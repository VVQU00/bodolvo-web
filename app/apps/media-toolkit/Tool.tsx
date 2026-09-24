"use client";
import { useEffect, useRef, useState } from "react";

type Mode = "image" | "audio" | "video";
type ExportFile = { url: string; name: string; size: number };
const mb = (n: number) => `${(n / 1048576).toFixed(2)} MB`;
const stem = (n: string) => n.replace(/\.[^.]+$/, "").replace(/[^\w. -]/g, "_").slice(0, 65) || "media";
const timeLabel = (n: number) => `${Math.floor(n / 60)}:${String(Math.floor(n % 60)).padStart(2, "0")}`;
const message = (e: unknown) => e instanceof Error ? e.message : "The operation could not be completed.";
function wav(buffer: AudioBuffer, from: number, to: number): Blob {
  const rate = buffer.sampleRate, channels = Math.min(2, buffer.numberOfChannels);
  const start = Math.max(0, Math.floor(from * rate)), end = Math.min(buffer.length, Math.ceil(to * rate));
  const count = end - start;
  if (count <= 0) throw Error("End time must be later than start time.");
  if (count * channels * 2 > 160 * 1048576) throw Error("WAV export is too large. Choose a shorter clip.");
  const bytes = new ArrayBuffer(44 + count * channels * 2), view = new DataView(bytes);
  const word = (offset: number, s: string) => { for (let i = 0; i < s.length; i++) view.setUint8(offset + i, s.charCodeAt(i)); };
  word(0,"RIFF");view.setUint32(4,bytes.byteLength-8,true);word(8,"WAVE");word(12,"fmt ");
  view.setUint32(16,16,true);view.setUint16(20,1,true);view.setUint16(22,channels,true);
  view.setUint32(24,rate,true);view.setUint32(28,rate*channels*2,true);view.setUint16(32,channels*2,true);
  view.setUint16(34,16,true);word(36,"data");view.setUint32(40,count*channels*2,true);
  const tracks = Array.from({length:channels}, (_,i)=>buffer.getChannelData(i));let offset=44;
  for(let i=start;i<end;i++) for(let c=0;c<channels;c++) {
    const value=Math.max(-1,Math.min(1,tracks[c][i]));view.setInt16(offset,value<0?value*32768:value*32767,true);offset+=2;
  }
  return new Blob([bytes],{type:"audio/wav"});
}
function blobOf(canvas: HTMLCanvasElement, type: string, quality?: number) {
  return new Promise<Blob>((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(Error("Image export is not supported by this browser.")),type,quality));
}
export function Tool() {
  const [mode,setMode]=useState<Mode>("image");
  const [file,setFile]=useState<File|null>(null),[url,setUrl]=useState("");
  const [duration,setDuration]=useState(0),[start,setStart]=useState(0),[end,setEnd]=useState(0);
  const [width,setWidth]=useState(0),[height,setHeight]=useState(0),[format,setFormat]=useState("image/png"),[quality,setQuality]=useState(85);
  const [busy,setBusy]=useState(false),[error,setError]=useState(""),[result,setResult]=useState<ExportFile|null>(null);
  const audio=useRef<HTMLAudioElement|null>(null),video=useRef<HTMLVideoElement|null>(null),image=useRef<HTMLImageElement|null>(null);
  const active=useRef(false),recording=useRef<MediaRecorder|null>(null),timer=useRef<ReturnType<typeof setInterval>|null>(null);
  useEffect(()=>{if(!file){setUrl("");return;}const u=URL.createObjectURL(file);setUrl(u);return()=>URL.revokeObjectURL(u);},[file]);
  useEffect(()=>()=>{if(result)URL.revokeObjectURL(result.url);},[result]);
  useEffect(()=>()=>{if(timer.current)clearInterval(timer.current);recording.current?.stop();},[]);
  function clearResult(){setResult(null);setError("");}
  function choose(next:File|null){
    clearResult();setDuration(0);setStart(0);setEnd(0);setWidth(0);setHeight(0);
    if(!next){setFile(null);return;}
    const matches=mode==="image" ? next.type.startsWith("image/") : mode==="audio" ? next.type.startsWith("audio/") : next.type.startsWith("video/");
    if(!matches){setFile(null);setError(`Choose a valid ${mode} file.`);return;}
    if(next.size>500*1048576){setFile(null);setError("Choose a file smaller than 500 MB.");return;}
    setFile(next);
  }
  function exportBlob(blob:Blob,name:string){setResult({url:URL.createObjectURL(blob),name,size:blob.size});}
  async function exportImage(){
    if(!file||!image.current||busy)return;setBusy(true);clearResult();
    try {
      const img=image.current;
      if(!img.naturalWidth||!img.naturalHeight)throw Error("Wait for the image to load.");
      if(!Number.isInteger(width)||!Number.isInteger(height)||width<1||height<1||width>12000||height>12000||width*height>40000000)throw Error("Enter valid dimensions (maximum 40 million pixels).");
      const canvas=document.createElement("canvas");canvas.width=width;canvas.height=height;
      const context=canvas.getContext("2d");if(!context)throw Error("Canvas is not available.");
      if(format==="image/jpeg"){context.fillStyle="#ffffff";context.fillRect(0,0,width,height);}
      context.drawImage(img,0,0,width,height);
      const blob=await blobOf(canvas,format,quality/100);
      const extension=format==="image/jpeg"?"jpg":format==="image/webp"?"webp":"png";
      exportBlob(blob,`${stem(file.name)}-${width}x${height}.${extension}`);
    }catch(e){setError(message(e));}finally{setBusy(false);}
  }
  async function exportAudio(){
    if(!file||busy)return;setBusy(true);clearResult();let context:AudioContext|null=null;
    try {
      if(file.size>100*1048576)throw Error("Audio files must be smaller than 100 MB for browser decoding.");
      context=new AudioContext();const decoded=await context.decodeAudioData(await file.arrayBuffer());
      if(start<0||end>decoded.duration+0.1||end-start<0.05)throw Error("Choose a valid clip of at least 0.05 seconds.");
      const blob=wav(decoded,start,Math.min(end,decoded.duration));exportBlob(blob,`${stem(file.name)}-clip.wav`);
    }catch(e){setError(message(e));}finally{if(context)await context.close();setBusy(false);}
  }
  async function frame(){
    if(!file||!video.current||busy)return;setBusy(true);clearResult();
    try {
      const v=video.current;if(!v.videoWidth||!v.videoHeight)throw Error("Wait for the video to load.");
      const canvas=document.createElement("canvas");canvas.width=v.videoWidth;canvas.height=v.videoHeight;
      const context=canvas.getContext("2d");if(!context)throw Error("Canvas is unavailable.");
      context.drawImage(v,0,0);const blob=await blobOf(canvas,"image/png");
      exportBlob(blob,`${stem(file.name)}-frame-${Math.floor(v.currentTime)}s.png`);
    }catch(e){setError(message(e));}finally{setBusy(false);}
  }
  async function trimVideo(){
    const v=video.current;if(!file||!v||busy)return;clearResult();
    // MediaRecorder + captureStream records playback in real time. No server upload or codec dependency.
    const capture=(v as HTMLVideoElement & {captureStream?:()=>MediaStream}).captureStream;
    if(!capture||typeof MediaRecorder==="undefined") {setError("Video trimming is unavailable in this browser. Use a browser with captureStream and MediaRecorder support.");return;}
    const mime=["video/webm;codecs=vp9,opus","video/webm;codecs=vp8,opus","video/webm"].find(t=>MediaRecorder.isTypeSupported(t));
    if(!mime){setError("This browser cannot export a WebM video recording.");return;}
    if(!(end>start&&end<=duration+0.1)){setError("Choose a valid start and end time.");return;}
    setBusy(true);active.current=true;let stream:MediaStream|null=null;
    try {
      v.pause();v.currentTime=start;
      await new Promise<void>((resolve,reject)=>{
        if(Math.abs(v.currentTime-start)<0.05&&v.readyState>=2){resolve();return;}
        const timeout=setTimeout(()=>{cleanup();reject(Error("Could not seek to the selected start time."));},10000);
        const ok=()=>{cleanup();resolve();},fail=()=>{cleanup();reject(Error("Could not load the selected video time."));};
        const cleanup=()=>{clearTimeout(timeout);v.removeEventListener("seeked",ok);v.removeEventListener("error",fail);};
        v.addEventListener("seeked",ok,{once:true});v.addEventListener("error",fail,{once:true});
      });
      stream=capture.call(v);
      if(!stream.getVideoTracks().length)throw Error("This browser cannot capture the video track.");
      const chunks:BlobPart[]=[];const recorder=new MediaRecorder(stream,{mimeType:mime});recording.current=recorder;
      const completion=new Promise<Blob>((resolve,reject)=>{
        recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data);};
        recorder.onerror=()=>reject(Error("The browser could not record this clip."));
        recorder.onstop=()=>{const blob=new Blob(chunks,{type:"video/webm"});blob.size?resolve(blob):reject(Error("Recording produced an empty clip."));};
      });
      recorder.start(250);
      await v.play();
      timer.current=setInterval(()=>{if(!active.current||v.currentTime>=end-0.035||v.ended){v.pause();if(recorder.state!=="inactive")recorder.stop();if(timer.current)clearInterval(timer.current);timer.current=null;}},35);
      const blob=await completion;exportBlob(blob,`${stem(file.name)}-clip.webm`);
    }catch(e){setError(message(e));if(recording.current?.state!=="inactive")recording.current?.stop();}
    finally {active.current=false;if(timer.current)clearInterval(timer.current);timer.current=null;v.pause();stream?.getTracks().forEach(t=>t.stop());recording.current=null;setBusy(false);}
  }
  const field="w-full rounded border border-gray-300 bg-white p-2 text-black";
  const button="rounded border border-gray-300 bg-white px-4 py-2 text-sm text-black disabled:opacity-50";
  return <div className="space-y-5 text-black">
    <div className="flex flex-wrap gap-2" role="group" aria-label="Media type">{(["image","audio","video"] as Mode[]).map(item=><button type="button" key={item} aria-pressed={mode===item} onClick={()=>{if(busy)return;setMode(item);setFile(null);clearResult();}} className={`${button} ${mode===item?"border-black font-semibold":""}`}>{item[0].toUpperCase()+item.slice(1)}</button>)}</div>
    <label className="block text-sm">Choose {mode} file<input className={`mt-2 ${field}`} type="file" key={mode} accept={`${mode}/*`} disabled={busy} onChange={e=>choose(e.target.files?.[0]??null)}/></label>
    {file&&<section className="space-y-4 rounded border border-gray-200 p-4"><p className="break-all text-sm text-gray-700">{file.name} · {mb(file.size)}</p>
      {mode==="image"&&<>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img ref={image} src={url} alt="Selected image preview" className="max-h-72 max-w-full object-contain" onLoad={e=>{setWidth(e.currentTarget.naturalWidth);setHeight(e.currentTarget.naturalHeight);}}/>
        <div className="grid gap-3 sm:grid-cols-2"><label className="text-sm">Width (px)<input type="number" min="1" max="12000" value={width||""} onChange={e=>setWidth(Number(e.target.value))} className={field}/></label><label className="text-sm">Height (px)<input type="number" min="1" max="12000" value={height||""} onChange={e=>setHeight(Number(e.target.value))} className={field}/></label></div>
        <label className="block text-sm">Output format<select className={field} value={format} onChange={e=>setFormat(e.target.value)}><option value="image/png">PNG</option><option value="image/jpeg">JPG</option><option value="image/webp">WebP</option></select></label>
        {format!=="image/png"&&<label className="block text-sm">Quality: {quality}%<input type="range" min="10" max="100" value={quality} onChange={e=>setQuality(Number(e.target.value))} className="block w-full"/></label>}
        <button type="button" disabled={busy||!width||!height} onClick={exportImage} className={button}>{busy?"Processing…":"Export image"}</button>
      </>}
      {mode==="audio"&&<audio ref={audio} src={url} controls className="w-full" onLoadedMetadata={e=>{const n=e.currentTarget.duration;if(Number.isFinite(n)){setDuration(n);setStart(0);setEnd(n);}}}/>}
      {mode==="video"&&<video ref={video} src={url} controls playsInline preload="metadata" className="max-h-[55vh] w-full bg-black" onLoadedMetadata={e=>{const n=e.currentTarget.duration;if(Number.isFinite(n)){setDuration(n);setStart(0);setEnd(n);}}}/>}
      {duration>0&&mode!=="image"&&<div className="space-y-3"><p className="text-sm">Duration: {timeLabel(duration)}</p><div className="grid gap-3 sm:grid-cols-2"><label className="text-sm">Start: {start.toFixed(1)}s<input type="range" className="block w-full" min="0" max={duration} step="0.1" value={start} onChange={e=>setStart(Math.min(Number(e.target.value),end))}/></label><label className="text-sm">End: {end.toFixed(1)}s<input type="range" className="block w-full" min="0" max={duration} step="0.1" value={end} onChange={e=>setEnd(Math.max(Number(e.target.value),start))}/></label></div>
       {mode==="audio"?<button type="button" disabled={busy||end-start<0.05} onClick={exportAudio} className={button}>{busy?"Exporting…":"Export WAV clip"}</button>:<div className="flex flex-wrap gap-2"><button type="button" disabled={busy} onClick={frame} className={button}>Save current frame (PNG)</button><button type="button" disabled={busy||end-start<0.05} onClick={trimVideo} className={button}>{busy?"Recording clip…":"Trim video (WebM)"}</button></div>}
       {mode==="video"&&<p className="text-xs text-gray-600">Video trim records playback in real time. It is only available where the browser supports video capture and WebM recording. Keep this tab visible and do not seek during export.</p>}
      </div>}
    </section>}
    {error&&<p role="alert" className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-800">{error}</p>}
    {result&&<a href={result.url} download={result.name} className="inline-flex rounded border border-black bg-black px-4 py-2 text-sm text-white">Download {result.name} ({mb(result.size)})</a>}
    <p className="text-xs text-gray-600">Files are processed locally. Supported input codecs depend on your browser.</p>
  </div>;
}

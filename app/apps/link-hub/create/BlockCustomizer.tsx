"use client";

import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  CalendarClock,
  ContactRound,
  Download,
  Image as ImageIcon,
  Link2,
  Mail,
  Music2,
  Package,
  QrCode,
  Share2,
  Space,
  Type,
  Video,
} from "lucide-react";

import MediaUploader from "./MediaUploader";

import type {
  BackgroundPosition,
  Block,
  BlockWidth,
  CountdownStyle,
  LinkLayout,
  ProductLayout,
  ShadowStrength,
  SocialButtonPlatform,
  SocialButtonStyle,
  TextAlign,
} from "./types";

type Props = {
  block: Block;
  onChange: (updates: Partial<Block>) => void;
  globalButtonColor: string;
  globalButtonTextColor: string;
  globalButtonRadius: number;
  globalAccentColor: string;
  globalTextColor: string;
  username: string;
};

const widths: {
  value: BlockWidth;
  label: string;
}[] = [
  { value: "full", label: "Full" },
  { value: "wide", label: "Wide" },
  { value: "medium", label: "Medium" },
  { value: "compact", label: "Compact" },
];

const shadows: {
  value: ShadowStrength;
  label: string;
}[] = [
  { value: "none", label: "None" },
  { value: "soft", label: "Soft" },
  { value: "medium", label: "Medium" },
  { value: "strong", label: "Strong" },
];

const linkLayouts: {
  value: LinkLayout;
  label: string;
  description: string;
}[] = [
  {
    value: "standard",
    label: "Standard",
    description: "Classic link button.",
  },
  {
    value: "thumbnail",
    label: "Thumbnail",
    description: "Link with an image preview.",
  },
  {
    value: "featured",
    label: "Featured",
    description: "Large visual callout.",
  },
  {
    value: "minimal",
    label: "Minimal",
    description: "Simple text-first link.",
  },
];

const socialPlatforms: {
  value: SocialButtonPlatform;
  label: string;
}[] = [
  { value: "instagram", label: "Instagram" },
  { value: "youtube", label: "YouTube" },
  { value: "tiktok", label: "TikTok" },
  { value: "twitter", label: "X / Twitter" },
  { value: "facebook", label: "Facebook" },
  { value: "twitch", label: "Twitch" },
  { value: "github", label: "GitHub" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "email", label: "Email" },
  { value: "website", label: "Website" },
];

const socialStyles: {
  value: SocialButtonStyle;
  label: string;
}[] = [
  { value: "icon", label: "Icon" },
  { value: "button", label: "Button" },
  { value: "card", label: "Card" },
];

const productLayouts: {
  value: ProductLayout;
  label: string;
}[] = [
  { value: "card", label: "Card" },
  { value: "featured", label: "Featured" },
  { value: "compact", label: "Compact" },
];

const countdownStyles: {
  value: CountdownStyle;
  label: string;
}[] = [
  { value: "cards", label: "Cards" },
  { value: "minimal", label: "Minimal" },
  { value: "banner", label: "Banner" },
];

function SelectedBlockHeader({
  block,
}: {
  block: Block;
}) {
  const renderIcon = () => {
    if (block.type === "link") return <Link2 size={17} />;
    if (block.type === "text") return <Type size={17} />;
    if (block.type === "image") return <ImageIcon size={17} />;
    if (block.type === "video") return <Video size={17} />;
    if (block.type === "music") return <Music2 size={17} />;
    if (block.type === "qr") return <QrCode size={17} />;
    if (block.type === "social") return <Share2 size={17} />;
    if (block.type === "contact") return <ContactRound size={17} />;
    if (block.type === "email") return <Mail size={17} />;
    if (block.type === "file") return <Download size={17} />;
    if (block.type === "product") return <Package size={17} />;
    if (block.type === "countdown") return <CalendarClock size={17} />;
    if (block.type === "spacer") return <Space size={17} />;

    return <Type size={17} />;
  };

  return (
    <div className="rounded-[22px] border border-black/10 bg-white p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#111111] text-white">
          {renderIcon()}
        </div>

        <div>
          <div className="text-xs font-black uppercase tracking-[0.18em] text-[#6657FF]">
            Selected block
          </div>

          <div className="mt-0.5 text-lg font-bold capitalize">
            {block.type}
          </div>
        </div>
      </div>
    </div>
  );
}

function ColorControl({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label>
      <div className="mb-2 text-[11px] font-semibold text-black/40">
        {label}
      </div>

      <input
        type="color"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full cursor-pointer"
      />
    </label>
  );
}

export default function BlockCustomizer({
  block,
  onChange,
  globalButtonColor,
  globalButtonTextColor,
  globalButtonRadius,
  globalAccentColor,
  globalTextColor,
  username,
}: Props) {
  return (
    <div className="space-y-5">
      <SelectedBlockHeader block={block} />

      {block.type === "link" && (
        <>
          <div className="rounded-[22px] border border-black/10 bg-white p-5">
            <div className="text-sm font-bold">Content</div>

            <div className="mt-4 space-y-3">
              <input
                value={block.title}
                onChange={(event) =>
                  onChange({ title: event.target.value } as Partial<Block>)
                }
                placeholder="Link title"
                className="w-full rounded-[14px] border border-black/10 bg-[#F7F3EB] px-3 py-3 text-sm outline-none focus:border-[#6657FF]"
              />

              <input
                value={block.subtitle}
                onChange={(event) =>
                  onChange({ subtitle: event.target.value } as Partial<Block>)
                }
                placeholder="Description"
                className="w-full rounded-[14px] border border-black/10 bg-[#F7F3EB] px-3 py-3 text-sm outline-none focus:border-[#6657FF]"
              />

              <input
                value={block.url}
                onChange={(event) =>
                  onChange({ url: event.target.value } as Partial<Block>)
                }
                placeholder="https://"
                className="w-full rounded-[14px] border border-black/10 bg-[#F7F3EB] px-3 py-3 text-sm outline-none focus:border-[#6657FF]"
              />
            </div>
          </div>

          <div className="rounded-[22px] border border-black/10 bg-white p-5">
            <div className="text-sm font-bold">Layout</div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              {linkLayouts.map((layout) => (
                <button
                  type="button"
                  key={layout.value}
                  onClick={() =>
                    onChange({ layout: layout.value } as Partial<Block>)
                  }
                  className={`rounded-[18px] border p-3 text-left ${
                    (block.layout || "standard") === layout.value
                      ? "border-[#6657FF] bg-[#F0ECFF]"
                      : "border-black/10 bg-[#F7F3EB]"
                  }`}
                >
                  <div className="text-xs font-bold">{layout.label}</div>
                  <div className="mt-1 text-[10px] leading-4 text-black/40">
                    {layout.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {(block.layout === "thumbnail" ||
            block.layout === "featured") && (
            <div className="rounded-[22px] border border-black/10 bg-white p-5">
              <div className="text-sm font-bold">Thumbnail</div>

              <div className="mt-4">
                <MediaUploader
                  username={username}
                  label="Upload thumbnail"
                  value={block.thumbnailUrl || null}
                  onChange={(url) =>
                    onChange({
                      thumbnailUrl: url || "",
                    } as Partial<Block>)
                  }
                  previewHeight={160}
                />
              </div>
            </div>
          )}

          <div className="rounded-[22px] border border-black/10 bg-white p-5">
            <div className="text-sm font-bold">Link style</div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <ColorControl
                label="Background"
                value={block.backgroundColor || globalButtonColor}
                onChange={(value) =>
                  onChange({ backgroundColor: value } as Partial<Block>)
                }
              />

              <ColorControl
                label="Text"
                value={block.textColor || globalButtonTextColor}
                onChange={(value) =>
                  onChange({ textColor: value } as Partial<Block>)
                }
              />

              <ColorControl
                label="Accent"
                value={block.accentColor || globalAccentColor}
                onChange={(value) =>
                  onChange({ accentColor: value } as Partial<Block>)
                }
              />
            </div>

            <label className="mt-5 block">
              <div className="flex justify-between text-xs">
                <span className="text-black/45">Corner radius</span>
                <span className="font-bold">
                  {block.radius ?? globalButtonRadius}px
                </span>
              </div>

              <input
                type="range"
                min="0"
                max="50"
                value={block.radius ?? globalButtonRadius}
                onChange={(event) =>
                  onChange({
                    radius: Number(event.target.value),
                  } as Partial<Block>)
                }
                className="mt-3 w-full"
              />
            </label>
          </div>
        </>
      )}

      {block.type === "text" && (
        <>
          <div className="rounded-[22px] border border-black/10 bg-white p-5">
            <div className="text-sm font-bold">Text</div>

            <textarea
              value={block.text}
              onChange={(event) =>
                onChange({ text: event.target.value } as Partial<Block>)
              }
              className="mt-4 min-h-[120px] w-full resize-none rounded-[14px] border border-black/10 bg-[#F7F3EB] px-3 py-3 text-sm outline-none focus:border-[#6657FF]"
            />
          </div>

          <div className="rounded-[22px] border border-black/10 bg-white p-5">
            <div className="text-sm font-bold">Typography</div>

            <label className="mt-4 block">
              <div className="flex justify-between text-xs">
                <span className="text-black/45">Font size</span>
                <span className="font-bold">{block.fontSize || 14}px</span>
              </div>

              <input
                type="range"
                min="10"
                max="64"
                value={block.fontSize || 14}
                onChange={(event) =>
                  onChange({
                    fontSize: Number(event.target.value),
                  } as Partial<Block>)
                }
                className="mt-3 w-full"
              />
            </label>

            <label className="mt-5 block">
              <div className="flex justify-between text-xs">
                <span className="text-black/45">Weight</span>
                <span className="font-bold">{block.fontWeight || 600}</span>
              </div>

              <input
                type="range"
                min="300"
                max="900"
                step="100"
                value={block.fontWeight || 600}
                onChange={(event) =>
                  onChange({
                    fontWeight: Number(event.target.value),
                  } as Partial<Block>)
                }
                className="mt-3 w-full"
              />
            </label>

            <div className="mt-5 grid grid-cols-3 gap-2">
              {[
                { value: "left", icon: AlignLeft },
                { value: "center", icon: AlignCenter },
                { value: "right", icon: AlignRight },
              ].map(({ value, icon: Icon }) => (
                <button
                  type="button"
                  key={value}
                  onClick={() =>
                    onChange({ align: value as TextAlign } as Partial<Block>)
                  }
                  className={`flex items-center justify-center rounded-[13px] py-3 ${
                    (block.align || "left") === value
                      ? "bg-black text-white"
                      : "bg-[#F3EFE7]"
                  }`}
                >
                  <Icon size={16} />
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() =>
                onChange({ italic: !block.italic } as Partial<Block>)
              }
              className={`mt-5 w-full rounded-[14px] py-3 text-xs font-bold ${
                block.italic
                  ? "bg-[#6657FF] text-white"
                  : "bg-[#F3EFE7]"
              }`}
            >
              Italic {block.italic ? "On" : "Off"}
            </button>

            <div className="mt-5">
              <ColorControl
                label="Text color"
                value={block.color || globalTextColor}
                onChange={(value) =>
                  onChange({ color: value } as Partial<Block>)
                }
              />
            </div>
          </div>
        </>
      )}

      {block.type === "image" && (
        <>
          <div className="rounded-[22px] border border-black/10 bg-white p-5">
            <div className="text-sm font-bold">Image</div>

            <div className="mt-4">
              <MediaUploader
                username={username}
                label="Upload image"
                value={block.imageUrl || null}
                onChange={(url) =>
                  onChange({ imageUrl: url || "" } as Partial<Block>)
                }
                previewHeight={190}
              />
            </div>

            <input
              value={block.caption}
              onChange={(event) =>
                onChange({ caption: event.target.value } as Partial<Block>)
              }
              placeholder="Caption"
              className="mt-4 w-full rounded-[14px] border border-black/10 bg-[#F7F3EB] px-3 py-3 text-sm outline-none focus:border-[#6657FF]"
            />
          </div>

          <div className="rounded-[22px] border border-black/10 bg-white p-5">
            <div className="text-sm font-bold">Image style</div>

            <label className="mt-4 block">
              <div className="flex justify-between text-xs">
                <span className="text-black/45">Height</span>
                <span className="font-bold">{block.height || 180}px</span>
              </div>

              <input
                type="range"
                min="100"
                max="500"
                value={block.height || 180}
                onChange={(event) =>
                  onChange({
                    height: Number(event.target.value),
                  } as Partial<Block>)
                }
                className="mt-3 w-full"
              />
            </label>

            <label className="mt-5 block">
              <div className="flex justify-between text-xs">
                <span className="text-black/45">Radius</span>
                <span className="font-bold">{block.radius || 22}px</span>
              </div>

              <input
                type="range"
                min="0"
                max="50"
                value={block.radius || 22}
                onChange={(event) =>
                  onChange({
                    radius: Number(event.target.value),
                  } as Partial<Block>)
                }
                className="mt-3 w-full"
              />
            </label>

            <div className="mt-5 grid grid-cols-2 gap-2">
              {["cover", "contain"].map((fit) => (
                <button
                  type="button"
                  key={fit}
                  onClick={() => onChange({ fit } as Partial<Block>)}
                  className={`rounded-[13px] py-3 text-xs font-bold capitalize ${
                    (block.fit || "cover") === fit
                      ? "bg-black text-white"
                      : "bg-[#F3EFE7]"
                  }`}
                >
                  {fit}
                </button>
              ))}
            </div>

            <div className="mt-5 grid grid-cols-5 gap-2">
              {["top", "left", "center", "right", "bottom"].map(
                (position) => (
                  <button
                    type="button"
                    key={position}
                    onClick={() =>
                      onChange({
                        position: position as BackgroundPosition,
                      } as Partial<Block>)
                    }
                    className={`rounded-[11px] py-2 text-[9px] font-bold capitalize ${
                      (block.position || "center") === position
                        ? "bg-black text-white"
                        : "bg-[#F3EFE7]"
                    }`}
                  >
                    {position}
                  </button>
                )
              )}
            </div>

            <button
              type="button"
              onClick={() =>
                onChange({
                  showCaption: block.showCaption === false,
                } as Partial<Block>)
              }
              className={`mt-5 w-full rounded-[14px] py-3 text-xs font-bold ${
                block.showCaption !== false
                  ? "bg-[#6657FF] text-white"
                  : "bg-[#F3EFE7]"
              }`}
            >
              Caption {block.showCaption !== false ? "On" : "Off"}
            </button>
          </div>
        </>
      )}

      {block.type === "video" && (
        <div className="rounded-[22px] border border-black/10 bg-white p-5">
          <div className="text-sm font-bold">Video</div>

          <input
            value={block.title}
            onChange={(event) =>
              onChange({ title: event.target.value } as Partial<Block>)
            }
            placeholder="Video title"
            className="mt-4 w-full rounded-[14px] border border-black/10 bg-[#F7F3EB] px-3 py-3 text-sm outline-none focus:border-[#6657FF]"
          />

          <input
            value={block.url}
            onChange={(event) =>
              onChange({ url: event.target.value } as Partial<Block>)
            }
            placeholder="YouTube, Vimeo, or direct video URL"
            className="mt-3 w-full rounded-[14px] border border-black/10 bg-[#F7F3EB] px-3 py-3 text-sm outline-none focus:border-[#6657FF]"
          />

          <div className="mt-2 text-[10px] leading-4 text-black/35">
            Supports YouTube, Vimeo, MP4, WEBM, OGG, and MOV URLs.
          </div>
        </div>
      )}

      {block.type === "music" && (
        <>
          <div className="rounded-[22px] border border-black/10 bg-white p-5">
            <div className="text-sm font-bold">Music</div>

            <input
              value={block.title}
              onChange={(event) =>
                onChange({ title: event.target.value } as Partial<Block>)
              }
              placeholder="Song or release"
              className="mt-4 w-full rounded-[14px] border border-black/10 bg-[#F7F3EB] px-3 py-3 text-sm outline-none focus:border-[#6657FF]"
            />

            <input
              value={block.artist}
              onChange={(event) =>
                onChange({ artist: event.target.value } as Partial<Block>)
              }
              placeholder="Artist"
              className="mt-3 w-full rounded-[14px] border border-black/10 bg-[#F7F3EB] px-3 py-3 text-sm outline-none focus:border-[#6657FF]"
            />

            <input
              value={block.url || ""}
              onChange={(event) =>
                onChange({ url: event.target.value } as Partial<Block>)
              }
              placeholder="Spotify, SoundCloud, or direct audio URL"
              className="mt-3 w-full rounded-[14px] border border-black/10 bg-[#F7F3EB] px-3 py-3 text-sm outline-none focus:border-[#6657FF]"
            />

            <div className="mt-2 text-[10px] leading-4 text-black/35">
              Supports Spotify tracks/albums/playlists, SoundCloud, MP3, WAV,
              OGG, M4A, and AAC URLs.
            </div>

            <div className="mt-4">
              <MediaUploader
                username={username}
                label="Upload artwork"
                value={block.artworkUrl || null}
                onChange={(url) =>
                  onChange({ artworkUrl: url || "" } as Partial<Block>)
                }
              />
            </div>
          </div>
        </>
      )}

      {block.type === "qr" && (
        <div className="rounded-[22px] border border-black/10 bg-white p-5">
          <div className="text-sm font-bold">QR Code</div>

          <input
            value={block.label}
            onChange={(event) =>
              onChange({ label: event.target.value } as Partial<Block>)
            }
            placeholder="Label"
            className="mt-4 w-full rounded-[14px] border border-black/10 bg-[#F7F3EB] px-3 py-3 text-sm outline-none focus:border-[#6657FF]"
          />

          <input
            value={block.destination || ""}
            onChange={(event) =>
              onChange({
                destination: event.target.value,
              } as Partial<Block>)
            }
            placeholder="Destination URL"
            className="mt-3 w-full rounded-[14px] border border-black/10 bg-[#F7F3EB] px-3 py-3 text-sm outline-none focus:border-[#6657FF]"
          />
        </div>
      )}

      {block.type === "social" && (
        <>
          <div className="rounded-[22px] border border-black/10 bg-white p-5">
            <div className="text-sm font-bold">Social button</div>

            <div className="mt-4">
              <div className="mb-2 text-xs text-black/45">Platform</div>

              <select
                value={block.platform}
                onChange={(event) =>
                  onChange({
                    platform: event.target.value as SocialButtonPlatform,
                  } as Partial<Block>)
                }
                className="w-full rounded-[14px] border border-black/10 bg-[#F7F3EB] px-3 py-3 text-sm outline-none"
              >
                {socialPlatforms.map((platform) => (
                  <option key={platform.value} value={platform.value}>
                    {platform.label}
                  </option>
                ))}
              </select>
            </div>

            <input
              value={block.label}
              onChange={(event) =>
                onChange({ label: event.target.value } as Partial<Block>)
              }
              placeholder="Button label"
              className="mt-3 w-full rounded-[14px] border border-black/10 bg-[#F7F3EB] px-3 py-3 text-sm outline-none focus:border-[#6657FF]"
            />

            <input
              value={block.url}
              onChange={(event) =>
                onChange({ url: event.target.value } as Partial<Block>)
              }
              placeholder="https://"
              className="mt-3 w-full rounded-[14px] border border-black/10 bg-[#F7F3EB] px-3 py-3 text-sm outline-none focus:border-[#6657FF]"
            />
          </div>

          <div className="rounded-[22px] border border-black/10 bg-white p-5">
            <div className="text-sm font-bold">Style</div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              {socialStyles.map((style) => (
                <button
                  type="button"
                  key={style.value}
                  onClick={() =>
                    onChange({ style: style.value } as Partial<Block>)
                  }
                  className={`rounded-[13px] py-3 text-xs font-bold ${
                    (block.style || "button") === style.value
                      ? "bg-black text-white"
                      : "bg-[#F3EFE7]"
                  }`}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {block.type === "contact" && (
        <>
          <div className="rounded-[22px] border border-black/10 bg-white p-5">
            <div className="text-sm font-bold">Contact card</div>

            <input
              value={block.title}
              onChange={(event) =>
                onChange({ title: event.target.value } as Partial<Block>)
              }
              placeholder="Work with me"
              className="mt-4 w-full rounded-[14px] border border-black/10 bg-[#F7F3EB] px-3 py-3 text-sm outline-none focus:border-[#6657FF]"
            />

            <textarea
              value={block.description}
              onChange={(event) =>
                onChange({
                  description: event.target.value,
                } as Partial<Block>)
              }
              placeholder="Tell visitors how to contact you."
              className="mt-3 min-h-[90px] w-full resize-none rounded-[14px] border border-black/10 bg-[#F7F3EB] px-3 py-3 text-sm outline-none focus:border-[#6657FF]"
            />

            <input
              value={block.email || ""}
              onChange={(event) =>
                onChange({ email: event.target.value } as Partial<Block>)
              }
              placeholder="Email address"
              className="mt-3 w-full rounded-[14px] border border-black/10 bg-[#F7F3EB] px-3 py-3 text-sm outline-none focus:border-[#6657FF]"
            />

            <input
              value={block.phone || ""}
              onChange={(event) =>
                onChange({ phone: event.target.value } as Partial<Block>)
              }
              placeholder="Phone number"
              className="mt-3 w-full rounded-[14px] border border-black/10 bg-[#F7F3EB] px-3 py-3 text-sm outline-none focus:border-[#6657FF]"
            />

            <input
              value={block.website || ""}
              onChange={(event) =>
                onChange({ website: event.target.value } as Partial<Block>)
              }
              placeholder="Website"
              className="mt-3 w-full rounded-[14px] border border-black/10 bg-[#F7F3EB] px-3 py-3 text-sm outline-none focus:border-[#6657FF]"
            />
          </div>

          <div className="rounded-[22px] border border-black/10 bg-white p-5">
            <div className="text-sm font-bold">Show actions</div>

            {[
              {
                label: "Email",
                active: block.showEmail !== false,
                key: "showEmail",
              },
              {
                label: "Phone",
                active: block.showPhone !== false,
                key: "showPhone",
              },
              {
                label: "Website",
                active: block.showWebsite !== false,
                key: "showWebsite",
              },
            ].map((action) => (
              <button
                type="button"
                key={action.key}
                onClick={() =>
                  onChange({
                    [action.key]: !action.active,
                  } as Partial<Block>)
                }
                className="mt-3 flex w-full items-center justify-between rounded-[14px] bg-[#F3EFE7] px-4 py-3"
              >
                <span className="text-xs font-bold">{action.label}</span>

                <span
                  className={`rounded-full px-3 py-1 text-[10px] font-black ${
                    action.active
                      ? "bg-[#6657FF] text-white"
                      : "bg-black/10"
                  }`}
                >
                  {action.active ? "ON" : "OFF"}
                </span>
              </button>
            ))}
          </div>
        </>
      )}

      {block.type === "email" && (
        <div className="rounded-[22px] border border-black/10 bg-white p-5">
          <div className="text-sm font-bold">Email signup</div>

          <input
            value={block.title}
            onChange={(event) =>
              onChange({ title: event.target.value } as Partial<Block>)
            }
            placeholder="Join my list"
            className="mt-4 w-full rounded-[14px] border border-black/10 bg-[#F7F3EB] px-3 py-3 text-sm outline-none focus:border-[#6657FF]"
          />

          <textarea
            value={block.description}
            onChange={(event) =>
              onChange({
                description: event.target.value,
              } as Partial<Block>)
            }
            placeholder="Signup description"
            className="mt-3 min-h-[90px] w-full resize-none rounded-[14px] border border-black/10 bg-[#F7F3EB] px-3 py-3 text-sm outline-none focus:border-[#6657FF]"
          />

          <input
            value={block.placeholder || ""}
            onChange={(event) =>
              onChange({
                placeholder: event.target.value,
              } as Partial<Block>)
            }
            placeholder="Email field placeholder"
            className="mt-3 w-full rounded-[14px] border border-black/10 bg-[#F7F3EB] px-3 py-3 text-sm outline-none focus:border-[#6657FF]"
          />

          <input
            value={block.buttonLabel || ""}
            onChange={(event) =>
              onChange({
                buttonLabel: event.target.value,
              } as Partial<Block>)
            }
            placeholder="Button label"
            className="mt-3 w-full rounded-[14px] border border-black/10 bg-[#F7F3EB] px-3 py-3 text-sm outline-none focus:border-[#6657FF]"
          />

          <input
            value={block.successMessage || ""}
            onChange={(event) =>
              onChange({
                successMessage: event.target.value,
              } as Partial<Block>)
            }
            placeholder="Success message"
            className="mt-3 w-full rounded-[14px] border border-black/10 bg-[#F7F3EB] px-3 py-3 text-sm outline-none focus:border-[#6657FF]"
          />
        </div>
      )}

      {block.type === "file" && (
        <div className="rounded-[22px] border border-black/10 bg-white p-5">
          <div className="text-sm font-bold">Download</div>

          <input
            value={block.title}
            onChange={(event) =>
              onChange({ title: event.target.value } as Partial<Block>)
            }
            placeholder="Download title"
            className="mt-4 w-full rounded-[14px] border border-black/10 bg-[#F7F3EB] px-3 py-3 text-sm outline-none focus:border-[#6657FF]"
          />

          <textarea
            value={block.description}
            onChange={(event) =>
              onChange({
                description: event.target.value,
              } as Partial<Block>)
            }
            placeholder="Tell people what they're downloading."
            className="mt-3 min-h-[90px] w-full resize-none rounded-[14px] border border-black/10 bg-[#F7F3EB] px-3 py-3 text-sm outline-none focus:border-[#6657FF]"
          />

          <input
            value={block.fileName || ""}
            onChange={(event) =>
              onChange({ fileName: event.target.value } as Partial<Block>)
            }
            placeholder="File name"
            className="mt-3 w-full rounded-[14px] border border-black/10 bg-[#F7F3EB] px-3 py-3 text-sm outline-none focus:border-[#6657FF]"
          />

          <input
            value={block.fileUrl || ""}
            onChange={(event) =>
              onChange({ fileUrl: event.target.value } as Partial<Block>)
            }
            placeholder="File URL"
            className="mt-3 w-full rounded-[14px] border border-black/10 bg-[#F7F3EB] px-3 py-3 text-sm outline-none focus:border-[#6657FF]"
          />

          <input
            value={block.fileSize || ""}
            onChange={(event) =>
              onChange({ fileSize: event.target.value } as Partial<Block>)
            }
            placeholder="File size, e.g. 2.4 MB"
            className="mt-3 w-full rounded-[14px] border border-black/10 bg-[#F7F3EB] px-3 py-3 text-sm outline-none focus:border-[#6657FF]"
          />

          <input
            value={block.buttonLabel || ""}
            onChange={(event) =>
              onChange({
                buttonLabel: event.target.value,
              } as Partial<Block>)
            }
            placeholder="Download"
            className="mt-3 w-full rounded-[14px] border border-black/10 bg-[#F7F3EB] px-3 py-3 text-sm outline-none focus:border-[#6657FF]"
          />
        </div>
      )}

      {block.type === "product" && (
        <>
          <div className="rounded-[22px] border border-black/10 bg-white p-5">
            <div className="text-sm font-bold">Product</div>

            <div className="mt-4">
              <MediaUploader
                username={username}
                label="Upload product image"
                value={block.imageUrl || null}
                onChange={(url) =>
                  onChange({ imageUrl: url || "" } as Partial<Block>)
                }
                previewHeight={190}
              />
            </div>

            <input
              value={block.name}
              onChange={(event) =>
                onChange({ name: event.target.value } as Partial<Block>)
              }
              placeholder="Product name"
              className="mt-4 w-full rounded-[14px] border border-black/10 bg-[#F7F3EB] px-3 py-3 text-sm outline-none focus:border-[#6657FF]"
            />

            <textarea
              value={block.description}
              onChange={(event) =>
                onChange({
                  description: event.target.value,
                } as Partial<Block>)
              }
              placeholder="Product description"
              className="mt-3 min-h-[90px] w-full resize-none rounded-[14px] border border-black/10 bg-[#F7F3EB] px-3 py-3 text-sm outline-none focus:border-[#6657FF]"
            />

            <input
              value={block.price}
              onChange={(event) =>
                onChange({ price: event.target.value } as Partial<Block>)
              }
              placeholder="$25.00"
              className="mt-3 w-full rounded-[14px] border border-black/10 bg-[#F7F3EB] px-3 py-3 text-sm outline-none focus:border-[#6657FF]"
            />

            <input
              value={block.purchaseUrl || ""}
              onChange={(event) =>
                onChange({
                  purchaseUrl: event.target.value,
                } as Partial<Block>)
              }
              placeholder="Purchase URL"
              className="mt-3 w-full rounded-[14px] border border-black/10 bg-[#F7F3EB] px-3 py-3 text-sm outline-none focus:border-[#6657FF]"
            />

            <input
              value={block.buttonLabel || ""}
              onChange={(event) =>
                onChange({
                  buttonLabel: event.target.value,
                } as Partial<Block>)
              }
              placeholder="Buy now"
              className="mt-3 w-full rounded-[14px] border border-black/10 bg-[#F7F3EB] px-3 py-3 text-sm outline-none focus:border-[#6657FF]"
            />
          </div>

          <div className="rounded-[22px] border border-black/10 bg-white p-5">
            <div className="text-sm font-bold">Product layout</div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              {productLayouts.map((layout) => (
                <button
                  type="button"
                  key={layout.value}
                  onClick={() =>
                    onChange({ layout: layout.value } as Partial<Block>)
                  }
                  className={`rounded-[13px] py-3 text-xs font-bold ${
                    (block.layout || "card") === layout.value
                      ? "bg-black text-white"
                      : "bg-[#F3EFE7]"
                  }`}
                >
                  {layout.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {block.type === "countdown" && (
        <>
          <div className="rounded-[22px] border border-black/10 bg-white p-5">
            <div className="text-sm font-bold">Countdown</div>

            <input
              value={block.title}
              onChange={(event) =>
                onChange({ title: event.target.value } as Partial<Block>)
              }
              placeholder="Launch day"
              className="mt-4 w-full rounded-[14px] border border-black/10 bg-[#F7F3EB] px-3 py-3 text-sm outline-none focus:border-[#6657FF]"
            />

            <div className="mt-3">
              <div className="mb-2 text-[11px] font-semibold text-black/40">
                Target date
              </div>

              <input
                type="datetime-local"
                value={block.targetDate}
                onChange={(event) =>
                  onChange({
                    targetDate: event.target.value,
                  } as Partial<Block>)
                }
                className="w-full rounded-[14px] border border-black/10 bg-[#F7F3EB] px-3 py-3 text-sm outline-none focus:border-[#6657FF]"
              />
            </div>

            <input
              value={block.completedText || ""}
              onChange={(event) =>
                onChange({
                  completedText: event.target.value,
                } as Partial<Block>)
              }
              placeholder="We're live!"
              className="mt-3 w-full rounded-[14px] border border-black/10 bg-[#F7F3EB] px-3 py-3 text-sm outline-none focus:border-[#6657FF]"
            />
          </div>

          <div className="rounded-[22px] border border-black/10 bg-white p-5">
            <div className="text-sm font-bold">Countdown style</div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              {countdownStyles.map((style) => (
                <button
                  type="button"
                  key={style.value}
                  onClick={() =>
                    onChange({ style: style.value } as Partial<Block>)
                  }
                  className={`rounded-[13px] py-3 text-xs font-bold ${
                    (block.style || "cards") === style.value
                      ? "bg-black text-white"
                      : "bg-[#F3EFE7]"
                  }`}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {block.type === "spacer" && (
        <div className="rounded-[22px] border border-black/10 bg-white p-5">
          <div className="text-sm font-bold">Spacer</div>

          <label className="mt-5 block">
            <div className="flex justify-between text-xs">
              <span className="text-black/45">Height</span>
              <span className="font-bold">{block.height}px</span>
            </div>

            <input
              type="range"
              min="8"
              max="240"
              value={block.height}
              onChange={(event) =>
                onChange({
                  height: Number(event.target.value),
                } as Partial<Block>)
              }
              className="mt-3 w-full"
            />
          </label>
        </div>
      )}

      {block.type === "divider" && (
        <div className="rounded-[22px] border border-black/10 bg-white p-5">
          <div className="text-sm font-bold">Divider</div>

          <label className="mt-4 block">
            <div className="flex justify-between text-xs">
              <span className="text-black/45">Thickness</span>
              <span className="font-bold">{block.thickness || 1}px</span>
            </div>

            <input
              type="range"
              min="1"
              max="10"
              value={block.thickness || 1}
              onChange={(event) =>
                onChange({
                  thickness: Number(event.target.value),
                } as Partial<Block>)
              }
              className="mt-3 w-full"
            />
          </label>

          <label className="mt-5 block">
            <div className="flex justify-between text-xs">
              <span className="text-black/45">Spacing</span>
              <span className="font-bold">{block.spacing || 12}px</span>
            </div>

            <input
              type="range"
              min="0"
              max="60"
              value={block.spacing || 12}
              onChange={(event) =>
                onChange({
                  spacing: Number(event.target.value),
                } as Partial<Block>)
              }
              className="mt-3 w-full"
            />
          </label>

          <div className="mt-5">
            <ColorControl
              label="Color"
              value={block.color || globalTextColor}
              onChange={(value) =>
                onChange({ color: value } as Partial<Block>)
              }
            />
          </div>
        </div>
      )}

      {block.type !== "spacer" && (
        <div className="rounded-[22px] border border-black/10 bg-white p-5">
          <div className="text-sm font-bold">Block</div>

          <div className="mt-4">
            <div className="mb-2 text-xs text-black/45">Width</div>

            <div className="grid grid-cols-2 gap-2">
              {widths.map((width) => (
                <button
                  type="button"
                  key={width.value}
                  onClick={() =>
                    onChange({ width: width.value } as Partial<Block>)
                  }
                  className={`rounded-[13px] py-3 text-xs font-bold ${
                    (block.width || "full") === width.value
                      ? "bg-black text-white"
                      : "bg-[#F3EFE7]"
                  }`}
                >
                  {width.label}
                </button>
              ))}
            </div>
          </div>

          <label className="mt-5 block">
            <div className="flex justify-between text-xs">
              <span className="text-black/45">Opacity</span>
              <span className="font-bold">{block.opacity ?? 100}%</span>
            </div>

            <input
              type="range"
              min="10"
              max="100"
              value={block.opacity ?? 100}
              onChange={(event) =>
                onChange({
                  opacity: Number(event.target.value),
                } as Partial<Block>)
              }
              className="mt-3 w-full"
            />
          </label>

          <div className="mt-5">
            <div className="mb-2 text-xs text-black/45">Shadow</div>

            <div className="grid grid-cols-2 gap-2">
              {shadows.map((shadow) => (
                <button
                  type="button"
                  key={shadow.value}
                  onClick={() =>
                    onChange({ shadow: shadow.value } as Partial<Block>)
                  }
                  className={`rounded-[13px] py-3 text-xs font-bold ${
                    (block.shadow || "soft") === shadow.value
                      ? "bg-black text-white"
                      : "bg-[#F3EFE7]"
                  }`}
                >
                  {shadow.label}
                </button>
              ))}
            </div>
          </div>

          <label className="mt-5 block">
            <div className="flex justify-between text-xs">
              <span className="text-black/45">Border width</span>
              <span className="font-bold">{block.borderWidth || 0}px</span>
            </div>

            <input
              type="range"
              min="0"
              max="8"
              value={block.borderWidth || 0}
              onChange={(event) =>
                onChange({
                  borderWidth: Number(event.target.value),
                } as Partial<Block>)
              }
              className="mt-3 w-full"
            />
          </label>

          {(block.borderWidth || 0) > 0 && (
            <div className="mt-5">
              <ColorControl
                label="Border color"
                value={block.borderColor || globalTextColor}
                onChange={(value) =>
                  onChange({ borderColor: value } as Partial<Block>)
                }
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

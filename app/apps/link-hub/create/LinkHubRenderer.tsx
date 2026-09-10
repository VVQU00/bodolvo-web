"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  CSSProperties,
  FormEvent,
  MouseEvent,
} from "react";

import {
  ArrowLeft,
  CalendarClock,
  ContactRound,
  Download,
  Image as ImageIcon,
  Link2,
  Mail,
  Music2,
  Package,
  Share2,
  Video,
} from "lucide-react";

import QRCode from "react-qr-code";

import {
  getMusicEmbed,
  getVideoEmbed,
} from "./mediaUtils";

import {
  PlatformIcon,
  type SocialLink,
} from "./ProfileCustomizer";

import type {
  Block,
  EmailSignupBlock,
  LinkHubDesign,
  LinkHubProfile,
  ShadowStrength,
  SocialButtonPlatform,
} from "./types";

type Props = {
  profile: LinkHubProfile;
  socials: SocialLink[];
  design: LinkHubDesign;
  blocks: Block[];

  previewMode?: "mobile" | "desktop";

  selectedBlockId?: number | null;

  editable?: boolean;

  onSelectBlock?: (id: number) => void;

  onBlockClick?: (
    block: Block,
    destination?: string | null
  ) => void;
};

function getWidthStyle(
  block: Block
): CSSProperties {
  const width =
    block.width || "full";

  if (width === "wide") {
    return {
      width: "92%",
      alignSelf: "center",
    };
  }

  if (width === "medium") {
    return {
      width: "78%",
      alignSelf: "center",
    };
  }

  if (width === "compact") {
    return {
      width: "62%",
      alignSelf: "center",
    };
  }

  return {
    width: "100%",
  };
}

function getShadow(
  strength: ShadowStrength | undefined,
  fallback = true
) {
  if (!strength) {
    return fallback
      ? "0 12px 28px rgba(0,0,0,.08)"
      : "none";
  }

  if (strength === "none") {
    return "none";
  }

  if (strength === "soft") {
    return "0 8px 22px rgba(0,0,0,.07)";
  }

  if (strength === "medium") {
    return "0 14px 34px rgba(0,0,0,.13)";
  }

  return "0 22px 55px rgba(0,0,0,.22)";
}

function getBlockBaseStyle(
  block: Block,
  fallbackShadow: boolean,
  fallbackBorderColor: string
): CSSProperties {
  return {
    ...getWidthStyle(block),

    opacity:
      (block.opacity ?? 100) /
      100,

    borderStyle:
      (block.borderWidth || 0) >
      0
        ? "solid"
        : undefined,

    borderWidth:
      (block.borderWidth || 0) >
      0
        ? block.borderWidth
        : undefined,

    borderColor:
      (block.borderWidth || 0) >
      0
        ? block.borderColor ||
          fallbackBorderColor
        : undefined,

    boxShadow: getShadow(
      block.shadow,
      fallbackShadow
    ),
  };
}

function getSocialPlatform(
  platform: SocialButtonPlatform
): SocialLink["platform"] {
  return platform;
}

function Countdown({
  targetDate,
  completedText,
}: {
  targetDate: string;
  completedText?: string;
}) {
  const [now, setNow] =
    useState(() => Date.now());

  useEffect(() => {
    const interval =
      window.setInterval(() => {
        setNow(Date.now());
      }, 1000);

    return () => {
      window.clearInterval(
        interval
      );
    };
  }, []);

  const target = useMemo(
    () =>
      targetDate
        ? new Date(
            targetDate
          ).getTime()
        : Number.NaN,
    [targetDate]
  );

  if (
    !targetDate ||
    Number.isNaN(target)
  ) {
    return (
      <div className="grid grid-cols-4 gap-2">
        {[
          "Days",
          "Hours",
          "Min",
          "Sec",
        ].map((label) => (
          <div
            key={label}
            className="rounded-[14px] bg-black/5 px-2 py-3 text-center"
          >
            <div className="text-lg font-black">
              00
            </div>

            <div className="mt-1 text-[8px] font-black uppercase tracking-[0.13em] opacity-40">
              {label}
            </div>
          </div>
        ))}
      </div>
    );
  }

  const remaining = Math.max(
    0,
    target - now
  );

  if (remaining <= 0) {
    return (
      <div className="py-2 text-sm font-bold">
        {completedText ||
          "We're live!"}
      </div>
    );
  }

  const days = Math.floor(
    remaining / 86400000
  );

  const hours = Math.floor(
    (remaining % 86400000) /
      3600000
  );

  const minutes = Math.floor(
    (remaining % 3600000) /
      60000
  );

  const seconds = Math.floor(
    (remaining % 60000) /
      1000
  );

  return (
    <div className="grid grid-cols-4 gap-2">
      {[
        ["Days", days],
        ["Hours", hours],
        ["Min", minutes],
        ["Sec", seconds],
      ].map(([label, value]) => (
        <div
          key={String(label)}
          className="rounded-[14px] bg-black/5 px-2 py-3 text-center"
        >
          <div className="text-lg font-black">
            {String(value).padStart(
              2,
              "0"
            )}
          </div>

          <div className="mt-1 text-[8px] font-black uppercase tracking-[0.13em] opacity-40">
            {label}
          </div>
        </div>
      ))}
    </div>
  );
}


function EmailSignup({
  block,
  username,
  editable,
  onSelect,
  baseStyle,
  selectedStyle,
  fallbackButtonColor,
  fallbackButtonTextColor,
  fallbackAccentColor,
  onPublicSubmit,
}: {
  block: EmailSignupBlock;
  username: string;
  editable: boolean;
  onSelect: () => void;
  baseStyle: CSSProperties;
  selectedStyle: CSSProperties;
  fallbackButtonColor: string;
  fallbackButtonTextColor: string;
  fallbackAccentColor: string;
  onPublicSubmit?: () => void;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] =
    useState<
      "idle" | "submitting" | "success" | "error"
    >("idle");
  const [message, setMessage] = useState("");

  const submit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (editable) {
      onSelect();
      return;
    }

    if (!email.trim()) {
      setStatus("error");
      setMessage("Enter your email address.");
      return;
    }

    setStatus("submitting");
    setMessage("");

    try {
      const response = await fetch(
        "/api/link-hub/subscribe",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            username,
            email,
          }),
        }
      );

      const result = (await response.json()) as {
        ok?: boolean;
        error?: string;
      };

      if (!response.ok || !result.ok) {
        throw new Error(
          result.error ||
            "Could not subscribe right now."
        );
      }

      setEmail("");
      setStatus("success");
      setMessage(
        block.successMessage ||
          "You're on the list."
      );

      onPublicSubmit?.();
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not subscribe right now."
      );
    }
  };

  return (
    <form
      onSubmit={submit}
      onClick={() => {
        if (editable) {
          onSelect();
        }
      }}
      className={
        editable
          ? "cursor-pointer p-5 text-left"
          : "p-5 text-left"
      }
      style={{
        ...baseStyle,
        ...selectedStyle,
        backgroundColor:
          block.backgroundColor ||
          fallbackButtonColor,
        color:
          block.textColor ||
          fallbackButtonTextColor,
        borderRadius:
          block.radius ?? 24,
      }}
    >
      <div className="flex items-center gap-3">
        <Mail size={18} />

        <div className="font-black">
          {block.title}
        </div>
      </div>

      <div className="mt-2 text-xs leading-5 opacity-50">
        {block.description}
      </div>

      <div className="mt-4 flex gap-2">
        <input
          type="email"
          value={editable ? "" : email}
          onChange={(event) => {
            if (!editable) {
              setEmail(event.target.value);
            }
          }}
          disabled={
            editable ||
            status === "submitting" ||
            status === "success"
          }
          placeholder={
            block.placeholder ||
            "Enter your email"
          }
          className="min-w-0 flex-1 rounded-[13px] border-0 px-3 py-3 text-xs outline-none disabled:opacity-60"
          style={{
            backgroundColor:
              block.inputColor ||
              "rgba(0,0,0,.06)",
            color:
              block.textColor ||
              fallbackButtonTextColor,
          }}
        />

        <button
          type="submit"
          disabled={
            editable ||
            status === "submitting" ||
            status === "success"
          }
          className="rounded-[13px] px-4 py-3 text-xs font-black disabled:cursor-not-allowed disabled:opacity-60"
          style={{
            backgroundColor:
              block.buttonColor ||
              fallbackAccentColor,
            color:
              block.buttonTextColor ||
              "#FFFFFF",
          }}
        >
          {status === "submitting"
            ? "Joining..."
            : status === "success"
              ? "Joined"
              : block.buttonLabel ||
                "Join"}
        </button>
      </div>

      {message && (
        <div
          className={`mt-3 text-[11px] font-bold ${
            status === "error"
              ? "text-red-600"
              : ""
          }`}
          aria-live="polite"
        >
          {message}
        </div>
      )}
    </form>
  );
}

export default function LinkHubRenderer({
  profile,
  socials,
  design,
  blocks,
  previewMode = "mobile",
  selectedBlockId = null,
  editable = false,
  onSelectBlock,
  onBlockClick,
}: Props) {
  const {
    displayName,
    username,
    bio,
    profileImage,
  } = profile;

  const {
    pageBackground,
    accentColor,
    textColor,
    buttonColor,
    buttonTextColor,
    backgroundMode,
    gradientColorOne,
    gradientColorTwo,
    gradientDirection,
    backgroundImage,
    videoBackgroundUrl,
    backgroundPosition,
    backgroundBlur,
    overlayOpacity,
    overlayColor,
    buttonRadius,
    buttonShadow,
    profileSize,
    profileRadius,
    contentWidth,
    pagePadding,
    blockSpacing,
    headingAlign,
  } = design;

  const enabledSocials =
    socials.filter(
      (social) =>
        social.enabled &&
        social.url.trim().length > 0
    );

  const previewBackgroundStyle: CSSProperties =
    {
      backgroundColor:
        backgroundMode ===
        "solid"
          ? pageBackground
          : undefined,

      backgroundImage:
        backgroundMode ===
        "gradient"
          ? `linear-gradient(${gradientDirection}, ${gradientColorOne}, ${gradientColorTwo})`
          : backgroundMode ===
              "image" &&
            backgroundImage &&
            backgroundBlur === 0
          ? `url("${backgroundImage}")`
          : undefined,

      backgroundSize:
        backgroundMode ===
        "image"
          ? "cover"
          : undefined,

      backgroundPosition:
        backgroundMode ===
        "image"
          ? backgroundPosition
          : undefined,

      color: textColor,
    };

  const selectBlock = (
    id: number
  ) => {
    if (
      editable &&
      onSelectBlock
    ) {
      onSelectBlock(id);
    }
  };

  const trackBlockClick = (
    block: Block,
    destination?: string | null
  ) => {
    if (
      editable ||
      !onBlockClick
    ) {
      return;
    }

    onBlockClick(
      block,
      destination || null
    );
  };

  const stopAction = (
    event:
      | React.MouseEvent
      | React.FormEvent
  ) => {
    if (editable) {
      event.preventDefault();
    }
  };

  const selectionStyle = (
    id: number
  ): CSSProperties =>
    editable &&
    selectedBlockId === id
      ? {
          outline: `3px solid ${accentColor}`,
          outlineOffset: "3px",
        }
      : {};

  return (
    <div
      className="relative min-h-full overflow-hidden"
      style={
        previewBackgroundStyle
      }
    >
      {backgroundMode ===
        "video" &&
        videoBackgroundUrl && (
          <video
            src={
              videoBackgroundUrl
            }
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
            style={{
              filter: `blur(${backgroundBlur}px)`,
              transform:
                backgroundBlur > 0
                  ? "scale(1.08)"
                  : undefined,
            }}
          />
        )}

      {backgroundMode ===
        "image" &&
        backgroundImage &&
        backgroundBlur > 0 && (
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("${backgroundImage}")`,
              backgroundSize:
                "cover",
              backgroundPosition,
              filter: `blur(${backgroundBlur}px)`,
              transform:
                "scale(1.08)",
            }}
          />
        )}

      {(backgroundMode ===
        "image" ||
        backgroundMode ===
          "video") &&
        overlayOpacity > 0 && (
          <div
            className="absolute inset-0"
            style={{
              backgroundColor:
                overlayColor,
              opacity:
                overlayOpacity /
                100,
            }}
          />
        )}

      <div className="relative z-10">
        {editable &&
          previewMode ===
            "mobile" && (
            <div className="flex justify-center pt-3">
              <div className="h-7 w-28 rounded-full bg-[#111111]" />
            </div>
          )}

        <div
          className="mx-auto"
          style={{
            maxWidth:
              contentWidth,
            padding:
              pagePadding,
          }}
        >
          <div className="flex w-full justify-end">
            <button
              type="button"
              onClick={(event) =>
                stopAction(event)
              }
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/55 text-black backdrop-blur-xl"
            >
              <Share2 size={16} />
            </button>
          </div>

          <div
            className={`flex ${
              headingAlign ===
              "center"
                ? "flex-col items-center text-center"
                : headingAlign ===
                  "right"
                ? "flex-col items-end text-right"
                : "flex-col items-start text-left"
            }`}
          >
            {profileImage ? (
              <img
                src={profileImage}
                alt={
                  displayName ||
                  "Profile"
                }
                className="object-cover"
                style={{
                  width:
                    profileSize,
                  height:
                    profileSize,
                  borderRadius:
                    profileRadius,
                }}
              />
            ) : (
              <div
                className="flex items-center justify-center font-black text-white"
                style={{
                  width:
                    profileSize,
                  height:
                    profileSize,
                  borderRadius:
                    profileRadius,
                  backgroundColor:
                    accentColor,
                  fontSize:
                    profileSize *
                    0.38,
                }}
              >
                {displayName
                  .slice(0, 1)
                  .toUpperCase() ||
                  "B"}
              </div>
            )}

            <h2
              className={`mt-5 font-black tracking-[-0.045em] ${
                previewMode ===
                "desktop"
                  ? "text-5xl"
                  : "text-3xl"
              }`}
            >
              {displayName ||
                "Your Name"}
            </h2>

            <div className="mt-1 text-sm opacity-45">
              @
              {username ||
                "username"}
            </div>

            <p className="mt-4 max-w-lg text-sm leading-6 opacity-60">
              {bio ||
                "Add a bio to tell people who you are."}
            </p>

            {enabledSocials.length >
              0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {enabledSocials.map(
                  (social) => (
                    <a
                      key={
                        social.id
                      }
                      href={
                        social.url ||
                        "#"
                      }
                      onClick={(
                        event
                      ) =>
                        stopAction(
                          event
                        )
                      }
                      title={
                        social.label
                      }
                      className="flex h-10 w-10 items-center justify-center rounded-full transition hover:-translate-y-0.5"
                      style={{
                        backgroundColor:
                          textColor,

                        color:
                          backgroundMode ===
                          "solid"
                            ? pageBackground
                            : "#FFFFFF",
                      }}
                    >
                      <PlatformIcon
                        platform={
                          social.platform
                        }
                        size={16}
                      />
                    </a>
                  )
                )}
              </div>
            )}
          </div>

          <div
            className="mt-7 flex flex-col"
            style={{
              gap: blockSpacing,
            }}
          >
            {blocks
              .filter(
                (block) =>
                  !block.hidden
              )
              .map((block) => {
                const base =
                  getBlockBaseStyle(
                    block,
                    buttonShadow,
                    textColor
                  );

                const selected =
                  selectionStyle(
                    block.id
                  );

                if (
                  block.type ===
                  "spacer"
                ) {
                  return (
                    <button
                      key={block.id}
                      type="button"
                      onClick={() =>
                        selectBlock(
                          block.id
                        )
                      }
                      className="relative w-full"
                      style={{
                        height:
                          block.height,
                        ...selected,
                      }}
                    >
                      {editable &&
                        selectedBlockId ===
                          block.id && (
                          <div className="absolute inset-0 flex items-center justify-center border border-dashed border-black/15 text-[9px] font-bold uppercase tracking-wider opacity-40">
                            Spacer{" "}
                            {
                              block.height
                            }
                            px
                          </div>
                        )}
                    </button>
                  );
                }

                if (
                  block.type ===
                  "divider"
                ) {
                  return (
                    <button
                      key={block.id}
                      type="button"
                      onClick={() =>
                        selectBlock(
                          block.id
                        )
                      }
                      className="flex"
                      style={{
                        ...base,
                        ...selected,
                        paddingTop:
                          block.spacing ??
                          12,
                        paddingBottom:
                          block.spacing ??
                          12,
                      }}
                    >
                      <div
                        className="w-full"
                        style={{
                          height:
                            block.thickness ??
                            1,

                          backgroundColor:
                            block.color ||
                            textColor,

                          opacity:
                            0.25,
                        }}
                      />
                    </button>
                  );
                }

                if (
                  block.type ===
                  "text"
                ) {
                  return (
                    <button
                      key={block.id}
                      type="button"
                      onClick={() =>
                        selectBlock(
                          block.id
                        )
                      }
                      className="px-1 py-2"
                      style={{
                        ...base,
                        ...selected,

                        textAlign:
                          block.align ||
                          "left",

                        fontSize:
                          block.fontSize ||
                          14,

                        fontWeight:
                          block.fontWeight ||
                          600,

                        color:
                          block.color ||
                          textColor,

                        fontStyle:
                          block.italic
                            ? "italic"
                            : "normal",
                      }}
                    >
                      {block.text}
                    </button>
                  );
                }

                if (
                  block.type ===
                  "image"
                ) {
                  return (
                    <button
                      key={block.id}
                      type="button"
                      onClick={() =>
                        selectBlock(
                          block.id
                        )
                      }
                      className="overflow-hidden text-left"
                      style={{
                        ...base,
                        ...selected,

                        borderRadius:
                          block.radius ??
                          buttonRadius,
                      }}
                    >
                      <div
                        className="flex items-center justify-center overflow-hidden"
                        style={{
                          height:
                            block.height ||
                            180,

                          backgroundColor:
                            "rgba(0,0,0,.08)",
                        }}
                      >
                        {block.imageUrl ? (
                          <img
                            src={
                              block.imageUrl
                            }
                            alt={
                              block.caption
                            }
                            className="h-full w-full"
                            style={{
                              objectFit:
                                block.fit ||
                                "cover",

                              objectPosition:
                                block.position ||
                                "center",
                            }}
                          />
                        ) : (
                          <ImageIcon
                            size={30}
                            className="opacity-25"
                          />
                        )}
                      </div>

                      {block.showCaption !==
                        false && (
                        <div
                          className="px-4 py-3 text-sm font-bold"
                          style={{
                            backgroundColor:
                              block.captionBackground ||
                              buttonColor,

                            color:
                              block.captionColor ||
                              buttonTextColor,
                          }}
                        >
                          {
                            block.caption
                          }
                        </div>
                      )}
                    </button>
                  );
                }

                if (
                  block.type ===
                  "video"
                ) {
                  const embed =
                    getVideoEmbed(
                      block.url
                    );

                  return (
                    <div
                      key={block.id}
                      onClick={() => {
                        if (
                          editable
                        ) {
                          selectBlock(
                            block.id
                          );
                        }
                      }}
                      className={
                        editable
                          ? "cursor-pointer overflow-hidden text-left"
                          : "overflow-hidden text-left"
                      }
                      style={{
                        ...base,
                        ...selected,

                        backgroundColor:
                          block.backgroundColor ||
                          buttonColor,

                        color:
                          block.textColor ||
                          buttonTextColor,

                        borderRadius:
                          block.radius ??
                          buttonRadius,
                      }}
                    >
                      {embed?.kind ===
                        "youtube" ||
                      embed?.kind ===
                        "vimeo" ? (
                        <div className="aspect-video overflow-hidden bg-black">
                          <iframe
                            src={
                              embed.src
                            }
                            title={
                              block.title ||
                              "Video"
                            }
                            className="h-full w-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            onClick={(
                              event
                            ) => {
                              if (
                                editable
                              ) {
                                event.preventDefault();
                              }
                            }}
                          />
                        </div>
                      ) : embed?.kind ===
                        "direct" ? (
                        <video
                          src={
                            embed.src
                          }
                          controls
                          playsInline
                          className="aspect-video w-full bg-black object-contain"
                          onClick={(
                            event
                          ) => {
                            if (
                              editable
                            ) {
                              event.preventDefault();
                            }
                          }}
                        />
                      ) : (
                        <div className="flex aspect-video items-center justify-center bg-black text-white">
                          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-black">
                            <Video
                              size={22}
                            />
                          </div>
                        </div>
                      )}

                      <div className="px-4 py-4">
                        <div className="text-sm font-bold">
                          {
                            block.title
                          }
                        </div>

                        {embed?.kind ===
                          "link" &&
                          block.url &&
                          block.url !==
                            "#" && (
                            <a
                              href={
                                block.url
                              }
                              target="_blank"
                              rel="noreferrer"
                              onClick={(
                                event
                              ) => {
                                if (
                                  editable
                                ) {
                                  event.preventDefault();
                                }
                              }}
                              className="mt-2 inline-flex text-[11px] font-bold underline opacity-60"
                            >
                              Open video
                            </a>
                          )}
                      </div>
                    </div>
                  );
                }

                if (
                  block.type ===
                  "music"
                ) {
                  const source =
                    block.artworkUrl?.trim() ||
                    "";

                  const musicUrl =
                    block.url?.trim() ||
                    "";

                  const embed =
                    getMusicEmbed(
                      musicUrl
                    );

                  if (
                    embed?.kind ===
                    "spotify" ||
                    embed?.kind ===
                    "soundcloud"
                  ) {
                    return (
                      <div
                        key={block.id}
                        onClick={() => {
                          if (
                            editable
                          ) {
                            selectBlock(
                              block.id
                            );
                          }
                        }}
                        className={
                          editable
                            ? "cursor-pointer overflow-hidden p-3"
                            : "overflow-hidden p-3"
                        }
                        style={{
                          ...base,
                          ...selected,

                          backgroundColor:
                            block.backgroundColor ||
                            buttonColor,

                          color:
                            block.textColor ||
                            buttonTextColor,

                          borderRadius:
                            block.radius ??
                            buttonRadius,
                        }}
                      >
                        <div className="mb-3 flex items-center gap-3">
                          {source ? (
                            <img
                              src={
                                source
                              }
                              alt=""
                              className="h-12 w-12 rounded-[14px] object-cover"
                            />
                          ) : (
                            <div
                              className="flex h-12 w-12 items-center justify-center rounded-[14px] text-white"
                              style={{
                                backgroundColor:
                                  accentColor,
                              }}
                            >
                              <Music2
                                size={
                                  18
                                }
                              />
                            </div>
                          )}

                          <div className="min-w-0">
                            <div className="truncate text-sm font-bold">
                              {
                                block.title
                              }
                            </div>

                            <div className="mt-1 truncate text-xs opacity-45">
                              {
                                block.artist
                              }
                            </div>
                          </div>
                        </div>

                        <iframe
                          src={
                            embed.src
                          }
                          title={`${block.title} by ${block.artist}`}
                          className="w-full rounded-[12px] border-0"
                          style={{
                            height:
                              embed.height,
                          }}
                          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                          loading="lazy"
                        />
                      </div>
                    );
                  }

                  if (
                    embed?.kind ===
                    "direct"
                  ) {
                    return (
                      <div
                        key={block.id}
                        onClick={() => {
                          if (
                            editable
                          ) {
                            selectBlock(
                              block.id
                            );
                          }
                        }}
                        className={
                          editable
                            ? "cursor-pointer p-4 text-left"
                            : "p-4 text-left"
                        }
                        style={{
                          ...base,
                          ...selected,

                          backgroundColor:
                            block.backgroundColor ||
                            buttonColor,

                          color:
                            block.textColor ||
                            buttonTextColor,

                          borderRadius:
                            block.radius ??
                            buttonRadius,
                        }}
                      >
                        <div className="flex items-center gap-4">
                          {source ? (
                            <img
                              src={
                                source
                              }
                              alt=""
                              className="h-14 w-14 shrink-0 rounded-[16px] object-cover"
                            />
                          ) : (
                            <div
                              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[16px] text-white"
                              style={{
                                backgroundColor:
                                  accentColor,
                              }}
                            >
                              <Music2
                                size={
                                  20
                                }
                              />
                            </div>
                          )}

                          <div className="min-w-0 flex-1">
                            <div className="truncate text-sm font-bold">
                              {
                                block.title
                              }
                            </div>

                            <div className="mt-1 truncate text-xs opacity-45">
                              {
                                block.artist
                              }
                            </div>
                          </div>
                        </div>

                        <audio
                          src={
                            embed.src
                          }
                          controls
                          className="mt-4 w-full"
                        />
                      </div>
                    );
                  }

                  return (
                    <button
                      key={block.id}
                      type="button"
                      onClick={() =>
                        selectBlock(
                          block.id
                        )
                      }
                      className="flex items-center gap-4 p-4 text-left"
                      style={{
                        ...base,
                        ...selected,

                        backgroundColor:
                          block.backgroundColor ||
                          buttonColor,

                        color:
                          block.textColor ||
                          buttonTextColor,

                        borderRadius:
                          block.radius ??
                          buttonRadius,
                      }}
                    >
                      {source ? (
                        <img
                          src={
                            source
                          }
                          alt=""
                          className="h-14 w-14 shrink-0 rounded-[16px] object-cover"
                        />
                      ) : (
                        <div
                          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[16px] text-white"
                          style={{
                            backgroundColor:
                              accentColor,
                          }}
                        >
                          <Music2
                            size={20}
                          />
                        </div>
                      )}

                      <div className="min-w-0">
                        <div className="truncate text-sm font-bold">
                          {
                            block.title
                          }
                        </div>

                        <div className="mt-1 truncate text-xs opacity-45">
                          {
                            block.artist
                          }
                        </div>
                      </div>
                    </button>
                  );
                }

                if (
                  block.type ===
                  "qr"
                ) {
                  const qrValue =
                    block.destination?.trim() ||
                    "https://bodolvo.online";

                  return (
                    <button
                      key={block.id}
                      type="button"
                      onClick={() => {
                        if (editable) {
                          selectBlock(
                            block.id
                          );
                          return;
                        }

                        trackBlockClick(
                          block,
                          block.destination
                        );
                      }}
                      className="flex items-center gap-4 p-4 text-left"
                      style={{
                        ...base,
                        ...selected,

                        backgroundColor:
                          block.backgroundColor ||
                          buttonColor,

                        color:
                          block.textColor ||
                          buttonTextColor,

                        borderRadius:
                          block.radius ??
                          buttonRadius,
                      }}
                    >
                      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[12px] bg-white p-2">
                        <QRCode
                          value={qrValue}
                          size={64}
                          bgColor="#FFFFFF"
                          fgColor="#000000"
                          level="M"
                          style={{
                            height: "64px",
                            width: "64px",
                          }}
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-bold">
                          {
                            block.label
                          }
                        </div>

                        <div className="mt-1 truncate text-xs opacity-45">
                          {block.destination?.trim()
                            ? block.destination
                            : "Add a destination URL"}
                        </div>
                      </div>
                    </button>
                  );
                }

                if (
                  block.type ===
                  "social"
                ) {
                  const socialStyle =
                    block.style ||
                    "button";

                  if (
                    socialStyle ===
                    "icon"
                  ) {
                    return (
                      <a
                        key={block.id}
                        href={
                          block.url ||
                          "#"
                        }
                        onClick={(event) => {
                        if (editable) {
                          event.preventDefault();
                          selectBlock(block.id);
                          return;
                        }

                        trackBlockClick(
                          block,
                          "url" in block
                            ? block.url
                            : "purchaseUrl" in block
                              ? block.purchaseUrl
                              : "fileUrl" in block
                                ? block.fileUrl
                                : null
                        );
                      }}
                        className="flex items-center justify-center self-center"
                        style={{
                          ...base,
                          ...selected,

                          width: 64,
                          height: 64,

                          borderRadius:
                            block.radius ??
                            22,

                          backgroundColor:
                            block.backgroundColor ||
                            buttonColor,

                          color:
                            block.textColor ||
                            buttonTextColor,
                        }}
                      >
                        <PlatformIcon
                          platform={getSocialPlatform(
                            block.platform
                          )}
                          size={22}
                        />
                      </a>
                    );
                  }

                  return (
                    <a
                      key={block.id}
                      href={
                        block.url ||
                        "#"
                      }
                      onClick={(
                        event
                      ) => {
                        if (
                          editable
                        ) {
                          event.preventDefault();

                          selectBlock(
                            block.id
                          );

                          return;
                        }

                        trackBlockClick(
                          block,
                          "url" in block
                            ? block.url
                            : "purchaseUrl" in block
                              ? block.purchaseUrl
                              : null
                        );
                      }}
                      className={`flex items-center gap-4 p-4 text-left ${
                        socialStyle ===
                        "card"
                          ? "min-h-[100px]"
                          : ""
                      }`}
                      style={{
                        ...base,
                        ...selected,

                        backgroundColor:
                          block.backgroundColor ||
                          buttonColor,

                        color:
                          block.textColor ||
                          buttonTextColor,

                        borderRadius:
                          block.radius ??
                          buttonRadius,
                      }}
                    >
                      <div
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] text-white"
                        style={{
                          backgroundColor:
                            block.accentColor ||
                            accentColor,
                        }}
                      >
                        <PlatformIcon
                          platform={getSocialPlatform(
                            block.platform
                          )}
                          size={18}
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="font-bold">
                          {
                            block.label
                          }
                        </div>

                        {socialStyle ===
                          "card" && (
                          <div className="mt-1 text-xs opacity-45">
                            Visit my{" "}
                            {
                              block.platform
                            }
                          </div>
                        )}
                      </div>

                      <ArrowLeft
                        size={16}
                        className="rotate-180"
                      />
                    </a>
                  );
                }

                if (
                  block.type ===
                  "contact"
                ) {
                  return (
                    <div
                      key={block.id}
                      onClick={() =>
                        selectBlock(
                          block.id
                        )
                      }
                      className={
                        editable
                          ? "cursor-pointer p-5 text-left"
                          : "p-5 text-left"
                      }
                      style={{
                        ...base,
                        ...selected,

                        backgroundColor:
                          block.backgroundColor ||
                          buttonColor,

                        color:
                          block.textColor ||
                          buttonTextColor,

                        borderRadius:
                          block.radius ??
                          24,
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] text-white"
                          style={{
                            backgroundColor:
                              block.accentColor ||
                              accentColor,
                          }}
                        >
                          <ContactRound
                            size={19}
                          />
                        </div>

                        <div>
                          <div className="text-lg font-black">
                            {
                              block.title
                            }
                          </div>

                          <div className="mt-1 text-xs opacity-50">
                            {
                              block.description
                            }
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {block.showEmail !==
                          false &&
                          block.email && (
                            <a
                              href={`mailto:${block.email}`}
                              onClick={(event) => {
                                if (editable) {
                                  stopAction(event);
                                  return;
                                }

                                trackBlockClick(
                                  block,
                                  `mailto:${block.email}`
                                );
                              }}
                              className="rounded-full bg-black/5 px-3 py-2 text-[10px] font-bold"
                            >
                              Email
                            </a>
                          )}

                        {block.showPhone !==
                          false &&
                          block.phone && (
                            <a
                              href={`tel:${block.phone}`}
                              onClick={(event) => {
                                if (editable) {
                                  stopAction(event);
                                  return;
                                }

                                trackBlockClick(
                                  block,
                                  `tel:${block.phone}`
                                );
                              }}
                              className="rounded-full bg-black/5 px-3 py-2 text-[10px] font-bold"
                            >
                              Call
                            </a>
                          )}

                        {block.showWebsite !==
                          false &&
                          block.website && (
                            <a
                              href={
                                block.website
                              }
                              onClick={stopAction}
                              className="rounded-full bg-black/5 px-3 py-2 text-[10px] font-bold"
                            >
                              Website
                            </a>
                          )}
                      </div>
                    </div>
                  );
                }

                if (
                  block.type ===
                  "email"
                ) {
                  return (
                    <EmailSignup
                      key={block.id}
                      block={block}
                      username={
                        profile.username
                      }
                      editable={
                        editable
                      }
                      onSelect={() =>
                        selectBlock(
                          block.id
                        )
                      }
                      baseStyle={
                        base
                      }
                      selectedStyle={
                        selected
                      }
                      fallbackButtonColor={
                        buttonColor
                      }
                      fallbackButtonTextColor={
                        buttonTextColor
                      }
                      fallbackAccentColor={
                        accentColor
                      }
                      onPublicSubmit={() =>
                        trackBlockClick(
                          block,
                          "/api/link-hub/subscribe"
                        )
                      }
                    />
                  );
                }

                if (
                  block.type ===
                  "file"
                ) {
                  return (
                    <a
                      key={block.id}
                      href={
                        block.fileUrl ||
                        "#"
                      }
                      download={
                        block.fileName ||
                        undefined
                      }
                      onClick={(
                        event
                      ) => {
                        if (
                          editable
                        ) {
                          event.preventDefault();

                          selectBlock(
                            block.id
                          );

                          return;
                        }

                        trackBlockClick(
                          block,
                          "url" in block
                            ? block.url
                            : "purchaseUrl" in block
                              ? block.purchaseUrl
                              : null
                        );
                      }}
                      className="flex items-center gap-4 p-4 text-left"
                      style={{
                        ...base,
                        ...selected,

                        backgroundColor:
                          block.backgroundColor ||
                          buttonColor,

                        color:
                          block.textColor ||
                          buttonTextColor,

                        borderRadius:
                          block.radius ??
                          22,
                      }}
                    >
                      <div
                        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[16px] text-white"
                        style={{
                          backgroundColor:
                            block.accentColor ||
                            accentColor,
                        }}
                      >
                        <Download
                          size={20}
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="font-bold">
                          {
                            block.title
                          }
                        </div>

                        <div className="mt-1 truncate text-xs opacity-45">
                          {block.fileName ||
                            block.description}
                        </div>

                        {block.fileSize && (
                          <div className="mt-1 text-[10px] opacity-30">
                            {
                              block.fileSize
                            }
                          </div>
                        )}
                      </div>

                      <span className="text-[10px] font-black uppercase">
                        {block.buttonLabel ||
                          "Download"}
                      </span>
                    </a>
                  );
                }

                if (
                  block.type ===
                  "product"
                ) {
                  const layout =
                    block.layout ||
                    "card";

                  if (
                    layout ===
                    "compact"
                  ) {
                    return (
                      <a
                        key={block.id}
                        href={
                          block.purchaseUrl ||
                          "#"
                        }
                        onClick={(event) => {
                        if (editable) {
                          event.preventDefault();
                          selectBlock(block.id);
                          return;
                        }

                        trackBlockClick(
                          block,
                          "url" in block
                            ? block.url
                            : "purchaseUrl" in block
                              ? block.purchaseUrl
                              : "fileUrl" in block
                                ? block.fileUrl
                                : null
                        );
                      }}
                        className="flex items-center gap-4 p-4 text-left"
                        style={{
                          ...base,
                          ...selected,

                          backgroundColor:
                            block.backgroundColor ||
                            buttonColor,

                          color:
                            block.textColor ||
                            buttonTextColor,

                          borderRadius:
                            block.radius ??
                            22,
                        }}
                      >
                        {block.imageUrl ? (
                          <img
                            src={
                              block.imageUrl
                            }
                            alt={
                              block.name
                            }
                            className="h-16 w-16 shrink-0 rounded-[15px] object-cover"
                          />
                        ) : (
                          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[15px] bg-black/5">
                            <Package
                              size={20}
                            />
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <div className="font-bold">
                            {
                              block.name
                            }
                          </div>

                          <div className="mt-1 text-xs font-black">
                            {
                              block.price
                            }
                          </div>
                        </div>
                      </a>
                    );
                  }

                  return (
                    <a
                      key={block.id}
                      href={
                        block.purchaseUrl ||
                        "#"
                      }
                      onClick={(
                        event
                      ) => {
                        if (
                          editable
                        ) {
                          event.preventDefault();

                          selectBlock(
                            block.id
                          );

                          return;
                        }

                        trackBlockClick(
                          block,
                          "url" in block
                            ? block.url
                            : "purchaseUrl" in block
                              ? block.purchaseUrl
                              : null
                        );
                      }}
                      className="overflow-hidden text-left"
                      style={{
                        ...base,
                        ...selected,

                        backgroundColor:
                          block.backgroundColor ||
                          buttonColor,

                        color:
                          block.textColor ||
                          buttonTextColor,

                        borderRadius:
                          block.radius ??
                          24,
                      }}
                    >
                      {block.imageUrl ? (
                        <img
                          src={
                            block.imageUrl
                          }
                          alt={
                            block.name
                          }
                          className={`w-full object-cover ${
                            layout ===
                            "featured"
                              ? "h-64"
                              : "h-48"
                          }`}
                        />
                      ) : (
                        <div
                          className={`flex w-full items-center justify-center bg-black/5 ${
                            layout ===
                            "featured"
                              ? "h-64"
                              : "h-48"
                          }`}
                        >
                          <Package
                            size={32}
                            className="opacity-25"
                          />
                        </div>
                      )}

                      <div className="p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="text-lg font-black">
                            {
                              block.name
                            }
                          </div>

                          <div className="shrink-0 text-sm font-black">
                            {
                              block.price
                            }
                          </div>
                        </div>

                        <div className="mt-2 text-xs leading-5 opacity-50">
                          {
                            block.description
                          }
                        </div>

                        <div
                          className="mt-4 rounded-[13px] px-4 py-3 text-center text-xs font-black text-white"
                          style={{
                            backgroundColor:
                              block.accentColor ||
                              accentColor,
                          }}
                        >
                          {block.buttonLabel ||
                            "Buy now"}
                        </div>
                      </div>
                    </a>
                  );
                }

                if (
                  block.type ===
                  "countdown"
                ) {
                  return (
                    <button
                      key={block.id}
                      type="button"
                      onClick={() =>
                        selectBlock(
                          block.id
                        )
                      }
                      className="p-5 text-left"
                      style={{
                        ...base,
                        ...selected,

                        backgroundColor:
                          block.backgroundColor ||
                          buttonColor,

                        color:
                          block.textColor ||
                          buttonTextColor,

                        borderRadius:
                          block.radius ??
                          24,
                      }}
                    >
                      <div className="mb-4 flex items-center gap-3">
                        <div
                          className="flex h-10 w-10 items-center justify-center rounded-[13px] text-white"
                          style={{
                            backgroundColor:
                              block.accentColor ||
                              accentColor,
                          }}
                        >
                          <CalendarClock
                            size={17}
                          />
                        </div>

                        <div className="font-black">
                          {
                            block.title
                          }
                        </div>
                      </div>

                      <Countdown
                        targetDate={
                          block.targetDate
                        }
                        completedText={
                          block.completedText
                        }
                      />
                    </button>
                  );
                }

                const layout =
                  block.layout ||
                  "standard";

                if (
                  layout ===
                  "featured"
                ) {
                  return (
                    <a
                      key={block.id}
                      href={
                        block.url ||
                        "#"
                      }
                      onClick={(
                        event
                      ) => {
                        if (
                          editable
                        ) {
                          event.preventDefault();

                          selectBlock(
                            block.id
                          );

                          return;
                        }

                        trackBlockClick(
                          block,
                          "url" in block
                            ? block.url
                            : "purchaseUrl" in block
                              ? block.purchaseUrl
                              : null
                        );
                      }}
                      className="overflow-hidden text-left transition hover:-translate-y-0.5"
                      style={{
                        ...base,
                        ...selected,

                        backgroundColor:
                          block.backgroundColor ||
                          buttonColor,

                        color:
                          block.textColor ||
                          buttonTextColor,

                        borderRadius:
                          block.radius ??
                          buttonRadius,
                      }}
                    >
                      {block.thumbnailUrl && (
                        <img
                          src={
                            block.thumbnailUrl
                          }
                          alt=""
                          className="h-44 w-full object-cover"
                        />
                      )}

                      <div className="p-5">
                        <div className="text-xl font-black tracking-tight">
                          {
                            block.title
                          }
                        </div>

                        <div className="mt-1 text-xs opacity-50">
                          {
                            block.subtitle
                          }
                        </div>
                      </div>
                    </a>
                  );
                }

                if (
                  layout ===
                  "minimal"
                ) {
                  return (
                    <a
                      key={block.id}
                      href={
                        block.url ||
                        "#"
                      }
                      onClick={(
                        event
                      ) => {
                        if (
                          editable
                        ) {
                          event.preventDefault();

                          selectBlock(
                            block.id
                          );

                          return;
                        }

                        trackBlockClick(
                          block,
                          "url" in block
                            ? block.url
                            : "purchaseUrl" in block
                              ? block.purchaseUrl
                              : null
                        );
                      }}
                      className="flex items-center justify-between border-b p-2 text-left"
                      style={{
                        ...base,
                        ...selected,

                        color:
                          block.textColor ||
                          textColor,

                        borderColor:
                          block.borderColor ||
                          `${textColor}30`,
                      }}
                    >
                      <div>
                        <div className="font-bold">
                          {
                            block.title
                          }
                        </div>

                        <div className="mt-1 text-xs opacity-40">
                          {
                            block.subtitle
                          }
                        </div>
                      </div>

                      <ArrowLeft
                        size={16}
                        className="rotate-180"
                      />
                    </a>
                  );
                }

                return (
                  <a
                    key={block.id}
                    href={
                      block.url ||
                      "#"
                    }
                    onClick={(event) => {
                        if (editable) {
                          event.preventDefault();
                          selectBlock(block.id);
                          return;
                        }

                        trackBlockClick(
                          block,
                          "url" in block
                            ? block.url
                            : "purchaseUrl" in block
                              ? block.purchaseUrl
                              : "fileUrl" in block
                                ? block.fileUrl
                                : null
                        );
                      }}
                    className="group flex items-center gap-4 p-4 text-left transition hover:-translate-y-0.5"
                    style={{
                      ...base,
                      ...selected,

                      backgroundColor:
                        block.backgroundColor ||
                        buttonColor,

                      color:
                        block.textColor ||
                        buttonTextColor,

                      borderRadius:
                        block.radius ??
                        buttonRadius,
                    }}
                  >
                    {layout ===
                      "thumbnail" &&
                    block.thumbnailUrl ? (
                      <img
                        src={
                          block.thumbnailUrl
                        }
                        alt=""
                        className="h-14 w-14 shrink-0 rounded-[15px] object-cover"
                      />
                    ) : (
                      <div
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[15px] text-white"
                        style={{
                          backgroundColor:
                            block.accentColor ||
                            accentColor,
                        }}
                      >
                        <Link2
                          size={17}
                        />
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="font-bold">
                        {
                          block.title
                        }
                      </div>

                      <div className="mt-0.5 truncate text-xs opacity-45">
                        {
                          block.subtitle
                        }
                      </div>
                    </div>

                    <ArrowLeft
                      size={16}
                      className="rotate-180 transition group-hover:translate-x-0.5"
                    />
                  </a>
                );
              })}
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] opacity-20">
            <Link2 size={11} />
            Made with Bodolvo
          </div>
        </div>
      </div>
    </div>
  );
}

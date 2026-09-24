"use client";

import {
  AtSign,
  BriefcaseBusiness,
  Camera,
  Code2,
  Gamepad2,
  Globe2,
  GripVertical,
  Mail,
  MessageCircle,
  Music2,
  Plus,
  Trash2,
  Users,
  Video,
} from "lucide-react";

import MediaUploader from "./MediaUploader";

export type SocialPlatform =
  | "instagram"
  | "youtube"
  | "tiktok"
  | "twitter"
  | "facebook"
  | "twitch"
  | "github"
  | "linkedin"
  | "email"
  | "website";

export type SocialLink = {
  id: number;
  platform: SocialPlatform;
  url: string;
  label: string;
  enabled: boolean;
};

type Props = {
  displayName: string;
  username: string;
  bio: string;

  profileImage: string | null;

  profileSize: number;
  profileRadius: number;

  socials: SocialLink[];

  onDisplayNameChange: (value: string) => void;
  onUsernameChange: (value: string) => void;
  onBioChange: (value: string) => void;

  onProfileImageChange: (value: string | null) => void;

  onProfileSizeChange: (value: number) => void;
  onProfileRadiusChange: (value: number) => void;

  onSocialsChange: (socials: SocialLink[]) => void;
};

const platformOptions: {
  platform: SocialPlatform;
  label: string;
  placeholder: string;
}[] = [
  {
    platform: "instagram",
    label: "Instagram",
    placeholder: "https://instagram.com/username",
  },
  {
    platform: "youtube",
    label: "YouTube",
    placeholder: "https://youtube.com/@username",
  },
  {
    platform: "tiktok",
    label: "TikTok",
    placeholder: "https://tiktok.com/@username",
  },
  {
    platform: "twitter",
    label: "X / Twitter",
    placeholder: "https://x.com/username",
  },
  {
    platform: "facebook",
    label: "Facebook",
    placeholder: "https://facebook.com/username",
  },
  {
    platform: "twitch",
    label: "Twitch",
    placeholder: "https://twitch.tv/username",
  },
  {
    platform: "github",
    label: "GitHub",
    placeholder: "https://github.com/username",
  },
  {
    platform: "linkedin",
    label: "LinkedIn",
    placeholder: "https://linkedin.com/in/username",
  },
  {
    platform: "email",
    label: "Email",
    placeholder: "mailto:hello@example.com",
  },
  {
    platform: "website",
    label: "Website",
    placeholder: "https://example.com",
  },
];

export function PlatformIcon({
  platform,
  size = 16,
}: {
  platform: SocialPlatform;
  size?: number;
}) {
  if (platform === "instagram") {
    return <Camera size={size} />;
  }

  if (platform === "youtube") {
    return <Video size={size} />;
  }

  if (platform === "tiktok") {
    return <Music2 size={size} />;
  }

  if (platform === "twitter") {
    return <MessageCircle size={size} />;
  }

  if (platform === "facebook") {
    return <Users size={size} />;
  }

  if (platform === "twitch") {
    return <Gamepad2 size={size} />;
  }

  if (platform === "github") {
    return <Code2 size={size} />;
  }

  if (platform === "linkedin") {
    return <BriefcaseBusiness size={size} />;
  }

  if (platform === "email") {
    return <Mail size={size} />;
  }

  return <Globe2 size={size} />;
}

export default function ProfileCustomizer({
  displayName,
  username,
  bio,
  profileImage,
  profileSize,
  profileRadius,
  socials,
  onDisplayNameChange,
  onUsernameChange,
  onBioChange,
  onProfileImageChange,
  onProfileSizeChange,
  onProfileRadiusChange,
  onSocialsChange,
}: Props) {
  const addSocial = (platform: SocialPlatform) => {
    const option = platformOptions.find(
      (item) => item.platform === platform
    );

    if (!option) return;

    const alreadyExists = socials.some(
      (social) => social.platform === platform
    );

    if (alreadyExists) return;

    onSocialsChange([
      ...socials,
      {
        id: Date.now(),
        platform,
        url: "",
        label: option.label,
        enabled: true,
      },
    ]);
  };

  const updateSocial = (
    id: number,
    updates: Partial<SocialLink>
  ) => {
    onSocialsChange(
      socials.map((social) =>
        social.id === id
          ? {
              ...social,
              ...updates,
            }
          : social
      )
    );
  };

  const removeSocial = (id: number) => {
    onSocialsChange(
      socials.filter((social) => social.id !== id)
    );
  };

  const moveSocial = (
    id: number,
    direction: "up" | "down"
  ) => {
    const index = socials.findIndex(
      (social) => social.id === id
    );

    if (index < 0) return;

    const destination =
      direction === "up"
        ? index - 1
        : index + 1;

    if (
      destination < 0 ||
      destination >= socials.length
    ) {
      return;
    }

    const updated = [...socials];

    const [item] = updated.splice(index, 1);

    updated.splice(destination, 0, item);

    onSocialsChange(updated);
  };

  const unusedPlatforms = platformOptions.filter(
    (option) =>
      !socials.some(
        (social) =>
          social.platform === option.platform
      )
  );

  return (
    <div className="space-y-5">
      <div className="rounded-[22px] border border-black/10 bg-white p-5">
        <div className="text-sm font-bold">
          Profile image
        </div>

        <div className="mt-1 text-xs leading-5 text-black/40">
          Your photo, logo, avatar, or artwork.
        </div>

        <div className="mt-4">
          <MediaUploader
            username={username}
            label="Upload profile image"
            value={profileImage}
            helperText="JPG, PNG, WEBP, or GIF"
            onChange={(url) =>
              onProfileImageChange(url)
            }
            previewHeight={220}
            rounded={20}
          />
        </div>
      </div>

      <div className="rounded-[22px] border border-black/10 bg-white p-5">
        <div className="text-sm font-bold">
          Identity
        </div>

        <div className="mt-4 space-y-4">
          <div>
            <div className="mb-2 text-[11px] font-semibold text-black/40">
              Display name
            </div>

            <input
              value={displayName}
              onChange={(event) =>
                onDisplayNameChange(
                  event.target.value
                )
              }
              placeholder="Your name"
              className="w-full rounded-[14px] border border-black/10 bg-[#F7F3EB] px-3 py-3 text-sm outline-none transition focus:border-[#6657FF]"
            />
          </div>

          <div>
            <div className="mb-2 text-[11px] font-semibold text-black/40">
              Username
            </div>

            <div className="flex overflow-hidden rounded-[14px] border border-black/10 bg-[#F7F3EB]">
              <div className="flex items-center border-r border-black/10 px-3 text-xs text-black/35">
                /u/
              </div>

              <input
                value={username}
                onChange={(event) =>
                  onUsernameChange(
                    event.target.value
                      .toLowerCase()
                      .replace(
                        /[^a-z0-9-_]/g,
                        ""
                      )
                  )
                }
                placeholder="username"
                className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm outline-none"
              />
            </div>
          </div>

          <div>
            <div className="mb-2 text-[11px] font-semibold text-black/40">
              Bio
            </div>

            <textarea
              value={bio}
              onChange={(event) =>
                onBioChange(event.target.value)
              }
              placeholder="Tell people who you are..."
              className="min-h-[120px] w-full resize-none rounded-[14px] border border-black/10 bg-[#F7F3EB] px-3 py-3 text-sm leading-6 outline-none transition focus:border-[#6657FF]"
            />

            <div className="mt-1 text-right text-[10px] text-black/30">
              {bio.length} characters
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[22px] border border-black/10 bg-white p-5">
        <div className="text-sm font-bold">
          Profile appearance
        </div>

        <label className="mt-5 block">
          <div className="flex items-center justify-between text-xs">
            <span className="text-black/45">
              Profile size
            </span>

            <span className="font-bold">
              {profileSize}px
            </span>
          </div>

          <input
            type="range"
            min="48"
            max="180"
            value={profileSize}
            onChange={(event) =>
              onProfileSizeChange(
                Number(event.target.value)
              )
            }
            className="mt-3 w-full"
          />
        </label>

        <label className="mt-5 block">
          <div className="flex items-center justify-between text-xs">
            <span className="text-black/45">
              Corner radius
            </span>

            <span className="font-bold">
              {profileRadius}px
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="90"
            value={profileRadius}
            onChange={(event) =>
              onProfileRadiusChange(
                Number(event.target.value)
              )
            }
            className="mt-3 w-full"
          />
        </label>

        <div className="mt-5">
          <div className="mb-3 text-xs text-black/45">
            Quick shapes
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() =>
                onProfileRadiusChange(0)
              }
              className={`rounded-[13px] py-3 text-xs font-bold ${
                profileRadius === 0
                  ? "bg-black text-white"
                  : "bg-[#F3EFE7]"
              }`}
            >
              Square
            </button>

            <button
              type="button"
              onClick={() =>
                onProfileRadiusChange(24)
              }
              className={`rounded-[13px] py-3 text-xs font-bold ${
                profileRadius === 24
                  ? "bg-black text-white"
                  : "bg-[#F3EFE7]"
              }`}
            >
              Soft
            </button>

            <button
              type="button"
              onClick={() =>
                onProfileRadiusChange(90)
              }
              className={`rounded-[13px] py-3 text-xs font-bold ${
                profileRadius >= 80
                  ? "bg-black text-white"
                  : "bg-[#F3EFE7]"
              }`}
            >
              Circle
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-[22px] border border-black/10 bg-white p-5">
        <div className="text-sm font-bold">
          Social links
        </div>

        <div className="mt-1 text-xs leading-5 text-black/40">
          Add the platforms you actually use.
        </div>

        {socials.length === 0 ? (
          <div className="mt-5 rounded-[18px] border border-dashed border-black/15 bg-[#F7F3EB] p-6 text-center">
            <AtSign
              size={22}
              className="mx-auto text-black/25"
            />

            <div className="mt-3 text-sm font-bold">
              No social links yet
            </div>

            <div className="mt-1 text-xs text-black/40">
              Add one below.
            </div>
          </div>
        ) : (
          <div className="mt-5 space-y-3">
            {socials.map((social, index) => {
              const option =
                platformOptions.find(
                  (item) =>
                    item.platform ===
                    social.platform
                );

              return (
                <div
                  key={social.id}
                  className={`rounded-[18px] border p-3 transition ${
                    social.enabled
                      ? "border-black/10 bg-[#F7F3EB]"
                      : "border-black/5 bg-black/[0.025] opacity-55"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-5 items-center justify-center text-black/25">
                      <GripVertical
                        size={15}
                      />
                    </div>

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] bg-black text-white">
                      <PlatformIcon
                        platform={
                          social.platform
                        }
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold">
                        {social.label}
                      </div>

                      <div className="mt-0.5 truncate text-[10px] text-black/35">
                        {social.url ||
                          "No URL yet"}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        updateSocial(
                          social.id,
                          {
                            enabled:
                              !social.enabled,
                          }
                        )
                      }
                      className={`flex h-6 w-11 items-center rounded-full p-1 transition ${
                        social.enabled
                          ? "bg-[#6657FF]"
                          : "bg-black/15"
                      }`}
                    >
                      <span
                        className={`h-4 w-4 rounded-full bg-white transition ${
                          social.enabled
                            ? "translate-x-5"
                            : ""
                        }`}
                      />
                    </button>
                  </div>

                  <input
                    value={social.url}
                    onChange={(event) =>
                      updateSocial(
                        social.id,
                        {
                          url: event.target.value,
                        }
                      )
                    }
                    placeholder={
                      option?.placeholder ||
                      "https://"
                    }
                    className="mt-3 w-full rounded-[13px] border border-black/10 bg-white px-3 py-2.5 text-xs outline-none focus:border-[#6657FF]"
                  />

                  <div className="mt-3 flex items-center gap-2">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() =>
                        moveSocial(
                          social.id,
                          "up"
                        )
                      }
                      className="rounded-full bg-white px-3 py-2 text-[10px] font-bold disabled:opacity-25"
                    >
                      Up
                    </button>

                    <button
                      type="button"
                      disabled={
                        index ===
                        socials.length - 1
                      }
                      onClick={() =>
                        moveSocial(
                          social.id,
                          "down"
                        )
                      }
                      className="rounded-full bg-white px-3 py-2 text-[10px] font-bold disabled:opacity-25"
                    >
                      Down
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        removeSocial(
                          social.id
                        )
                      }
                      className="ml-auto flex h-8 w-8 items-center justify-center rounded-full bg-[#FFE7E3] text-[#C13D32]"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {unusedPlatforms.length > 0 && (
        <div className="rounded-[22px] border border-black/10 bg-white p-5">
          <div className="flex items-center gap-2">
            <Plus size={16} />

            <div className="text-sm font-bold">
              Add a platform
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            {unusedPlatforms.map(
              (option) => (
                <button
                  type="button"
                  key={option.platform}
                  onClick={() =>
                    addSocial(
                      option.platform
                    )
                  }
                  className="flex items-center gap-3 rounded-[15px] bg-[#F3EFE7] px-3 py-3 text-left transition hover:bg-black hover:text-white"
                >
                  <PlatformIcon
                    platform={
                      option.platform
                    }
                    size={15}
                  />

                  <span className="text-xs font-bold">
                    {option.label}
                  </span>
                </button>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
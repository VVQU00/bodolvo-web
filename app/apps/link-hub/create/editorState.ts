import type { SocialLink } from "./ProfileCustomizer";

import type {
  Block,
  LinkHubDesign,
  LinkHubProfile,
} from "./types";

export type LinkHubEditorState = {
  profile: LinkHubProfile;

  socials: SocialLink[];

  design: LinkHubDesign;

  blocks: Block[];
};

export const defaultLinkHubEditorState: LinkHubEditorState = {
  profile: {
    displayName: "Bodolvo",

    username: "bodolvo",

    bio: "Software, tools, experiments, and ideas built for everyday life.",

    profileImage: null,
  },

  socials: [
    {
      id: 101,
      platform: "instagram",
      label: "Instagram",
      url: "",
      enabled: true,
    },
    {
      id: 102,
      platform: "youtube",
      label: "YouTube",
      url: "",
      enabled: true,
    },
    {
      id: 103,
      platform: "website",
      label: "Website",
      url: "https://bodolvo.online",
      enabled: true,
    },
  ],

  design: {
    pageBackground: "#F4F0E8",

    accentColor: "#6657FF",

    textColor: "#131313",

    buttonColor: "#FFFFFF",

    buttonTextColor: "#131313",

    backgroundMode: "solid",

    gradientColorOne: "#6657FF",

    gradientColorTwo: "#D7FF55",

    gradientDirection: "to bottom right",

    backgroundImage: null,

    videoBackgroundUrl: "",

    backgroundPosition: "center",

    backgroundBlur: 0,

    overlayOpacity: 0,

    overlayColor: "#000000",

    buttonRadius: 22,

    buttonShadow: true,

    profileSize: 80,

    profileRadius: 24,

    contentWidth: 390,

    pagePadding: 20,

    blockSpacing: 12,

    headingAlign: "left",
  },

  blocks: [
    {
      id: 1,

      type: "link",

      title: "Explore Bodolvo",

      subtitle: "Apps, tools, and digital products",

      url: "https://bodolvo.online",

      hidden: false,

      layout: "standard",

      width: "full",

      opacity: 100,

      shadow: "soft",
    },

    {
      id: 2,

      type: "link",

      title: "Latest Release",

      subtitle: "See what we just launched",

      url: "#",

      hidden: false,

      layout: "standard",

      width: "full",

      opacity: 100,

      shadow: "soft",
    },

    {
      id: 3,

      type: "text",

      text: "Building useful things for real life.",

      fontSize: 14,

      fontWeight: 600,

      align: "left",

      hidden: false,

      width: "full",

      opacity: 100,

      shadow: "none",
    },
  ],
};

export const LINK_HUB_DRAFT_STORAGE_KEY =
  "bodolvo-link-hub-draft-v1";
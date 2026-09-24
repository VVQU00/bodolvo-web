"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type {
  ChangeEvent,
  CSSProperties,
} from "react";
import Link from "next/link";

import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ArrowLeft,
  BarChart3,
  CalendarClock,
  ContactRound,
  Copy,
  CopyPlus,
  Download,
  Eye,
  EyeOff,
  Film,
  GripVertical,
  Image as ImageIcon,
  Layers3,
  Link2,
  Mail,
  Monitor,
  Music2,
  Package,
  Palette,
  Plus,
  QrCode,
  Redo2,
  RotateCcw,
  Save,
  Settings,
  Share2,
  Smartphone,
  Space,
  Sparkles,
  Trash2,
  Type,
  Undo2,
  Upload,
  Video,
} from "lucide-react";

import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";

import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

import BlockCustomizer from "./BlockCustomizer";
import LinkHubRenderer from "./LinkHubRenderer";
import ProfileCustomizer, {
  type SocialLink,
} from "./ProfileCustomizer";
import useLinkHubHistory from "./useLinkHubHistory";
import {
  defaultLinkHubEditorState,
  LINK_HUB_DRAFT_STORAGE_KEY,
  type LinkHubEditorState,
} from "./editorState";

import type {
  BackgroundMode,
  BackgroundPosition,
  Block,
  BlockType,
  GradientDirection,
  ShadowStrength,
  TextAlign,
} from "./types";

const blockOptions: {
  type: BlockType;
  label: string;
  description: string;
  icon: typeof Link2;
}[] = [
  {
    type: "link",
    label: "Link",
    description: "Website, social, store, booking, or any destination.",
    icon: Link2,
  },
  {
    type: "text",
    label: "Text",
    description: "Heading, description, quote, announcement, or note.",
    icon: Type,
  },
  {
    type: "image",
    label: "Image",
    description: "Photography, graphics, artwork, flyers, or visual content.",
    icon: ImageIcon,
  },
  {
    type: "video",
    label: "Video",
    description: "Feature a video, stream, trailer, or video destination.",
    icon: Video,
  },
  {
    type: "music",
    label: "Music",
    description: "Feature a track, album, playlist, or upcoming release.",
    icon: Music2,
  },
  {
    type: "qr",
    label: "QR Code",
    description: "Give visitors a scannable destination or action.",
    icon: QrCode,
  },
  {
    type: "social",
    label: "Social Button",
    description: "Feature one social platform as a dedicated block.",
    icon: Share2,
  },
  {
    type: "contact",
    label: "Contact Card",
    description: "Show email, phone, website, and ways to reach you.",
    icon: ContactRound,
  },
  {
    type: "email",
    label: "Email Signup",
    description: "Collect email addresses from your visitors.",
    icon: Mail,
  },
  {
    type: "file",
    label: "Download",
    description: "Offer a file, document, media kit, guide, or resource.",
    icon: Download,
  },
  {
    type: "product",
    label: "Product",
    description: "Feature something you're selling with image and price.",
    icon: Package,
  },
  {
    type: "countdown",
    label: "Countdown",
    description: "Count down to a launch, event, release, or announcement.",
    icon: CalendarClock,
  },
  {
    type: "divider",
    label: "Divider",
    description: "Create visual separation between sections.",
    icon: Layers3,
  },
  {
    type: "spacer",
    label: "Spacer",
    description: "Add intentional breathing room anywhere on the page.",
    icon: Space,
  },
];

const presets = [
  {
    name: "Studio",
    bg: "#F4F0E8",
    accent: "#6657FF",
    text: "#131313",
    button: "#FFFFFF",
    buttonText: "#131313",
  },
  {
    name: "Midnight",
    bg: "#101010",
    accent: "#D7FF55",
    text: "#FFFFFF",
    button: "#1D1D1D",
    buttonText: "#FFFFFF",
  },
  {
    name: "Cherry",
    bg: "#F7D9D6",
    accent: "#DD3C48",
    text: "#261414",
    button: "#FFF7F5",
    buttonText: "#261414",
  },
  {
    name: "Ocean",
    bg: "#DCEFFC",
    accent: "#1267E3",
    text: "#0B1D37",
    button: "#FFFFFF",
    buttonText: "#0B1D37",
  },
];

const gradientPresets = [
  ["#6657FF", "#D7FF55"],
  ["#FF7B55", "#F6D365"],
  ["#111111", "#6657FF"],
  ["#1267E3", "#49D4FF"],
  ["#FF4F81", "#8A5CFF"],
  ["#F4F0E8", "#E1D9FF"],
];


type LinkHubStatsResponse = {
  ok: boolean;
  username: string;
  days: number;
  totals: {
    views: number;
    clicks: number;
    clickThroughRate: number;
  };
  daily: Array<{
    date: string;
    views: number;
    clicks: number;
  }>;
  topBlocks: Array<{
    blockId: number | null;
    blockType: string;
    destination: string | null;
    clicks: number;
  }>;
  topReferrers: Array<{
    referrer: string;
    views: number;
  }>;
  error?: string;
};

function getBlockTitle(block: Block) {
  if (block.type === "link") return block.title;
  if (block.type === "text") return block.text;
  if (block.type === "image") return block.caption;
  if (block.type === "video") return block.title;
  if (block.type === "music") return block.title;
  if (block.type === "qr") return block.label;
  if (block.type === "social") return block.label;
  if (block.type === "contact") return block.title;
  if (block.type === "email") return block.title;
  if (block.type === "file") return block.title;
  if (block.type === "product") return block.name;
  if (block.type === "countdown") return block.title;
  if (block.type === "spacer") return `${block.height}px spacer`;

  return "Divider";
}

function getBlockIcon(type: BlockType) {
  if (type === "link") return Link2;
  if (type === "text") return Type;
  if (type === "image") return ImageIcon;
  if (type === "video") return Video;
  if (type === "music") return Music2;
  if (type === "qr") return QrCode;
  if (type === "social") return Share2;
  if (type === "contact") return ContactRound;
  if (type === "email") return Mail;
  if (type === "file") return Download;
  if (type === "product") return Package;
  if (type === "countdown") return CalendarClock;
  if (type === "spacer") return Space;

  return Layers3;
}

function SortableLayer({
  block,
  selected,
  onSelect,
  onHide,
  onDuplicate,
  onDelete,
}: {
  block: Block;
  selected: boolean;
  onSelect: () => void;
  onHide: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: block.id,
  });

  const Icon = getBlockIcon(block.type);

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.68 : 1,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onSelect}
      className={`cursor-pointer rounded-[20px] border p-3 transition ${
        selected
          ? "border-[#6657FF] bg-[#F0ECFF]"
          : "border-black/10 bg-white hover:border-black/20"
      } ${isDragging ? "shadow-2xl" : ""}`}
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          {...attributes}
          {...listeners}
          onClick={(event) => event.stopPropagation()}
          className="flex h-9 w-7 shrink-0 cursor-grab items-center justify-center rounded-lg text-black/25 transition hover:bg-black/5 hover:text-black active:cursor-grabbing"
        >
          <GripVertical size={17} />
        </button>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] bg-[#EEE9DF]">
          <Icon size={16} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="text-sm font-bold capitalize">
            {block.type}
          </div>

          <div className="truncate text-xs text-black/40">
            {getBlockTitle(block)}
          </div>
        </div>

        {block.hidden && (
          <EyeOff size={15} className="text-black/30" />
        )}
      </div>

      {selected && (
        <div
          className="mt-3 flex gap-2 border-t border-black/10 pt-3"
          onClick={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            onClick={onHide}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white"
          >
            {block.hidden ? <Eye size={15} /> : <EyeOff size={15} />}
          </button>

          <button
            type="button"
            onClick={onDuplicate}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white"
          >
            <CopyPlus size={15} />
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="ml-auto flex h-9 w-9 items-center justify-center rounded-full bg-[#FFE7E3] text-[#C13D32]"
          >
            <Trash2 size={15} />
          </button>
        </div>
      )}
    </div>
  );
}

export default function CreateLinkHubPage() {
  const [activeTab, setActiveTab] = useState<
    "add" | "layers" | "design" | "settings" | "stats"
  >("add");

  const [previewMode, setPreviewMode] =
    useState<"mobile" | "desktop">("mobile");

  const [selectedBlockId, setSelectedBlockId] =
    useState<number | null>(null);

  const [publishStatus, setPublishStatus] =
    useState<
      "idle" | "publishing" | "published" | "error"
    >("idle");

  const [publishMessage, setPublishMessage] =
    useState("");

  const [isPreparingBackground, setIsPreparingBackground] =
    useState(false);

  const [backgroundUploadError, setBackgroundUploadError] =
    useState("");


  const [statsRange, setStatsRange] =
    useState<7 | 30 | 90>(30);

  const [stats, setStats] =
    useState<LinkHubStatsResponse | null>(null);

  const [statsLoading, setStatsLoading] =
    useState(false);

  const [statsError, setStatsError] =
    useState("");

  const {
    state: editor,
    setState: setEditor,
    undo,
    redo,
    reset,
    canUndo,
    canRedo,
    saveNow,
    hasLoaded,
    saveStatus,
  } = useLinkHubHistory<LinkHubEditorState>({
    initialState: defaultLinkHubEditorState,
    storageKey: LINK_HUB_DRAFT_STORAGE_KEY,
    maxHistory: 60,
    autosaveDelay: 700,
  });

  const { profile, socials, design, blocks } = editor;

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

  const backgroundImageInputRef =
    useRef<HTMLInputElement | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    })
  );

  useEffect(() => {
    if (
      activeTab !== "stats" ||
      !username.trim()
    ) {
      return;
    }

    let cancelled = false;

    const loadStats = async () => {
      setStatsLoading(true);
      setStatsError("");

      try {
        const response = await fetch(
          `/api/link-hub/stats/${encodeURIComponent(
            username
          )}?days=${statsRange}`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const result =
          (await response.json()) as LinkHubStatsResponse;

        if (cancelled) {
          return;
        }

        if (
          !response.ok ||
          !result.ok
        ) {
          throw new Error(
            result.error ||
              "Could not load analytics."
          );
        }

        setStats(result);
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error(
          "Could not load Link Hub stats:",
          error
        );

        setStats(null);
        setStatsError(
          error instanceof Error
            ? error.message
            : "Could not load analytics."
        );
      } finally {
        if (!cancelled) {
          setStatsLoading(false);
        }
      }
    };

    loadStats();

    return () => {
      cancelled = true;
    };
  }, [
    activeTab,
    username,
    statsRange,
  ]);

  const selectedBlock = useMemo(
    () =>
      blocks.find(
        (block) =>
          block.id ===
          selectedBlockId
      ) ?? null,
    [blocks, selectedBlockId]
  );

  const publicUrl = `bodolvo.online/u/${
    username || "username"
  }`;

  const patchProfile = (
    updates: Partial<
      LinkHubEditorState["profile"]
    >
  ) => {
    setEditor((current) => ({
      ...current,

      profile: {
        ...current.profile,
        ...updates,
      },
    }));
  };

  const patchDesign = (
    updates: Partial<
      LinkHubEditorState["design"]
    >
  ) => {
    setEditor((current) => ({
      ...current,

      design: {
        ...current.design,
        ...updates,
      },
    }));
  };

  const setSocials = (
    nextSocials: SocialLink[]
  ) => {
    setEditor((current) => ({
      ...current,
      socials: nextSocials,
    }));
  };

  const setBlocks = (
    updater:
      | Block[]
      | ((
          current: Block[]
        ) => Block[])
  ) => {
    setEditor((current) => ({
      ...current,

      blocks:
        typeof updater ===
        "function"
          ? updater(
              current.blocks
            )
          : updater,
    }));
  };

  const addBlock = (
    type: BlockType
  ) => {
    const id = Date.now();

    let newBlock: Block;

    if (type === "text") {
      newBlock = {
        id,
        type: "text",
        text: "Add your text here.",
        fontSize: 18,
        fontWeight: 600,
        align: "left",
        hidden: false,
        width: "full",
        opacity: 100,
        shadow: "none",
      };
    } else if (type === "image") {
      newBlock = {
        id,
        type: "image",
        imageUrl: "",
        caption: "Featured image",
        height: 180,
        radius: 22,
        fit: "cover",
        position: "center",
        showCaption: true,
        hidden: false,
        width: "full",
        opacity: 100,
        shadow: "soft",
      };
    } else if (type === "video") {
      newBlock = {
        id,
        type: "video",
        title: "Featured video",
        url: "#",
        radius: 22,
        hidden: false,
        width: "full",
        opacity: 100,
        shadow: "soft",
      };
    } else if (type === "music") {
      newBlock = {
        id,
        type: "music",
        title: "New release",
        artist:
          displayName ||
          "Artist",
        radius: 22,
        hidden: false,
        width: "full",
        opacity: 100,
        shadow: "soft",
      };
    } else if (type === "qr") {
      newBlock = {
        id,
        type: "qr",
        label: "Scan me",
        destination: "",
        radius: 22,
        hidden: false,
        width: "full",
        opacity: 100,
        shadow: "soft",
      };
    } else if (type === "social") {
      newBlock = {
        id,
        type: "social",
        platform: "instagram",
        label: "Follow me",
        url: "",
        style: "button",
        radius: 22,
        hidden: false,
        width: "full",
        opacity: 100,
        shadow: "soft",
      };
    } else if (type === "contact") {
      newBlock = {
        id,
        type: "contact",
        title:
          "Let's connect",
        description:
          "Reach out for questions, collaborations, or business.",
        email: "",
        phone: "",
        website: "",
        showEmail: true,
        showPhone: true,
        showWebsite: true,
        radius: 24,
        hidden: false,
        width: "full",
        opacity: 100,
        shadow: "soft",
      };
    } else if (type === "email") {
      newBlock = {
        id,
        type: "email",
        title:
          "Stay in the loop",
        description:
          "Get updates, new releases, and announcements.",
        placeholder:
          "Enter your email",
        buttonLabel: "Join",
        successMessage:
          "You're in!",
        radius: 24,
        hidden: false,
        width: "full",
        opacity: 100,
        shadow: "soft",
      };
    } else if (type === "file") {
      newBlock = {
        id,
        type: "file",
        title: "Download",
        description:
          "Grab this resource directly from my page.",
        fileName:
          "download.pdf",
        fileUrl: "",
        fileSize: "",
        buttonLabel:
          "Download",
        radius: 22,
        hidden: false,
        width: "full",
        opacity: 100,
        shadow: "soft",
      };
    } else if (type === "product") {
      newBlock = {
        id,
        type: "product",
        name:
          "Featured product",
        description:
          "Add a short description for this product.",
        price: "$25.00",
        imageUrl: "",
        purchaseUrl: "",
        buttonLabel: "Buy now",
        layout: "card",
        radius: 24,
        hidden: false,
        width: "full",
        opacity: 100,
        shadow: "medium",
      };
    } else if (
      type === "countdown"
    ) {
      newBlock = {
        id,
        type: "countdown",
        title:
          "Something is coming",
        targetDate: "",
        completedText:
          "We're live!",
        style: "cards",
        radius: 24,
        hidden: false,
        width: "full",
        opacity: 100,
        shadow: "soft",
      };
    } else if (
      type === "divider"
    ) {
      newBlock = {
        id,
        type: "divider",
        thickness: 1,
        spacing: 12,
        hidden: false,
        width: "full",
        opacity: 100,
        shadow: "none",
      };
    } else if (
      type === "spacer"
    ) {
      newBlock = {
        id,
        type: "spacer",
        height: 48,
        hidden: false,
        opacity: 100,
      };
    } else {
      newBlock = {
        id,
        type: "link",
        title: "New link",
        subtitle:
          "Add a description",
        url: "#",
        layout: "standard",
        hidden: false,
        width: "full",
        opacity: 100,
        shadow: "soft",
      };
    }

    setBlocks((current) => [
      ...current,
      newBlock,
    ]);

    setSelectedBlockId(id);
    setActiveTab("layers");
  };

  const deleteBlock = (
    id: number
  ) => {
    setBlocks((current) =>
      current.filter(
        (block) =>
          block.id !== id
      )
    );

    if (
      selectedBlockId === id
    ) {
      setSelectedBlockId(
        null
      );
    }
  };

  const duplicateBlock = (
    id: number
  ) => {
    const source =
      blocks.find(
        (block) =>
          block.id === id
      );

    if (!source) return;

    const duplicated = {
      ...source,
      id: Date.now(),
    } as Block;

    setBlocks((current) => {
      const index =
        current.findIndex(
          (block) =>
            block.id === id
        );

      const updated = [
        ...current,
      ];

      updated.splice(
        index + 1,
        0,
        duplicated
      );

      return updated;
    });

    setSelectedBlockId(
      duplicated.id
    );
  };

  const toggleHidden = (
    id: number
  ) => {
    setBlocks((current) =>
      current.map((block) =>
        block.id === id
          ? {
              ...block,
              hidden:
                !block.hidden,
            }
          : block
      )
    );
  };

  const updateSelectedBlock = (
    updates: Partial<Block>
  ) => {
    if (!selectedBlockId) {
      return;
    }

    setBlocks((current) =>
      current.map((block) =>
        block.id ===
        selectedBlockId
          ? ({
              ...block,
              ...updates,
            } as Block)
          : block
      )
    );
  };

  const handleDragEnd = (
    event: DragEndEvent
  ) => {
    const { active, over } =
      event;

    if (
      !over ||
      active.id === over.id
    ) {
      return;
    }

    setBlocks((current) => {
      const oldIndex =
        current.findIndex(
          (block) =>
            block.id ===
            Number(
              active.id
            )
        );

      const newIndex =
        current.findIndex(
          (block) =>
            block.id ===
            Number(over.id)
        );

      if (
        oldIndex < 0 ||
        newIndex < 0
      ) {
        return current;
      }

      return arrayMove(
        current,
        oldIndex,
        newIndex
      );
    });
  };

  const applyPreset = (
    preset: (typeof presets)[number]
  ) => {
    patchDesign({
      backgroundMode: "solid",
      pageBackground:
        preset.bg,
      accentColor:
        preset.accent,
      textColor:
        preset.text,
      buttonColor:
        preset.button,
      buttonTextColor:
        preset.buttonText,
      overlayOpacity: 0,
    });
  };

  const applyGradientPreset = (
    colorOne: string,
    colorTwo: string
  ) => {
    patchDesign({
      gradientColorOne:
        colorOne,
      gradientColorTwo:
        colorTwo,
      backgroundMode:
        "gradient",
    });
  };

  const handleBackgroundImage = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0];

    event.target.value = "";

    if (!file) return;

    const normalizedUsername = username
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-_]/g, "")
      .replace(/^-+|-+$/g, "");

    if (!normalizedUsername) {
      setBackgroundUploadError(
        "Enter a Link Hub username before uploading a background image."
      );
      return;
    }

    setBackgroundUploadError("");
    setIsPreparingBackground(true);

    try {
      const formData =
        new FormData();

      formData.append(
        "username",
        normalizedUsername
      );

      formData.append(
        "file",
        file
      );

      const response = await fetch(
        "/api/link-hub/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      let result: {
        ok?: boolean;
        url?: string;
        error?: string;
      } = {};

      try {
        result = await response.json();
      } catch {
        result = {};
      }

      if (
        !response.ok ||
        !result.ok ||
        !result.url
      ) {
        throw new Error(
          result.error ||
            "Could not upload that background image."
        );
      }

      patchDesign({
        backgroundImage:
          result.url,
        backgroundMode:
          "image",
      });
    } catch (error) {
      console.error(
        "Link Hub background upload failed:",
        error
      );

      setBackgroundUploadError(
        error instanceof Error
          ? error.message
          : "Could not upload that background image."
      );
    } finally {
      setIsPreparingBackground(false);
    }
  };

  const removeBackgroundImage =
    () => {
      setBackgroundUploadError("");

      patchDesign({
        backgroundImage:
          null,
      });
    };

  const resetDesign = () => {
    setEditor((current) => ({
      ...current,
      design:
        defaultLinkHubEditorState.design,
    }));
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(
        `https://${publicUrl}`
      );
    } catch {}
  };

  const handlePublish = async () => {
    if (publishStatus === "publishing") {
      return;
    }

    setPublishStatus("publishing");
    setPublishMessage("");

    try {
      const response = await fetch(
        "/api/link-hub/publish",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            state: editor,
          }),
        }
      );

      const result = (await response.json()) as {
        ok?: boolean;
        username?: string;
        publishedAt?: string;
        error?: string;
      };

      if (!response.ok || !result.ok) {
        throw new Error(
          result.error ||
            "Could not publish this Link Hub."
        );
      }

      const publishedUsername =
        result.username ||
        editor.profile.username;

      if (
        publishedUsername &&
        publishedUsername !==
          editor.profile.username
      ) {
        patchProfile({
          username:
            publishedUsername,
        });
      } else {
        saveNow();
      }

      setPublishStatus("published");
      setPublishMessage(
        `Published to /u/${publishedUsername}`
      );

      window.setTimeout(() => {
        setPublishStatus("idle");
      }, 2500);
    } catch (error) {
      console.error(
        "Link Hub publish failed:",
        error
      );

      setPublishStatus("error");

      setPublishMessage(
        error instanceof Error
          ? error.message
          : "Could not publish this Link Hub."
      );
    }
  };

  if (!hasLoaded) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F4F0E8] text-[#131313]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-black/10 border-t-[#6657FF]" />

          <div className="mt-4 text-sm font-bold">
            Loading your Link
            Hub...
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#E8E2D8] text-[#131313]">
      <header className="sticky top-0 z-50 border-b border-black/10 bg-[#F8F4EC]/95 backdrop-blur-xl">
        <div className="flex min-h-[72px] items-center justify-between gap-3 px-5">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href="/apps/link-hub"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/10 bg-white transition hover:bg-black hover:text-white"
            >
              <ArrowLeft
                size={18}
              />
            </Link>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="truncate text-sm font-bold">
                  Bodolvo Link Hub
                </span>

                <span className="shrink-0 rounded-full bg-[#D7FF55] px-2 py-1 text-[9px] font-black uppercase tracking-[0.16em]">
                  Editor
                </span>
              </div>

              <div className="truncate text-xs text-black/40">
                {publicUrl}
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <div className="hidden items-center gap-1 rounded-full border border-black/10 bg-white p-1 md:flex">
              <button
                type="button"
                onClick={undo}
                disabled={
                  !canUndo
                }
                title="Undo"
                className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-25"
              >
                <Undo2 size={16} />
              </button>

              <button
                type="button"
                onClick={redo}
                disabled={
                  !canRedo
                }
                title="Redo"
                className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-25"
              >
                <Redo2 size={16} />
              </button>
            </div>

            <div className="hidden items-center rounded-full border border-black/10 bg-white p-1 sm:flex">
              <button
                type="button"
                onClick={() =>
                  setPreviewMode(
                    "mobile"
                  )
                }
                className={`flex h-9 w-9 items-center justify-center rounded-full transition ${
                  previewMode ===
                  "mobile"
                    ? "bg-black text-white"
                    : "text-black/45"
                }`}
              >
                <Smartphone
                  size={16}
                />
              </button>

              <button
                type="button"
                onClick={() =>
                  setPreviewMode(
                    "desktop"
                  )
                }
                className={`flex h-9 w-9 items-center justify-center rounded-full transition ${
                  previewMode ===
                  "desktop"
                    ? "bg-black text-white"
                    : "text-black/45"
                }`}
              >
                <Monitor
                  size={16}
                />
              </button>
            </div>

            <button
              type="button"
              onClick={saveNow}
              className="hidden items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold lg:flex"
            >
              <Save size={15} />

              {saveStatus ===
              "saving"
                ? "Saving..."
                : saveStatus ===
                  "unsaved"
                ? "Save"
                : "Saved"}
            </button>

            <button
              type="button"
              onClick={
                handlePublish
              }
              disabled={
                publishStatus ===
                "publishing"
              }
              className="inline-flex items-center gap-2 rounded-full bg-[#6657FF] px-5 py-2.5 text-sm font-bold text-white shadow-[0_12px_28px_rgba(102,87,255,.25)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {publishStatus ===
              "publishing"
                ? "Publishing..."
                : publishStatus ===
                    "published"
                  ? "Published"
                  : "Publish"}

              <Sparkles
                size={15}
              />
            </button>
          </div>
        </div>
      </header>

      {publishMessage && (
        <div className="fixed right-5 top-[84px] z-[70] max-w-sm">
          <div
            className={`rounded-[16px] border px-4 py-3 text-xs font-bold shadow-xl backdrop-blur-xl ${
              publishStatus ===
              "error"
                ? "border-red-500/20 bg-red-50/95 text-red-700"
                : "border-black/10 bg-white/95 text-black/65"
            }`}
          >
            {publishMessage}
          </div>
        </div>
      )}

      <div className="grid min-h-[calc(100vh-72px)] lg:grid-cols-[82px_440px_1fr]">
        <aside className="border-r border-black/10 bg-[#111111] text-white">
          <div className="flex h-full flex-row gap-2 overflow-x-auto p-2 lg:flex-col lg:overflow-visible">
            {[
              {
                id: "add",
                label: "Add",
                icon: Plus,
              },
              {
                id: "layers",
                label: "Layers",
                icon: Layers3,
              },
              {
                id: "design",
                label: "Design",
                icon: Palette,
              },
              {
                id: "settings",
                label: "Settings",
                icon: Settings,
              },
              {
                id: "stats",
                label: "Stats",
                icon: BarChart3,
              },
            ].map(
              ({
                id,
                label,
                icon: Icon,
              }) => (
                <button
                  type="button"
                  key={id}
                  onClick={() =>
                    setActiveTab(
                      id as
                        | "add"
                        | "layers"
                        | "design"
                        | "settings"
                        | "stats"
                    )
                  }
                  className={`flex min-w-[66px] flex-col items-center gap-2 rounded-[18px] px-2 py-4 text-[11px] font-semibold transition lg:min-w-0 ${
                    activeTab ===
                    id
                      ? "bg-[#D7FF55] text-black"
                      : "text-white/45 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon
                    size={19}
                  />

                  {label}
                </button>
              )
            )}

            <div className="hidden flex-1 lg:block" />
          </div>
        </aside>

        <section className="border-r border-black/10 bg-[#F7F3EB]">
          <div className="h-[calc(100vh-72px)] overflow-y-auto p-5">
            {activeTab ===
              "add" && (
              <div>
                <div className="mb-6">
                  <div className="text-[11px] font-black uppercase tracking-[0.2em] text-[#6657FF]">
                    Add content
                  </div>

                  <h1 className="mt-2 text-3xl font-bold tracking-[-0.04em]">
                    Build your
                    page.
                  </h1>

                  <p className="mt-2 text-sm leading-6 text-black/45">
                    Links are only
                    the beginning.
                  </p>
                </div>

                <div className="space-y-3">
                  {blockOptions.map(
                    ({
                      type,
                      label,
                      description,
                      icon: Icon,
                    }) => (
                      <button
                        type="button"
                        key={type}
                        onClick={() =>
                          addBlock(
                            type
                          )
                        }
                        className="group flex w-full items-center gap-4 rounded-[22px] border border-black/10 bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-[#6657FF]/30 hover:shadow-[0_15px_35px_rgba(0,0,0,.06)]"
                      >
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] bg-[#111111] text-white transition group-hover:bg-[#6657FF]">
                          <Icon
                            size={
                              19
                            }
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="font-bold">
                            {label}
                          </div>

                          <div className="mt-1 text-xs leading-5 text-black/45">
                            {
                              description
                            }
                          </div>
                        </div>

                        <Plus
                          size={18}
                          className="text-black/30"
                        />
                      </button>
                    )
                  )}
                </div>
              </div>
            )}

            {activeTab ===
              "layers" && (
              <div>
                <div className="mb-6">
                  <div className="text-[11px] font-black uppercase tracking-[0.2em] text-[#6657FF]">
                    Layers
                  </div>

                  <h1 className="mt-2 text-3xl font-bold tracking-[-0.04em]">
                    Your page.
                  </h1>

                  <p className="mt-2 text-sm text-black/45">
                    Drag blocks to
                    reorder. Select
                    one to customize
                    it.
                  </p>
                </div>

                <DndContext
                  sensors={
                    sensors
                  }
                  collisionDetection={
                    closestCenter
                  }
                  onDragEnd={
                    handleDragEnd
                  }
                >
                  <SortableContext
                    items={blocks.map(
                      (block) =>
                        block.id
                    )}
                    strategy={
                      verticalListSortingStrategy
                    }
                  >
                    <div className="space-y-3">
                      {blocks.map(
                        (block) => (
                          <SortableLayer
                            key={
                              block.id
                            }
                            block={
                              block
                            }
                            selected={
                              selectedBlockId ===
                              block.id
                            }
                            onSelect={() =>
                              setSelectedBlockId(
                                block.id
                              )
                            }
                            onHide={() =>
                              toggleHidden(
                                block.id
                              )
                            }
                            onDuplicate={() =>
                              duplicateBlock(
                                block.id
                              )
                            }
                            onDelete={() =>
                              deleteBlock(
                                block.id
                              )
                            }
                          />
                        )
                      )}
                    </div>
                  </SortableContext>
                </DndContext>

                {selectedBlock ? (
                  <div className="mt-6 border-t border-black/10 pt-6">
                    <BlockCustomizer
                      block={
                        selectedBlock
                      }
                      onChange={
                        updateSelectedBlock
                      }
                      globalButtonColor={
                        buttonColor
                      }
                      globalButtonTextColor={
                        buttonTextColor
                      }
                      globalButtonRadius={
                        buttonRadius
                      }
                      globalAccentColor={
                        accentColor
                      }
                      globalTextColor={
                        textColor
                      }
                      username={
                        username
                      }
                    />
                  </div>
                ) : (
                  <div className="mt-6 rounded-[22px] border border-dashed border-black/15 bg-white/50 p-8 text-center">
                    <div className="text-sm font-bold">
                      Select a block
                    </div>

                    <p className="mt-2 text-xs leading-5 text-black/40">
                      Click a layer
                      or a block in
                      the live
                      preview.
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab ===
              "design" && (
              <div>
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div>
                    <div className="text-[11px] font-black uppercase tracking-[0.2em] text-[#6657FF]">
                      Design
                    </div>

                    <h1 className="mt-2 text-3xl font-bold tracking-[-0.04em]">
                      Make it yours.
                    </h1>
                  </div>

                  <button
                    type="button"
                    onClick={
                      resetDesign
                    }
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white"
                  >
                    <RotateCcw
                      size={15}
                    />
                  </button>
                </div>

                <div className="space-y-5">
                  <div className="rounded-[22px] border border-black/10 bg-white p-5">
                    <div className="text-sm font-bold">
                      Starting styles
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      {presets.map(
                        (preset) => (
                          <button
                            type="button"
                            key={
                              preset.name
                            }
                            onClick={() =>
                              applyPreset(
                                preset
                              )
                            }
                            className="rounded-[18px] border border-black/10 p-3 text-left transition hover:border-black/30"
                          >
                            <div
                              className="h-20 rounded-[12px] p-2"
                              style={{
                                backgroundColor:
                                  preset.bg,
                              }}
                            >
                              <div
                                className="h-5 w-10 rounded-full"
                                style={{
                                  backgroundColor:
                                    preset.accent,
                                }}
                              />

                              <div
                                className="mt-3 h-5 rounded-full"
                                style={{
                                  backgroundColor:
                                    preset.button,
                                }}
                              />
                            </div>

                            <div className="mt-2 text-xs font-bold">
                              {
                                preset.name
                              }
                            </div>
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  <div className="rounded-[22px] border border-black/10 bg-white p-5">
                    <div className="text-sm font-bold">
                      Background
                    </div>

                    <div className="mt-1 text-xs leading-5 text-black/40">
                      Color, gradient,
                      image, or motion.
                    </div>

                    <div className="mt-5 grid grid-cols-4 gap-2">
                      {[
                        {
                          mode: "solid",
                          label: "Color",
                          icon: Palette,
                        },
                        {
                          mode: "gradient",
                          label:
                            "Gradient",
                          icon: Sparkles,
                        },
                        {
                          mode: "image",
                          label: "Image",
                          icon: ImageIcon,
                        },
                        {
                          mode: "video",
                          label: "Video",
                          icon: Film,
                        },
                      ].map(
                        ({
                          mode,
                          label,
                          icon: Icon,
                        }) => (
                          <button
                            type="button"
                            key={mode}
                            onClick={() =>
                              patchDesign(
                                {
                                  backgroundMode:
                                    mode as BackgroundMode,
                                }
                              )
                            }
                            className={`flex flex-col items-center gap-2 rounded-[15px] px-2 py-3 text-[10px] font-bold transition ${
                              backgroundMode ===
                              mode
                                ? "bg-black text-white"
                                : "bg-[#F3EFE7] text-black/55"
                            }`}
                          >
                            <Icon
                              size={
                                16
                              }
                            />
                            {label}
                          </button>
                        )
                      )}
                    </div>

                    {backgroundMode ===
                      "solid" && (
                      <div className="mt-5 border-t border-black/5 pt-5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-black/45">
                            Background
                            color
                          </span>

                          <input
                            type="color"
                            value={
                              pageBackground
                            }
                            onChange={(
                              event
                            ) =>
                              patchDesign(
                                {
                                  pageBackground:
                                    event
                                      .target
                                      .value,
                                }
                              )
                            }
                            className="h-10 w-12 cursor-pointer"
                          />
                        </div>
                      </div>
                    )}

                    {backgroundMode ===
                      "gradient" && (
                      <div className="mt-5 space-y-5 border-t border-black/5 pt-5">
                        <div className="grid grid-cols-3 gap-2">
                          {gradientPresets.map(
                            ([
                              one,
                              two,
                            ]) => (
                              <button
                                type="button"
                                key={`${one}-${two}`}
                                onClick={() =>
                                  applyGradientPreset(
                                    one,
                                    two
                                  )
                                }
                                className="h-14 rounded-[14px] border border-black/10"
                                style={{
                                  backgroundImage: `linear-gradient(to bottom right, ${one}, ${two})`,
                                }}
                              />
                            )
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="color"
                            value={
                              gradientColorOne
                            }
                            onChange={(
                              event
                            ) =>
                              patchDesign(
                                {
                                  gradientColorOne:
                                    event
                                      .target
                                      .value,
                                }
                              )
                            }
                            className="h-11 w-full"
                          />

                          <input
                            type="color"
                            value={
                              gradientColorTwo
                            }
                            onChange={(
                              event
                            ) =>
                              patchDesign(
                                {
                                  gradientColorTwo:
                                    event
                                      .target
                                      .value,
                                }
                              )
                            }
                            className="h-11 w-full"
                          />
                        </div>

                        <select
                          value={
                            gradientDirection
                          }
                          onChange={(
                            event
                          ) =>
                            patchDesign(
                              {
                                gradientDirection:
                                  event
                                    .target
                                    .value as GradientDirection,
                              }
                            )
                          }
                          className="w-full rounded-[14px] border border-black/10 bg-[#F7F3EB] px-3 py-3 text-sm outline-none"
                        >
                          <option value="to bottom">
                            Top to
                            bottom
                          </option>

                          <option value="to bottom right">
                            Diagonal
                            down
                          </option>

                          <option value="to right">
                            Left to
                            right
                          </option>

                          <option value="to top right">
                            Diagonal
                            up
                          </option>

                          <option value="to top">
                            Bottom to
                            top
                          </option>
                        </select>
                      </div>
                    )}

                    {backgroundMode ===
                      "image" && (
                      <div className="mt-5 border-t border-black/5 pt-5">
                        <input
                          ref={
                            backgroundImageInputRef
                          }
                          type="file"
                          accept="image/*"
                          onChange={
                            handleBackgroundImage
                          }
                          className="hidden"
                        />

                        {!backgroundImage ? (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                backgroundImageInputRef.current?.click()
                              }
                              disabled={isPreparingBackground}
                              className="flex min-h-[150px] w-full flex-col items-center justify-center rounded-[20px] border border-dashed border-black/15 bg-[#F7F3EB] p-5 transition hover:border-[#6657FF] disabled:cursor-wait disabled:opacity-60"
                            >
                              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-white">
                                {isPreparingBackground ? (
                                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                ) : (
                                  <Upload
                                    size={
                                      18
                                    }
                                  />
                                )}
                              </div>

                              <div className="mt-3 text-sm font-bold">
                                {isPreparingBackground
                                  ? "Preparing background..."
                                  : "Upload background"}
                              </div>

                              <div className="mt-1 text-[10px] text-black/35">
                                Optimized before autosave.
                              </div>
                            </button>

                            {backgroundUploadError && (
                              <div className="mt-2 text-[11px] font-semibold text-red-600">
                                {backgroundUploadError}
                              </div>
                            )}
                          </>
                        ) : (
                          <div>
                            <div className="relative overflow-hidden rounded-[18px]">
                              <img
                                src={
                                  backgroundImage
                                }
                                alt="Background preview"
                                className="h-40 w-full object-cover"
                              />

                              <button
                                type="button"
                                onClick={() =>
                                  backgroundImageInputRef.current?.click()
                                }
                                disabled={isPreparingBackground}
                                className="absolute bottom-3 left-3 rounded-full bg-black px-4 py-2 text-xs font-bold text-white disabled:cursor-wait disabled:opacity-70"
                              >
                                {isPreparingBackground
                                  ? "Preparing..."
                                  : "Replace"}
                              </button>

                              <button
                                type="button"
                                onClick={
                                  removeBackgroundImage
                                }
                                className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-black"
                              >
                                <Trash2
                                  size={
                                    14
                                  }
                                />
                              </button>
                            </div>

                            <div className="mt-4 grid grid-cols-5 gap-2">
                              {[
                                "top",
                                "left",
                                "center",
                                "right",
                                "bottom",
                              ].map(
                                (
                                  position
                                ) => (
                                  <button
                                    type="button"
                                    key={
                                      position
                                    }
                                    onClick={() =>
                                      patchDesign(
                                        {
                                          backgroundPosition:
                                            position as BackgroundPosition,
                                        }
                                      )
                                    }
                                    className={`rounded-[11px] py-2 text-[9px] font-bold capitalize ${
                                      backgroundPosition ===
                                      position
                                        ? "bg-black text-white"
                                        : "bg-[#F3EFE7]"
                                    }`}
                                  >
                                    {
                                      position
                                    }
                                  </button>
                                )
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {backgroundMode ===
                      "video" && (
                      <div className="mt-5 border-t border-black/5 pt-5">
                        <input
                          value={
                            videoBackgroundUrl
                          }
                          onChange={(
                            event
                          ) =>
                            patchDesign(
                              {
                                videoBackgroundUrl:
                                  event
                                    .target
                                    .value,
                              }
                            )
                          }
                          placeholder="https://example.com/background.mp4"
                          className="w-full rounded-[14px] border border-black/10 bg-[#F7F3EB] px-3 py-3 text-sm outline-none"
                        />
                      </div>
                    )}
                  </div>

                  {(backgroundMode ===
                    "image" ||
                    backgroundMode ===
                      "video") && (
                    <div className="rounded-[22px] border border-black/10 bg-white p-5">
                      <div className="text-sm font-bold">
                        Background
                        effects
                      </div>

                      <label className="mt-5 block">
                        <div className="flex justify-between text-xs">
                          <span className="text-black/45">
                            Blur
                          </span>

                          <span className="font-bold">
                            {
                              backgroundBlur
                            }
                            px
                          </span>
                        </div>

                        <input
                          type="range"
                          min="0"
                          max="20"
                          value={
                            backgroundBlur
                          }
                          onChange={(
                            event
                          ) =>
                            patchDesign(
                              {
                                backgroundBlur:
                                  Number(
                                    event
                                      .target
                                      .value
                                  ),
                              }
                            )
                          }
                          className="mt-3 w-full"
                        />
                      </label>

                      <label className="mt-5 block">
                        <div className="flex justify-between text-xs">
                          <span className="text-black/45">
                            Overlay
                          </span>

                          <span className="font-bold">
                            {
                              overlayOpacity
                            }
                            %
                          </span>
                        </div>

                        <input
                          type="range"
                          min="0"
                          max="90"
                          value={
                            overlayOpacity
                          }
                          onChange={(
                            event
                          ) =>
                            patchDesign(
                              {
                                overlayOpacity:
                                  Number(
                                    event
                                      .target
                                      .value
                                  ),
                              }
                            )
                          }
                          className="mt-3 w-full"
                        />
                      </label>

                      <div className="mt-5 flex items-center justify-between">
                        <span className="text-xs text-black/45">
                          Overlay
                          color
                        </span>

                        <input
                          type="color"
                          value={
                            overlayColor
                          }
                          onChange={(
                            event
                          ) =>
                            patchDesign(
                              {
                                overlayColor:
                                  event
                                    .target
                                    .value,
                              }
                            )
                          }
                          className="h-10 w-12"
                        />
                      </div>
                    </div>
                  )}

                  <div className="rounded-[22px] border border-black/10 bg-white p-5">
                    <div className="text-sm font-bold">
                      Page colors
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-4">
                      {[
                        {
                          label:
                            "Accent",
                          value:
                            accentColor,
                          key: "accentColor",
                        },
                        {
                          label:
                            "Text",
                          value:
                            textColor,
                          key: "textColor",
                        },
                        {
                          label:
                            "Buttons",
                          value:
                            buttonColor,
                          key: "buttonColor",
                        },
                        {
                          label:
                            "Button text",
                          value:
                            buttonTextColor,
                          key: "buttonTextColor",
                        },
                      ].map(
                        ({
                          label,
                          value,
                          key,
                        }) => (
                          <label
                            key={
                              label
                            }
                          >
                            <div className="mb-2 text-[11px] font-semibold text-black/40">
                              {label}
                            </div>

                            <input
                              type="color"
                              value={
                                value
                              }
                              onChange={(
                                event
                              ) =>
                                patchDesign(
                                  {
                                    [key]:
                                      event
                                        .target
                                        .value,
                                  } as Partial<
                                    LinkHubEditorState["design"]
                                  >
                                )
                              }
                              className="h-11 w-full"
                            />
                          </label>
                        )
                      )}
                    </div>
                  </div>

                  <div className="rounded-[22px] border border-black/10 bg-white p-5">
                    <div className="text-sm font-bold">
                      Buttons
                    </div>

                    <label className="mt-5 block">
                      <div className="flex justify-between text-xs">
                        <span className="text-black/45">
                          Radius
                        </span>

                        <span className="font-bold">
                          {
                            buttonRadius
                          }
                          px
                        </span>
                      </div>

                      <input
                        type="range"
                        min="0"
                        max="50"
                        value={
                          buttonRadius
                        }
                        onChange={(
                          event
                        ) =>
                          patchDesign(
                            {
                              buttonRadius:
                                Number(
                                  event
                                    .target
                                    .value
                                ),
                            }
                          )
                        }
                        className="mt-3 w-full"
                      />
                    </label>

                    <button
                      type="button"
                      onClick={() =>
                        patchDesign(
                          {
                            buttonShadow:
                              !buttonShadow,
                          }
                        )
                      }
                      className="mt-5 flex w-full items-center justify-between rounded-[15px] bg-[#F3EFE7] px-4 py-3"
                    >
                      <span className="text-sm font-semibold">
                        Shadow
                      </span>

                      <span className="text-xs font-bold">
                        {buttonShadow
                          ? "On"
                          : "Off"}
                      </span>
                    </button>
                  </div>

                  <div className="rounded-[22px] border border-black/10 bg-white p-5">
                    <div className="text-sm font-bold">
                      Layout
                    </div>

                    <label className="mt-5 block">
                      <div className="flex justify-between text-xs">
                        <span className="text-black/45">
                          Content width
                        </span>

                        <span className="font-bold">
                          {
                            contentWidth
                          }
                          px
                        </span>
                      </div>

                      <input
                        type="range"
                        min="300"
                        max="700"
                        value={
                          contentWidth
                        }
                        onChange={(
                          event
                        ) =>
                          patchDesign(
                            {
                              contentWidth:
                                Number(
                                  event
                                    .target
                                    .value
                                ),
                            }
                          )
                        }
                        className="mt-3 w-full"
                      />
                    </label>

                    <label className="mt-5 block">
                      <div className="flex justify-between text-xs">
                        <span className="text-black/45">
                          Page padding
                        </span>

                        <span className="font-bold">
                          {
                            pagePadding
                          }
                          px
                        </span>
                      </div>

                      <input
                        type="range"
                        min="8"
                        max="60"
                        value={
                          pagePadding
                        }
                        onChange={(
                          event
                        ) =>
                          patchDesign(
                            {
                              pagePadding:
                                Number(
                                  event
                                    .target
                                    .value
                                ),
                            }
                          )
                        }
                        className="mt-3 w-full"
                      />
                    </label>

                    <label className="mt-5 block">
                      <div className="flex justify-between text-xs">
                        <span className="text-black/45">
                          Block spacing
                        </span>

                        <span className="font-bold">
                          {
                            blockSpacing
                          }
                          px
                        </span>
                      </div>

                      <input
                        type="range"
                        min="4"
                        max="40"
                        value={
                          blockSpacing
                        }
                        onChange={(
                          event
                        ) =>
                          patchDesign(
                            {
                              blockSpacing:
                                Number(
                                  event
                                    .target
                                    .value
                                ),
                            }
                          )
                        }
                        className="mt-3 w-full"
                      />
                    </label>

                    <div className="mt-5 grid grid-cols-3 gap-2">
                      {[
                        {
                          value: "left",
                          icon: AlignLeft,
                        },
                        {
                          value:
                            "center",
                          icon:
                            AlignCenter,
                        },
                        {
                          value: "right",
                          icon:
                            AlignRight,
                        },
                      ].map(
                        ({
                          value,
                          icon: Icon,
                        }) => (
                          <button
                            type="button"
                            key={
                              value
                            }
                            onClick={() =>
                              patchDesign(
                                {
                                  headingAlign:
                                    value as TextAlign,
                                }
                              )
                            }
                            className={`flex items-center justify-center rounded-[13px] py-3 ${
                              headingAlign ===
                              value
                                ? "bg-black text-white"
                                : "bg-[#F3EFE7]"
                            }`}
                          >
                            <Icon
                              size={
                                16
                              }
                            />
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab ===
              "stats" && (
              <div>
                <div className="mb-6">
                  <div className="text-[11px] font-black uppercase tracking-[0.2em] text-[#6657FF]">
                    Analytics
                  </div>

                  <h1 className="mt-2 text-3xl font-bold tracking-[-0.04em]">
                    See what&apos;s working.
                  </h1>

                  <p className="mt-2 text-sm leading-6 text-black/45">
                    Views and interactions from your published Link Hub.
                  </p>
                </div>

                <div className="mb-5 grid grid-cols-3 gap-2">
                  {([7, 30, 90] as const).map(
                    (days) => (
                      <button
                        type="button"
                        key={days}
                        onClick={() =>
                          setStatsRange(
                            days
                          )
                        }
                        className={`rounded-[14px] px-3 py-3 text-xs font-bold transition ${
                          statsRange ===
                          days
                            ? "bg-black text-white"
                            : "border border-black/10 bg-white text-black/55"
                        }`}
                      >
                        {days} days
                      </button>
                    )
                  )}
                </div>

                {statsLoading ? (
                  <div className="rounded-[22px] border border-black/10 bg-white p-8 text-center">
                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-black/10 border-t-[#6657FF]" />

                    <div className="mt-4 text-sm font-bold">
                      Loading analytics...
                    </div>
                  </div>
                ) : statsError ? (
                  <div className="rounded-[22px] border border-red-500/20 bg-red-50 p-5 text-sm font-bold text-red-700">
                    {statsError}
                  </div>
                ) : stats ? (
                  <div className="space-y-5">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="rounded-[20px] border border-black/10 bg-white p-4">
                        <div className="text-[10px] font-black uppercase tracking-[0.15em] text-black/35">
                          Views
                        </div>

                        <div className="mt-2 text-3xl font-black tracking-[-0.05em]">
                          {
                            stats
                              .totals
                              .views
                          }
                        </div>
                      </div>

                      <div className="rounded-[20px] border border-black/10 bg-white p-4">
                        <div className="text-[10px] font-black uppercase tracking-[0.15em] text-black/35">
                          Clicks
                        </div>

                        <div className="mt-2 text-3xl font-black tracking-[-0.05em]">
                          {
                            stats
                              .totals
                              .clicks
                          }
                        </div>
                      </div>

                      <div className="rounded-[20px] border border-black/10 bg-white p-4">
                        <div className="text-[10px] font-black uppercase tracking-[0.15em] text-black/35">
                          CTR
                        </div>

                        <div className="mt-2 text-3xl font-black tracking-[-0.05em]">
                          {
                            stats
                              .totals
                              .clickThroughRate
                          }
                          %
                        </div>
                      </div>
                    </div>

                    <div className="rounded-[22px] border border-black/10 bg-white p-5">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="text-sm font-bold">
                            Activity
                          </div>

                          <div className="mt-1 text-[10px] text-black/35">
                            Most recent 14 days
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-[10px] font-bold text-black/40">
                          <span>
                            Views
                          </span>
                          <span>
                            Clicks
                          </span>
                        </div>
                      </div>

                      <div className="mt-5 space-y-3">
                        {stats.daily
                          .slice(-14)
                          .map(
                            (
                              day
                            ) => {
                              const maxValue =
                                Math.max(
                                  1,
                                  ...stats.daily.map(
                                    (
                                      item
                                    ) =>
                                      Math.max(
                                        item.views,
                                        item.clicks
                                      )
                                  )
                                );

                              const viewWidth =
                                Math.max(
                                  4,
                                  (day.views /
                                    maxValue) *
                                    100
                                );

                              const clickWidth =
                                Math.max(
                                  4,
                                  (day.clicks /
                                    maxValue) *
                                    100
                                );

                              return (
                                <div
                                  key={
                                    day.date
                                  }
                                >
                                  <div className="mb-1 flex items-center justify-between text-[10px] text-black/40">
                                    <span>
                                      {new Date(
                                        `${day.date}T00:00:00`
                                      ).toLocaleDateString(
                                        undefined,
                                        {
                                          month:
                                            "short",
                                          day: "numeric",
                                        }
                                      )}
                                    </span>

                                    <span className="font-bold text-black/60">
                                      {
                                        day.views
                                      }
                                      {" / "}
                                      {
                                        day.clicks
                                      }
                                    </span>
                                  </div>

                                  <div className="space-y-1">
                                    <div className="h-2 overflow-hidden rounded-full bg-black/5">
                                      <div
                                        className="h-full rounded-full bg-[#6657FF]"
                                        style={{
                                          width: `${viewWidth}%`,
                                        }}
                                      />
                                    </div>

                                    <div className="h-2 overflow-hidden rounded-full bg-black/5">
                                      <div
                                        className="h-full rounded-full bg-[#D7FF55]"
                                        style={{
                                          width: `${clickWidth}%`,
                                        }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                          )}
                      </div>
                    </div>

                    <div className="rounded-[22px] border border-black/10 bg-white p-5">
                      <div className="text-sm font-bold">
                        Top blocks
                      </div>

                      <div className="mt-4 space-y-3">
                        {stats.topBlocks.length >
                        0 ? (
                          stats.topBlocks.map(
                            (
                              item,
                              index
                            ) => {
                              const editorBlock =
                                blocks.find(
                                  (
                                    block
                                  ) =>
                                    block.id ===
                                    item.blockId
                                );

                              const label =
                                editorBlock
                                  ? getBlockTitle(
                                      editorBlock
                                    )
                                  : item.blockType;

                              return (
                                <div
                                  key={`${item.blockId}-${item.blockType}-${index}`}
                                  className="flex items-center gap-3 rounded-[16px] bg-[#F7F3EB] p-3"
                                >
                                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black text-xs font-black text-white">
                                    {index +
                                      1}
                                  </div>

                                  <div className="min-w-0 flex-1">
                                    <div className="truncate text-xs font-bold">
                                      {
                                        label
                                      }
                                    </div>

                                    <div className="mt-1 truncate text-[10px] capitalize text-black/35">
                                      {
                                        item.blockType
                                      }
                                    </div>
                                  </div>

                                  <div className="text-sm font-black">
                                    {
                                      item.clicks
                                    }
                                  </div>
                                </div>
                              );
                            }
                          )
                        ) : (
                          <div className="rounded-[16px] border border-dashed border-black/10 p-6 text-center text-xs text-black/40">
                            No block clicks yet.
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="rounded-[22px] border border-black/10 bg-white p-5">
                      <div className="text-sm font-bold">
                        Traffic sources
                      </div>

                      <div className="mt-4 space-y-3">
                        {stats.topReferrers.length >
                        0 ? (
                          stats.topReferrers.map(
                            (
                              item,
                              index
                            ) => (
                              <div
                                key={`${item.referrer}-${index}`}
                                className="flex items-center justify-between gap-3 rounded-[16px] bg-[#F7F3EB] px-4 py-3"
                              >
                                <div className="min-w-0 truncate text-xs font-bold">
                                  {
                                    item.referrer
                                  }
                                </div>

                                <div className="shrink-0 text-xs font-black">
                                  {
                                    item.views
                                  }{" "}
                                  views
                                </div>
                              </div>
                            )
                          )
                        ) : (
                          <div className="rounded-[16px] border border-dashed border-black/10 p-6 text-center text-xs text-black/40">
                            No traffic data yet.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-[22px] border border-dashed border-black/15 bg-white/60 p-8 text-center">
                    <BarChart3
                      size={24}
                      className="mx-auto text-black/25"
                    />

                    <div className="mt-3 text-sm font-bold">
                      Publish your page to start collecting analytics.
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab ===
              "settings" && (
              <div>
                <div className="mb-6">
                  <div className="text-[11px] font-black uppercase tracking-[0.2em] text-[#6657FF]">
                    Settings
                  </div>

                  <h1 className="mt-2 text-3xl font-bold tracking-[-0.04em]">
                    Your identity.
                  </h1>
                </div>

                <ProfileCustomizer
                  displayName={
                    displayName
                  }
                  username={
                    username
                  }
                  bio={bio}
                  profileImage={
                    profileImage
                  }
                  profileSize={
                    profileSize
                  }
                  profileRadius={
                    profileRadius
                  }
                  socials={
                    socials
                  }
                  onDisplayNameChange={(
                    value
                  ) =>
                    patchProfile(
                      {
                        displayName:
                          value,
                      }
                    )
                  }
                  onUsernameChange={(
                    value
                  ) =>
                    patchProfile(
                      {
                        username:
                          value,
                      }
                    )
                  }
                  onBioChange={(
                    value
                  ) =>
                    patchProfile(
                      {
                        bio: value,
                      }
                    )
                  }
                  onProfileImageChange={(
                    value
                  ) =>
                    patchProfile(
                      {
                        profileImage:
                          value,
                      }
                    )
                  }
                  onProfileSizeChange={(
                    value
                  ) =>
                    patchDesign(
                      {
                        profileSize:
                          value,
                      }
                    )
                  }
                  onProfileRadiusChange={(
                    value
                  ) =>
                    patchDesign(
                      {
                        profileRadius:
                          value,
                      }
                    )
                  }
                  onSocialsChange={
                    setSocials
                  }
                />

                <div className="mt-5 rounded-[22px] border border-black/10 bg-white p-5">
                  <div className="text-sm font-bold">
                    Draft
                  </div>

                  <div className="mt-4 flex items-center justify-between rounded-[15px] bg-[#F3EFE7] p-3">
                    <div>
                      <div className="text-xs font-bold">
                        {saveStatus ===
                        "saving"
                          ? "Saving draft..."
                          : saveStatus ===
                            "unsaved"
                          ? "Unsaved changes"
                          : "Draft saved"}
                      </div>

                      <div className="mt-1 text-[10px] text-black/40">
                        Autosaves in
                        this browser.
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={
                        saveNow
                      }
                      className="rounded-full bg-black px-4 py-2 text-xs font-bold text-white"
                    >
                      Save now
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      reset(
                        defaultLinkHubEditorState
                      );

                      setSelectedBlockId(
                        null
                      );
                    }}
                    className="mt-3 w-full rounded-[14px] border border-black/10 px-4 py-3 text-xs font-bold"
                  >
                    Reset entire
                    page
                  </button>
                </div>

                <div className="mt-5 rounded-[22px] border border-black/10 bg-white p-5">
                  <div className="text-sm font-bold">
                    Public link
                  </div>

                  <div className="mt-4 flex items-center gap-2 rounded-[15px] bg-[#F3EFE7] p-3">
                    <div className="min-w-0 flex-1 truncate text-xs font-semibold">
                      {publicUrl}
                    </div>

                    <button
                      type="button"
                      onClick={
                        copyLink
                      }
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black text-white"
                    >
                      <Copy
                        size={15}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="relative overflow-hidden bg-[#DED8CE]">
          <div className="absolute inset-0">
            <div className="absolute left-[15%] top-[20%] h-44 w-44 rounded-full bg-[#D7FF55]/30 blur-[90px]" />

            <div className="absolute bottom-[5%] right-[10%] h-60 w-60 rounded-full bg-[#6657FF]/20 blur-[110px]" />
          </div>

          <div className="relative flex min-h-[calc(100vh-72px)] items-center justify-center overflow-auto p-8">
            <div
              className="w-full transition-all duration-300"
              style={{
                maxWidth:
                  previewMode ===
                  "mobile"
                    ? Math.min(
                        contentWidth,
                        430
                      )
                    : Math.max(
                        contentWidth +
                          260,
                        760
                      ),
              }}
            >
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.18em] text-black/35">
                    Live preview
                  </div>

                  <div className="mt-1 text-sm font-semibold">
                    Click anything
                    to edit it.
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      saveStatus ===
                      "unsaved"
                        ? "bg-amber-500"
                        : saveStatus ===
                          "saving"
                        ? "bg-blue-500"
                        : "bg-emerald-500"
                    }`}
                  />

                  <div className="rounded-full border border-black/10 bg-white/60 px-3 py-1.5 text-[11px] font-semibold backdrop-blur">
                    {previewMode ===
                    "mobile"
                      ? "Mobile"
                      : "Desktop"}
                  </div>
                </div>
              </div>

              <div
                className={`overflow-hidden border-[8px] border-[#111111] bg-[#111111] shadow-[0_45px_100px_rgba(0,0,0,.22)] ${
                  previewMode ===
                  "mobile"
                    ? "rounded-[48px]"
                    : "rounded-[30px]"
                }`}
              >
                <div
                  className={`min-h-[690px] ${
                    previewMode ===
                    "mobile"
                      ? "rounded-[38px]"
                      : "rounded-[20px]"
                  } overflow-hidden`}
                >
                  <LinkHubRenderer
                    profile={
                      profile
                    }
                    socials={
                      socials
                    }
                    design={
                      design
                    }
                    blocks={
                      blocks
                    }
                    previewMode={
                      previewMode
                    }
                    selectedBlockId={
                      selectedBlockId
                    }
                    editable
                    onSelectBlock={(
                      id
                    ) => {
                      setSelectedBlockId(
                        id
                      );

                      setActiveTab(
                        "layers"
                      );
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export type BlockType =
  | "link"
  | "text"
  | "image"
  | "video"
  | "music"
  | "qr"
  | "divider"
  | "social"
  | "contact"
  | "email"
  | "file"
  | "product"
  | "countdown"
  | "spacer";

export type TextAlign = "left" | "center" | "right";

export type BackgroundMode = "solid" | "gradient" | "image" | "video";

export type GradientDirection =
  | "to bottom"
  | "to bottom right"
  | "to right"
  | "to top right"
  | "to top";

export type BackgroundPosition =
  | "center"
  | "top"
  | "bottom"
  | "left"
  | "right";

export type LinkLayout =
  | "standard"
  | "thumbnail"
  | "featured"
  | "minimal";

export type ShadowStrength =
  | "none"
  | "soft"
  | "medium"
  | "strong";

export type BlockWidth =
  | "full"
  | "wide"
  | "medium"
  | "compact";

export type ImageFit = "cover" | "contain";

export type SocialButtonPlatform =
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

export type SocialButtonStyle =
  | "icon"
  | "button"
  | "card";

export type ContactAction =
  | "email"
  | "phone"
  | "sms"
  | "website";

export type ProductLayout =
  | "card"
  | "featured"
  | "compact";

export type CountdownStyle =
  | "cards"
  | "minimal"
  | "banner";

export type BaseBlock = {
  id: number;
  hidden: boolean;
  width?: BlockWidth;
  opacity?: number;
  borderWidth?: number;
  borderColor?: string;
  shadow?: ShadowStrength;

  /*
   * Shared optional destination fields.
   *
   * These intentionally live on BaseBlock so destination-tracking code can
   * safely inspect url / purchaseUrl / fileUrl across the discriminated
   * Block union without TypeScript narrowing the block to never or unknown.
   * Individual block types below still keep their stricter fields where
   * appropriate (for example LinkBlock requires url).
   */
  url?: string;
  purchaseUrl?: string;
  fileUrl?: string;
};

export type LinkBlock = BaseBlock & {
  type: "link";
  title: string;
  subtitle: string;
  url: string;
  layout?: LinkLayout;
  backgroundColor?: string;
  textColor?: string;
  radius?: number;
  thumbnailUrl?: string;
  accentColor?: string;
};

export type TextBlock = BaseBlock & {
  type: "text";
  text: string;
  fontSize?: number;
  align?: TextAlign;
  fontWeight?: number;
  color?: string;
  italic?: boolean;
};

export type ImageBlock = BaseBlock & {
  type: "image";
  imageUrl: string;
  caption: string;
  height?: number;
  radius?: number;
  fit?: ImageFit;
  position?: BackgroundPosition;
  showCaption?: boolean;
  captionBackground?: string;
  captionColor?: string;
};

export type VideoBlock = BaseBlock & {
  type: "video";
  title: string;
  url: string;
  backgroundColor?: string;
  textColor?: string;
  radius?: number;
};

export type MusicBlock = BaseBlock & {
  type: "music";
  title: string;
  artist: string;
  url?: string;
  artworkUrl?: string;
  backgroundColor?: string;
  textColor?: string;
  radius?: number;
};

export type QrBlock = BaseBlock & {
  type: "qr";
  label: string;
  destination?: string;
  backgroundColor?: string;
  textColor?: string;
  radius?: number;
};

export type DividerBlock = BaseBlock & {
  type: "divider";
  color?: string;
  thickness?: number;
  spacing?: number;
};

export type SocialBlock = BaseBlock & {
  type: "social";
  platform: SocialButtonPlatform;
  label: string;
  url: string;
  style?: SocialButtonStyle;
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  radius?: number;
};

export type ContactBlock = BaseBlock & {
  type: "contact";
  title: string;
  description: string;
  email?: string;
  phone?: string;
  website?: string;
  showEmail?: boolean;
  showPhone?: boolean;
  showWebsite?: boolean;
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  radius?: number;
};

export type EmailSignupBlock = BaseBlock & {
  type: "email";
  title: string;
  description: string;
  placeholder?: string;
  buttonLabel?: string;
  successMessage?: string;
  backgroundColor?: string;
  textColor?: string;
  inputColor?: string;
  buttonColor?: string;
  buttonTextColor?: string;
  radius?: number;
};

export type FileBlock = BaseBlock & {
  type: "file";
  title: string;
  description: string;
  fileName?: string;
  fileUrl?: string;
  fileSize?: string;
  buttonLabel?: string;
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  radius?: number;
};

export type ProductBlock = BaseBlock & {
  type: "product";
  name: string;
  description: string;
  price: string;
  imageUrl?: string;
  purchaseUrl?: string;
  buttonLabel?: string;
  layout?: ProductLayout;
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  radius?: number;
};

export type CountdownBlock = BaseBlock & {
  type: "countdown";
  title: string;
  targetDate: string;
  completedText?: string;
  style?: CountdownStyle;
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  radius?: number;
};

export type SpacerBlock = BaseBlock & {
  type: "spacer";
  height: number;
};

export type Block =
  | LinkBlock
  | TextBlock
  | ImageBlock
  | VideoBlock
  | MusicBlock
  | QrBlock
  | DividerBlock
  | SocialBlock
  | ContactBlock
  | EmailSignupBlock
  | FileBlock
  | ProductBlock
  | CountdownBlock
  | SpacerBlock;

export type LinkHubDesign = {
  pageBackground: string;
  accentColor: string;
  textColor: string;
  buttonColor: string;
  buttonTextColor: string;
  backgroundMode: BackgroundMode;
  gradientColorOne: string;
  gradientColorTwo: string;
  gradientDirection: GradientDirection;
  backgroundImage: string | null;
  videoBackgroundUrl: string;
  backgroundPosition: BackgroundPosition;
  backgroundBlur: number;
  overlayOpacity: number;
  overlayColor: string;
  buttonRadius: number;
  buttonShadow: boolean;
  profileSize: number;
  profileRadius: number;
  contentWidth: number;
  pagePadding: number;
  blockSpacing: number;
  headingAlign: TextAlign;
};

export type LinkHubProfile = {
  displayName: string;
  username: string;
  bio: string;
  profileImage: string | null;
};

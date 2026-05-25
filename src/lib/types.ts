export type LinkKind =
  | "website"
  | "instagram"
  | "youtube"
  | "shop"
  | "calendar"
  | "newsletter"
  | "music"
  | "download";

export type BioLink = {
  id: string;
  title: string;
  url: string;
  description: string;
  kind: LinkKind;
  active: boolean;
  clicks: number;
  createdAt: string;
};

export type AnalyticsDay = {
  date: string;
  visits: number;
  clicks: number;
  signups: number;
};

export type UserProfile = {
  id: string;
  name: string;
  username: string;
  email: string;
  password: string;
  headline: string;
  bio: string;
  location: string;
  avatarUrl: string;
  themeId: string;
  links: BioLink[];
  analytics: AnalyticsDay[];
  totalViews: number;
  totalClicks: number;
  subscribers: number;
};

export type AppState = {
  users: UserProfile[];
  currentUserId: string;
  darkMode: boolean;
};

export type ToastTone = "success" | "info" | "warning" | "error";

export type ToastMessage = {
  id: string;
  title: string;
  description?: string;
  tone: ToastTone;
};

export type BioTheme = {
  id: string;
  name: string;
  description: string;
  preview: string;
  pageClass: string;
  surfaceClass: string;
  linkClass: string;
  buttonClass: string;
  textClass: string;
  mutedClass: string;
  avatarClass: string;
  accentClass: string;
};

export const DEFAULT_PROFILE_AVATAR = "👤";

export const PROFILE_AVATAR_EMOJIS = [
  "🥷",
  "🏴‍☠️",
  "👤",
  "🧛",
  "🧟",
  "🧜",
  "🧚",
  "🧞",
  "🦸",
  "🦹",
  "🦁",
  "🐯",
  "🐲",
  "🐺",
  "🐼",
  "🦊",
  "🦒",
  "🤖",
  "👽",
  "👾",
] as const;

export type ProfileAvatarEmoji = (typeof PROFILE_AVATAR_EMOJIS)[number];

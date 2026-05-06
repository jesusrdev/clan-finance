import {
  DEFAULT_PROFILE_AVATAR,
  PROFILE_AVATAR_EMOJIS,
  type ProfileAvatarEmoji,
} from "../constants/avatarEmojis";

const PROFILE_AVATAR_EMOJI_SET = new Set<string>(PROFILE_AVATAR_EMOJIS);

export function isSupportedProfileAvatar(value: string | null | undefined): value is ProfileAvatarEmoji {
  if (typeof value !== "string") return false;
  return PROFILE_AVATAR_EMOJI_SET.has(value);
}

export function normalizeProfileAvatar(value: string | null | undefined): ProfileAvatarEmoji {
  if (isSupportedProfileAvatar(value)) return value;
  return DEFAULT_PROFILE_AVATAR;
}

export type ClanResolutionStatus = "idle" | "loading" | "resolved" | "error";

type AuthClanGuardInput = {
  loading: boolean;
  isReady: boolean;
  isResolvingClan: boolean;
  hasSession: boolean;
  hasClan: boolean | null;
  clanResolutionStatus: ClanResolutionStatus;
  segments: string[];
};

type GuardRedirectPath = "/" | "/onboarding" | "/(tabs)";

export function resolveAuthClanRedirect({
  loading,
  isReady,
  isResolvingClan,
  hasSession,
  hasClan,
  clanResolutionStatus,
  segments,
}: AuthClanGuardInput): GuardRedirectPath | null {
  if (loading || !isReady || isResolvingClan) return null;

  const currentPath = segments.join("/");
  const isOnOnboarding = currentPath === "onboarding";
  const isInAuthGroup = segments[0] === "(auth)";
  const isInTabsGroup = segments[0] === "(tabs)";
  const isOnRoot = !segments[0];

  if (!hasSession) {
    if (isInTabsGroup || isOnOnboarding) {
      return "/";
    }
    return null;
  }

  if (clanResolutionStatus === "resolved" && hasClan === false) {
    if (!isOnOnboarding) return "/onboarding";
    return null;
  }

  if (
    (clanResolutionStatus === "resolved" && hasClan === true) ||
    clanResolutionStatus === "error"
  ) {
    if (isInAuthGroup || isOnRoot || isOnOnboarding) {
      return "/(tabs)";
    }
  }

  return null;
}

export function shouldHoldNavigation(args: {
  loading: boolean;
  isReady: boolean;
  hasSession: boolean;
  hasClan: boolean | null;
  clanResolutionStatus: ClanResolutionStatus;
  isRootSegment: boolean;
  isWeb: boolean;
}): boolean {
  const {
    loading,
    isReady,
    hasSession,
    hasClan,
    clanResolutionStatus,
    isRootSegment,
    isWeb,
  } = args;

  return (
    loading ||
    !isReady ||
    (hasSession &&
      hasClan === null &&
      (clanResolutionStatus === "idle" || clanResolutionStatus === "loading")) ||
    (!isWeb && isRootSegment && !hasSession)
  );
}

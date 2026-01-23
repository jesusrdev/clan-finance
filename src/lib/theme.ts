import { DarkTheme, DefaultTheme, type Theme } from "@react-navigation/native";

export const THEME = {
  light: {
    background: "hsl(0 0% 100%)", // white
    foreground: "hsl(240 10% 3.9%)", // foreground
    card: "hsl(0 0% 100%)", // card
    cardForeground: "hsl(240 10% 3.9%)", // card-foreground
    popover: "hsl(0 0% 100%)", // popover
    popoverForeground: "hsl(240 10% 3.9%)", // popover-foreground
    primary: "hsl(0 75% 48%)", // primary #d91e1e
    primaryForeground: "hsl(0 0% 100%)", // primary-foreground
    secondary: "hsl(240 4.8% 95.9%)", // secondary
    secondaryForeground: "hsl(240 5.9% 10%)", // secondary-foreground
    muted: "hsl(240 4.8% 95.9%)", // muted
    mutedForeground: "hsl(240 3.8% 46.1%)", // muted-foreground
    accent: "hsl(240 4.8% 95.9%)", // accent
    accentForeground: "hsl(240 5.9% 10%)", // accent-foreground
    destructive: "hsl(0 84.2% 60.2%)", // destructive
    destructiveForeground: "hsl(0 0% 98%)",
    border: "hsl(240 5.9% 90%)", // border
    input: "hsl(240 5.9% 90%)", // input
    ring: "hsl(0 75% 48%)", // ring
    radius: "0.5rem",
  },
  dark: {
    background: "hsl(240 10% 3.9%)", // background
    foreground: "hsl(0 0% 98%)", // foreground
    card: "hsl(240 10% 3.9%)", // card
    cardForeground: "hsl(0 0% 98%)", // card-foreground
    popover: "hsl(240 10% 3.9%)", // popover
    popoverForeground: "hsl(0 0% 98%)", // popover-foreground
    primary: "hsl(0 100% 63%)", // primary #ff4444
    primaryForeground: "hsl(0 0% 100%)", // primary-foreground
    secondary: "hsl(240 3.7% 15.9%)", // secondary
    secondaryForeground: "hsl(0 0% 98%)", // secondary-foreground
    muted: "hsl(240 3.7% 15.9%)", // muted
    mutedForeground: "hsl(240 5% 64.9%)", // muted-foreground
    accent: "hsl(240 3.7% 15.9%)", // accent
    accentForeground: "hsl(0 0% 98%)", // accent-foreground
    destructive: "hsl(0 62.8% 30.6%)", // destructive
    destructiveForeground: "hsl(0 0% 98%)",
    border: "hsl(240 3.7% 15.9%)", // border
    input: "hsl(240 3.7% 15.9%)", // input
    ring: "hsl(0 100% 63%)", // ring
    radius: "0.5rem",
  },
};

export const NAV_THEME: Record<string, Theme> = {
  light: {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: THEME.light.background,
      border: THEME.light.border,
      card: THEME.light.card,
      notification: THEME.light.destructive,
      primary: THEME.light.primary,
      text: THEME.light.foreground,
    },
  },
  dark: {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: THEME.dark.background,
      border: THEME.dark.border,
      card: THEME.dark.card,
      notification: THEME.dark.destructive,
      primary: THEME.dark.primary,
      text: THEME.dark.foreground,
    },
  },
  onePiece: {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: "hsl(39 77% 91%)", // #fdf5e6
      border: "hsl(18 47% 12%)", // #2c1810
      card: "hsl(0 0% 100%)",
      notification: "hsl(0 75% 48%)",
      primary: "hsl(0 75% 48%)",
      text: "hsl(18 47% 12%)",
    },
  },
  // Add other anime themes as needed if they use different NAV colors
};

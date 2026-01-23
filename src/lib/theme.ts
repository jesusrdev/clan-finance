import { DarkTheme, DefaultTheme, type Theme } from "@react-navigation/native";

export const THEME_METADATA = {
  light: {
    name: "Luz Clara",
    icon: "☀️",
    description: "Limpio y profesional",
    color: "#ffffff",
    item: "Cristal",
  },
  dark: {
    name: "Noche Oscura",
    icon: "🌙",
    description: "Elegante y minimalista",
    color: "#09090b",
    item: "Vacío",
  },
  onePiece: {
    name: "Gran Ruta",
    icon: "☠️",
    description: "¡Aventuras en el mar!",
    color: "#df1e26", // Luffy Red
    item: "Pergamino",
  },
  demonSlayer: {
    name: "Respiración Solar",
    icon: "⚔️",
    description: "Poder del sol y la espada",
    color: "#ff4500", // Fiery Orange-Red
    item: "Katana",
  },
  naruto: {
    name: "Senda del Hokage",
    icon: "🍥",
    description: "Energía pura y determinación",
    color: "#ff8c00", // Kyuubi Orange
    item: "Shuriken",
  },
  dragonBall: {
    name: "Guerrero Z",
    icon: "🐲",
    description: "Fuerza explosiva Saiyan",
    color: "#f1c40f", // Super Saiyan Yellow
    item: "Esfera del Dragón",
  },
  strangerThings: {
    name: "Mundo del Revés",
    icon: "🧇",
    description: "Misterio ochentero láser",
    color: "#f40d17", // Netflix Red
    item: "Láser",
  },
};

export const THEME = {
  light: {
    background: "#ffffff",
    foreground: "#09090b",
    card: "#ffffff",
    cardForeground: "#09090b",
    primary: "#0f172a",
    primaryForeground: "#ffffff",
    border: "#e2e8f0",
    notification: "#ef4444",
    text: "#0f172a",
  },
  dark: {
    background: "#09090b",
    foreground: "#fafafa",
    card: "#18181b",
    cardForeground: "#fafafa",
    primary: "#ffffff",
    primaryForeground: "#09090b",
    border: "#27272a",
    notification: "#7f1d1d",
    text: "#fafafa",
  },
  onePiece: {
    background: "#fffbf0",
    foreground: "#4a3321",
    card: "#ffffff",
    cardForeground: "#4a3321",
    primary: "#df1e26",
    primaryForeground: "#ffffff",
    border: "#d4a373",
    notification: "#df1e26",
    text: "#4a3321",
  },
  demonSlayer: {
    background: "#0a0a0a",
    foreground: "#ffffff",
    card: "#1a0a0a", // Slight reddish card
    cardForeground: "#ffffff",
    primary: "#ff4500",
    primaryForeground: "#ffffff",
    border: "#8b0000",
    notification: "#ff4500",
    text: "#ffffff",
  },
  naruto: {
    background: "#121212",
    foreground: "#ffffff",
    card: "#1e1e1e",
    cardForeground: "#ffffff",
    primary: "#ff8c00",
    primaryForeground: "#ffffff",
    border: "#2563eb",
    notification: "#ef4444",
    text: "#ffffff",
  },
  dragonBall: {
    background: "#2b3eb1",
    foreground: "#ffffff",
    card: "#3a4ac6",
    cardForeground: "#ffffff",
    primary: "#f1c40f",
    primaryForeground: "#2c3e50",
    border: "#e67e22",
    notification: "#e74c3c",
    text: "#ffffff",
  },
  strangerThings: {
    background: "#050101",
    foreground: "#ffffff",
    card: "#121212",
    cardForeground: "#ffffff",
    primary: "#f40d17",
    primaryForeground: "#ffffff",
    border: "#8b0000",
    notification: "#f40d17",
    text: "#ffffff",
  },
};

export const NAV_THEME: Record<string, Theme> = Object.entries(THEME).reduce(
  (acc, [key, val]) => {
    const isDark = [
      "dark",
      "demonSlayer",
      "dragonBall",
      "strangerThings",
      "naruto",
    ].includes(key);
    const baseTheme = isDark ? DarkTheme : DefaultTheme;
    acc[key] = {
      ...baseTheme,
      colors: {
        ...baseTheme.colors,
        background: val.background,
        border: val.border,
        card: val.card,
        notification: val.notification,
        primary: val.primary,
        text: val.text,
      },
    };
    return acc;
  },
  {} as Record<string, Theme>,
);

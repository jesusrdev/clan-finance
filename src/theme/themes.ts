/**
 * Sistema de Temas (Skins) para Clan Finance
 * Basado en cultura pop: Anime y Series
 */

export type ThemeName =
  | "onePiece"
  | "demonSlayer"
  | "naruto"
  | "dragonBall"
  | "strangerThings";

export interface Theme {
  name: ThemeName;
  displayName: string;
  colors: {
    primary: string;
    background: string;
    text: string;
    textInverse: string;
    card: string;
    border: string;
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  ui: {
    borderWidth: number;
    borderRadius: number;
    fontFamily: string;
  };
}

export const themes: Record<ThemeName, Theme> = {
  onePiece: {
    name: "onePiece",
    displayName: "One Piece",
    colors: {
      primary: "#D91E1E",
      background: "#FDF5E6",
      text: "#2C1810",
      textInverse: "#FFFFFF",
      card: "#FFFFFF",
      border: "#2C1810",
      success: "#4CAF50",
      warning: "#FF9800",
      error: "#D91E1E",
      info: "#2196F3",
    },
    ui: {
      borderWidth: 2,
      borderRadius: 4,
      fontFamily: "System",
    },
  },
  demonSlayer: {
    name: "demonSlayer",
    displayName: "Demon Slayer",
    colors: {
      primary: "#2D5F5D",
      background: "#121212",
      text: "#FFFFFF",
      textInverse: "#121212",
      card: "#1E1E1E",
      border: "#2D5F5D",
      success: "#4CAF50",
      warning: "#FF9800",
      error: "#F44336",
      info: "#2196F3",
    },
    ui: {
      borderWidth: 1,
      borderRadius: 0,
      fontFamily: "System",
    },
  },
  naruto: {
    name: "naruto",
    displayName: "Naruto",
    colors: {
      primary: "#FF9F1C",
      background: "#FFFFFF",
      text: "#2C2C2C",
      textInverse: "#FFFFFF",
      card: "#FFF8E7",
      border: "#FF9F1C",
      success: "#4CAF50",
      warning: "#FF9800",
      error: "#F44336",
      info: "#2196F3",
    },
    ui: {
      borderWidth: 1,
      borderRadius: 8,
      fontFamily: "System",
    },
  },
  dragonBall: {
    name: "dragonBall",
    displayName: "Dragon Ball",
    colors: {
      primary: "#F28F08",
      background: "#253294",
      text: "#FFFFFF",
      textInverse: "#253294",
      card: "#3A4DB8",
      border: "#F28F08",
      success: "#4CAF50",
      warning: "#FF9800",
      error: "#F44336",
      info: "#2196F3",
    },
    ui: {
      borderWidth: 2,
      borderRadius: 4,
      fontFamily: "System",
    },
  },
  strangerThings: {
    name: "strangerThings",
    displayName: "Stranger Things",
    colors: {
      primary: "#E20713",
      background: "#0B0B0B",
      text: "#FFFFFF",
      textInverse: "#0B0B0B",
      card: "#1A1A1A",
      border: "#E20713",
      success: "#4CAF50",
      warning: "#FF9800",
      error: "#E20713",
      info: "#2196F3",
    },
    ui: {
      borderWidth: 1,
      borderRadius: 2,
      fontFamily: "System",
    },
  },
};

export const defaultTheme: ThemeName = "onePiece";

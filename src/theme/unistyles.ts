import { UnistylesRegistry } from "react-native-unistyles";
import { themes } from "./themes";

// Configurar Unistyles con nuestros temas
UnistylesRegistry.addThemes(themes).addConfig({
  adaptiveThemes: false,
});

// Tipos para TypeScript
type AppThemes = typeof themes;

declare module "react-native-unistyles" {
  export interface UnistylesThemes extends AppThemes {}
}

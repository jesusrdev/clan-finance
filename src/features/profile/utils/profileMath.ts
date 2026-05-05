/**
 * LÓGICA DE PROGRESIÓN CUADRÁTICA
 * Nivel 1: 0 XP
 * Nivel 2: 200 XP (Req: 200)
 * Nivel 3: 600 XP (Req: 400)
 * Nivel 4: 1200 XP (Req: 600)
 * ...
 * TotalXP(L) = 100 * L * (L-1)
 */

export const THEME_RANKS: Record<string, string[]> = {
  light: [
    "Novato", "Aprendiz", "Guía", "Iluminado", "Mentor", 
    "Visionario", "Guardian", "Maestro de Claridad", "Ser de Luz", "Archimaestro Solar"
  ],
  dark: [
    "Sombra", "Espectro", "Acechador", "Guerrero Sombrío", "Segador", 
    "Señor del Abismo", "Caminante del Vacío", "Caballero Oscuro", "Soberano de la Noche", "Monarca del Vacío"
  ],
  onePiece: [
    "Grumete", "Marinero", "Timonel", "Carpintero", "Cocinero", 
    "Navegante", "Tirador", "Espadachín", "Comandante", "Rey de los Piratas"
  ],
  demonSlayer: [
    "Mizunoto", "Mizunoe", "Kanoto", "Kanoe", "Tuchinoto", 
    "Tuchinoe", "Hinoto", "Hinoe", "Kinoe", "Pilar (Hashira)"
  ],
  naruto: [
    "Estudiante", "Genin", "Chunin", "Tokubetsu Jonin", "Jonin", 
    "Anbu", "Sabio", "Sannin", "Kage", "Leyenda Ninja"
  ],
  dragonBall: [
    "Humano", "Discípulo", "Guerrero Z", "Kaioken", "Super Saiyan", 
    "Super Saiyan 2", "Super Saiyan 3", "Super Saiyan Dios", "Super Saiyan Blue", "Ultra Instinto"
  ],
  strangerThings: [
    "Civil", "Explorador", "Investigador", "Residente de Hawkins", "Cazador de Demoperros", 
    "Sobreviviente", "Guerrero de Hawkins", "Vidente", "Exterminador de Demogorgones", "Maestro del Revés"
  ],
};

export const THEME_MARKERS: Record<string, string> = {
  light: "✨",
  dark: "🌑",
  onePiece: "⛵",
  demonSlayer: "⚔️",
  naruto: "🍥",
  dragonBall: "☄️",
  strangerThings: "🔦",
};

/**
 * Calcula el nivel actual basado en el XP acumulado
 * Usando la fórmula inversa de 100 * L * (L-1)
 */
export const getLevel = (xp: number = 0) => {
  if (xp <= 0) return 1;
  // xp = 100 * L^2 - 100 * L  => 100L^2 - 100L - xp = 0
  // L = (-b + sqrt(b^2 - 4ac)) / 2a
  // a=100, b=-100, c=-xp
  const level = Math.floor((100 + Math.sqrt(100 * 100 + 4 * 100 * xp)) / (2 * 100));
  return level || 1;
};

/**
 * Obtiene el XP total necesario para llegar a un nivel específico
 */
export const getTotalXpForLevel = (level: number) => {
  return 100 * level * (level - 1);
};

/**
 * Calcula el progreso (0.0 a 1.0) dentro del nivel actual
 */
export const getLevelProgress = (xp: number = 0) => {
  const currentLevel = getLevel(xp);
  const xpAtStartOfLevel = getTotalXpForLevel(currentLevel);
  const xpAtEndOfLevel = getTotalXpForLevel(currentLevel + 1);
  
  const xpInCurrentLevel = xp - xpAtStartOfLevel;
  const totalXpNeededForLevel = xpAtEndOfLevel - xpAtStartOfLevel;
  
  return Math.min(Math.max(xpInCurrentLevel / totalXpNeededForLevel, 0), 0.99);
};

/**
 * XP pendiente para el siguiente nivel
 */
export const getXpForNextLevel = (xp: number = 0) => {
  const currentLevel = getLevel(xp);
  const xpAtEndOfLevel = getTotalXpForLevel(currentLevel + 1);
  return xpAtEndOfLevel - xp;
};

/**
 * Título de rango (10 rangos disponibles)
 * Cambia cada 2 niveles (Nivel 1-2: Rango 1, 3-4: Rango 2, etc.)
 */
export const getRankTitle = (theme: string, level: number) => {
  const ranks = THEME_RANKS[theme] || THEME_RANKS.light;
  const rankIndex = Math.min(Math.floor((level - 1) / 2), ranks.length - 1);
  return ranks[rankIndex];
};

/**
 * Obtiene el marcador visual del tema para la barra de progreso
 */
export const getThemeMarker = (theme: string) => {
  return THEME_MARKERS[theme] || THEME_MARKERS.light;
};

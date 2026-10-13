/**
 * Themes and presets for Buyer customization (Requirement 27)
 * Themes may modify: Colors, Fonts, Text, Images, per-size layout styling.
 * Themes MUST NEVER modify: Scene definitions, Scene lengths, Scene order, Output size, or Animation timing.
 */

export const THEMES = [
  {
    id: 'theme-cyberpunk',
    name: 'Cyberpunk Neon',
    description: 'Electric violet, neon cyan, glowing yellow, high contrast',
    colors: {
      primary: '#8b5cf6',
      secondary: '#06b6d4',
      accent: '#facc15',
      background: '#090a10',
      text: '#ffffff',
      subtext: '#94a3b8'
    },
    fontFamily: 'Space Grotesk'
  },
  {
    id: 'theme-monochrome',
    name: 'Minimal Monochrome',
    description: 'Crisp Swiss architectural contrast, graphite, pure black & stark white',
    colors: {
      primary: '#ffffff',
      secondary: '#a1a1aa',
      accent: '#71717a',
      background: '#0a0a0a',
      text: '#ffffff',
      subtext: '#a1a1aa'
    },
    fontFamily: 'Inter'
  },
  {
    id: 'theme-sunset',
    name: 'Sunset Horizon',
    description: 'Warm coral, vivid amber, deep magenta dusk',
    colors: {
      primary: '#f43f5e',
      secondary: '#fb923c',
      accent: '#fbbf24',
      background: '#180e1a',
      text: '#fff1f2',
      subtext: '#fecdd3'
    },
    fontFamily: 'Syne'
  },
  {
    id: 'theme-corporate',
    name: 'Corporate Tech',
    description: 'Deep navy, cobalt blue, clean emerald accent, trust & authority',
    colors: {
      primary: '#3b82f6',
      secondary: '#10b981',
      accent: '#60a5fa',
      background: '#0a101d',
      text: '#f8fafc',
      subtext: '#94a3b8'
    },
    fontFamily: 'Plus Jakarta Sans'
  },
  {
    id: 'theme-emerald-luxury',
    name: 'Emerald Prestige',
    description: 'Rich dark jade, muted champagne gold, regal serif typography',
    colors: {
      primary: '#10b981',
      secondary: '#d97706',
      accent: '#fbbf24',
      background: '#051b14',
      text: '#ecfdf5',
      subtext: '#a7f3d0'
    },
    fontFamily: 'Cinzel'
  }
];

/**
 * Deterministic PRNG using Mulberry32 for seedable randomization
 */
function mulberry32(seed) {
  return function() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

/**
 * Deterministic randomize function that produces fresh color palettes & typography
 * without affecting scene lengths, order, or animation timing.
 */
export function getDeterministicRandomTheme(seed = Date.now()) {
  const rng = mulberry32(seed);
  
  const hues = [260, 210, 330, 160, 35, 190, 280];
  const primaryHue = hues[Math.floor(rng() * hues.length)];
  const secondaryHue = (primaryHue + 60 + Math.floor(rng() * 120)) % 360;
  
  const fonts = ['Inter', 'Space Grotesk', 'Syne', 'Plus Jakarta Sans', 'Oswald', 'Poppins', 'Cinzel', 'Outfit'];
  const chosenFont = fonts[Math.floor(rng() * fonts.length)];

  return {
    id: `random-theme-${seed}`,
    name: `Custom Palette #${seed % 1000}`,
    colors: {
      primary: `hsl(${primaryHue}, 85%, 65%)`,
      secondary: `hsl(${secondaryHue}, 80%, 60%)`,
      accent: `hsl(${(primaryHue + 180) % 360}, 90%, 65%)`,
      background: '#0d1117',
      text: '#f1f5f9',
      subtext: '#94a3b8'
    },
    fontFamily: chosenFont
  };
}

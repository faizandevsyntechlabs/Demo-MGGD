/**
 * Motion Generator Types Catalog (23 types total)
 * As required by MGGD Requirements 29-30:
 * - 10 configurable Motion types
 * - 12 configurable Intro/Logo Reveal types
 * - 1 Lower-Third type
 */

export const GENERATOR_TYPES = [
  // 10 Configurable Motion Types
  {
    typeId: 'demo-mggd-mot-01',
    name: 'Kinetic Typography Strobe',
    group: 'Motion',
    category: 'Kinetic Typography',
    subcategory: 'Strobe Cuts',
    style: 'Fast-Paced Editorial',
    mood: 'High Energy',
    industry: 'Media & Entertainment',
    defaultScenes: 3,
    templateKey: 'kinetic_type'
  },
  {
    typeId: 'demo-mggd-mot-02',
    name: 'Product Feature Showcase',
    group: 'Motion',
    category: 'E-Commerce Promotion',
    subcategory: 'Hardware Product',
    style: 'Clean Commercial',
    mood: 'Sophisticated',
    industry: 'Consumer Tech',
    defaultScenes: 4,
    templateKey: 'product_promo'
  },
  {
    typeId: 'demo-mggd-mot-03',
    name: 'UI Overlay & Badge Alert',
    group: 'Motion',
    category: 'Stream & Broadcast Overlay',
    subcategory: 'Twitch/YouTube HUD',
    style: 'Cyber Neon HUD',
    mood: 'Exciting',
    industry: 'Gaming & Creators',
    defaultScenes: 2,
    templateKey: 'ui_overlay'
  },
  {
    typeId: 'demo-mggd-mot-04',
    name: 'Data Counter & Metrics Card',
    group: 'Motion',
    category: 'Infographic Motion',
    subcategory: 'KPI Dashboard',
    style: 'Minimal Corporate',
    mood: 'Analytical',
    industry: 'Finance & SaaS',
    defaultScenes: 2,
    templateKey: 'kinetic_type'
  },
  {
    typeId: 'demo-mggd-mot-05',
    name: 'Social Story Carousel Slide',
    group: 'Motion',
    category: 'Social Media Motion',
    subcategory: 'Vertical Story',
    style: 'Bold Vibrant',
    mood: 'Playful',
    industry: 'Lifestyle & Fashion',
    defaultScenes: 3,
    templateKey: 'product_promo'
  },
  {
    typeId: 'demo-mggd-mot-06',
    name: 'Event Countdown Sequence',
    group: 'Motion',
    category: 'Broadcast Motion',
    subcategory: 'Live Stream Opener',
    style: 'Dynamic Glitch',
    mood: 'Anticipation',
    industry: 'Conferences & Music',
    defaultScenes: 3,
    templateKey: 'kinetic_type'
  },
  {
    typeId: 'demo-mggd-mot-07',
    name: 'Podcast Audiogram Waveform',
    group: 'Motion',
    category: 'Audio Visualizer',
    subcategory: 'Episode Teaser',
    style: 'Waveform Synth',
    mood: 'Intriguing',
    industry: 'Podcasting & Audio',
    defaultScenes: 2,
    templateKey: 'ui_overlay'
  },
  {
    typeId: 'demo-mggd-mot-08',
    name: 'Quotes & Testimonial Card',
    group: 'Motion',
    category: 'Social Proof',
    subcategory: 'Customer Review',
    style: 'Elegant Editorial',
    mood: 'Trustworthy',
    industry: 'B2B & Agencies',
    defaultScenes: 2,
    templateKey: 'kinetic_type'
  },
  {
    typeId: 'demo-mggd-mot-09',
    name: 'Feature Bento Box Reel',
    group: 'Motion',
    category: 'Product Marketing',
    subcategory: 'Grid Reveal',
    style: 'Modern Apple-esque',
    mood: 'Premium',
    industry: 'Software & Mobile',
    defaultScenes: 3,
    templateKey: 'product_promo'
  },
  {
    typeId: 'demo-mggd-mot-10',
    name: 'Breaking News Ticker Banner',
    group: 'Motion',
    category: 'Broadcast Graphics',
    subcategory: 'News Alert',
    style: 'Urgent Television',
    mood: 'Critical Attention',
    industry: 'Journalism & Media',
    defaultScenes: 2,
    templateKey: 'ui_overlay'
  },

  // 12 Configurable Intro / Logo Reveal Types
  {
    typeId: 'demo-mggd-rev-01',
    name: 'Geometric Neon Logo Reveal',
    group: 'Logo Reveal',
    category: 'Logo Animation',
    subcategory: 'Wireframe Vector',
    style: 'Cyberpunk Vector',
    mood: 'Futuristic',
    industry: 'Tech & Gaming',
    defaultScenes: 2,
    templateKey: 'logo_reveal'
  },
  {
    typeId: 'demo-mggd-rev-02',
    name: 'Particle Burst Brand Opener',
    group: 'Logo Reveal',
    category: 'Logo Animation',
    subcategory: 'Explosive Light Burst',
    style: 'Cinematic Flare',
    mood: 'Epic Grandeur',
    industry: 'Cinema & Studio',
    defaultScenes: 2,
    templateKey: 'logo_reveal'
  },
  {
    typeId: 'demo-mggd-rev-03',
    name: 'Minimal Clean Monogram Drop',
    group: 'Logo Reveal',
    category: 'Logo Animation',
    subcategory: 'Swiss Modernist',
    style: 'Monochrome Flat',
    mood: 'Refined',
    industry: 'Architecture & Design',
    defaultScenes: 2,
    templateKey: 'logo_reveal'
  },
  {
    typeId: 'demo-mggd-rev-04',
    name: '3D Liquid Gradient Morph',
    group: 'Logo Reveal',
    category: 'Logo Animation',
    subcategory: 'Fluid Simulation',
    style: 'Soft Organic 3D',
    mood: 'Creative',
    industry: 'Art & Design',
    defaultScenes: 2,
    templateKey: 'logo_reveal'
  },
  {
    typeId: 'demo-mggd-rev-05',
    name: 'Retro VHS Glitch Reveal',
    group: 'Logo Reveal',
    category: 'Logo Animation',
    subcategory: 'Analog Cassette',
    style: '1980s CRT Scanline',
    mood: 'Nostalgic',
    industry: 'Music & Streetwear',
    defaultScenes: 2,
    templateKey: 'logo_reveal'
  },
  {
    typeId: 'demo-mggd-rev-06',
    name: 'Origami Paper Fold Stencil',
    group: 'Logo Reveal',
    category: 'Logo Animation',
    subcategory: 'Geometric Folding',
    style: 'Tactile Craft',
    mood: 'Warm & Organic',
    industry: 'Eco & Artisanal',
    defaultScenes: 2,
    templateKey: 'logo_reveal'
  },
  {
    typeId: 'demo-mggd-rev-07',
    name: 'Golden Luxury Crest Shine',
    group: 'Logo Reveal',
    category: 'Logo Animation',
    subcategory: 'Metallic Sheen',
    style: 'Prestige Metallic',
    mood: 'Opulent',
    industry: 'Jewelry & Hospitality',
    defaultScenes: 2,
    templateKey: 'logo_reveal'
  },
  {
    typeId: 'demo-mggd-rev-08',
    name: 'Fast Sports Flash Stutter',
    group: 'Logo Reveal',
    category: 'Logo Animation',
    subcategory: 'Strobe Action',
    style: 'Extreme Athletics',
    mood: 'Aggressive Energy',
    industry: 'Fitness & Sports',
    defaultScenes: 2,
    templateKey: 'logo_reveal'
  },
  {
    typeId: 'demo-mggd-rev-09',
    name: 'Architectural Blueprint Draw',
    group: 'Logo Reveal',
    category: 'Logo Animation',
    subcategory: 'Technical CAD Outline',
    style: 'Technical Drafting',
    mood: 'Precision',
    industry: 'Engineering & Construction',
    defaultScenes: 2,
    templateKey: 'logo_reveal'
  },
  {
    typeId: 'demo-mggd-rev-10',
    name: 'Watercolor Ink Dispersion',
    group: 'Logo Reveal',
    category: 'Logo Animation',
    subcategory: 'Pigment Spread',
    style: 'Painterly Flow',
    mood: 'Serene Dreamy',
    industry: 'Beauty & Wellness',
    defaultScenes: 2,
    templateKey: 'logo_reveal'
  },
  {
    typeId: 'demo-mggd-rev-11',
    name: 'Circuit Board Electric Pulse',
    group: 'Logo Reveal',
    category: 'Logo Animation',
    subcategory: 'PCB Bus Tracer',
    style: 'Microchip Hardware',
    mood: 'High-Tech Focus',
    industry: 'AI & Semiconductors',
    defaultScenes: 2,
    templateKey: 'logo_reveal'
  },
  {
    typeId: 'demo-mggd-rev-12',
    name: 'Cosmic Starfield Vortex',
    group: 'Logo Reveal',
    category: 'Logo Animation',
    subcategory: 'Space Nebula',
    style: 'Interstellar Deep Space',
    mood: 'Mysterious',
    industry: 'Space & Gaming',
    defaultScenes: 2,
    templateKey: 'logo_reveal'
  },

  // 1 Lower-Third Type
  {
    typeId: 'demo-mggd-lt-01',
    name: 'Broadcast Lower-Third Nameplate',
    group: 'Lower Third',
    category: 'Broadcast Overlays',
    subcategory: 'Speaker Identification',
    style: 'Crisp Studio Glassmorphism',
    mood: 'Professional Authority',
    industry: 'Broadcast & Streaming',
    defaultScenes: 2,
    templateKey: 'lower_third'
  }
];

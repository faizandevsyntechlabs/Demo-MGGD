/**
 * Initial Demo Generators adhering strictly to MGGD Specification
 * Requirements: 1-2, 4, 10, 11, 12, 13, 16, 20
 */

// SVG Placeholder Data URLs for Default Assets with licenses
const LOGO_SVG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200' width='200' height='200'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%238b5cf6'/%3E%3Cstop offset='100%25' stop-color='%23ec4899'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cpolygon points='100,20 180,65 180,155 100,200 20,155 20,65' fill='none' stroke='url(%23g)' stroke-width='10'/%3E%3Ccircle cx='100' cy='100' r='35' fill='url(%23g)'/%3E%3Cpath d='M75,100 L125,100 M100,75 L100,125' stroke='%23ffffff' stroke-width='6' stroke-linecap='round'/%3E%3C/svg%3E";

const PRODUCT_IMAGE_SVG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400' width='400' height='400'%3E%3Cdefs%3E%3ClinearGradient id='pg' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%231e293b'/%3E%3Cstop offset='100%25' stop-color='%230f172a'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='400' rx='40' fill='url(%23pg)' stroke='%238b5cf6' stroke-width='4'/%3E%3Ccircle cx='200' cy='170' r='80' fill='%23334155' stroke='%2338bdf8' stroke-width='4'/%3E%3Cpath d='M160,170 Q200,120 240,170 Q200,220 160,170' fill='%2338bdf8' opacity='0.7'/%3E%3Crect x='120' y='280' width='160' height='20' rx='10' fill='%2364748b'/%3E%3Crect x='150' y='315' width='100' height='12' rx='6' fill='%23475569'/%3E%3C/svg%3E";

export const DEMO_GENERATORS = [
  // 1. Geometric Neon Logo Reveal
  {
    generatorId: 'mggd-gen-logo-reveal-01',
    generatorTypeId: 'demo-mggd-rev-01',
    name: 'Geometric Neon Logo Reveal',
    panelVersion: 'M1.0',
    classification: {
      category: 'Logo Animation',
      subcategory: 'Wireframe Vector',
      style: 'Cyberpunk Vector',
      mood: 'Futuristic',
      industry: 'Tech & Gaming'
    },
    supportedSizes: ['1920x1080', '1080x1920', '1080x1080', '1080x1350', '2560x1080'],
    defaultSize: '1920x1080',
    currentSize: '1920x1080',
    transparency: false,
    transparentType: 'page-layout',
    loop: true,
    libraries: [
      { name: 'Canvas2D Builtin', keep: true, license: 'W3C Standard', description: 'Deterministic standard browser rendering' }
    ],
    defaultAssets: [
      {
        id: 'asset-logo',
        name: 'Brand Monogram Mark',
        url: LOGO_SVG,
        license: 'CC-BY-4.0 (Maker Original Asset)'
      }
    ],
    properties: {
      headline: 'NEO NEXUS STUDIOS',
      subline: 'NEXT-GENERATION INTERACTIVE MEDIA',
      tag: 'EST. 2026',
      colors: {
        primary: '#8b5cf6',
        secondary: '#06b6d4',
        accent: '#facc15',
        background: '#090a10',
        text: '#ffffff',
        subtext: '#94a3b8'
      },
      fontFamily: 'Space Grotesk',
      imageUrl: LOGO_SVG
    },
    scenes: [
      {
        id: 'scene-logo-1',
        name: 'Wireframe Pulse & Emblem',
        order: 1,
        defaultDuration: 3.5,
        minDuration: 2.0,
        maxDuration: 6.0,
        currentDuration: 3.5,
        required: true,
        background: '#090a10',
        entrance: 'zoom-in',
        exit: 'fade',
        objects: [
          {
            id: 'obj-emblem',
            name: 'Emblem Hexagon',
            type: 'logo',
            delay: 0.2,
            minDelay: 0.0,
            maxDelay: 1.0,
            duration: 3.0,
            minDuration: 1.5,
            maxDuration: 5.0,
            trigger: 'Auto - Once - Stay',
            entranceAnimation: 'spring-scale',
            exitAnimation: 'fade-out',
            layout: {
              '1920x1080': { x: 960, y: 440, scale: 1.2, fontSize: 0, align: 'center' },
              '1080x1920': { x: 540, y: 780, scale: 1.4, fontSize: 0, align: 'center' },
              '1080x1080': { x: 540, y: 460, scale: 1.2, fontSize: 0, align: 'center' },
              '1080x1350': { x: 540, y: 550, scale: 1.3, fontSize: 0, align: 'center' },
              '2560x1080': { x: 1280, y: 440, scale: 1.2, fontSize: 0, align: 'center' }
            }
          },
          {
            id: 'obj-headline',
            name: 'Brand Title',
            type: 'text',
            delay: 0.8,
            minDelay: 0.2,
            maxDelay: 2.0,
            duration: 2.5,
            minDuration: 1.2,
            maxDuration: 4.5,
            trigger: 'Auto - Once - Stay',
            entranceAnimation: 'glow-pop',
            exitAnimation: 'fade-out',
            layout: {
              '1920x1080': { x: 960, y: 640, scale: 1.0, fontSize: 44, align: 'center' },
              '1080x1920': { x: 540, y: 1040, scale: 1.0, fontSize: 42, align: 'center' },
              '1080x1080': { x: 540, y: 680, scale: 1.0, fontSize: 38, align: 'center' },
              '1080x1350': { x: 540, y: 790, scale: 1.0, fontSize: 40, align: 'center' },
              '2560x1080': { x: 1280, y: 640, scale: 1.0, fontSize: 46, align: 'center' }
            }
          }
        ]
      },
      {
        id: 'scene-logo-2',
        name: 'Tagline & Settle',
        order: 2,
        defaultDuration: 3.0,
        minDuration: 1.5,
        maxDuration: 5.0,
        currentDuration: 3.0,
        required: false,
        background: '#090a10',
        entrance: 'fade',
        exit: 'fade',
        objects: [
          {
            id: 'obj-tagline',
            name: 'Subline Tagline',
            type: 'text',
            delay: 0.3,
            minDelay: 0.0,
            maxDelay: 1.2,
            duration: 2.4,
            minDuration: 1.0,
            maxDuration: 4.0,
            trigger: 'Auto - Once - Stay',
            entranceAnimation: 'slide-in-bottom',
            exitAnimation: 'fade-out',
            layout: {
              '1920x1080': { x: 960, y: 540, scale: 1.0, fontSize: 26, align: 'center' },
              '1080x1920': { x: 540, y: 960, scale: 1.0, fontSize: 24, align: 'center' },
              '1080x1080': { x: 540, y: 540, scale: 1.0, fontSize: 22, align: 'center' },
              '1080x1350': { x: 540, y: 675, scale: 1.0, fontSize: 24, align: 'center' },
              '2560x1080': { x: 1280, y: 540, scale: 1.0, fontSize: 28, align: 'center' }
            }
          }
        ]
      }
    ],
    validationStatus: 'Verified'
  },

  // 2. Broadcast Lower Third Nameplate
  {
    generatorId: 'mggd-gen-lower-third-01',
    generatorTypeId: 'demo-mggd-lt-01',
    name: 'Broadcast Lower-Third Nameplate',
    panelVersion: 'M1.0',
    classification: {
      category: 'Broadcast Overlays',
      subcategory: 'Speaker Identification',
      style: 'Crisp Studio Glassmorphism',
      mood: 'Professional Authority',
      industry: 'Broadcast & Streaming'
    },
    supportedSizes: ['1920x1080', '1080x1920', '1080x1080', '1080x1350', '2560x1080'],
    defaultSize: '1920x1080',
    currentSize: '1920x1080',
    transparency: true,
    transparentType: 'overlay',
    loop: false,
    libraries: [
      { name: 'Canvas2D Builtin', keep: true, license: 'W3C Standard', description: 'Deterministic standard browser rendering' }
    ],
    defaultAssets: [
      {
        id: 'asset-lt-icon',
        name: 'Speaker Badge Mark',
        url: LOGO_SVG,
        license: 'MIT Permissive (Maker Library)'
      }
    ],
    properties: {
      headline: 'DR. ELENA VANCE',
      subline: 'Senior Director of Artificial Systems',
      tag: 'LIVE FEED // TOKYO',
      colors: {
        primary: '#3b82f6',
        secondary: '#10b981',
        accent: '#60a5fa',
        background: 'rgba(15, 23, 42, 0.88)',
        text: '#ffffff',
        subtext: '#94a3b8'
      },
      fontFamily: 'Inter',
      imageUrl: LOGO_SVG
    },
    scenes: [
      {
        id: 'scene-lt-1',
        name: 'Nameplate Enter & Identity',
        order: 1,
        defaultDuration: 4.5,
        minDuration: 2.5,
        maxDuration: 8.0,
        currentDuration: 4.5,
        required: true,
        background: 'transparent',
        entrance: 'slide-in-left',
        exit: 'fade',
        objects: [
          {
            id: 'obj-lt-bar',
            name: 'Accent Backing Bar',
            type: 'shape',
            delay: 0.1,
            minDelay: 0.0,
            maxDelay: 0.5,
            duration: 4.0,
            minDuration: 2.0,
            maxDuration: 7.0,
            trigger: 'Auto - Once - Stay',
            entranceAnimation: 'slide-in-left',
            exitAnimation: 'slide-out-right',
            layout: {
              '1920x1080': { x: 380, y: 920, scale: 1.0, fontSize: 0, align: 'left' },
              '1080x1920': { x: 260, y: 1680, scale: 1.0, fontSize: 0, align: 'left' },
              '1080x1080': { x: 260, y: 900, scale: 0.9, fontSize: 0, align: 'left' },
              '1080x1350': { x: 260, y: 1150, scale: 0.95, fontSize: 0, align: 'left' },
              '2560x1080': { x: 500, y: 920, scale: 1.1, fontSize: 0, align: 'left' }
            }
          },
          {
            id: 'obj-lt-name',
            name: 'Speaker Name',
            type: 'text',
            delay: 0.4,
            minDelay: 0.1,
            maxDelay: 1.0,
            duration: 3.8,
            minDuration: 2.0,
            maxDuration: 6.5,
            trigger: 'Auto - Once - Stay',
            entranceAnimation: 'slide-in-left',
            exitAnimation: 'fade-out',
            layout: {
              '1920x1080': { x: 420, y: 900, scale: 1.0, fontSize: 32, align: 'left' },
              '1080x1920': { x: 280, y: 1660, scale: 1.0, fontSize: 30, align: 'left' },
              '1080x1080': { x: 280, y: 880, scale: 0.9, fontSize: 28, align: 'left' },
              '1080x1350': { x: 280, y: 1130, scale: 0.95, fontSize: 30, align: 'left' },
              '2560x1080': { x: 540, y: 900, scale: 1.1, fontSize: 34, align: 'left' }
            }
          },
          {
            id: 'obj-lt-role',
            name: 'Speaker Role & Affiliation',
            type: 'text',
            delay: 0.7,
            minDelay: 0.2,
            maxDelay: 1.5,
            duration: 3.5,
            minDuration: 1.8,
            maxDuration: 6.0,
            trigger: 'Auto - Once - Stay',
            entranceAnimation: 'slide-in-left',
            exitAnimation: 'fade-out',
            layout: {
              '1920x1080': { x: 420, y: 940, scale: 1.0, fontSize: 18, align: 'left' },
              '1080x1920': { x: 280, y: 1700, scale: 1.0, fontSize: 18, align: 'left' },
              '1080x1080': { x: 280, y: 920, scale: 0.9, fontSize: 16, align: 'left' },
              '1080x1350': { x: 280, y: 1170, scale: 0.95, fontSize: 18, align: 'left' },
              '2560x1080': { x: 540, y: 940, scale: 1.1, fontSize: 20, align: 'left' }
            }
          }
        ]
      }
    ],
    validationStatus: 'Verified'
  },

  // 3. Product Feature Showcase
  {
    generatorId: 'mggd-gen-product-promo-01',
    generatorTypeId: 'demo-mggd-mot-02',
    name: 'Product Feature Showcase',
    panelVersion: 'M1.0',
    classification: {
      category: 'E-Commerce Promotion',
      subcategory: 'Hardware Product',
      style: 'Clean Commercial',
      mood: 'Sophisticated',
      industry: 'Consumer Tech'
    },
    supportedSizes: ['1920x1080', '1080x1920', '1080x1080', '1080x1350', '2560x1080'],
    defaultSize: '1920x1080',
    currentSize: '1920x1080',
    transparency: false,
    transparentType: 'page-layout',
    loop: false,
    libraries: [
      { name: 'Canvas2D Builtin', keep: true, license: 'W3C Standard', description: 'Deterministic standard browser rendering' }
    ],
    defaultAssets: [
      {
        id: 'asset-prod-1',
        name: 'Hardware Flagship Render',
        url: PRODUCT_IMAGE_SVG,
        license: 'Custom Commercial (Maker Royalty-Free)'
      }
    ],
    properties: {
      headline: 'AURA SPHERE X1',
      subline: 'Precision Acoustic Chamber with Active Resonance',
      tag: 'PRE-ORDER NOW · $299',
      colors: {
        primary: '#f43f5e',
        secondary: '#06b6d4',
        accent: '#fbbf24',
        background: '#0d1117',
        text: '#ffffff',
        subtext: '#94a3b8'
      },
      fontFamily: 'Montserrat',
      imageUrl: PRODUCT_IMAGE_SVG
    },
    scenes: [
      {
        id: 'scene-prod-1',
        name: 'Product Reveal Hero',
        order: 1,
        defaultDuration: 3.5,
        minDuration: 2.0,
        maxDuration: 6.0,
        currentDuration: 3.5,
        required: true,
        background: '#0d1117',
        entrance: 'zoom-in',
        exit: 'fade',
        objects: [
          {
            id: 'obj-prod-img',
            name: 'Device Render',
            type: 'image',
            delay: 0.1,
            minDelay: 0.0,
            maxDelay: 0.8,
            duration: 3.2,
            minDuration: 1.5,
            maxDuration: 5.0,
            trigger: 'Auto - Once - Stay',
            entranceAnimation: 'spring-scale',
            exitAnimation: 'fade-out',
            layout: {
              '1920x1080': { x: 680, y: 540, scale: 1.1, fontSize: 0, align: 'center' },
              '1080x1920': { x: 540, y: 720, scale: 1.2, fontSize: 0, align: 'center' },
              '1080x1080': { x: 540, y: 440, scale: 1.0, fontSize: 0, align: 'center' },
              '1080x1350': { x: 540, y: 520, scale: 1.1, fontSize: 0, align: 'center' },
              '2560x1080': { x: 920, y: 540, scale: 1.1, fontSize: 0, align: 'center' }
            }
          },
          {
            id: 'obj-prod-title',
            name: 'Device Name',
            type: 'text',
            delay: 0.5,
            minDelay: 0.1,
            maxDelay: 1.5,
            duration: 2.8,
            minDuration: 1.2,
            maxDuration: 4.5,
            trigger: 'Auto - Once - Stay',
            entranceAnimation: 'glow-pop',
            exitAnimation: 'fade-out',
            layout: {
              '1920x1080': { x: 1320, y: 480, scale: 1.0, fontSize: 48, align: 'left' },
              '1080x1920': { x: 540, y: 1140, scale: 1.0, fontSize: 46, align: 'center' },
              '1080x1080': { x: 540, y: 760, scale: 1.0, fontSize: 40, align: 'center' },
              '1080x1350': { x: 540, y: 880, scale: 1.0, fontSize: 42, align: 'center' },
              '2560x1080': { x: 1680, y: 480, scale: 1.0, fontSize: 52, align: 'left' }
            }
          }
        ]
      },
      {
        id: 'scene-prod-2',
        name: 'Call To Action & Spec',
        order: 2,
        defaultDuration: 3.0,
        minDuration: 1.5,
        maxDuration: 5.0,
        currentDuration: 3.0,
        required: false,
        background: '#0d1117',
        entrance: 'fade',
        exit: 'fade',
        objects: [
          {
            id: 'obj-prod-cta',
            name: 'Price & CTA Badge',
            type: 'badge',
            delay: 0.2,
            minDelay: 0.0,
            maxDelay: 1.0,
            duration: 2.6,
            minDuration: 1.0,
            maxDuration: 4.0,
            trigger: 'Auto - Once - Stay',
            entranceAnimation: 'spring-scale',
            exitAnimation: 'fade-out',
            layout: {
              '1920x1080': { x: 960, y: 540, scale: 1.0, fontSize: 30, align: 'center' },
              '1080x1920': { x: 540, y: 960, scale: 1.0, fontSize: 32, align: 'center' },
              '1080x1080': { x: 540, y: 540, scale: 1.0, fontSize: 28, align: 'center' },
              '1080x1350': { x: 540, y: 675, scale: 1.0, fontSize: 30, align: 'center' },
              '2560x1080': { x: 1280, y: 540, scale: 1.0, fontSize: 34, align: 'center' }
            }
          }
        ]
      }
    ],
    validationStatus: 'Verified'
  },

  // 4. Kinetic Typography Strobe
  {
    generatorId: 'mggd-gen-kinetic-01',
    generatorTypeId: 'demo-mggd-mot-01',
    name: 'Kinetic Typography Strobe',
    panelVersion: 'M1.0',
    classification: {
      category: 'Kinetic Typography',
      subcategory: 'Strobe Cuts',
      style: 'Fast-Paced Editorial',
      mood: 'High Energy',
      industry: 'Media & Entertainment'
    },
    supportedSizes: ['1920x1080', '1080x1920', '1080x1080', '1080x1350', '2560x1080'],
    defaultSize: '1920x1080',
    currentSize: '1920x1080',
    transparency: false,
    transparentType: 'page-layout',
    loop: true,
    libraries: [
      { name: 'Canvas2D Builtin', keep: true, license: 'W3C Standard', description: 'Deterministic standard browser rendering' }
    ],
    defaultAssets: [],
    properties: {
      headline: 'SPEED IS GRAVITY',
      subline: 'ACCELERATE YOUR DESIGN ENGINE',
      tag: '01 / BREAKTHROUGH',
      colors: {
        primary: '#facc15',
        secondary: '#f43f5e',
        accent: '#ffffff',
        background: '#050508',
        text: '#ffffff',
        subtext: '#94a3b8'
      },
      fontFamily: 'Syne',
      imageUrl: ''
    },
    scenes: [
      {
        id: 'scene-kin-1',
        name: 'Punch Line 1',
        order: 1,
        defaultDuration: 2.2,
        minDuration: 1.2,
        maxDuration: 4.0,
        currentDuration: 2.2,
        required: true,
        background: '#050508',
        entrance: 'strobe',
        exit: 'fade',
        objects: [
          {
            id: 'obj-kin-1',
            name: 'Strobe Words',
            type: 'text',
            delay: 0.1,
            minDelay: 0.0,
            maxDelay: 0.5,
            duration: 2.0,
            minDuration: 1.0,
            maxDuration: 3.5,
            trigger: 'Auto - Once - Stay',
            entranceAnimation: 'glow-pop',
            exitAnimation: 'fade-out',
            layout: {
              '1920x1080': { x: 960, y: 540, scale: 1.0, fontSize: 72, align: 'center' },
              '1080x1920': { x: 540, y: 960, scale: 1.0, fontSize: 64, align: 'center' },
              '1080x1080': { x: 540, y: 540, scale: 1.0, fontSize: 58, align: 'center' },
              '1080x1350': { x: 540, y: 675, scale: 1.0, fontSize: 62, align: 'center' },
              '2560x1080': { x: 1280, y: 540, scale: 1.0, fontSize: 80, align: 'center' }
            }
          }
        ]
      },
      {
        id: 'scene-kin-2',
        name: 'Punch Line 2 & Subtext',
        order: 2,
        defaultDuration: 2.5,
        minDuration: 1.5,
        maxDuration: 4.5,
        currentDuration: 2.5,
        required: false,
        background: '#050508',
        entrance: 'wipe',
        exit: 'fade',
        objects: [
          {
            id: 'obj-kin-2',
            name: 'Secondary Statement',
            type: 'text',
            delay: 0.2,
            minDelay: 0.0,
            maxDelay: 0.8,
            duration: 2.1,
            minDuration: 1.0,
            maxDuration: 3.8,
            trigger: 'Auto - Once - Stay',
            entranceAnimation: 'slide-in-bottom',
            exitAnimation: 'fade-out',
            layout: {
              '1920x1080': { x: 960, y: 540, scale: 1.0, fontSize: 44, align: 'center' },
              '1080x1920': { x: 540, y: 960, scale: 1.0, fontSize: 40, align: 'center' },
              '1080x1080': { x: 540, y: 540, scale: 1.0, fontSize: 36, align: 'center' },
              '1080x1350': { x: 540, y: 675, scale: 1.0, fontSize: 38, align: 'center' },
              '2560x1080': { x: 1280, y: 540, scale: 1.0, fontSize: 48, align: 'center' }
            }
          }
        ]
      }
    ],
    validationStatus: 'Verified'
  },

  // 5. UI Overlay Animation
  {
    generatorId: 'mggd-gen-ui-overlay-01',
    generatorTypeId: 'demo-mggd-mot-03',
    name: 'UI Overlay & Badge Alert',
    panelVersion: 'M1.0',
    classification: {
      category: 'Stream & Broadcast Overlay',
      subcategory: 'Twitch/YouTube HUD',
      style: 'Cyber Neon HUD',
      mood: 'Exciting',
      industry: 'Gaming & Creators'
    },
    supportedSizes: ['1920x1080', '1080x1920', '1080x1080', '1080x1350', '2560x1080'],
    defaultSize: '1920x1080',
    currentSize: '1920x1080',
    transparency: true,
    transparentType: 'ui',
    loop: false,
    libraries: [
      { name: 'Canvas2D Builtin', keep: true, license: 'W3C Standard', description: 'Deterministic standard browser rendering' }
    ],
    defaultAssets: [
      {
        id: 'asset-ui-badge',
        name: 'Cyber HUD Reticle',
        url: LOGO_SVG,
        license: 'Apache 2.0 (Maker UI Pack)'
      }
    ],
    properties: {
      headline: 'NEW SUBSCRIBER!',
      subline: 'VALKYRIE_99 JOINED THE SQUAD',
      tag: 'LEVEL 50 HYPETRAIN',
      colors: {
        primary: '#8b5cf6',
        secondary: '#ec4899',
        accent: '#06b6d4',
        background: 'rgba(17, 24, 39, 0.85)',
        text: '#ffffff',
        subtext: '#c4b5fd'
      },
      fontFamily: 'Righteous',
      imageUrl: LOGO_SVG
    },
    scenes: [
      {
        id: 'scene-ui-1',
        name: 'Alert Popup & Particle HUD',
        order: 1,
        defaultDuration: 3.8,
        minDuration: 2.0,
        maxDuration: 6.0,
        currentDuration: 3.8,
        required: true,
        background: 'transparent',
        entrance: 'spring-scale',
        exit: 'fade',
        objects: [
          {
            id: 'obj-ui-hud',
            name: 'HUD Frame Banner',
            type: 'badge',
            delay: 0.1,
            minDelay: 0.0,
            maxDelay: 0.5,
            duration: 3.5,
            minDuration: 1.8,
            maxDuration: 5.5,
            trigger: 'Auto - Once - Stay',
            entranceAnimation: 'spring-scale',
            exitAnimation: 'shrink',
            layout: {
              '1920x1080': { x: 960, y: 180, scale: 1.0, fontSize: 0, align: 'center' },
              '1080x1920': { x: 540, y: 280, scale: 1.0, fontSize: 0, align: 'center' },
              '1080x1080': { x: 540, y: 180, scale: 0.9, fontSize: 0, align: 'center' },
              '1080x1350': { x: 540, y: 220, scale: 0.95, fontSize: 0, align: 'center' },
              '2560x1080': { x: 1280, y: 180, scale: 1.1, fontSize: 0, align: 'center' }
            }
          },
          {
            id: 'obj-ui-text',
            name: 'Alert Text & Donor',
            type: 'text',
            delay: 0.3,
            minDelay: 0.1,
            maxDelay: 1.0,
            duration: 3.2,
            minDuration: 1.5,
            maxDuration: 5.0,
            trigger: 'Auto - Once - Stay',
            entranceAnimation: 'glow-pop',
            exitAnimation: 'fade-out',
            layout: {
              '1920x1080': { x: 960, y: 180, scale: 1.0, fontSize: 24, align: 'center' },
              '1080x1920': { x: 540, y: 280, scale: 1.0, fontSize: 24, align: 'center' },
              '1080x1080': { x: 540, y: 180, scale: 0.9, fontSize: 22, align: 'center' },
              '1080x1350': { x: 540, y: 220, scale: 0.95, fontSize: 23, align: 'center' },
              '2560x1080': { x: 1280, y: 180, scale: 1.1, fontSize: 26, align: 'center' }
            }
          }
        ]
      }
    ],
    validationStatus: 'Verified'
  }
];

/**
 * Creates a valid generator document for any catalog type from GENERATOR_TYPES
 */
export function createGeneratorFromType(typeDef) {
  const baseId = `mggd-gen-${typeDef.typeId.replace('demo-mggd-', '')}-${Date.now().toString(36)}`;
  return {
    generatorId: baseId,
    generatorTypeId: typeDef.typeId,
    name: typeDef.name,
    panelVersion: 'M1.0',
    classification: {
      category: typeDef.category,
      subcategory: typeDef.subcategory,
      style: typeDef.style,
      mood: typeDef.mood,
      industry: typeDef.industry
    },
    supportedSizes: ['1920x1080', '1080x1920', '1080x1080', '1080x1350', '2560x1080'],
    defaultSize: '1920x1080',
    currentSize: '1920x1080',
    transparency: typeDef.group === 'Lower Third' || typeDef.templateKey === 'ui_overlay',
    transparentType: typeDef.group === 'Lower Third' ? 'overlay' : (typeDef.templateKey === 'ui_overlay' ? 'ui' : 'page-layout'),
    loop: typeDef.templateKey === 'kinetic_type' || typeDef.templateKey === 'logo_reveal',
    libraries: [
      { name: 'Canvas2D Builtin', keep: true, license: 'W3C Standard', description: 'Deterministic standard browser rendering' }
    ],
    defaultAssets: [
      {
        id: `asset-${baseId}-mark`,
        name: `${typeDef.name} Symbol`,
        url: LOGO_SVG,
        license: 'CC-BY-4.0 (Maker Pack)'
      }
    ],
    properties: {
      headline: typeDef.name.toUpperCase(),
      subline: `${typeDef.style} · ${typeDef.mood}`,
      tag: typeDef.category.toUpperCase(),
      colors: {
        primary: '#8b5cf6',
        secondary: '#06b6d4',
        accent: '#facc15',
        background: '#090a10',
        text: '#ffffff',
        subtext: '#94a3b8'
      },
      fontFamily: 'Inter',
      imageUrl: LOGO_SVG
    },
    scenes: [
      {
        id: `scene-${baseId}-1`,
        name: 'Opening Sequence',
        order: 1,
        defaultDuration: 3.0,
        minDuration: 1.5,
        maxDuration: 6.0,
        currentDuration: 3.0,
        required: true,
        background: typeDef.group === 'Lower Third' || typeDef.templateKey === 'ui_overlay' ? 'transparent' : '#090a10',
        entrance: 'zoom-in',
        exit: 'fade',
        objects: [
          {
            id: `obj-${baseId}-1`,
            name: 'Primary Title',
            type: 'text',
            delay: 0.2,
            minDelay: 0.0,
            maxDelay: 1.0,
            duration: 2.6,
            minDuration: 1.2,
            maxDuration: 5.0,
            trigger: 'Auto - Once - Stay',
            entranceAnimation: 'glow-pop',
            exitAnimation: 'fade-out',
            layout: {
              '1920x1080': { x: 960, y: 540, scale: 1.0, fontSize: 44, align: 'center' },
              '1080x1920': { x: 540, y: 960, scale: 1.0, fontSize: 40, align: 'center' },
              '1080x1080': { x: 540, y: 540, scale: 1.0, fontSize: 38, align: 'center' },
              '1080x1350': { x: 540, y: 675, scale: 1.0, fontSize: 40, align: 'center' },
              '2560x1080': { x: 1280, y: 540, scale: 1.0, fontSize: 46, align: 'center' }
            }
          }
        ]
      }
    ],
    validationStatus: 'Verified'
  };
}

// Nuxt 4 configuration for MGGD Motion Studio
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  future: {
    compatibilityVersion: 4
  },
  ssr: false, // SPA Mode for deterministic canvas rendering & frame seeking
  devtools: { enabled: false },
  css: [
    '~/assets/less/mggd.less'
  ],
  vite: {
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true
        }
      }
    }
  },
  app: {
    head: {
      title: 'MGGD Motion Generator Studio',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
        { name: 'description', content: 'Professional MGGD Motion Graphics Generator Studio featuring deterministic frame seeking, Maker/Buyer workflows, live manifests, real PNG and video exports, and compliance validation.' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Anton&family=Archivo+Black&family=Bebas+Neue&family=Cabin:wght@400;600;700&family=Cinzel:wght@600;800&family=DM+Sans:wght@400;600;700&family=Inter:wght@300;400;500;600;700;800&family=Montserrat:wght@400;600;800&family=Oswald:wght@500;700&family=Outfit:wght@400;600;800&family=Playfair+Display:ital,wght@0,600;0,800;1,600&family=Plus+Jakarta+Sans:wght@500;700;800&family=Poppins:wght@400;600;700;800&family=Raleway:wght@400;700;900&family=Righteous&family=Roboto:wght@400;500;700&family=Rubik:wght@500;700;900&family=Space+Grotesk:wght@500;700&family=Syne:wght@700;800&family=Work+Sans:wght@400;600;800&display=swap' }
      ]
    }
  }
});

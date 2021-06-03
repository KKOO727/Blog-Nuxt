import i18nConfig from './i18n.config'

const LOCALES = [{
    code: 'en',
    iso: 'en-US'
  },
  {
    code: 'es',
    iso: 'es-ES'
  }
]
const DEFAULT_LOCALE = 'en'
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'

export default {
  mode: 'universal',
  // subdirectory: '/1/brook',
  ssr: false,
  target: 'server',
  server: {
    port: 3000
  },
  generate: {
    subFolders: false,
    fallback: '404.html',
    exclude: [/admin/],
    dir: 'my-dist'
  },
  env: {
    NODE_ENV: process.env.NODE_ENV,
    baseUrl: process.env.BASE_URL || 'http://localhost:8080',
    VUE_APP_API_ENDPOINT: 'http://localhost:8080/v1',
    VUE_APP_BFF_ENDPOINT: 'http://localhost:8080/bff',
    // baseUrl: process.env.BASE_URL || 'http://45.82.75.51:8080',
    // VUE_APP_API_ENDPOINT: 'http://45.82.75.51:8080/v1',
    // VUE_APP_BFF_ENDPOINT: 'http://45.82.75.51:8080/bff'
  },
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || 'Panama blog',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#0f0' },
  /*
   ** Global CSS
   */
  css: [
    'assets/scss/style.scss'
  ],

  router: {
    linkExactActiveClass: 'active-link',
    scrollBehavior: function(to, from, savedPosition) {
        return { x: 0, y: 0 }
      }
      // base: '/1/brook'
  },
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '~/plugins/vue-awesome-swiper.js',
    '~/plugins/vuejs-paginate.js',
    '~/plugins/vue2-google-maps.js',
    '~/plugins/vue-masonry-css.js',
    '~/plugins/Mixitup.client.js',
    '~/plugins/silentbox.js',
    '~/plugins/customDirective.js',
    { src: '~/plugins/vue-masonry', ssr: false },
    { src: '~/plugins/TiptapElement.js', ssr: false }
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // '@nuxtjs/eslint-module',
    '@nuxtjs/dotenv',
    '@nuxt/typescript-build'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    'nuxt-i18n',
    'bootstrap-vue/nuxt',
    '@nuxtjs/axios',
    '@nuxtjs/style-resources',
    // '@nuxtjs/sitemap',
    '@nuxtjs/google-analytics'
  ],
  styleResources: {
    scss: [
      'assets/scss/default/_variables.scss'
    ]
  },
  i18n: {
    baseUrl: BASE_URL,
    locales: LOCALES,
    defaultLocale: DEFAULT_LOCALE,
    // parsePages: false,
    // pages: i18nConfig.pages,
    // encodePaths: false,
    seo: false,
    vueI18n: {
      fallbackLocale: DEFAULT_LOCALE,
      messages: i18nConfig.messages
    }
  },
  // googleAnalytics: {
  //   id: "{YOUR GOOGLE ANALYTICS ID}",
  //   dev: false
  // },
  /*
   ** Build configuration
   */
  build: {
    extractCSS: true,
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      config.resolve.alias.vue = 'vue/dist/vue.esm.js',
        config.node = {
          fs: 'empty'
        }
    },
    transpile: [/^vue2-google-maps($|\/)/]
  }
}
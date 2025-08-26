// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
   ssr: false,
   app: {
      head: {
         htmlAttrs: {
            lang: "en",
         },
         title: "SWU Nurse",
      },
   },
   devtools: { enabled: true },
   components: false,
   css: ["~/assets/css/main.scss"],
   modules: ["@nuxt/ui", "@pinia/nuxt"],
   runtimeConfig: {
      public: {
         apiBaseUrl: process.env.API_URL,
         version: "0.4.14",
      },
   },
   devServer: {
      host: "0.0.0.0",
   },
   tailwindcss: {
      viewer: false,
   },
   colorMode: {
      preference: "light",
   },
});

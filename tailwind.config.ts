import ColorsCustom from "./utils/color.json";

/** @type {import('tailwindcss').Config} */
export default {
   content: [
      "./components/**/*.{js,vue,ts}",
      "./layouts/**/*.vue",
      "./pages/**/*.vue",
      "./plugins/**/*.{js,ts}",
      "./app.vue",
      "./error.vue",
      "./node_modules/vue-tailwind-datepicker/**/*.js",
   ],
   theme: {
      extend: {
         fontFamily: {
            sarabun: ["Sarabun", "sans-serif"],
            "sarabun-bold": ["SarabunBold", "sans-serif"],
            srinakharinwirot: ["Srinakharinwirot", "sans-serif"],
         },
         colors: {
            grayy: ColorsCustom.gray,
            primaryy: ColorsCustom.primary,
            error: ColorsCustom.error,
            warning: ColorsCustom.warning,
            success: ColorsCustom.success,
         },
         screens: {
            mobile: "400px",
            sm: "640px",
            md: "768px",
            tablet: "850px",
            lg: "1024px",
            fhd: "1920px",
         },
      },
   },
   plugins: [],
};

import defaultTheme from "tailwindcss/defaultTheme";
import forms from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: "class",

    content: [
        "./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
        "./storage/framework/views/*.php",
        "./resources/views/**/*.blade.php",
        "./resources/js/**/*.jsx",
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ["Figtree", ...defaultTheme.fontFamily.sans],
            },
            colors: {
                brand: {
                    25: "#f2f7ff",
                    50: "#ecf3ff",
                    100: "#dde9ff",
                    200: "#c2d6ff",
                    300: "#9cb9ff",
                    400: "#7592ff",
                    500: "#465fff",
                    600: "#3641f5",
                    700: "#2a31d8",
                    800: "#252dae",
                    900: "#262e89",
                    950: "#161950",
                },
                error: {
                    25: "#fffbfa",
                    50: "#fef3f2",
                    100: "#fee4e2",
                    200: "#fecdca",
                    300: "#fda29b",
                    400: "#f97066",
                    500: "#f04438",
                    600: "#d92d20",
                    700: "#b42318",
                    800: "#912018",
                    900: "#7a271a",
                    950: "#55160c",
                },
            },
        },
    },

    plugins: [forms],
};

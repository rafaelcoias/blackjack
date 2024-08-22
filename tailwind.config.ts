import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
      },
      screens: {
        "quatro": '400px',
        "cinco": '500px',
        "seis": '600px',
        "sete": '700px',
        "oito": '800px',
        "nove": '900px',
        "mil": '1000px',
        "milecem": '1100px',
        "miledois": '1200px',
      }
    },
    patterns: {
      opacities: {
        100: "1",
        80: ".80",
        60: ".60",
        40: ".40",
        20: ".20",
        10: ".10",
        5: ".05",
      },
      sizes: {
        1: "0.25rem",
        2: "0.5rem",
        4: "1rem",
        6: "1.5rem",
        8: "2rem",
        16: "4rem",
        20: "5rem",
        24: "6rem",
        32: "8rem",
      }
    }
  },
  plugins: [require('tailwindcss-bg-patterns'),],
} satisfies Config;

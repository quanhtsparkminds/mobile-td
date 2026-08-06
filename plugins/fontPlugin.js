const plugin = require("tailwindcss/plugin");

const fontFamily = "Montserrat";

module.exports = plugin(function ({ addUtilities }) {
  addUtilities({
    ".font-sans": { fontFamily },
  });

  addUtilities({
    ".font-thin": { fontFamily: `${fontFamily}-Thin` },
    ".font-extralight": { fontFamily: `${fontFamily}-ExtraLight` },
    ".font-light": { fontFamily: `${fontFamily}-Light` },
    ".font-normal": { fontFamily: "Montserrat" },
    ".font-medium": { fontFamily: `${fontFamily}-Medium` },
    ".font-semibold": { fontFamily: `${fontFamily}-SemiBold` },
    ".font-bold": { fontFamily: `${fontFamily}-Bold` },
    ".font-extrabold": { fontFamily: `${fontFamily}-ExtraBold` },
    ".font-black": { fontFamily: `${fontFamily}-Black` },
  });
});

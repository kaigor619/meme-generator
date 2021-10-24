import { FONTS } from "types/fonts";

export const addFonts = (fontsNames, callback) => {
  if (fontsNames.length) {
    const head = document.querySelector("head");
    const links = document.querySelectorAll("link[data-font]");

    fontsNames.forEach((value) => {
      const is = [...links].some(
        (node) => node.getAttribute("data-font") === value
      );

      const font = FONTS.find((x) => x.name === value);
      const url = font.url;

      if (!is) {
        const link = document.createElement("link");
        link.setAttribute("data-font", value);
        link.rel = "stylesheet";
        link.href = url;
        head.appendChild(link);
        link.onload = () => {
          document.fonts.load("16px " + font.label).then((d) => {
            callback(fontsNames);
          });
        };
      } else {
        callback(fontsNames);
      }
    });
  }
};

import { FONTS } from "types/fonts";

export const addFonts = (fontsNames, callback) => {
  if (fontsNames.length) {
    let counter = 0;
    const head = document.querySelector("head");
    const links = document.querySelectorAll("link[data-font]");

    fontsNames.forEach((value) => {
      const is = [...links].some(
        (node) => node.getAttribute("data-font") === value
      );

      const url = FONTS.find((x) => x.label === value)?.url;

      if (!is) {
        const link = document.createElement("link");
        link.setAttribute("data-font", value);
        link.rel = "stylesheet";
        link.href = url;
        head.appendChild(link);
        link.onload = () => {
          counter++;

          if (counter === fontsNames.length) {
            callback(fontsNames);
          }
        };
      }
    });
  }
};
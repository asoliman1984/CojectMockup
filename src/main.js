import { initElements, addElement, updateElementList } from "./elements.js";
import { makeDraggableResizable } from "./dragResize.js";
import {
  highlightElement,
  showProperties,
  removeElement,
  exportAsImage,
} from "./properties.js";

(function () {
  var script = document.createElement("script");
  script.src =
    "https://cdn.jsdelivr.net/npm/interactjs@1.10.11/dist/interact.min.js";
  document.head.appendChild(script);

  let elementsArray = [];
  let nextX = 50;
  let nextY = 50;
  const offset = 30;
  let elementTypes = {};

  script.onload = function () {
    fetch("../src/elements.json")
      .then((response) => response.json())
      .then((data) => {
        elementTypes = data;
        initElements(elementTypes, elementsArray, nextX, nextY, offset);

        window.CojectMockup = {
          addElement: (type) =>
            addElement(type, elementsArray, nextX, nextY, offset, elementTypes),
          highlightElement: (id) => highlightElement(id, elementsArray),
          removeElement: (id) => removeElement(id, elementsArray),
          exportAsImage: () => exportAsImage(),
        };

        const addElementButton = document.getElementById("addElementButton");
        const container = document.getElementById("container");

        if (addElementButton) {
          addElementButton.addEventListener("click", () => {
            CojectMockup.addElement("textbox");
          });
        } else {
          console.error("Add Element button not found");
        }

        if (container) {
          container.addEventListener("click", (e) => {
            if (e.target.classList.contains("element-box")) {
              CojectMockup.highlightElement(e.target.id);
            }
          });
        } else {
          console.error("Container not found");
        }
      })
      .catch((error) => {
        console.error("Error fetching element types:", error);
      });
  };
})();

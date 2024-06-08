import { updateElementList } from "./elements.js";

export function highlightElement(id, elementsArray) {
  elementsArray.forEach(function (item) {
    var element = document.getElementById(item.id);
    if (element) {
      if (item.id === id) {
        element.classList.add("highlighted");
        updateProperties(id, elementsArray);
      } else {
        element.classList.remove("highlighted");
      }

      var listItem = document.getElementById("item-" + item.id);
      if (listItem) {
        listItem.style.backgroundColor = item.id === id ? "#f0f0f0" : "";
      }
    }
  });
}

export function showProperties(id, elementsArray) {
  var item = elementsArray.find((item) => item.id === id);
  if (item) {
    const elementX = document.getElementById("elementX");
    const elementY = document.getElementById("elementY");
    const elementWidth = document.getElementById("elementWidth");
    const elementHeight = document.getElementById("elementHeight");

    elementX.value = Math.round(item.x);
    elementY.value = Math.round(item.y);
    elementWidth.value = Math.round(parseFloat(item.element.style.width));
    elementHeight.value = Math.round(parseFloat(item.element.style.height));

    elementX.onchange = () =>
      updateElementPosition(item, "x", elementX.value, elementsArray);
    elementY.onchange = () =>
      updateElementPosition(item, "y", elementY.value, elementsArray);
    elementWidth.onchange = () =>
      updateElementSize(item, "width", elementWidth.value, elementsArray);
    elementHeight.onchange = () =>
      updateElementSize(item, "height", elementHeight.value, elementsArray);

    // Clear existing custom properties
    const customPropertiesContainer =
      document.getElementById("customProperties");
    customPropertiesContainer.innerHTML = "";

    // Add custom properties based on type
    if (item.type === "button") {
      addCustomProperty(
        customPropertiesContainer,
        "Button Text",
        item.element,
        "text",
        item.element.querySelector("text")
      );
      addCustomProperty(
        customPropertiesContainer,
        "Button Color",
        item.element,
        "color",
        item.element.querySelector("rect"),
        "fill"
      );
      addCustomProperty(
        customPropertiesContainer,
        "Text Color",
        item.element,
        "color",
        item.element.querySelector("text"),
        "fill"
      );
    } else if (item.type === "textbox") {
      addCustomProperty(
        customPropertiesContainer,
        "Textbox Text",
        item.element,
        "text",
        item.element.querySelector("text")
      );
    } else if (item.type === "grid") {
      addCustomProperty(
        customPropertiesContainer,
        "Number of Rows",
        item,
        "number",
        item,
        "rows",
        true
      );
      addCustomProperty(
        customPropertiesContainer,
        "Number of Columns",
        item,
        "number",
        item,
        "cols",
        true
      );
      addCustomProperty(
        customPropertiesContainer,
        "Has Header",
        item,
        "checkbox",
        item,
        "hasHeader",
        true
      );
    }

    document.querySelector('#myTab a[href="#properties"]').click();
  }
}

function addCustomProperty(
  container,
  label,
  element,
  type,
  target,
  attribute,
  isGridProperty = false
) {
  const formGroup = document.createElement("div");
  formGroup.className = "form-group";

  const labelElement = document.createElement("label");
  labelElement.innerText = label;

  let inputElement;
  if (type === "text") {
    inputElement = document.createElement("input");
    inputElement.type = "text";
    inputElement.className = "form-control";
    inputElement.value = target.textContent;
    inputElement.oninput = () => (target.textContent = inputElement.value);
  } else if (type === "color") {
    inputElement = document.createElement("input");
    inputElement.type = "color";
    inputElement.className = "form-control";
    inputElement.value = rgbToHex(target.getAttribute(attribute));
    inputElement.oninput = () =>
      target.setAttribute(attribute, inputElement.value);
  } else if (type === "number") {
    inputElement = document.createElement("input");
    inputElement.type = "number";
    inputElement.className = "form-control";
    inputElement.value = target[attribute];
    inputElement.oninput = () =>
      updateGridProperty(
        target,
        attribute,
        parseInt(inputElement.value, 10),
        element,
        isGridProperty
      );
  } else if (type === "checkbox") {
    inputElement = document.createElement("input");
    inputElement.type = "checkbox";
    inputElement.className = "form-control";
    inputElement.checked = target[attribute];
    inputElement.onchange = () =>
      updateGridProperty(
        target,
        attribute,
        inputElement.checked,
        element,
        isGridProperty
      );
  }

  formGroup.appendChild(labelElement);
  formGroup.appendChild(inputElement);
  container.appendChild(formGroup);
}

function updateGridProperty(target, attribute, value, element, isGridProperty) {
  if (isGridProperty) {
    target[attribute] = value;
      const newHTML = generateGridHTML(
          element,
      target.rows,
      target.cols,
      target.hasHeader
    );
    document.getElementById(element.id).innerHTML = newHTML;
    console.log("Element updated:", element);
  } else {
    target[attribute] = value;
  }
}

function generateGridHTML(element,rows, cols, hasHeader, existingHTML = '') {    
    const myDivId = element.id;
    const div = document.getElementById(myDivId);
    let existingTable='';
    if (div) {
        const table = div.querySelector('table');
        existingTable = div.querySelector('table');
        if (table) {
            const thead = table.querySelector('thead');
            const theadHTML = thead ? thead.innerHTML : 'No thead found';
            console.log('Thead content:', theadHTML);
        } else {
            console.error('No table found within the div with ID:', myDivId);
        }
    } else {
        console.error('The specified div ID does not exist.');
    }

    let html = '<table class="table table-bordered">';
    if (hasHeader) {
        html += '<thead><tr>';
        for (let c = 0; c < cols; c++) {
            const headerValue = existingTable && existingTable.tHead && existingTable.tHead.rows[0].cells[c] ? existingTable.tHead.rows[0].cells[c].innerHTML : `Header ${c + 1}`;
            html += `<th contenteditable="true">${headerValue}</th>`;
        }
        html += '</tr></thead>';
    }
    html += '<tbody>';
    for (let r = hasHeader ? 1 : 0; r < rows + (hasHeader ? 0 : -1); r++) {
        html += '<tr>';
        for (let c = 0; c < cols; c++) {
            const cellValue = existingTable && existingTable.tBodies[0].rows[r] && existingTable.tBodies[0].rows[r].cells[c] ? existingTable.tBodies[0].rows[r].cells[c].innerHTML : '';
            html += `<td contenteditable="true">${cellValue}</td>`;
        }
        html += '</tr>';
    }
    html += '</tbody></table>';
    return html;
}

function rgbToHex(rgb) {
  if (!rgb) return "#000000";
  const rgbMatch = rgb.match(/\d+/g);
  if (!rgbMatch) return "#000000";
  const result = rgbMatch.map((x) => parseInt(x).toString(16).padStart(2, "0"));
  return `#${result.join("")}`;
}

function updateElementPosition(item, prop, value, elementsArray) {
  value = parseInt(value, 10);
  if (prop === "x") {
    item.x = value;
  } else if (prop === "y") {
    item.y = value;
  }
  item.element.style.transform = `translate(${item.x}px, ${item.y}px)`;
  updateProperties(item.id, elementsArray);
}

function updateElementSize(item, prop, value, elementsArray) {
  value = parseInt(value, 10);
  if (prop === "width") {
    item.element.style.width = `${value}px`;
  } else if (prop === "height") {
    item.element.style.height = `${value}px`;
  }

  // Update internal SVG elements
  const svg = item.element.querySelector("svg");
  const svgRect = item.element.querySelector("rect");
  const svgText = item.element.querySelector("text");
  const svgArrow = item.element.querySelector("#arrow");
  if (svg && svgRect) {
    svg.setAttribute("width", value);
    svg.setAttribute("height", item.element.style.height);

    svgRect.setAttribute("width", value);
    svgRect.setAttribute("height", item.element.style.height);

    if (svgText) {
      svgText.setAttribute("x", value / 2);
      svgText.setAttribute("y", item.element.style.height / 2);
      svgText.setAttribute("dominant-baseline", "middle");
      svgText.setAttribute("text-anchor", "middle");
    }

    if (svgArrow) {
      svgArrow.setAttribute(
        "points",
        `${value - 20},15 ${value - 10},25 ${value - 20},35`
      );
    }
  }

  updateProperties(item.id, elementsArray);
}

export function updateProperties(id, elementsArray) {
  var item = elementsArray.find((item) => item.id === id);
  if (item) {
    const elementX = document.getElementById("elementX");
    const elementY = document.getElementById("elementY");
    const elementWidth = document.getElementById("elementWidth");
    const elementHeight = document.getElementById("elementHeight");

    if (elementX && elementY && elementWidth && elementHeight) {
      elementX.value = Math.round(item.x);
      elementY.value = Math.round(item.y);
      elementWidth.value = Math.round(parseFloat(item.element.style.width));
      elementHeight.value = Math.round(parseFloat(item.element.style.height));
    }

    // Update grid properties
    if (item.type === "grid") {
      const elementRows = document.getElementById(
        "customProperty-NumberofRows"
      );
      const elementCols = document.getElementById(
        "customProperty-NumberofColumns"
      );
      const elementHasHeader = document.getElementById(
        "customProperty-HasHeader"
      );

      if (elementRows) {
        elementRows.value = item.rows;
        elementRows.onchange = () =>
          updateGridProperty(
            item,
            "rows",
            parseInt(elementRows.value),
            item.element,
            true
          );
      }
      if (elementCols) {
        elementCols.value = item.cols;
        elementCols.onchange = () =>
          updateGridProperty(
            item,
            "cols",
            parseInt(elementCols.value),
            item.element,
            true
          );
      }
      if (elementHasHeader) {
        elementHasHeader.checked = item.hasHeader;
        elementHasHeader.onchange = () =>
          updateGridProperty(
            item,
            "hasHeader",
            elementHasHeader.checked,
            item.element,
            true
          );
      }
    }
  }
}

export function removeElement(id, elementsArray) {
  var item = elementsArray.find((item) => item.id === id);
  if (item && item.element) {
    item.element.parentNode.removeChild(item.element);
    console.log("Element removed from workspace:", id);
  }
  elementsArray = elementsArray.filter(function (item) {
    return item.id !== id;
  });
  console.log("Updated elements array:", elementsArray);
  updateElementList(elementsArray);
}

export function exportAsImage() {
  var container = document.getElementById("container");
  domtoimage
    .toPng(container)
    .then(function (dataUrl) {
      var link = document.createElement("a");
      link.href = dataUrl;
      link.download = "mockup.png";
      link.click();
    })
    .catch(function (error) {
      console.error("oops, something went wrong!", error);
    });
}

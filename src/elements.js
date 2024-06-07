import { makeDraggableResizable } from './dragResize.js';
import { highlightElement, showProperties } from './properties.js';

export function initElements(data, elementsArray, nextX, nextY, offset) {
    // Initialize elements if needed
}

export function addElement(type, elementsArray, nextX, nextY, offset, elementTypes) {
    if (!elementTypes[type]) {
        console.error('Element type not defined:', type);
        return;
    }

    var element = document.createElement('div');
    element.className = 'draggable resizable element-box';
    element.setAttribute('draggable', 'true');
    var id = 'element-' + Date.now();
    element.id = id;

    var initialX = nextX;
    var initialY = nextY;

    if (type === 'grid') {
        element.innerHTML = generateGridHTML(3, 3, true); // Default grid with 3x3 and header
        element.style.width = '300px';
        element.style.height = '200px';
        elementsArray.push({ id: id, type: type, element: element, x: initialX, y: initialY, rows: 3, cols: 3, hasHeader: true });
    } else {
        element.innerHTML = elementTypes[type].innerHTML;
        element.style.width = elementTypes[type].style.width;
        element.style.height = elementTypes[type].style.height;
        elementsArray.push({ id: id, type: type, element: element, x: initialX, y: initialY });
    }

    element.style.transform = `translate(${initialX}px, ${initialY}px)`;
    element.setAttribute('data-x', initialX);
    element.setAttribute('data-y', initialY);

    element.onclick = function() {
        highlightElement(id, elementsArray);
    };

    element.ondblclick = function() {
        showProperties(id, elementsArray);
    };

    document.getElementById('container').appendChild(element);
    console.log("Element added:", { id: id, type: type, x: initialX, y: initialY });
    updateElementList(elementsArray);
    makeDraggableResizable(element, elementsArray);

    nextX += offset;
    nextY += offset;
}

function generateGridHTML(rows, cols, hasHeader) {
    let html = '<table class="table table-bordered">';
    if (hasHeader) {
        html += '<thead><tr>';
        for (let c = 0; c < cols; c++) {
            html += `<th contenteditable="true">Header ${c + 1}</th>`;
        }
        html += '</tr></thead>';
    }
    html += '<tbody>';
    for (let r = 0; r < rows; r++) {
        html += '<tr>';
        for (let c = 0; c < cols; c++) {
            html += '<td contenteditable="true"></td>';
        }
        html += '</tr>';
    }
    html += '</tbody></table>';
    return html;
}

export function updateElementList(elementsArray) {
    var elementList = document.getElementById('elements');
    elementList.innerHTML = '';
    elementsArray.forEach(function(item) {
        var listItem = document.createElement('div');
        listItem.className = 'element-list-item';
        listItem.id = 'item-' + item.id;
        listItem.innerHTML = '<span onclick="CojectMockup.highlightElement(\'' + item.id + '\')">' + item.type + '</span> <button class="btn btn-danger btn-sm ml-2 delete-button" onclick="CojectMockup.removeElement(\'' + item.id + '\')">Delete</button>';
        elementList.appendChild(listItem);
        console.log("Element listed:", { id: item.id, type: item.type });
    });
}

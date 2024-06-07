
(function() {
    var script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/npm/interactjs@1.10.11/dist/interact.min.js";
    document.head.appendChild(script);

    let elementsArray = [];
    let nextX = 50;
    let nextY = 50;
    const offset = 30;
    let elementTypes = {};

    script.onload = function() {
        fetch('../src/elements.json')
            .then(response => response.json())
            .then(data => {
                elementTypes = data;
                init();
            });

        function init() {
            function addElement(type) {
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

                element.innerHTML = elementTypes[type].innerHTML;
                element.style.width = elementTypes[type].style.width;
                element.style.height = elementTypes[type].style.height;

                element.style.transform = `translate(${initialX}px, ${initialY}px)`;
                element.setAttribute('data-x', initialX);
                element.setAttribute('data-y', initialY);

                element.onclick = function() {
                    highlightElement(id);
                };

                document.getElementById('container').appendChild(element);
                elementsArray.push({ id: id, type: type, element: element, x: initialX, y: initialY });
                console.log("Element added:", { id: id, type: type, x: initialX, y: initialY });
                updateElementList();
                makeDraggableResizable(element);
                highlightElement(id);

                nextX += offset;
                nextY += offset;
            }

            function makeDraggableResizable(element) {
                interact(element)
                    .draggable({
                        listeners: {
                            move(event) {
                                var target = event.target;
                                var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                                var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

                                target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
                                target.setAttribute('data-x', x);
                                target.setAttribute('data-y', y);

                                var elementId = target.id;
                                var elementData = elementsArray.find(item => item.id === elementId);
                                if (elementData) {
                                    elementData.x = x;
                                    elementData.y = y;
                                }
                            }
                        }
                    })
                    .resizable({
                        edges: { left: true, right: true, bottom: true, top: true },
                        listeners: {
                            move(event) {
                                var target = event.target;
                                var x = (parseFloat(target.getAttribute('data-x')) || 0);
                                var y = (parseFloat(target.getAttribute('data-y')) || 0);

                                var type = target.querySelector('svg text') ? target.querySelector('svg text').textContent.trim() : '';

                                if (type === 'Checkbox') {
                                    var svgRect = target.querySelector('rect');
                                    var svgText = target.querySelector('text');

                                    var width = parseFloat(svgRect.getAttribute('width'));
                                    var height = parseFloat(svgRect.getAttribute('height'));

                                    var newWidth = width;
                                    var newHeight = height;

                                    target.style.width = `${newWidth}px`;
                                    target.style.height = `${newHeight}px`;

                                    var newX = (parseFloat(target.getAttribute('data-x')) || 0) + event.deltaRect.left;
                                    var newY = (parseFloat(target.getAttribute('data-y')) || 0) + event.deltaRect.top;

                                    target.style.transform = `translate(${newX}px, ${newY}px)`;
                                    target.setAttribute('data-x', newX);
                                    target.setAttribute('data-y', newY);
                                } else {
                                    target.style.width = event.rect.width + 'px';
                                    target.style.height = event.rect.height + 'px';

                                    var svg = target.querySelector('svg');
                                    var svgRect = target.querySelector('rect');
                                    var svgText = target.querySelector('text');
                                    var svgArrow = target.querySelector('#arrow');
                                    if (svg && svgRect) {
                                        svg.setAttribute('width', event.rect.width);
                                        svg.setAttribute('height', event.rect.height);
                                        svgRect.setAttribute('width', event.rect.width);
                                        svgRect.setAttribute('height', event.rect.height);

                                        if (svgText) {
                                            if (target.querySelector('text') && target.querySelector('text').innerHTML === 'Button') {
                                                svgText.setAttribute('x', event.rect.width / 2);
                                                svgText.setAttribute('y', event.rect.height / 2);
                                            } else if (target.querySelector('text')) {
                                                svgText.setAttribute('x', 10);
                                                svgText.setAttribute('y', 20);
                                            }
                                        }

                                        if (svgArrow) {
                                            svgArrow.setAttribute('points', `${event.rect.width - 20},15 ${event.rect.width - 10},25 ${event.rect.width - 20},35`);
                                        }
                                    }

                                    x += event.deltaRect.left;
                                    y += event.deltaRect.top;

                                    target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
                                    target.setAttribute('data-x', x);
                                    target.setAttribute('data-y', y);

                                    var elementId = target.id;
                                    var elementData = elementsArray.find(item => item.id === elementId);
                                    if (elementData) {
                                        elementData.x = x;
                                        elementData.y = y;
                                    }
                                }
                            }
                        }
                    });
            }

            function updateElementList() {
                var elementList = document.getElementById('elements');
                elementList.innerHTML = '';
                elementsArray.forEach(function(item) {
                    var listItem = document.createElement('div');
                    listItem.className = 'element-list-item';
                    listItem.id = 'item-' + item.id;
                    listItem.innerHTML = '<span onclick="CojectMockup.highlightElement(' + item.id + ')">' + item.type + '</span> <button class="btn btn-danger btn-sm ml-2 delete-button" onclick="CojectMockup.removeElement(' + item.id + ')">Delete</button>';
                    elementList.appendChild(listItem);
                    console.log("Element listed:", { id: item.id, type: item.type });
                });
            }

            function highlightElement(id) {
                elementsArray.forEach(function(item) {
                    var element = document.getElementById(item.id);
                    if (item.id === id) {
                        element.classList.add('highlighted');
                    } else {
                        element.classList.remove('highlighted');
                    }

                    var listItem = document.getElementById('item-' + item.id);
                    if (listItem) {
                        listItem.style.backgroundColor = item.id === id ? '#f0f0f0' : '';
                    }
                });
            }

            function removeElement(id) {
                var item = elementsArray.find(item => item.id === id);
                if (item && item.element) {
                    item.element.parentNode.removeChild(item.element);
                    console.log("Element removed from workspace:", id);
                }
                elementsArray = elementsArray.filter(function(item) {
                    return item.id !== id;
                });
                console.log("Updated elements array:", elementsArray);
                updateElementList();
            }

            window.CojectMockup = {
                addElement: addElement,
                makeDraggableResizable: makeDraggableResizable,
                removeElement: removeElement,
                highlightElement: highlightElement
            };
        }
    };
})();

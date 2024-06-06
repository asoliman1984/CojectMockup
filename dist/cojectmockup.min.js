(function() {
    var script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/npm/interactjs@1.10.11/dist/interact.min.js";
    document.head.appendChild(script);

    let elementsArray = [];

    script.onload = function() {
        function addElement(type) {
            var element = document.createElement('div');
            element.className = 'draggable resizable element-box';
            element.setAttribute('draggable', 'true');
            var id = 'element-' + Date.now();
            element.id = id;

            if (type === 'textbox') {
                element.innerHTML = '<svg width="200" height="50" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="50" fill="white" stroke="black"/><text x="10" y="20" font-size="16" fill="grey" alignment-baseline="hanging">Textbox</text></svg>';
            } else if (type === 'button') {
                element.innerHTML = '<svg width="100" height="50" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="50" fill="lightgrey" stroke="black"/><text x="50" y="25" font-size="16" text-anchor="middle" alignment-baseline="middle" fill="black">Button</text></svg>';
            } else if (type === 'dropdown') {
                element.innerHTML = '<svg width="200" height="50" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="50" fill="white" stroke="black"/><polygon id="arrow" points="180,15 190,25 180,35" fill="black"/><text x="10" y="20" font-size="16" fill="grey" alignment-baseline="hanging">Option 1</text></svg>';
            }

            element.onclick = function() {
                highlightElement(id);
            };

            document.getElementById('container').appendChild(element);
            elementsArray.push({ id: id, type: type });
            console.log("Element added:", { id: id, type: type });
            updateElementList();
            makeDraggableResizable(element);
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
                                    if (target.querySelector('text').innerHTML === 'Button') {
                                        svgText.setAttribute('x', event.rect.width / 2);
                                        svgText.setAttribute('y', event.rect.height / 2);
                                    } else {
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
                        }
                    }
                });
        }

        function updateElementList() {
            var elementList = document.getElementById('elements');
            elementList.innerHTML = '';
            elementsArray.forEach(function(item) {
                var listItem = document.createElement('div');
                listItem.className = 'element-item';
                listItem.id = 'item-' + item.id;
                listItem.innerHTML = '<span>' + item.type + '</span> <button class="btn btn-danger btn-sm ml-2" onclick="CojectMockup.removeElement(\'' + item.id + '\')">Delete</button>';
                elementList.appendChild(listItem);
                console.log("Element listed:", { id: item.id, type: item.type });
            });
        }

        function highlightElement(id) {
            elementsArray.forEach(function(item) {
                var listItem = document.getElementById('item-' + item.id);
                if (listItem) {
                    listItem.style.backgroundColor = item.id === id ? '#f0f0f0' : '';
                }
            });
        }

        function removeElement(id) {
            var element = document.getElementById(id);
            if (element) {
                element.parentNode.removeChild(element);
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
            removeElement: removeElement
        };
    };
})();

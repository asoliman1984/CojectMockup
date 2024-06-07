import { updateProperties } from './properties.js';

export function makeDraggableResizable(element, elementsArray) {
    interact(element)
        .draggable({
            listeners: {
                move(event) {
                    var target = event.target;
                    var x = Math.round((parseFloat(target.getAttribute('data-x')) || 0) + event.dx);
                    var y = Math.round((parseFloat(target.getAttribute('data-y')) || 0) + event.dy);

                    target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
                    target.setAttribute('data-x', x);
                    target.setAttribute('data-y', y);

                    var elementId = target.id;
                    var elementData = elementsArray.find(item => item.id === elementId);
                    if (elementData) {
                        elementData.x = x;
                        elementData.y = y;
                    }

                    updateProperties(elementId, elementsArray);
                }
            }
        })
        .resizable({
            edges: { left: true, right: true, bottom: true, top: true },
            listeners: {
                move(event) {
                    var target = event.target;
                    var x = Math.round(parseFloat(target.getAttribute('data-x')) || 0);
                    var y = Math.round(parseFloat(target.getAttribute('data-y')) || 0);

                    var type = target.querySelector('svg text') ? target.querySelector('svg text').textContent.trim() : '';

                    if (type === 'Checkbox') {
                        var svgRect = target.querySelector('rect');
                        var svgText = target.querySelector('text');

                        var width = Math.round(parseFloat(svgRect.getAttribute('width')));
                        var height = Math.round(parseFloat(svgRect.getAttribute('height')));

                        var newWidth = width;
                        var newHeight = height;

                        target.style.width = `${newWidth}px`;
                        target.style.height = `${newHeight}px`;

                        var newX = Math.round((parseFloat(target.getAttribute('data-x')) || 0) + event.deltaRect.left);
                        var newY = Math.round((parseFloat(target.getAttribute('data-y')) || 0) + event.deltaRect.top);

                        target.style.transform = `translate(${newX}px, ${newY}px)`;
                        target.setAttribute('data-x', newX);
                        target.setAttribute('data-y', newY);
                    } else {
                        target.style.width = Math.round(event.rect.width) + 'px';
                        target.style.height = Math.round(event.rect.height) + 'px';

                        var svg = target.querySelector('svg');
                        var svgRect = target.querySelector('rect');
                        var svgText = target.querySelector('text');
                        var svgArrow = target.querySelector('#arrow');
                        if (svg && svgRect) {
                            svg.setAttribute('width', Math.round(event.rect.width));
                            svg.setAttribute('height', Math.round(event.rect.height));
                            svgRect.setAttribute('width', Math.round(event.rect.width));
                            svgRect.setAttribute('height', Math.round(event.rect.height));

                            if (svgText) {
                                svgText.setAttribute('x', Math.round(event.rect.width / 2));
                                svgText.setAttribute('y', Math.round(event.rect.height / 2));
                            }

                            if (svgArrow) {
                                svgArrow.setAttribute('points', `${Math.round(event.rect.width - 20)},15 ${Math.round(event.rect.width - 10)},25 ${Math.round(event.rect.width - 20)},35`);
                            }
                        }

                        x += event.deltaRect.left;
                        y += event.deltaRect.top;

                        target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
                        target.setAttribute('data-x', Math.round(x));
                        target.setAttribute('data-y', Math.round(y));

                        var elementId = target.id;
                        var elementData = elementsArray.find(item => item.id === elementId);
                        if (elementData) {
                            elementData.x = Math.round(x);
                            elementData.y = Math.round(y);
                        }
                    }

                    updateProperties(target.id, elementsArray);
                }
            }
        });
}

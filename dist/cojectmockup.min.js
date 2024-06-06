(function() {
    // Add Interact.js from CDN
    var script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/npm/interactjs@1.10.11/dist/interact.min.js";
    document.head.appendChild(script);

    // Wait for Interact.js to load
    script.onload = function() {
        function addElement(type) {
            var element = document.createElement('div');
            element.className = 'draggable';
            element.setAttribute('draggable', 'true');
            var id = 'element-' + Date.now();
            element.id = id;

            var deleteButton = document.createElement('button');
            deleteButton.className = 'delete-button';
            deleteButton.innerHTML = 'X';
            deleteButton.onclick = function() {
                removeElement(id);
            };
            element.appendChild(deleteButton);

            if (type === 'textbox') {
                element.innerHTML += '<input type="text" placeholder="Textbox" class="form-control">';
            } else if (type === 'button') {
                element.innerHTML += '<button class="btn btn-secondary">Button</button>';
            } else if (type === 'dropdown') {
                element.innerHTML += '<select class="form-control"><option>Option 1</option><option>Option 2</option></select>';
            }

            document.getElementById('container').appendChild(element);
            addElementToList(id, type);  // تأكد من استدعاء هذه الوظيفة هنا
            makeDraggable(element);
        }

        function makeDraggable(element) {
            interact(element)
                .draggable({
                    listeners: {
                        move(event) {
                            var target = event.target;
                            var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                            var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

                            // Ensure the element stays within the container
                            var container = document.getElementById('container');
                            var containerRect = container.getBoundingClientRect();
                            var elementRect = target.getBoundingClientRect();

                            if (elementRect.left + event.dx < containerRect.left || 
                                elementRect.right + event.dx > containerRect.right ||
                                elementRect.top + event.dy < containerRect.top || 
                                elementRect.bottom + event.dy > containerRect.bottom) {
                                return;
                            }

                            target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';

                            target.setAttribute('data-x', x);
                            target.setAttribute('data-y', y);
                        }
                    }
                });
        }

        function addElementToList(id, type) {
            var elementList = document.getElementById('elements');
            var item = document.createElement('div');
            item.className = 'element-item';
            item.id = 'item-' + id;
            item.innerHTML = '<span>' + type + '</span>';
            elementList.appendChild(item);
        }

        function removeElement(id) {
            var element = document.getElementById(id);
            if (element) {
                element.parentNode.removeChild(element);
            }
            var listItem = document.getElementById('item-' + id);
            if (listItem) {
                listItem.parentNode.removeChild(listItem);
            }
        }

        window.CojectMockup = {
            addElement: addElement,
            makeDraggable: makeDraggable,
            removeElement: removeElement
        };
    };
})();

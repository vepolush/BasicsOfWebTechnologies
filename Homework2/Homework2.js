document.addEventListener('DOMContentLoaded', function () {
    const addButton = document.getElementById('add-button');
    const itemNameInput = document.getElementById('item-name');
    const shoppingList = document.querySelector('.shopping-list');


    function addItem() {
        const itemName = itemNameInput.value.trim();
        if (itemName === '') return;

        const newItem = document.createElement('div');
        newItem.className = 'item';
        newItem.innerHTML = `
            <div class="item-name">${itemName}</div>
            <div class="quantity-controls">
                <button class="quantity-button decrement" data-tooltip="Неможливо зменшити кількість" style="background-color: #f99090;">-</button>
                <span class="quantity"><b>1</b></span>
                <button class="quantity-button increment" data-tooltip="Збільшити кількість">+</button>
            </div>
            <button class="bought-button" data-tooltip="Товар куплено"><b>Куплено</b></button>
            <button class="delete-button" style="margin-right: 2%;" data-tooltip="Видалити">✖</button>
        `;

        newItem.querySelector('.decrement').addEventListener('click', decrementQuantity);
        newItem.querySelector('.increment').addEventListener('click', incrementQuantity);
        newItem.querySelector('.bought-button').addEventListener('click', markAsBought);
        newItem.querySelector('.delete-button').addEventListener('click', deleteItem);
        newItem.querySelector('.item-name').addEventListener('click', editItemName);

        shoppingList.appendChild(newItem);

        
        itemNameInput.value = '';
        itemNameInput.focus();

        
        updateSummary();
    }

    
    function decrementQuantity(event) {
        const quantitySpan = event.target.nextElementSibling;
        let quantity = parseInt(quantitySpan.textContent);
        if (quantity > 1) {
            quantitySpan.innerHTML = `<b>${quantity - 1}</b>`;
            if (quantity - 1 === 1) {
                event.target.style.backgroundColor = '#f99090'; 
                event.target.setAttribute('data-tooltip', 'Неможливо зменшити кількість');
            }
            updateSummary();
        }
    }

    
    function incrementQuantity(event) {
        const quantitySpan = event.target.previousElementSibling;
        let quantity = parseInt(quantitySpan.textContent);
        quantitySpan.innerHTML = `<b>${quantity + 1}</b>`;
        const decrementButton = event.target.previousElementSibling.previousElementSibling;
        
        if (quantity + 1 > 1) {
            decrementButton.style.backgroundColor = '#dc3545'; 
            decrementButton.setAttribute('data-tooltip', 'Зменшити кількість');
        }
        updateSummary();
    }

    
    function markAsBought(event) {
        const itemDiv = event.target.closest('.item, .item3');
        const itemNameDiv = itemDiv.querySelector('.item-name');
        const itemNameText = itemNameDiv.querySelector('input') ? itemNameDiv.querySelector('input').value : itemNameDiv.textContent;
        const quantityControls = itemDiv.querySelector('.quantity-controls');
        const deleteButton = itemDiv.querySelector('.delete-button');
        const decrementButton = itemDiv.querySelector('.quantity-button.decrement');
        const incrementButton = itemDiv.querySelector('.quantity-button.increment');
        const quantity = itemDiv.querySelector('.quantity');
        const isBought = itemNameDiv.querySelector('s') === null;

        if (isBought) {
            itemNameDiv.innerHTML = `<s>${itemNameText}</s>`;
            event.target.innerHTML = `<b>Не куплено</b>`;
            deleteButton.style.display = 'none';
            decrementButton.style.display = 'none';
            incrementButton.style.display = 'none';
            
        } else {
            itemNameDiv.innerHTML = itemNameText.replace(/<s>|<\/s>/g, '').trim();
            event.target.innerHTML = `<b>Куплено</b>`;
            deleteButton.style.display = 'inline';
            decrementButton.style.display = 'inline';
            incrementButton.style.display = 'inline';
    
        }
        updateSummary();
    }

    
    function deleteItem(event) {
        const itemDiv = event.target.closest('.item, .item3');
        itemDiv.remove();
        updateSummary();
    }

    
    function editItemName(event) {
        const itemNameDiv = event.target;
        const itemName = itemNameDiv.textContent.trim();
        const inputField = document.createElement('input');
        inputField.type = 'text';
        inputField.value = itemName;
        inputField.classList.add('item-input');

    
        itemNameDiv.replaceWith(inputField);

        
        inputField.focus();

        
        inputField.addEventListener('blur', () => {
            const newItemName = inputField.value.trim();
            const newSpan = document.createElement('div');
            newSpan.className = 'item-name';
            newSpan.textContent = newItemName;
            newSpan.addEventListener('click', editItemName); 
            inputField.replaceWith(newSpan);
            updateSummary();
        });
    }

   
function updateSummary() {
    const remainingList = document.querySelector('.remaining-list');
    const boughtList = document.querySelector('.bought-list');

   
    remainingList.innerHTML = '<h2>Залишилося:</h2>';
    boughtList.innerHTML = '<h2>Куплено:</h2>';

    
    const items = document.querySelectorAll('.item, .item3');

    
    items.forEach(item => {
        const itemNameDiv = item.querySelector('.item-name');
        const itemName = itemNameDiv.querySelector('input') ? itemNameDiv.querySelector('input').value : itemNameDiv.textContent;
        const quantity = parseInt(item.querySelector('.quantity').textContent);
        const isBought = itemNameDiv.querySelector('s') !== null;

        
        const summaryItem = document.createElement('div');
        summaryItem.className = 'summary-item';
        summaryItem.innerHTML = `
            <span class="summary-name">${isBought ? '<s>' : ''}<b>${itemName}</b>${isBought ? '</s>' : ''}</span>
            <span class="badge">${isBought ? '<s>' : ''}${quantity}${isBought ? '</s>' : ''}</span>
        `;

        
        if (isBought) {
            boughtList.appendChild(summaryItem);
        } else {
            remainingList.appendChild(summaryItem);
        }
    });
}


    
    addButton.addEventListener('click', addItem);

    
    itemNameInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            addItem();
        }
    });

    
    document.querySelectorAll('.decrement').forEach(button => button.addEventListener('click', decrementQuantity));
    document.querySelectorAll('.increment').forEach(button => button.addEventListener('click', incrementQuantity));
    document.querySelectorAll('.bought-button').forEach(button => button.addEventListener('click', markAsBought));
    document.querySelectorAll('.delete-button').forEach(button => button.addEventListener('click', deleteItem));
    document.querySelectorAll('.item-name').forEach(item => item.addEventListener('click', editItemName));

   
    updateSummary();
});

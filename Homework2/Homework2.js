document.addEventListener('DOMContentLoaded', function () {
    const addButton = document.getElementById('add-button'); // Кнопка додавання 
    const itemNameInput = document.getElementById('item-name'); // Поле введення імені товару
    const shoppingList = document.querySelector('.shopping-list'); 

    function addItem() { // Функція додавання товару
        const itemName = itemNameInput.value.trim();
        if (itemName === '') return; // Якщо ім'я товару пусте, не додаємо нічого

        const newItem = document.createElement('div'); // Створення нового елементу товару
        newItem.className = 'item';
        newItem.innerHTML = `
            <div class="item-name">${itemName}</div>
            <div class="quantity-controls">
                <button class="quantity-button decrement" data-tooltip="Неможливо зменшити кількість" style="background-color: #f99090;">-</button>
                <span class="quantity"><b>1</b></span>
                <button class="quantity-button increment" data-tooltip="Збільшити кількість">+</button>
            </div>
            <button class="bought-button" data-tooltip="Товар куплено"><b>Не куплено</b></button>
            <button class="delete-button" data-tooltip="Видалити">✖</button>
        `;

        newItem.querySelector('.decrement').addEventListener('click', decrementQuantity);
        newItem.querySelector('.increment').addEventListener('click', incrementQuantity);
        newItem.querySelector('.bought-button').addEventListener('click', markAsBought);
        newItem.querySelector('.delete-button').addEventListener('click', deleteItem);
        newItem.querySelector('.item-name').addEventListener('click', editItemName);

        shoppingList.appendChild(newItem); // Додаємо новий товар у список покупок

        itemNameInput.value = '';
        itemNameInput.focus();

        updateSummary();
    }

    function decrementQuantity(event) { // Функція зменшення кількості товару
        const quantitySpan = event.target.nextElementSibling; // Отримуємо елемент зі значенням кількості
        let quantity = parseInt(quantitySpan.textContent); // Перетворюємо кількість на число
        if (quantity > 1) { // Якщо кількість більше 1
            quantitySpan.innerHTML = `<b>${quantity - 1}</b>`; // Зменшуємо кількість на 1
            if (quantity - 1 === 1) { // Якщо нова кількість дорівнює 1
                event.target.style.backgroundColor = '#f99090'; // Змінюємо колір кнопки на світло-червоний
                event.target.setAttribute('data-tooltip', 'Неможливо зменшити кількість'); // Змінюємо підказку
            }
            updateSummary();
        }
    }

    function incrementQuantity(event) { // Функція збільшення кількості товару
        const quantitySpan = event.target.previousElementSibling; // Отримуємо елемент зі значенням кількості
        let quantity = parseInt(quantitySpan.textContent); // Перетворюємо кількість на число
        quantitySpan.innerHTML = `<b>${quantity + 1}</b>`; // Збільшуємо кількість на 1
        const decrementButton = event.target.previousElementSibling.previousElementSibling; // Отримуємо кнопку зменшення кількості


        if (quantity + 1 > 1) { // Якщо нова кількість більше 1
            decrementButton.style.backgroundColor = '#dc3545'; // Змінюємо колір кнопки на червоний
            decrementButton.setAttribute('data-tooltip', 'Зменшити кількість'); // Змінюємо підказку
        }
        updateSummary();
    }

    function markAsBought(event) { // Функція позначення товару як купленого
        const itemDiv = event.target.closest('.item, .item3'); // Батьківський елемент товару
        const itemNameDiv = itemDiv.querySelector('.item-name'); // Елемент з ім'ям товару
        const itemNameText = itemNameDiv.querySelector('input') ? itemNameDiv.querySelector('input').value : itemNameDiv.textContent; // Текст імені товару
        const quantityControls = itemDiv.querySelector('.quantity-controls'); // Керування кількістю
        const deleteButton = itemDiv.querySelector('.delete-button'); // Кнопка видалення 
        const decrementButton = itemDiv.querySelector('.quantity-button.decrement'); // Кнопка зменшення кількості
        const incrementButton = itemDiv.querySelector('.quantity-button.increment'); // Кнопка збільшення кількості
        const quantity = itemDiv.querySelector('.quantity'); // Елемент зі значенням кількості
        const isBought = itemNameDiv.querySelector('s') === null; // Перевіряємо, чи товар вже куплено
 
        if (isBought) { // Якщо товар ще не куплено
            itemNameDiv.innerHTML = `<s>${itemNameText}</s>`; // Додаємо текстову позначку купленого товару
            event.target.innerHTML = `<b>Куплено</b>`; // Змінюємо текст кнопки
            deleteButton.style.visibility = 'hidden'; // Приховуємо кнопку видалення
            decrementButton.style.visibility = 'hidden'; // Приховуємо кнопку зменшення кількості
            incrementButton.style.visibility = 'hidden'; // Приховуємо кнопку збільшення кількості
            quantity.style.textDecoration = 'line-through'; // Додаємо лінію через кількість
        } else { // Якщо товар вже куплено
            itemNameDiv.innerHTML = itemNameText.replace(/<s>|<\/s>/g, '').trim(); // Видаляємо текстову позначку купленого товару
            event.target.innerHTML = `<b>Не куплено</b>`; // Змінюємо текст кнопки
            deleteButton.style.visibility = 'visible'; // Показуємо кнопку видалення
            decrementButton.style.visibility = 'visible'; // Показуємо кнопку зменшення кількості
            incrementButton.style.visibility = 'visible'; // Показуємо кнопку збільшення кількості
            quantity.style.textDecoration = 'none'; // Видаляємо лінію через кількість
        }
        updateSummary(); 
    }

    function deleteItem(event) { // Функція видалення товару
        const itemDiv = event.target.closest('.item, .item3'); // Отримуємо батьківський елемент товару
        itemDiv.remove(); // Видаляємо елемент товару
        updateSummary(); 
    }

    function editItemName(event) { // Функція редагування імені товару
        const itemNameDiv = event.target; // Отримуємо елемент з ім'ям товару
        const itemName = itemNameDiv.textContent.trim();
        const inputField = document.createElement('input'); // Створюємо поле введення
        inputField.type = 'text'; // Встановлюємо тип поля введення
        inputField.value = itemName; // Встановлюємо значення поля введення
        inputField.classList.add('item-input'); // Додаємо клас до поля введення

        itemNameDiv.replaceWith(inputField); // Заміщуємо текстове ім'я на поле введення

        inputField.focus(); // Фокусуємо поле введення

        inputField.addEventListener('blur', () => { // Додаємо обробник події при втраті фокусу
            const newItemName = inputField.value.trim(); // Отримуємо нове значення імені товару
            const newSpan = document.createElement('div'); // Створюємо новий елемент для імені товару
            newSpan.className = 'item-name'; // Додаємо клас до нового елементу
            newSpan.textContent = newItemName; // Встановлюємо текст нового елементу
            newSpan.addEventListener('click', editItemName); // Додаємо обробник події для редагування імені
            inputField.replaceWith(newSpan); // Заміщуємо поле введення на текстовий елемент
            updateSummary(); // Оновлюємо зведення
        });
    }

    function updateSummary() { // Функція оновлення зведення
        const remainingList = document.querySelector('.remaining-list'); // Отримуємо список залишених товарів
        const boughtList = document.querySelector('.bought-list'); // Отримуємо список куплених товарів

        remainingList.innerHTML = '<h2>Залишилося:</h2>'; // Очищуємо список залишених товарів та додаємо заголовок
        boughtList.innerHTML = '<h2>Куплено:</h2>'; // Очищуємо список куплених товарів та додаємо заголовок

        const items = document.querySelectorAll('.item, .item3'); // Отримуємо всі елементи товарів

        items.forEach(item => { // Перебираємо всі елементи товарів
            const itemNameDiv = item.querySelector('.item-name'); // Отримуємо елемент з ім'ям товару
            const itemName = itemNameDiv.querySelector('input') ? itemNameDiv.querySelector('input').value : itemNameDiv.textContent; // Отримуємо текст імені товару
            const quantity = parseInt(item.querySelector('.quantity').textContent); // Отримуємо значення кількості товару
            const isBought = itemNameDiv.querySelector('s') !== null; // Перевіряємо, чи товар куплено

            const summaryItem = document.createElement('div'); // Створюємо новий елемент для зведення
            summaryItem.className = 'summary-item'; // Додаємо клас до нового елементу
            summaryItem.innerHTML = ` 
                <span class="summary-name">${isBought ? '<s>' : ''}<b>${itemName}</b>${isBought ? '</s>' : ''}</span> 
                <span class="badge">${isBought ? '<s>' : ''}${quantity}${isBought ? '</s>' : ''}</span> 
            `;

            if (isBought) { // Якщо товар куплено
                boughtList.appendChild(summaryItem); // Додаємо елемент в список куплених товарів
            } else { // Якщо товар не куплено
                remainingList.appendChild(summaryItem); // Додаємо елемент в список залишених товарів
            }
        });
    }

    addButton.addEventListener('click', addItem); // Додаємо обробник події для кнопки додавання товару

    itemNameInput.addEventListener('keypress', function (e) { // Додаємо обробник події для натискання клавіші в полі введення імені товару
        if (e.key === 'Enter') { // Якщо натиснута клавіша 'Enter'
            addItem(); // Додаємо товар
        }
    });

    document.querySelectorAll('.decrement').forEach(button => button.addEventListener('click', decrementQuantity)); // Додаємо обробники подій для всіх кнопок зменшення кількості
    document.querySelectorAll('.increment').forEach(button => button.addEventListener('click', incrementQuantity)); // Додаємо обробники подій для всіх кнопок збільшення кількості
    document.querySelectorAll('.bought-button').forEach(button => button.addEventListener('click', markAsBought)); // Додаємо обробники подій для всіх кнопок позначення товару як купленого
    document.querySelectorAll('.delete-button').forEach(button => button.addEventListener('click', deleteItem)); // Додаємо обробники подій для всіх кнопок видалення товару
    document.querySelectorAll('.item-name').forEach(item => item.addEventListener('click', editItemName)); // Додаємо обробники подій для всіх елементів імен товарів

    updateSummary(); // Оновлюємо зведення при завантаженні сторінки
});

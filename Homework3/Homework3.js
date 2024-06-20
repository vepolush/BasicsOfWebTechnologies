// Додаємо слухача подій, щоб почекати завантаження документа
document.addEventListener("DOMContentLoaded", function() {
    // Додаємо обробник подій для очищення всіх замовлень
    document.querySelector(".clear-order").addEventListener("click", clearOrders);

    // Додаємо обробник подій для збільшення кількості замовлених товарів
    document.querySelectorAll(".amount-control .plus").forEach(button => {
        button.addEventListener("click", function() {
            updateQuantity(this, 1);
        });
    });

    // Додаємо обробник подій для зменшення кількості замовлень
    document.querySelectorAll(".amount-control .minus").forEach(button => {
        button.addEventListener("click", function() {
            updateQuantity(this, -1);
        });
    });

    // Додаємо обробник подій для видалення товару з замовлення
    document.querySelectorAll(".control-panel .delete").forEach(button => {
        button.addEventListener("click", function() {
            deleteItem(this);
        });
    });

    const buyButtons = document.querySelectorAll('.buy-button');

    buyButtons.forEach(button => {
        button.addEventListener('click', function () {
            const pizzaElement = this.parentElement;
            const size = pizzaElement.querySelector('.size').textContent;
            const weight = pizzaElement.querySelector('.weight').textContent;
            const price = pizzaElement.querySelector('.price').textContent;
            const name = pizzaElement.querySelector('h2').textContent;

            addToOrderList(name, size, weight, price);
        });
    });

    function addToOrderList(name, size, weight, price) {
        const orderList = document.querySelector('#order-list');

        const orderItem = document.createElement('li');
        orderItem.textContent = `${name} - Розмір: ${size}, Вага: ${weight}, Ціна: ${price}`;

        orderList.appendChild(orderItem);
    }
});

// Функція для очищення всіх замовлень
function clearOrders() {
    // Видяляємо всі елементи з класом "ordered-item"
    document.querySelectorAll(".ordered-item").forEach(item => {
        item.remove();
    });
    // Оновлюємо суму замовлення
    updateOrderSummary();
}

// Функція для оновлення кількості замовлених товарів
function updateQuantity(button, change) {
    // Знаходимо елемент, що показує кількість
    let quantityElement = button.parentElement.querySelector("span");
    // Отримуємо поточну кількість і перетворюємо її на ціле число
    let quantity = parseInt(quantityElement.textContent);
    // Перевіряємо, щоб кількість не стала меншою за 1
    if (quantity + change > 0) {
        // Оновлюємо кількість
        quantityElement.textContent = quantity + change;
        // Оновлюємо суму замовлення
        updateOrderSummary();
    }
}

// Функція для видалення товару з замовлення
function deleteItem(button) {
    // Видаляємо найближчий елемент з класом "ordered-item"
    button.closest(".ordered-item").remove();
    // Оновлюємо суму замовлення
    updateOrderSummary();
}

// Функція для оновлення суми замовлення
function updateOrderSummary() {
    // Ініціалізуємо загальну суму як 0
    let total = 0;
    // Проходимо через всі елементи з класом "ordered-item"
    document.querySelectorAll(".ordered-item").forEach(item => {
        // Отримуємо ціну товару і перетворюємо її на ціле число
        let price = parseInt(item.querySelector(".price").textContent);
        // Отримуємо кількість товару і перетворюємо її на ціле число
        let quantity = parseInt(item.querySelector(".amount-control span").textContent);
        // Додаємо до загальної  суми вартість цього товару
        total += price * quantity;
    });
    // Оновлюємо текстовий вміст елемента з класом "sum"
    document.querySelector(".sum").textContent = total + "грн";
}



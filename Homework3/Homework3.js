document.addEventListener("DOMContentLoaded", function() {
    document.querySelector(".clear-order").addEventListener("click", clearOrders);

    document.querySelectorAll(".amount-control .plus").forEach(button => {
        button.addEventListener("click", function() {
            updateQuantity(this, 1);
        });
    });

    document.querySelectorAll(".amount-control .minus").forEach(button => {
        button.addEventListener("click", function() {
            updateQuantity(this, -1);
        });
    });

    document.querySelectorAll(".control-panel .delete").forEach(button => {
        button.addEventListener("click", function() {
            deleteItem(this);
        });
    });
});

function clearOrders() {
    document.querySelectorAll(".ordered-item").forEach(item => {
        item.remove();
    });
    updateOrderSummary();
}

function updateQuantity(button, change) {
    let quantityElement = button.parentElement.querySelector("span");
    let quantity = parseInt(quantityElement.textContent);
    if (quantity + change > 0) {
        quantityElement.textContent = quantity + change;
        updateOrderSummary();
    }
}

function deleteItem(button) {
    button.closest(".ordered-item").remove();
    updateOrderSummary();
}

function updateOrderSummary() {
    let total = 0;
    document.querySelectorAll(".ordered-item").forEach(item => {
        let price = parseInt(item.querySelector(".price").textContent);
        let quantity = parseInt(item.querySelector(".amount-control span").textContent);
        total += price * quantity;
    });
    document.querySelector(".sum").textContent = total + "грн";
}



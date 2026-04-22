let tg = window.Telegram.WebApp;

// expand to full screen
tg.expand();

function buyProduct() {
    alert("Product added to cart!");

    // Example: send data back to bot
    tg.sendData(JSON.stringify({
        action: "buy",
        product: "Sample Product",
        price: 10
    }));
}
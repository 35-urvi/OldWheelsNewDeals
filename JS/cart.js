function loadCartItems() {
    fetch('get_cart.php')
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('cartContainer');
            container.innerHTML = '';
            
            data.forEach(car => {
                const card = `
                    <div class="car-card">
                        <img src="${car.front_photo}" alt="${car.make} ${car.model}" class="car-image">
                        <div class="car-info">
                            <table class="car-info-table">
                                <tr>
                                    <td>Car ID</td>
                                    <td>${car.car_id}</td>
                                </tr>
                                <tr>
                                    <td>Make</td>
                                    <td>${car.make}</td>
                                </tr>
                                <tr>
                                    <td>Model</td>
                                    <td>${car.model}</td>
                                </tr>
                                <tr>
                                    <td>Year</td>
                                    <td>${car.year}</td>
                                </tr>
                                <tr>
                                    <td>Price</td>
                                    <td>₹${car.asking_price.toLocaleString()}</td>
                                </tr>
                            </table>
                            <div class="button-group">
                                <button class="btn btn-buy" onclick="showBuyModal(${car.car_id})">Buy Now</button>
                                <button class="btn btn-remove" onclick="removeFromCart(${car.car_id})">Remove</button>
                            </div>
                        </div>
                    </div>
                `;
                container.innerHTML += card;
            });
        });
}

function showBuyModal(carId) {
    fetch(`get_car_details.php?id=${carId}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                showMessage('Invalid car ID');
            } else {
                const detailsHtml = `
                    <table class="car-details-table" data-car-id="${data.id}">
                        <tr><td>Make</td><td>${data.make}</td></tr>
                        <tr><td>Model</td><td>${data.model}</td></tr>
                        <tr><td>Year</td><td>${data.year}</td></tr>
                        <tr><td>Fuel Type</td><td>${data.fuel_type}</td></tr>
                        <tr><td>Transmission</td><td>${data.transmission}</td></tr>
                        <tr><td>Registration Place</td><td>${data.registration_place}</td></tr>
                        <tr><td>Registration Number</td><td>${data.registration_number}</td></tr>
                        <tr><td>Ownership</td><td>${data.ownership}</td></tr>
                        <tr><td>Condition</td><td>${data.car_condition}</td></tr>
                        <tr><td>Color</td><td>${data.color}</td></tr>
                        <tr><td>Seller Name</td><td>${data.seller_name}</td></tr>
                        <tr><td>Seller Phone</td><td>${data.seller_phone}</td></tr>
                        <tr><td>Asking Price</td><td>₹${data.asking_price}</td></tr>
                    </table>
                `;
                document.getElementById('carDetails').innerHTML = detailsHtml;
                document.getElementById('buyModal').style.display = 'flex';
            }
        });
}

function confirmPurchase() {
    const offerPrice = document.getElementById('offerPrice').value;
    const carId = document.querySelector('.car-details-table').getAttribute('data-car-id');

    fetch('process_purchase.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            carId: carId,
            offerPrice: offerPrice
        })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('buyModal').style.display = 'none';
        showMessage(data.message);
        if (data.success) {
            loadCartItems();
        }
    });
}

function removeFromCart(carId) {
    fetch('remove_from_cart.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            carId: carId
        })
    })
    .then(response => response.json())
    .then(data => {
        showMessage('Car removed from cart successfully');
        loadCartItems();
    });
}

function showMessage(message) {
    document.getElementById('messageText').textContent = message;
    document.getElementById('messageModal').style.display = 'flex';
}

function closeMessageModal() {
    document.getElementById('messageModal').style.display = 'none';
}

// Close modals when clicking on close button or outside
document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('buyModal').style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target.className === 'modal') {
        document.getElementById('buyModal').style.display = 'none';
    }
    if (e.target.className === 'message-modal') {
        document.getElementById('messageModal').style.display = 'none';
    }
});

// Load cart items on page load
loadCartItems();
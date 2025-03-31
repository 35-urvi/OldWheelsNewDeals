async function fetchCars() {
    try {
        const response = await fetch('fetch_cars.php');
        const cars = await response.json();
        return cars;
    } catch (error) {
        console.error('Error fetching cars:', error);
        return [];
    }
}
function displayCars(cars) {
const carGrid = document.getElementById('carGrid');
carGrid.innerHTML = '';

cars.forEach(car => {
const carCard = document.createElement('div');
carCard.className = 'car-card';
carCard.setAttribute('data-car-id', car.id); 
carCard.innerHTML = `
    <img src="${car.front_photo}" alt="${car.make} ${car.model}" class="car-image">
    <div class="car-info">
        <p><strong>Car ID:</strong> ${car.id}</p>
        <p><strong>Make:</strong> ${car.make}</p>
        <p><strong>Model:</strong> ${car.model}</p>
        <p><strong>Year:</strong> ${car.year}</p>
        <p><strong>Price:</strong> ₹${car.asking_price}</p>
        <div class="car-buttons">
            <button class="car-btn see-more-btn" onclick="showCarDetails(${car.id})">See More</button>
            <button class="car-btn add-cart-btn" onclick="addToCart(${car.id})">Add to Cart</button>
            <button class="car-btn buy-now-btn" onclick="showBuyModal(${car.id})">Buy Now</button>
        </div>
    </div>
`;
carGrid.appendChild(carCard);
});
}

// Search functionality
document.getElementById('searchInput').addEventListener('input', async (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const cars = await fetchCars();
    const filteredCars = cars.filter(car => 
        car.make.toLowerCase().includes(searchTerm) ||
        car.model.toLowerCase().includes(searchTerm) ||
        car.year.toString().includes(searchTerm)
    );
    displayCars(filteredCars);
});

// Sort functionality
document.querySelectorAll('.sort-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
        const sortBy = btn.dataset.sort;
        const cars = await fetchCars();
        
        cars.sort((a, b) => {
            if (sortBy === 'price') {
                return a.asking_price - b.asking_price;
            } else if (sortBy === 'year') {
                return b.year - a.year;
            } else {
                return a[sortBy].localeCompare(b[sortBy]);
            }
        });

        displayCars(cars);
    });
});

function showCarDetails(carId) {
const modal = document.getElementById('carModal');
const modalContent = document.getElementById('modalContent');

fetch(`get_car_details.php?id=${carId}`)
    .then(response => response.json())
    .then(car => {
        const images = [
            car.front_photo,
            car.rear_photo,
            car.left_photo,
            car.right_photo,
            car.dashboard_photo
        ];

        modalContent.innerHTML = `
            <div class="carousel">
                <div class="carousel-inner">
                    ${images.map((img, index) => `
                        <div class="carousel-item ${index === 0 ? 'active' : ''}">
                            <img src="${img}" alt="Car Image ${index + 1}">
                        </div>
                    `).join('')}
                </div>
                <button class="carousel-control prev" onclick="moveCarousel(-1)">❮</button>
                <button class="carousel-control next" onclick="moveCarousel(1)">❯</button>
            </div>
            <div class="car-details">
                <div class="detail-item">
                    <div class="detail-label">Car ID</div>
                    <div class="detail-value">${car.id}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Make</div>
                    <div class="detail-value">${car.make}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Model</div>
                    <div class="detail-value">${car.model}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Year</div>
                    <div class="detail-value">${car.year}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Fuel Type</div>
                    <div class="detail-value">${car.fuel_type}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Transmission</div>
                    <div class="detail-value">${car.transmission}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Registration Place</div>
                    <div class="detail-value">${car.registration_place}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Registration Number</div>
                    <div class="detail-value">${car.registration_number}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Ownership</div>
                    <div class="detail-value">${car.ownership}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Condition</div>
                    <div class="detail-value">${car.car_condition}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Color</div>
                    <div class="detail-value">${car.color}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Seller Name</div>
                    <div class="detail-value">${car.seller_name}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Seller Phone</div>
                    <div class="detail-value">${car.seller_phone}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Asking Price</div>
                    <div class="detail-value">₹${car.asking_price}</div>
                </div>
            </div>
        `;
        modal.style.display = 'block';
    });
}
let currentSlide = 0;
function moveCarousel(direction) {
const items = document.querySelectorAll('.carousel-item');
if (!items.length) return;

items[currentSlide].classList.remove('active');
currentSlide = (currentSlide + direction + items.length) % items.length;
items[currentSlide].classList.add('active');
}

function showBuyModal(carId) {
fetch(`get_car_details.php?id=${carId}`)
.then(response => response.json())
.then(data => {
    if (data.error) {
        showNotification('Invalid car ID', 'error');
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
        document.getElementById('buyModal').style.display = 'block';
    }
});
}

function confirmPurchase() {
const offerPrice = document.getElementById('offerPrice').value;
const carId = document.querySelector('.car-details-table').getAttribute('data-car-id');

if (!offerPrice || isNaN(offerPrice)) {
showNotification('Please enter a valid offer amount', 'error');
return;
}

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
if (data.success) {
    Swal.fire({
        title: 'Success!',
        text: 'Purchase completed successfully!',
        icon: 'success',
        confirmButtonText: 'OK'
    }).then(() => {
        // Remove the car from the grid
        const carElement = document.querySelector(`.car-card[data-car-id="${carId}"]`);
        if (carElement) {
            carElement.remove();
        }
        // Refresh the car list
        fetchCars().then(cars => displayCars(cars));
    });
} else {
    Swal.fire({
        title: 'Error',
        text: data.message || 'Purchase could not be completed',
        icon: 'error',
        confirmButtonText: 'OK'
    });
}
});
}

// Close modal functionality
document.querySelectorAll('.close-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        btn.closest('.modal').style.display = 'none';
    });
});

function showNotification(message, type = 'success') {
const notification = document.createElement('div');
notification.className = `notification ${type}`;
notification.textContent = message;
document.body.appendChild(notification);

// Show notification
setTimeout(() => notification.style.opacity = '1', 100);

// Hide and remove notification
setTimeout(() => {
notification.style.opacity = '0';
setTimeout(() => notification.remove(), 300);
}, 3000);
}

// Initialize page
window.onload = async () => {
    const cars = await fetchCars();
    displayCars(cars);
};

async function addToCart(carId) {
try {
    const formData = new FormData();
    formData.append('carId', carId);
    
    const response = await fetch('add_to_cart.php', {
        method: 'POST',
        body: formData
    });
    const result = await response.json();
    
    if (result.success) {
        showNotification('Car added to cart successfully!');
    } else {
        showNotification(result.error || 'Failed to add car to cart', 'error');
    }
} catch (error) {
    showNotification('An error occurred while adding to cart', 'error');
}
}

// Close modals when clicking outside
window.onclick = function(event) {
    const modals = document.getElementsByClassName('modal');
    Array.from(modals).forEach(modal => {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    });
}
const reviews = [
    {
        image: "photo/pg-6.jpg",
        text: "I sold my old car within a day! The process was super smooth, and I got the best price compared to other platforms. Highly recommended!",
        name: "Bharti Bhatt",
        rating: 5
    },
    {
        image: "photo/pb-8.jpg",
        text: "Sold my car within a week. I get the best price. Great platform for both buyers and sellers!",
        name: "Manish Patel",
        rating: 4
    },
    {
        image: "photo/pg-7.jpg",
        text: "Excellent service! The condition of the car matched exactly what was described online. Very happy with my purchase.",
        name: "Janvi Raval",
        rating: 5
    },
    {
        image: "photo/postb-5.jpg",
        text: "I liked how easy it was to list my car, get an offer, and sell it without any negotiations. The website is user-friendly and efficient!",
        name: "Dev Shah",
        rating: 4
    },
    {
        image: "photo/postg-1.jpg",
        text: "Quick and easy process. Got a great deal on my car sale. Would definitely use Old Wheels New Deels again.",
        name: "Shivani Patel",
        rating: 5
    },
    {
        image: "photo/storyb-6.jpg",
        text: "I was able to sell my 5-year-old car at a great price. The process was simple, and I didn't have to go through the trouble of finding buyers myself",
        name: "Deep Patel",
        rating: 4
    },
    {
        image: "photo/postgirl.jpg",
        text: "Outstanding experience! Found exactly what I was looking for within my budget.",
        name: "Bansi Rana",
        rating: 5
    },
    {
        image: "photo/storyb-9.jpg",
        text: "Transparent pricing and honest descriptions. No hidden surprises. Very satisfied with my purchase.",
        name: "Raj Prajapati",
        rating: 4
    },
    {
        image: "photo/storyg-3.jpg",
        text: "What I loved the most was the transparency. No last-minute deductions or hidden fees. The price quoted was exactly what I received!",
        name: "Avni Oza",
        rating: 5
    }
];

const reviewContainer = document.getElementById('reviewContainer');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const dotsContainer = document.getElementById('carouselDots');
let currentIndex = 0;
let autoScrollInterval;
const AUTO_SCROLL_INTERVAL = 3000; // Auto scroll every 3 seconds

function createReviewCard(review, index) {
const stars = '★'.repeat(Math.floor(review.rating)) + 
         (review.rating % 1 ? '½' : '') +
         '☆'.repeat(5 - Math.ceil(review.rating));

return `
<div class="review-card ${index === 1 ? 'active' : ''}" data-index="${index}">
    <div class="review-image">
        <img src="${review.image}" alt="${review.name}">
    </div>
    <p class="review-text">${review.text}</p>
    <h3 class="review-name">${review.name}</h3>
    <div class="review-stars">${stars}</div>
</div>
`;
}

function initCarousel() {
const extendedReviews = [...reviews.slice(-1), ...reviews, ...reviews.slice(0, 2)];
reviewContainer.innerHTML = extendedReviews.map((review, index) => 
createReviewCard(review, index)
).join('');

dotsContainer.innerHTML = reviews.map((_, index) => 
`<div class="dot ${index === 0 ? 'active' : ''}" data-index="${index}"></div>`
).join('');

updateCarousel();

document.querySelectorAll('.dot').forEach(dot => {
dot.addEventListener('click', () => {
    currentIndex = parseInt(dot.dataset.index);
    updateCarousel(true);
    resetAutoScroll(); 
});
});
startAutoScroll();
}

function updateCarousel(fromDotClick = false) {
const isDesktop = window.innerWidth > 768;
const slideWidth = 100 / (isDesktop ? 3 : 1);
const adjustedIndex = currentIndex + 1;

reviewContainer.style.transform = `translateX(-${adjustedIndex * slideWidth}%)`;

document.querySelectorAll('.review-card').forEach(card => {
card.classList.remove('active');
});

const activeCardIndex = isDesktop ? adjustedIndex + 1 : adjustedIndex;
const activeCard = document.querySelector(`.review-card[data-index="${activeCardIndex}"]`);
if (activeCard) {
activeCard.classList.add('active');
}

document.querySelectorAll('.dot').forEach((dot, index) => {
dot.classList.toggle('active', index === currentIndex);
});

if (!fromDotClick) {
if (currentIndex >= reviews.length) {
    setTimeout(() => {
        currentIndex = 0;
        reviewContainer.style.transition = 'none';
        updateCarousel();
        setTimeout(() => {
            reviewContainer.style.transition = 'transform 0.5s ease';
        }, 50);
    }, 500);
} else if (currentIndex < 0) {
    setTimeout(() => {
        currentIndex = reviews.length - 1;
        reviewContainer.style.transition = 'none';
        updateCarousel();
        setTimeout(() => {
            reviewContainer.style.transition = 'transform 0.5s ease';
        }, 50);
    }, 500);
}
}
}

function startAutoScroll() {
if (autoScrollInterval) {
clearInterval(autoScrollInterval);
}

autoScrollInterval = setInterval(() => {
currentIndex++;
updateCarousel();
}, AUTO_SCROLL_INTERVAL);
}

function resetAutoScroll() {
clearInterval(autoScrollInterval);
startAutoScroll();
}


prevBtn.addEventListener('click', () => {
currentIndex--;
updateCarousel();
resetAutoScroll();
});

nextBtn.addEventListener('click', () => {
currentIndex++;
updateCarousel();
resetAutoScroll();
});

reviewContainer.addEventListener('mouseenter', () => {
clearInterval(autoScrollInterval);
});

reviewContainer.addEventListener('mouseleave', () => {
startAutoScroll();
});

// Initialize carousel
initCarousel();

window.addEventListener('resize', () => {
updateCarousel(true);
resetAutoScroll();
});

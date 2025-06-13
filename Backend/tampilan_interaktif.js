// Global Variables
let currentPage = 0;
const totalPages = 4;

// Page Content Data
const pages = [
    {
        title: "TENTANG KAMI",
        description: "DentAI adalah platform inovatif yang menggabungkan teknologi kecerdasan buatan dengan dunia kedokteran gigi. Kami berkomitmen untuk membantu pasien dan profesional gigi dalam mendiagnosis masalah kesehatan mulut secara cepat, akurat, dan mudah.",
        counter: "01"
    },
    {
        title: "TEKNOLOGI AI",
        description: "Dengan memanfaatkan analisis citra berbasis AI, DentAI mampu membaca hasil rontgen dan memberikan insight awal terhadap kondisi gigi dan mulut. Hal ini memungkinkan tindakan preventif maupun penanganan lebih lanjut bisa dilakukan lebih dini.",
        counter: "02"
    },
    {
        title: "TIM MEDIS",
        description: "Didirikan oleh tim yang terdiri dari pengembang, desainer, dan praktisi medis, kami percaya bahwa masa depan kesehatan ada di tangan teknologi yang bersahabat dan mudah diakses oleh siapa pun.",
        counter: "03"
    },
    {
        title: "VISI MISI",
        description: "DentAI – Senyum Sehat Dimulai dari Diagnosa yang Cerdas. Kami berkomitmen untuk menjadi pionir dalam transformasi digital kesehatan gigi di Indonesia.",
        counter: "04"
    }
];

// Main Functions
function selectCard(index) {
    currentPage = index;
    updateContent();
    updateActiveCard();
    updateBackground();
}

function updateContent() {
    const page = pages[currentPage];
    const titleElement = document.getElementById('main-title');
    const descriptionElement = document.getElementById('main-description');
    const counterElement = document.querySelector('.page-counter');

    // Add fade effect
    titleElement.style.opacity = '0';
    descriptionElement.style.opacity = '0';
    
    setTimeout(() => {
        titleElement.textContent = page.title;
        descriptionElement.textContent = page.description;
        counterElement.textContent = page.counter;
        
        titleElement.style.opacity = '1';
        descriptionElement.style.opacity = '1';
    }, 200);
}

function updateActiveCard() {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.classList.remove('active');
        if (index === currentPage) {
            card.classList.add('active');
        }
    });
}

function updateBackground() {
    const backgrounds = document.querySelectorAll('.background-image');
    backgrounds.forEach((bg, index) => {
        bg.classList.remove('active');
        if (index === currentPage) {
            bg.classList.add('active');
        }
    });
}

function nextPage() {
    currentPage = (currentPage + 1) % totalPages;
    selectCard(currentPage);
}

function previousPage() {
    currentPage = (currentPage - 1 + totalPages) % totalPages;
    selectCard(currentPage);
}

// Auto-play functionality
let autoPlayInterval;

function startAutoPlay() {
    autoPlayInterval = setInterval(() => {
        nextPage();
    }, 5000);
}

function stopAutoPlay() {
    clearInterval(autoPlayInterval);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    updateContent();
    updateActiveCard();
    updateBackground();
    startAutoPlay();
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
        nextPage();
    } else if (e.key === 'ArrowLeft') {
        previousPage();
    }
});

// Touch/swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const swipeDistance = touchEndX - touchStartX;
    
    if (Math.abs(swipeDistance) > swipeThreshold) {
        if (swipeDistance > 0) {
            previousPage();
        } else {
            nextPage();
        }
    }
}

// Pause auto-play on hover
const aboutSection = document.querySelector('#about');
if (aboutSection) {
    aboutSection.addEventListener('mouseenter', stopAutoPlay);
    aboutSection.addEventListener('mouseleave', startAutoPlay);
}

// Additional utility functions
function pauseAutoPlay() {
    stopAutoPlay();
    setTimeout(startAutoPlay, 10000); // Resume after 10 seconds
}

function goToPage(pageIndex) {
    if (pageIndex >= 0 && pageIndex < totalPages) {
        selectCard(pageIndex);
        pauseAutoPlay();
    }
}

// Export functions for global access (if needed)
window.selectCard = selectCard;
window.nextPage = nextPage;
window.previousPage = previousPage;
window.goToPage = goToPage;
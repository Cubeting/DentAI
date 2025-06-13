// JavaScript untuk About Section Interaktif
class AboutSlider {
    constructor() {
        this.currentSlide = 1;
        this.totalSlides = 4;
        this.isAutoPlay = true;
        this.autoPlayInterval = null;
        this.autoPlayDelay = 5000; // 5 detik
        
        this.init();
    }
    
    init() {
        this.createSliderStructure();
        this.bindEvents();
        this.startAutoPlay();
        this.updateProgress();
    }
    
    createSliderStructure() {
        // Ambil semua section dengan id="about"
        const aboutSections = document.querySelectorAll('#about');
        
        if (aboutSections.length < 4) {
            console.warn('Tidak ditemukan 4 section tentang');
            return;
        }
        
        // Buat container utama
        const container = document.createElement('div');
        container.className = 'about-container';
        
        // Buat navigation dots
        const navigation = document.createElement('div');
        navigation.className = 'about-navigation';
        
        for (let i = 1; i <= this.totalSlides; i++) {
            const dot = document.createElement('div');
            dot.className = `nav-dot ${i === 1 ? 'active' : ''}`;
            dot.dataset.slide = i;
            navigation.appendChild(dot);
        }
        
        // Buat progress bar
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        const progressFill = document.createElement('div');
        progressFill.className = 'progress-fill';
        progressBar.appendChild(progressFill);
        
        // Buat slider container
        const slider = document.createElement('div');
        slider.className = 'about-slider';
        
        // Buat wrapper untuk pages
        const wrapper = document.createElement('div');
        wrapper.className = 'pages-wrapper slide-1';
        
        // Pindahkan semua halaman ke dalam wrapper
        aboutSections.forEach((section, index) => {
            const page = section.querySelector('.page');
            if (page) {
                page.classList.add(index === 0 ? 'active' : '');
                wrapper.appendChild(page);
            }
        });
        
        // Buat navigation arrows
        const prevArrow = document.createElement('div');
        prevArrow.className = 'nav-arrow prev';
        const nextArrow = document.createElement('div');
        nextArrow.className = 'nav-arrow next';
        
        // Buat auto-play indicator
        const autoPlayIndicator = document.createElement('div');
        autoPlayIndicator.className = 'auto-play-indicator playing';
        autoPlayIndicator.innerHTML = 'Auto-play';
        
        // Buat keyboard hint
        const keyboardHint = document.createElement('div');
        keyboardHint.className = 'keyboard-hint';
        keyboardHint.innerHTML = '← → untuk navigasi';
        
        // Buat touch hint untuk mobile
        const touchHint = document.createElement('div');
        touchHint.className = 'touch-hint';
        touchHint.innerHTML = 'Swipe untuk navigasi';
        
        // Susun struktur
        slider.appendChild(wrapper);
        slider.appendChild(prevArrow);
        slider.appendChild(nextArrow);
        slider.appendChild(autoPlayIndicator);
        slider.appendChild(keyboardHint);
        slider.appendChild(touchHint);
        
        container.appendChild(navigation);
        container.appendChild(progressBar);
        container.appendChild(slider);
        
        // Replace section pertama dengan container
        aboutSections[0].innerHTML = '';
        aboutSections[0].appendChild(container);
        
        // Hapus section lainnya
        for (let i = 1; i < aboutSections.length; i++) {
            aboutSections[i].remove();
        }
        
        // Simpan referensi elemen
        this.wrapper = wrapper;
        this.dots = navigation.querySelectorAll('.nav-dot');
        this.progressFill = progressFill;
        this.autoPlayIndicator = autoPlayIndicator;
        this.pages = wrapper.querySelectorAll('.page');
    }
    
    bindEvents() {
        // Navigation dots
        this.dots.forEach(dot => {
            dot.addEventListener('click', () => {
                this.goToSlide(parseInt(dot.dataset.slide));
            });
        });
        
        // Navigation arrows
        document.querySelector('.nav-arrow.prev')?.addEventListener('click', () => {
            this.prevSlide();
        });
        
        document.querySelector('.nav-arrow.next')?.addEventListener('click', () => {
            this.nextSlide();
        });
        
        // Auto-play toggle
        this.autoPlayIndicator?.addEventListener('click', () => {
            this.toggleAutoPlay();
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.isInViewport(document.querySelector('#about'))) {
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    this.prevSlide();
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    this.nextSlide();
                } else if (e.key === ' ') {
                    e.preventDefault();
                    this.toggleAutoPlay();
                }
            }
        });
        
        // Touch/swipe support
        this.addTouchSupport();
        
        // Pause auto-play saat hover
        const slider = document.querySelector('.about-slider');
        slider?.addEventListener('mouseenter', () => {
            if (this.isAutoPlay) this.pauseAutoPlay();
        });
        
        slider?.addEventListener('mouseleave', () => {
            if (this.isAutoPlay) this.startAutoPlay();
        });
        
        // Visibility API untuk pause saat tab tidak aktif
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAutoPlay();
            } else if (this.isAutoPlay) {
                this.startAutoPlay();
            }
        });
    }
    
    addTouchSupport() {
        const slider = document.querySelector('.about-slider');
        if (!slider) return;
        
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;
        
        slider.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });
        
        slider.addEventListener('touchmove', (e) => {
            e.preventDefault(); // Prevent scrolling
        });
        
        slider.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
            
            const deltaX = startX - endX;
            const deltaY = startY - endY;
            const minSwipeDistance = 50;
            
            // Horizontal swipe detected
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
                if (deltaX > 0) {
                    this.nextSlide(); // Swipe left - next slide
                } else {
                    this.prevSlide(); // Swipe right - prev slide
                }
            }
        });
    }
    
    goToSlide(slideNumber) {
        if (slideNumber < 1 || slideNumber > this.totalSlides) return;
        
        this.currentSlide = slideNumber;
        
        // Update wrapper class
        this.wrapper.className = `pages-wrapper slide-${slideNumber}`;
        
        // Update dots
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index + 1 === slideNumber);
        });
        
        // Update active page
        this.pages.forEach((page, index) => {
            page.classList.toggle('active', index + 1 === slideNumber);
        });
        
        // Update progress
        this.updateProgress();
        
        // Restart auto-play
        if (this.isAutoPlay) {
            this.startAutoPlay();
        }
    }
    
    nextSlide() {
        const next = this.currentSlide >= this.totalSlides ? 1 : this.currentSlide + 1;
        this.goToSlide(next);
    }
    
    prevSlide() {
        const prev = this.currentSlide <= 1 ? this.totalSlides : this.currentSlide - 1;
        this.goToSlide(prev);
    }
    
    startAutoPlay() {
        this.pauseAutoPlay();
        if (this.isAutoPlay) {
            this.autoPlayInterval = setInterval(() => {
                this.nextSlide();
            }, this.autoPlayDelay);
        }
    }
    
    pauseAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
    
    toggleAutoPlay() {
        this.isAutoPlay = !this.isAutoPlay;
        
        if (this.autoPlayIndicator) {
            this.autoPlayIndicator.classList.toggle('playing', this.isAutoPlay);
        }
        
        if (this.isAutoPlay) {
            this.startAutoPlay();
        } else {
            this.pauseAutoPlay();
        }
    }
    
    updateProgress() {
        const progress = (this.currentSlide / this.totalSlides) * 100;
        if (this.progressFill) {
            this.progressFill.style.width = `${progress}%`;
        }
    }
    
    isInViewport(element) {
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
}

// Initialize slider when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Tunggu sebentar untuk memastikan semua elemen sudah dimuat
    setTimeout(() => {
        new AboutSlider();
    }, 100);
});

// Handle resize
window.addEventListener('resize', () => {
    // Re-calculate dimensions if needed
    const slider = document.querySelector('.about-slider');
    if (slider) {
        // Force repaint
        slider.style.display = 'none';
        slider.offsetHeight; // Trigger reflow
        slider.style.display = '';
    }
});

// Intersection Observer untuk animasi saat scroll
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const aboutObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe about section
document.addEventListener('DOMContentLoaded', () => {
    const aboutSection = document.querySelector('#about');
    if (aboutSection) {
        aboutObserver.observe(aboutSection);
    }
});
class MerchSlider {
  constructor() {
    this.slider = document.querySelector('.merch-slider');
    if (!this.slider) return;

    this.wrapper = this.slider.querySelector('.merch-slider-wrapper');
    this.list = this.slider.querySelector('.merch-list');
    this.items = this.slider.querySelectorAll('.merch-item');
    this.prevBtn = this.slider.querySelector('.slider-btn-prev');
    this.nextBtn = this.slider.querySelector('.slider-btn-next');
    this.dotsContainer = document.querySelector('.slider-dots');
    
    this.currentIndex = 0;
    this.itemWidth = 300; // Fixed width for desktop
    this.gap = 20;
    
    this.init();
  }
  
  getItemsPerView() {
    const containerWidth = this.wrapper.offsetWidth;
    const width = window.innerWidth;
    
    // Mobile: 1 item
    if (width < 768) {
      this.itemWidth = 280;
      return 1;
    }
    
    // Desktop: Calculate how many 300px items fit
    this.itemWidth = 300;
    const itemsWillFit = Math.floor((containerWidth + this.gap) / (this.itemWidth + this.gap));
    
    // Show 3 items if they fit, otherwise show as many as fit
    return Math.min(itemsWillFit, 3);
  }
  
  init() {
    if (this.items.length <= 0) return;
    
    this.updateLayout();
    this.updateSlider();
    
    this.prevBtn.addEventListener('click', () => this.slidePrev());
    this.nextBtn.addEventListener('click', () => this.slideNext());
    
    window.addEventListener('resize', () => {
      this.updateLayout();
      this.updateSlider();
    });
    
    if ('ontouchstart' in window) {
      this.initSwipe();
    }
  }
  
  updateLayout() {
    this.itemsPerView = this.getItemsPerView();
    this.totalSlides = Math.ceil(this.items.length / this.itemsPerView);
    this.maxIndex = this.totalSlides - 1;
    
    // Adjust current index if needed
    if (this.currentIndex > this.maxIndex) {
      this.currentIndex = this.maxIndex;
    }
    
    this.createDots();
  }
  
  createDots() {
    this.dotsContainer.innerHTML = '';
    
    for (let i = 0; i < this.totalSlides; i++) {
      const dot = document.createElement('span');
      dot.classList.add('slider-dot');
      if (i === this.currentIndex) dot.classList.add('active');
      
      dot.addEventListener('click', () => {
        this.currentIndex = i;
        this.updateSlider();
      });
      
      this.dotsContainer.appendChild(dot);
    }
  }
  
  slidePrev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updateSlider();
    }
  }
  
  slideNext() {
    if (this.currentIndex < this.maxIndex) {
      this.currentIndex++;
      this.updateSlider();
    }
  }
  
  updateSlider() {
    // Calculate exact pixel offset for current slide
    const itemsToScroll = this.currentIndex * this.itemsPerView;
    const offset = itemsToScroll * (this.itemWidth + this.gap);
    
    this.list.style.transform = `translateX(-${offset}px)`;
    
    // Update buttons
    this.prevBtn.disabled = this.currentIndex === 0;
    this.nextBtn.disabled = this.currentIndex >= this.maxIndex;
    
    // Update dots
    const dots = this.dotsContainer.querySelectorAll('.slider-dot');
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === this.currentIndex);
    });
  }
  
  initSwipe() {
    let startX = 0;
    let diff = 0;
    
    this.list.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    }, { passive: true });
    
    this.list.addEventListener('touchmove', (e) => {
      diff = startX - e.touches[0].clientX;
    }, { passive: true });
    
    this.list.addEventListener('touchend', () => {
      const threshold = 50;
      
      if (Math.abs(diff) > threshold) {
        if (diff > 0 && this.currentIndex < this.maxIndex) {
          this.slideNext();
        } else if (diff < 0 && this.currentIndex > 0) {
          this.slidePrev();
        }
      }
      
      diff = 0;
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new MerchSlider();
});
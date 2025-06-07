const slidesWrapper = document.querySelector('.slides-wrapper');
const dots = document.querySelectorAll('.dot');
let currentIndex = 0;
const totalSlides = dots.length;

function goToSlide(index) {
  slidesWrapper.style.transform = `translateX(-${index * 100}%)`;
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
  currentIndex = index;
}

function nextSlide() {
  const nextIndex = (currentIndex + 1) % totalSlides;
  goToSlide(nextIndex);
}

let slideInterval = setInterval(nextSlide, 4000);

dots.forEach(dot => {
  dot.addEventListener('click', () => {
    clearInterval(slideInterval);
    goToSlide(parseInt(dot.dataset.index));
    slideInterval = setInterval(nextSlide, 4000);
  });
});

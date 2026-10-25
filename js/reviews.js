document.addEventListener("DOMContentLoaded", () => {
  const carousel = document.getElementById("reviewsCarousel");
  const track = carousel.querySelector(".reviews-track");
  let slides = Array.from(track.children);
  const nextButton = carousel.querySelector(".next");
  const prevButton = carousel.querySelector(".prev");
  const pagination = carousel.querySelector(".pagination");

  let index = 1;
  let autoSlide;

  const firstClone = slides[0].cloneNode(true);
  const lastClone = slides[slides.length - 1].cloneNode(true);
  firstClone.classList.add("clone");
  lastClone.classList.add("clone");

  track.appendChild(firstClone);
  track.insertBefore(lastClone, slides[0]);

  slides = Array.from(track.children);

  slides.slice(1, -1).forEach((_, i) => {
    const dot = document.createElement("span");
    dot.classList.add("dot");
    if (i === 0) dot.classList.add("active");
    dot.addEventListener("click", () => goToSlide(i + 1));
    pagination.appendChild(dot);
  });

  const dots = pagination.querySelectorAll(".dot");

  function updateCarousel(animate = true) {
    const slideWidth = slides[0].getBoundingClientRect().width;
    track.style.transition = animate ? "transform 0.6s ease" : "none";
    track.style.transform = `translateX(-${index * slideWidth}px)`;

    dots.forEach((dot, i) => dot.classList.toggle("active", i === index - 1));
  }

  track.addEventListener("transitionend", () => {
    if (slides[index].classList.contains("clone")) {
      track.style.transition = "none";
      if (index === slides.length - 1) index = 1;
      else if (index === 0) index = slides.length - 2;
      updateCarousel(false);
    }
  });

  function nextSlide() {
    if (index >= slides.length - 1) return;
    index++;
    updateCarousel();
  }

  function prevSlide() {
    if (index <= 0) return;
    index--;
    updateCarousel();
  }

  function goToSlide(i) {
    index = i;
    updateCarousel();
  }

  nextButton.addEventListener("click", nextSlide);
  prevButton.addEventListener("click", prevSlide);

  function startAutoSlide() {
    autoSlide = setInterval(nextSlide, 5000);
  }
  function stopAutoSlide() {
    clearInterval(autoSlide);
  }
  carousel.addEventListener("mouseenter", stopAutoSlide);
  carousel.addEventListener("mouseleave", startAutoSlide);

  updateCarousel(false);
  startAutoSlide();

  window.addEventListener("resize", () => updateCarousel(false));
});

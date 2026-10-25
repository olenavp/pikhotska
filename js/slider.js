const carousel = document.getElementById("diplomaCarousel");
const track = carousel.querySelector(".carousel__track");
let slides = Array.from(track.children);
const nextButton = carousel.querySelector(".next");
const prevButton = carousel.querySelector(".prev");
const trackContainer = carousel.querySelector(".carousel__track-container");

let index = 1;

const firstClone = slides[0].cloneNode(true);
const lastClone = slides[slides.length - 1].cloneNode(true);

firstClone.classList.add("clone");
lastClone.classList.add("clone");

track.appendChild(firstClone);
track.insertBefore(lastClone, slides[0]);

slides = Array.from(track.children);

function updateCarousel(animate = true) {
  const slideWidth = slides[0].getBoundingClientRect().width;
  track.style.transition = animate ? "transform 0.6s ease" : "none";
  track.style.transform = `translateX(-${index * slideWidth}px)`;
}

track.addEventListener("transitionend", () => {
  const slideWidth = slides[0].getBoundingClientRect().width;

  if (slides[index].classList.contains("clone")) {
    track.style.transition = "none";

    if (index === slides.length - 1) {
      index = 1;
    } else if (index === 0) {
      index = slides.length - 2;
    }

    track.style.transform = `translateX(-${index * slideWidth}px)`;
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

nextButton.addEventListener("click", nextSlide);
prevButton.addEventListener("click", prevSlide);

updateCarousel(false);

window.addEventListener("resize", () => updateCarousel(false));

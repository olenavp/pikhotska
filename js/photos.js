document.addEventListener("DOMContentLoaded", () => {
  const photos = [
    "./images/IMG_4400.JPG",
    "./images/IMG_4537.JPG",
    "./images/IMG_4540.JPG",
    "./images/IMG_4903.JPG",
    "./images/IMG_4905.JPG"
  ];

  photos.forEach(src => {
    const img = new Image();
    img.src = src;
  });

  let index = 0;
  const img = document.getElementById("goal-photo");

  img.style.transition = "opacity 0.8s ease-in-out";

  setInterval(() => {
    img.style.opacity = 0;
    setTimeout(() => {
      index = (index + 1) % photos.length;
      img.src = photos[index];
      img.style.opacity = 1;
    }, 1000);
  }, 5000);
});

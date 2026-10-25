const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImg');
const closeBtn = document.querySelector('.modal__close');
const prevBtn = document.querySelector('.modal__btn.prev');
const nextBtn = document.querySelector('.modal__btn.next');
const images = Array.from(document.querySelectorAll('.carousel__item img'));

let currentIndex = 0;

function openModal(index) {
    currentIndex = index;
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    showImage(currentIndex);
}

function showImage(index) {
    const img = images[index];
    modalImg.src = img.currentSrc || img.src;
}
function closeModal() {
    modal.style.display = 'none';
}

function nextImage() {
    currentIndex = (currentIndex + 1) % images.length;
    showImage(currentIndex);
}

function prevImage() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    showImage(currentIndex);
}

images.forEach((img, index) => {
    img.addEventListener('click', () => openModal(index));
});

closeBtn.addEventListener('click', closeModal);

modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

document.addEventListener('keydown', (e) => {
    if (modal.style.display === 'flex') {
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
        if (e.key === 'Escape') closeModal();
    }
});

document.querySelectorAll('.modal__close').forEach(btn => {
    btn.addEventListener('click', () => {
        btn.closest('.modal').style.display = 'none';
    });
});

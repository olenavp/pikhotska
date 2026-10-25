const contactModal = document.getElementById("contactModal");
const contactClose = document.getElementById("contactClose");

const contactButtons = document.querySelectorAll(".contactBtn");

contactButtons.forEach(btn => {
    btn.addEventListener('click', () => contactModal.classList.add('show'));
});

contactClose.addEventListener('click', () => contactModal.classList.remove('show'));
contactModal.addEventListener('click', e => {
    if (e.target === contactModal) contactModal.classList.remove('show');
});
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') contactModal.classList.remove('show');
});

const tsField = document.getElementById("ts");
tsField.value = Date.now();

document.getElementById("contactForm").addEventListener("submit", function (e) {
    const now = Date.now();
    const diff = now - parseInt(tsField.value, 10);

    if (diff < 2000) {
        e.preventDefault();
        alert("Схоже на автоматичну відправку. Спробуйте ще раз.");
        return;
    }
});

const contactBtnMobile = document.getElementById("contactBtnMobile");

if (contactBtnMobile) {
    contactBtnMobile.addEventListener('click', () => {
        contactModal.classList.add('show');
        menuContainer.classList.remove('is-open');
    });
}


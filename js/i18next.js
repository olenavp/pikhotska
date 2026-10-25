i18next
  .use(i18nextHttpBackend)
  .init({
    lng: "uk",
    fallbackLng: "uk",
    debug: false,
    backend: {
      loadPath: "./locales/{{lng}}/common.json"
    }
  }, function (err, t) {
    updateContent();
    setActiveLangButton();
  });

function updateContent() {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    el.textContent = i18next.t(key);
  });
}

function changeLang(lang) {
  i18next.changeLanguage(lang, () => {
    updateContent();
    setActiveLangButton();
  });
}

const uaBtn = document.querySelector(".lang-switch button:nth-child(1)");
const enBtn = document.querySelector(".lang-switch button:nth-child(2)");

function setActiveLangButton() {
  const currentLang = i18next.language || "uk";
  if (currentLang === "uk") {
    uaBtn.classList.add("active");
    enBtn.classList.remove("active");
  } else {
    uaBtn.classList.remove("active");
    enBtn.classList.add("active");
  }
}

uaBtn.addEventListener("click", () => changeLang("uk"));
enBtn.addEventListener("click", () => changeLang("en"));

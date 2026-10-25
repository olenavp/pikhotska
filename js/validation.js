document.addEventListener("DOMContentLoaded", function () {
    const validation = new JustValidate("#contactForm");

    validation
        .addField("#name", [
            { rule: "required", errorMessage: "Введіть ім'я" },
            { rule: "minLength", value: 2, errorMessage: "Ім'я повинно містити не менше ніж 2 символи" }
        ])
        .addField("#tel", [
            { rule: "required", errorMessage: "Телефон обов'язковий" },
            { rule: "customRegexp", value: /^\+?\d{7,15}$/, errorMessage: "Некоректний номер" }
        ])
        .addField("#messenger", [
            { rule: "maxLength", value: 50, errorMessage: "Занадто довге повідомлення" }
        ])
        .addField("#message", [
            { rule: "maxLength", value: 1000, errorMessage: "Занадто довге повідомлення" }
        ])
        .onSuccess((event) => {
            event.preventDefault();
            const form = event.target;
            const msg = document.getElementById("formMessage");
            msg.style.display = "block";

            setTimeout(() => {
                form.submit(); 
            }, 2000);
        });

});

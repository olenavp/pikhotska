const facade = document.querySelector(".youtube-facade");
facade.addEventListener("click", () => {
    const id = facade.dataset.id;
    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube.com/embed/${id}?autoplay=1`;
    iframe.title = "YouTube video player";
    iframe.frameBorder = "0";
    iframe.allow =
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    iframe.allowFullscreen = true;
    iframe.style.width = "100%";
    iframe.style.height = "450px";
    facade.replaceWith(iframe);
});



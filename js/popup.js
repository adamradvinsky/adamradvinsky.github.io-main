let images = [
    "../assets/images/achievements/medal1.jpg",
    "../assets/images/achievements/medal2.jpg",
    "../assets/images/achievements/medal3.jpg",
    "../assets/images/achievements/medal4.jpg",
    "../assets/images/achievements/medal5.jpg",
    "../assets/images/achievements/medal6.jpg",
    "../assets/images/achievements/medal7.jpg",
    "../assets/images/achievements/medal8.jpg",
]

function openPopupMedals() {

    console.log("Opening medals popup...");

    closePopup(true);

    const overlay = document.createElement("div");
    overlay.id = "popupOverlay";

    const popup = document.createElement("div");
    popup.id = "popup";

    const closeBtn = document.createElement("button");
    closeBtn.id = "popupCloseBtn";
    closeBtn.textContent = "✕";
    closeBtn.addEventListener("click", () => closePopup());

    const strip = document.createElement("div");
    strip.id = "popupStrip";

    popup.appendChild(closeBtn);
    popup.appendChild(strip);
    overlay.appendChild(popup);
    document.body.appendChild(overlay);

    requestAnimationFrame(() => {
        overlay.classList.add("visible");
    });

    const OFFSET = 28;

    images.forEach((src, i) => {
        const wrapper = document.createElement("div");
        wrapper.classList.add("popupCard");

        wrapper.style.left = `${i * OFFSET}px`;
        wrapper.style.zIndex = i;

        const img = document.createElement("img");
        img.src = src;
        img.classList.add("popupImg");
        wrapper.appendChild(img);

        // hover: just brighten
        wrapper.addEventListener("mouseenter", () => {
            img.style.filter = "brightness(1.25)";
        });

        wrapper.addEventListener("mouseleave", () => {
            wrapper.style.zIndex = i;
            img.style.filter = "brightness(1)";
        });

        // click: expand image
        wrapper.addEventListener("click", () => {
            expandImage(src);
        });

        strip.appendChild(wrapper);

        setTimeout(() => {
            wrapper.classList.add("visible");
        }, i * 120);
    });

    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) closePopup();
    });
}

function expandImage(src) {
    // remove existing expanded view if any
    const existing = document.getElementById("expandedView");
    if (existing) existing.remove();

    const expanded = document.createElement("div");
    expanded.id = "expandedView";

    const img = document.createElement("img");
    img.src = src;
    img.id = "expandedImg";

    expanded.appendChild(img);
    document.body.appendChild(expanded);

    // fade in
    requestAnimationFrame(() => {
        expanded.classList.add("visible");
    });

    // click anywhere on expanded view to close it
    expanded.addEventListener("click", () => {
        expanded.classList.remove("visible");
        expanded.addEventListener("transitionend", () => expanded.remove(), { once: true });
    });
}

function closePopup(instant = false) {
    const overlay = document.getElementById("popupOverlay");
    if (!overlay) return;

    // also close expanded view if open
    const expanded = document.getElementById("expandedView");
    if (expanded) expanded.remove();

    if (instant) {
        overlay.remove();
        return;
    }

    overlay.classList.remove("visible");
    overlay.addEventListener("transitionend", () => overlay.remove(), { once: true });
}
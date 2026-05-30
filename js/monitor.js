const projects = [
    {
        title: "Phasetec Websummit 2026 Intern",
        description: "Helped Phasetec redisign their demo for Websummit 2026",
        link: "https://github.com",
        cover: "../assets/images/projects/phasetec/phasetec.jpg",
        photos: [
            "../assets/images/projects/phasetec/phasetec2.jpg",
            "../assets/images/projects/phasetec/phasetec3.jpg",
        ]
    },
    {
        title: "BlockBlast Clone",
        description: "A clone of the game BlockBlast built with Unity. Features similar mechanics and gameplay to the original.",
        link: "https://github.com/adamradvinsky/BlockBlastClone",
        cover: "../assets/images/projects/blockblast/blockblast.png",
        photos: [
            "../assets/images/projects/blockblast/blockblast2.png",
            "../assets/images/projects/blockblast/blockblast1.png",
        ]
    },
    {
        title: "Health Triage AI",
        description: "A web application that uses AI to help users triage their health symptoms and provide guidance on next steps. Built with React and integrated with Gemini's API for natural language processing.",
        link: "https://github.com/adamradvinsky/HTS-Health-Triage-AI",
        cover:"../assets/images/projects/triage/hts.png",
        photos: [
            "../assets/images/projects/triage/hts1.png",
            "../assets/images/projects/triage/hts2.png",
        ]
    },
    // add or remove projects here — grid adjusts automatically
];

/* ----------------------------
   OPEN MONITOR POPUP
---------------------------- */
function openMonitor() {
    closeMonitor(true);

    const overlay = document.createElement("div");
    overlay.id = "monitorOverlay";

    const screen = document.createElement("div");
    screen.id = "monitorScreen";

    const closeBtn = document.createElement("button");
    closeBtn.id = "monitorCloseBtn";
    closeBtn.textContent = "✕";
    closeBtn.addEventListener("click", () => closeMonitor());

    const grid = document.createElement("div");
    grid.id = "projectGrid";

    // figure out columns
    const count = projects.length;
    const cols = count <= 3 ? count : count <= 6 ? 3 : 3;
    grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

    screen.appendChild(closeBtn);
    screen.appendChild(grid);
    overlay.appendChild(screen);
    document.body.appendChild(overlay);

    requestAnimationFrame(() => overlay.classList.add("visible"));

    // animate cards in left to right, top to bottom
    projects.forEach((project, i) => {
        const card = document.createElement("div");
        card.classList.add("projectCard");

        card.innerHTML = `
    ${project.cover ? `<div class="projectCover" style="background-image: url('${project.cover}')"></div>` : ""}
    <div class="projectCardInner">
        <h3 class="projectTitle">${project.title}</h3>
        <p class="projectDesc">${project.description}</p>
    </div>
`;

        card.addEventListener("click", () => openProjectDetail(project));
        grid.appendChild(card);

        setTimeout(() => {
            card.classList.add("visible");
        }, i * 100);
    });

    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) closeMonitor();
    });
}

function closeMonitor(instant = false) {
    const overlay = document.getElementById("monitorOverlay");
    if (!overlay) return;

    const detail = document.getElementById("projectDetailOverlay");
    if (detail) detail.remove();

    if (instant) { overlay.remove(); return; }
    overlay.classList.remove("visible");
    overlay.addEventListener("transitionend", () => overlay.remove(), { once: true });
}

/* ----------------------------
   PROJECT DETAIL VIEW
---------------------------- */
function openProjectDetail(project) {
    const existing = document.getElementById("projectDetailOverlay");
    if (existing) existing.remove();

    const overlay = document.createElement("div");
    overlay.id = "projectDetailOverlay";

    const detail = document.createElement("div");
    detail.id = "projectDetail";

    const backBtn = document.createElement("button");
    backBtn.id = "detailBackBtn";
    backBtn.textContent = "← Back";
    backBtn.addEventListener("click", () => {
        overlay.classList.remove("visible");
        overlay.addEventListener("transitionend", () => overlay.remove(), { once: true });
    });

    // carousel
    let currentSlide = 0;
    const carousel = document.createElement("div");
    carousel.id = "detailCarousel";

    if (project.photos && project.photos.length > 0) {
        const imgEl = document.createElement("img");
        imgEl.id = "carouselImg";
        imgEl.src = project.photos[0];

        const prevBtn = document.createElement("button");
        prevBtn.classList.add("carouselBtn");
        prevBtn.id = "carouselPrev";
        prevBtn.textContent = "‹";
        prevBtn.addEventListener("click", () => {
            currentSlide = (currentSlide - 1 + project.photos.length) % project.photos.length;
            changeSlide(imgEl, project.photos[currentSlide]);
        });

        const nextBtn = document.createElement("button");
        nextBtn.classList.add("carouselBtn");
        nextBtn.id = "carouselNext";
        nextBtn.textContent = "›";
        nextBtn.addEventListener("click", () => {
            currentSlide = (currentSlide + 1) % project.photos.length;
            changeSlide(imgEl, project.photos[currentSlide]);
        });

        const dots = document.createElement("div");
        dots.id = "carouselDots";
        project.photos.forEach((_, i) => {
            const dot = document.createElement("span");
            dot.classList.add("carouselDot");
            if (i === 0) dot.classList.add("active");
            dot.addEventListener("click", () => {
                currentSlide = i;
                changeSlide(imgEl, project.photos[currentSlide]);
                updateDots(dots, currentSlide);
            });
            dots.appendChild(dot);
        });

        // hide arrows if only one photo
        if (project.photos.length === 1) {
            prevBtn.style.display = "none";
            nextBtn.style.display = "none";
        }

        carousel.appendChild(prevBtn);
        carousel.appendChild(imgEl);
        carousel.appendChild(nextBtn);
        carousel.appendChild(dots);

        function changeSlide(imgEl, src) {
            imgEl.style.opacity = "0";
            setTimeout(() => {
                imgEl.src = src;
                imgEl.style.opacity = "1";
            }, 200);
            updateDots(dots, currentSlide);
        }

        function updateDots(dotsEl, active) {
            [...dotsEl.children].forEach((d, i) => {
                d.classList.toggle("active", i === active);
            });
        }
    }

    // info section
    const info = document.createElement("div");
    info.id = "detailInfo";
    info.innerHTML = `
        <h2 id="detailTitle">${project.title}</h2>
        <p id="detailDesc">${project.description}</p>
        <a id="detailLink" href="${project.link}" target="_blank">View Project →</a>
    `;

    detail.appendChild(backBtn);
    detail.appendChild(carousel);
    detail.appendChild(info);
    overlay.appendChild(detail);
    document.body.appendChild(overlay);

    requestAnimationFrame(() => overlay.classList.add("visible"));
}
const menu = document.querySelector("#toggle-menu");
const menuLinks = document.querySelectorAll("nav ul a");

if (menu) {
  menuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      menu.checked = false;
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menu.checked) {
      menu.checked = false;
    }
  });
}

const style = document.createElement("style");

style.textContent = `
  @media (max-width: 900px) {
    nav ul {
      display: flex !important;
      flex-direction: column;
      align-items: stretch;
      gap: 0;
      max-height: 0;
      opacity: 0;
      visibility: hidden;
      overflow: hidden;
      padding-top: 0;
      transition:
        max-height 0.4s ease,
        opacity 0.3s ease,
        padding 0.3s ease,
        visibility 0.3s;
    }

    nav input:checked ~ ul {
      max-height: 400px;
      opacity: 1;
      visibility: visible;
      padding-top: 10px;
    }
  }

  #heroes article img {
    cursor: zoom-in;
    transition: transform 0.35s ease, filter 0.35s ease;
  }

  #heroes article img:hover {
    transform: scale(1.025);
    filter: saturate(1);
  }

  #character-viewer {
    position: fixed;
    inset: 0;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    background: rgba(5, 7, 8, 0.94);
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    transition: opacity 0.3s ease, visibility 0.3s ease;
  }

  #character-viewer[data-open="true"] {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
  }

  #character-viewer img {
    max-width: min(90vw, 650px);
    max-height: 82vh;
    width: auto;
    height: auto;
    object-fit: contain;
    border: 1px solid #C89A63;
    box-shadow: 0 15px 60px rgba(0, 0, 0, 0.4);
    transform: scale(0.96);
    transition: transform 0.3s ease;
  }

  #character-viewer[data-open="true"] img {
    transform: scale(1);
  }

  #character-viewer button {
    position: absolute;
    top: 18px;
    left: 22px;
    width: 46px;
    height: 46px;
    border: 1px solid rgba(200, 154, 99, 0.5);
    border-radius: 50%;
    background: #171A1D;
    color: #F1EEE8;
    font-size: 30px;
    line-height: 1;
    cursor: pointer;
    transition: background 0.25s ease, color 0.25s ease;
  }

  #character-viewer button:hover {
    background: #C89A63;
    color: #101214;
  }

  #character-viewer p {
    position: absolute;
    bottom: 12px;
    right: 20px;
    left: 20px;
    color: #F1EEE8;
    text-align: center;
    font-size: 14px;
  }

  main section > [data-reveal] {
    opacity: 0;
    transform: translateY(22px);
    transition: opacity 0.7s ease, transform 0.7s ease;
  }

  main section > [data-reveal][data-visible="true"] {
    opacity: 1;
    transform: translateY(0);
  }

  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      scroll-behavior: auto !important;
      transition-duration: 0.01ms !important;
      animation-duration: 0.01ms !important;
    }

    main section > [data-reveal] {
      opacity: 1;
      transform: none;
    }
  }
`;

document.head.appendChild(style);

const viewer = document.createElement("div");
viewer.id = "character-viewer";
viewer.setAttribute("aria-hidden", "true");

const viewerImage = document.createElement("img");
viewerImage.alt = "";

const closeButton = document.createElement("button");
closeButton.type = "button";
closeButton.textContent = "×";
closeButton.setAttribute("aria-label", "إغلاق الصورة");

const caption = document.createElement("p");

viewer.append(viewerImage, closeButton, caption);
document.body.appendChild(viewer);

let lastFocusedImage = null;

function closeViewer() {
  viewer.dataset.open = "false";
  viewer.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";

  if (lastFocusedImage) {
    lastFocusedImage.focus();
  }
}

document.querySelectorAll("#heroes article img").forEach((image) => {
  image.tabIndex = 0;
  image.setAttribute("role", "button");
  image.setAttribute("aria-label", `تكبير صورة ${image.alt}`);

  function openViewer() {
    lastFocusedImage = image;
    viewerImage.src = image.currentSrc || image.src;
    viewerImage.alt = image.alt;
    caption.textContent = image.alt;

    viewer.dataset.open = "true";
    viewer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    closeButton.focus();
  }

  image.addEventListener("click", openViewer);

  image.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openViewer();
    }
  });
});

closeButton.addEventListener("click", closeViewer);

viewer.addEventListener("click", (event) => {
  if (event.target === viewer) {
    closeViewer();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && viewer.dataset.open === "true") {
    closeViewer();
  }
});

const revealElements = document.querySelectorAll(
  "main section > div, main section > figure, main section > article, main section > img"
);

if ("IntersectionObserver" in window) {
  revealElements.forEach((element) => {
    element.setAttribute("data-reveal", "");
  });

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.setAttribute("data-visible", "true");
          currentObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -35px 0px"
    }
  );

  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => {
    element.setAttribute("data-visible", "true");
  });
}
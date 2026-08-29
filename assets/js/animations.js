function buildCurrent(container, amount) {
  if (!container) return;
  const fragment = document.createDocumentFragment();

  for (let index = 0; index < amount; index += 1) {
    const stroke = document.createElement("span");
    stroke.className = "current-stroke";
    stroke.style.left = `${(index / Math.max(1, amount - 1)) * 100}%`;
    stroke.style.setProperty("--stroke-height", `${28 + ((index * 37) % 108)}px`);
    stroke.style.setProperty("--stroke-opacity", `${0.16 + ((index * 11) % 32) / 100}`);
    fragment.append(stroke);
  }

  container.append(fragment);
}

function initNavigation() {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#main-nav");

  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open));
    toggle.textContent = open ? "Menú" : "Cerrar";
    nav.classList.toggle("is-open", !open);
    document.body.classList.toggle("menu-open", !open);
  });

  nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
    toggle.setAttribute("aria-expanded", "false");
    toggle.textContent = "Menú";
    nav.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  }));
}

export function initAnimations() {
  buildCurrent(document.querySelector("[data-current-band]"), 74);
  document.documentElement.classList.add("motion-ready");
  initNavigation();
}

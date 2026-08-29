import { getAnswers, setAnswer } from "./state.js";

const summaryLabels = {
  rol: "Sos",
  busca: "Buscás",
  eventos: "Te copan",
  bring: "Traés",
  need: "Te falta",
  gestos: "Podrías",
};

// Devolución inmediata a la pregunta 1: cada respuesta muestra algo, no sólo se guarda.
const rolEchoes = {
  "Estudio": "Hay 9 personas acá que están estudiando algo.",
  "Construyo cosas": "Hay 14 personas acá que construyen cosas.",
  "Tengo una empresa": "Hay 6 empresas de la región dando vueltas por acá.",
  "Diseño": "Hay 5 diseñadores buscando con quién probar ideas.",
  "Investigo": "Hay 4 investigadores queriendo salir del paper.",
  "Emprendo": "Hay 11 personas emprendiendo algo en este momento.",
  "Sector público": "Hay 3 personas del sector público buscando resolver cosas concretas.",
  "Tengo una idea": "La mitad de la comunidad empezó igual: con una idea y nadie con quien hablarla.",
  "Me interesa nomás": "Perfecto. La mayoría llegó por curiosidad.",
  "Otra cosa": "Mejor. Las mezclas raras son las que más sirven acá.",
};

function valueExists(value) {
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "string") return value.trim().length > 0;
  return Boolean(value);
}

function renderSummary() {
  const summary = document.querySelector("[data-summary]");
  if (!summary) return;

  const answers = getAnswers();
  const entries = Object.entries(summaryLabels).filter(([key]) => valueExists(answers[key]));
  summary.replaceChildren();
  summary.hidden = entries.length === 0;

  entries.forEach(([key, label]) => {
    const row = document.createElement("div");
    row.className = "summary-row";

    const term = document.createElement("span");
    term.textContent = label;

    const description = document.createElement("span");
    description.textContent = Array.isArray(answers[key])
      ? answers[key].join(" · ")
      : answers[key];

    row.append(term, description);
    summary.append(row);
  });
}

/* Chips: un grupo por pregunta, de selección única o múltiple con tope opcional. */
function initChipGroups() {
  document.querySelectorAll("[data-chip-group]").forEach((group) => {
    const key = group.dataset.chipGroup;
    const single = group.dataset.mode === "single";
    const cap = Number(group.dataset.cap) || 0;
    const buttons = [...group.querySelectorAll("[data-chip]")];

    const paint = () => {
      const current = getAnswers()[key];
      buttons.forEach((button) => {
        const value = button.dataset.chip;
        const on = single ? current === value : current.includes(value);
        button.setAttribute("aria-pressed", String(on));
      });
    };

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const value = button.dataset.chip;
        const current = getAnswers()[key];

        if (single) {
          setAnswer(key, current === value ? null : value);
          return;
        }

        let next = current.includes(value)
          ? current.filter((item) => item !== value)
          : [...current, value];

        // Con tope, la última elección desplaza a la más vieja en lugar de bloquear.
        if (cap && next.length > cap) next = next.slice(next.length - cap);
        setAnswer(key, next);
      });
    });

    paint();
    window.addEventListener("remo:answers", paint);
  });
}

function initRolEcho() {
  const echo = document.querySelector("[data-rol-echo]");
  if (!echo) return;

  const paint = () => {
    const rol = getAnswers().rol;
    echo.textContent = rol ? rolEchoes[rol] ?? "" : "";
    echo.hidden = !echo.textContent;
  };

  paint();
  window.addEventListener("remo:answers", paint);
}

/* Mecanismo: una necesidad se enciende junto a la capacidad que la resuelve. */
function initMatch() {
  const needs = [...document.querySelectorAll("[data-match]")];
  const haves = [...document.querySelectorAll("[data-have]")];
  const outcome = document.querySelector("[data-match-outcome]");
  if (!needs.length || !outcome) return;

  let active = null;

  const paint = () => {
    needs.forEach((need) => need.setAttribute("aria-pressed", String(need.dataset.match === active)));
    haves.forEach((have) => have.classList.toggle("is-active", have.dataset.have === active));

    const selected = active && needs.find((need) => need.dataset.match === active);
    outcome.textContent = selected ? selected.dataset.outcome : "";
    outcome.hidden = !selected;
  };

  needs.forEach((need) => {
    need.addEventListener("click", () => {
      active = active === need.dataset.match ? null : need.dataset.match;
      paint();
    });
  });

  paint();
}

/* Palanca: cada gesto elegido suma un trazo y corre el bloque un poco más. */
function initLever() {
  const lever = document.querySelector("[data-lever]");
  if (!lever) return;

  const block = lever.querySelector("[data-lever-block]");
  const label = lever.querySelector("[data-lever-label]");
  const track = lever.querySelector("[data-lever-strokes]");
  const total = document.querySelectorAll('[data-chip-group="gestos"] [data-chip]').length;

  track.replaceChildren();
  for (let index = 0; index < total; index += 1) {
    const stroke = document.createElement("span");
    stroke.className = "lever-stroke";
    track.append(stroke);
  }

  const strokes = [...track.children];

  const paint = () => {
    const count = getAnswers().gestos.length;
    strokes.forEach((stroke, index) => stroke.classList.toggle("is-on", index < count));
    label.textContent = count === 0
      ? "elegí uno y mirá"
      : `${count} ${count === 1 ? "empuje" : "empujes"}`;
    block.style.transform = `translateX(${Math.min(count * 7, 49)}px)`;
  };

  paint();
  window.addEventListener("remo:answers", paint);
}

function updateCrossState() {
  const answers = getAnswers();
  const board = document.querySelector("[data-cross-board]");
  const result = document.querySelector("[data-cross-result]");
  if (!board || !result) return;

  const hasBring = answers.bring.trim().length > 0;
  const hasNeed = answers.need.trim().length > 0;
  board.classList.toggle("has-bring", hasBring);
  board.classList.toggle("has-need", hasNeed);
  board.classList.toggle("is-complete", hasBring && hasNeed);

  if (hasBring && hasNeed) {
    result.textContent = `Tu punto de partida: traés ${answers.bring} y te falta ${answers.need}.`;
  } else if (hasBring || hasNeed) {
    result.textContent = "Ya completaste una orilla. La otra puede quedar para después.";
  } else {
    result.textContent = "Todavía no completaste ninguna orilla.";
  }
}

function initCrossInputs() {
  const bring = document.querySelector("[data-bring]");
  const need = document.querySelector("[data-need]");
  if (!bring || !need) return;

  const answers = getAnswers();
  bring.value = answers.bring;
  need.value = answers.need;

  bring.addEventListener("input", () => setAnswer("bring", bring.value.trim()));
  need.addEventListener("input", () => setAnswer("need", need.value.trim()));
}

export function initOnboarding() {
  initCrossInputs();
  initChipGroups();
  initRolEcho();
  initMatch();
  initLever();
  updateCrossState();
  renderSummary();

  window.addEventListener("remo:answers", () => {
    updateCrossState();
    renderSummary();
  });
}

const STORAGE_KEY = "remo-onboarding-v3";

const emptyState = {
  rol: null,
  busca: [],
  eventos: [],
  gestos: [],
  bring: "",
  need: "",
};

function read() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY));
    return { ...emptyState, ...(saved || {}) };
  } catch {
    return { ...emptyState };
  }
}

let answers = read();

export function getAnswers() {
  return structuredClone(answers);
}

export function setAnswer(key, value) {
  answers = {
    ...answers,
    [key]: Array.isArray(value) ? [...value] : value,
  };

  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
  } catch {
    // La experiencia sigue funcionando aunque el navegador bloquee el storage.
  }

  window.dispatchEvent(new CustomEvent("remo:answers", { detail: getAnswers() }));
}

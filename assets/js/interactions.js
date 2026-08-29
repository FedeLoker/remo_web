import { getAnswers } from "./state.js";

/* ------------------------------------------------------------------
   PLACEHOLDER — el envío todavía no está conectado.

   Cuando haya backend, reemplazar el cuerpo de esta función por el fetch
   correspondiente y devolver { ok: true } SÓLO después de una respuesta
   exitosa del servidor. Todo lo demás (validación, estados del botón,
   confirmación) ya está armado alrededor y no hay que tocarlo.

   Mientras tanto no se guarda nada: los datos quedan en la consola.
   Acordate de borrar también los <p class="pending-note"> del index.html.
   ------------------------------------------------------------------ */
async function enviarInscripcion(datos) {
  console.info("[REMO] Inscripción sin enviar (placeholder):", datos);
  return { ok: true, pendiente: true };
}

const mensajes = {
  name: "Decinos tu nombre.",
  city: "¿Desde qué ciudad escribís?",
  contact: "Dejanos un mail o un WhatsApp para poder escribirte.",
};

function esContactoValido(valor) {
  const texto = valor.trim();
  const esMail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(texto);
  const esTelefono = texto.replace(/\D/g, "").length >= 8;
  return esMail || esTelefono;
}

function validarCampo(form, nombre) {
  const campo = form.elements[nombre];
  const error = form.querySelector(`[data-error="${nombre}"]`);
  const valor = campo.value.trim();
  const valido = nombre === "contact" ? esContactoValido(valor) : valor.length >= 2;

  error.textContent = valido ? "" : mensajes[nombre];
  campo.setAttribute("aria-invalid", String(!valido));
  return valido;
}

function validar(form) {
  // Se evalúan todos para que se marquen juntos, no de a uno por intento.
  return ["name", "city", "contact"].map((n) => validarCampo(form, n)).every(Boolean);
}

function reunirDatos(form) {
  const respuestas = getAnswers();

  return {
    nombre: form.elements.name.value.trim(),
    ciudad: form.elements.city.value.trim(),
    contacto: form.elements.contact.value.trim(),
    nota: form.elements.note.value.trim(),
    rol: respuestas.rol,
    busca: respuestas.busca,
    eventos: respuestas.eventos,
    gestos: respuestas.gestos,
    enviadoEn: new Date().toISOString(),
  };
}

export function initInteractions() {
  const form = document.querySelector("[data-join-form]");
  if (!form) return;

  const boton = form.querySelector("[data-submit]");
  const etiqueta = form.querySelector("[data-submit-label]");
  const estado = form.querySelector("[data-form-status]");
  const confirmacion = document.querySelector("[data-join-done]");
  const etiquetaInicial = etiqueta.textContent;

  // Al corregir un campo ya marcado, el error se va solo.
  ["name", "city", "contact"].forEach((nombre) => {
    form.elements[nombre].addEventListener("input", () => {
      if (form.elements[nombre].getAttribute("aria-invalid") === "true") validarCampo(form, nombre);
    });
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!validar(form)) {
      estado.textContent = "Falta completar algo antes de mandarlo.";
      form.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }

    boton.disabled = true;
    etiqueta.textContent = "Enviando…";
    estado.textContent = "";

    try {
      const resultado = await enviarInscripcion(reunirDatos(form));
      if (!resultado?.ok) throw new Error("envío rechazado");

      form.hidden = true;
      confirmacion.hidden = false;
      confirmacion.setAttribute("tabindex", "-1");
      confirmacion.focus();
    } catch {
      // La confirmación no aparece si el envío no salió bien.
      estado.textContent = "No pudimos enviarlo. Probá de nuevo en un rato.";
      boton.disabled = false;
      etiqueta.textContent = etiquetaInicial;
    }
  });
}

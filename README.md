# Landing REMO

Landing estática para la etapa inicial de REMO, armada sobre el documento de concepto
y las maquetas de `ejemplo claude design/`.

## Cómo verla

Por usar módulos JavaScript, debe abrirse desde un servidor local:

```bash
python3 -m http.server 8877
```

Después visitar `http://localhost:8877`.

## Recorrido

Sigue el orden del concepto: primero evidencia, después participación, recién al final identidad.

1. **Hero**: qué es REMO.
2. **Personas**: quién anda por acá. Cierra con la pregunta *Contanos un poco de vos…*
   (10 opciones, selección única) y devuelve un dato al responder.
3. **Mecanismo**: necesidades y capacidades que se encuentran al tocarlas. Cierra con
   *¿Qué buscas?* (10 opciones, hasta dos).
4. **Eventos**: cartelera de encuentros. Cierra con *Eventos que no queres perderte:*
   (10 opciones, múltiple).
5. **Participar**: siete gestos mínimos.
6. **Sumarse**: devuelve lo respondido y pide nombre, ciudad y un contacto.

Todas las respuestas son opcionales, viven en `sessionStorage` y se ven resumidas en el cierre.

Quedaron en el CSS y el JS los estilos de tres bloques que hoy no están en el HTML — el cruce
de texto libre (`.cross-*`), el tramo de visión (`.vision-*`), los pasos 01–05 (`.flow-*`) y la
palanca de empujes (`.lever-*`). No molestan y sirven si alguno vuelve; el JS los detecta y sigue
de largo si no están.

## Contenido de muestra a reemplazar

Estas partes vienen del documento de concepto y son **placeholders**; están marcadas con
comentarios `PLACEHOLDER` en `index.html`:

- **Personas** (Lucía, Martín, Juana, Andrés, Sofía) y la cita: reemplazar por integrantes
  reales y cambiar los marcadores `FOTO — …` por fotos.
- **Mecanismo**: los pares "me hace falta / me encontré a" y sus resultados.
- **Eventos**: fechas, ciudades y estados de cupo.
- **Eco de la primera pregunta**: los conteos de `rolEchoes` en `assets/js/onboarding.js`
  ("Hay 14 personas acá que…") son inventados; ajustarlos o vaciarlos antes de publicar.

## Archivos principales

- `index.html`: estructura y copy.
- `assets/css/tokens.css`: colores, tipografías, escalas y espacios.
- `assets/css/base.css`: normalización y accesibilidad general.
- `assets/css/layout.css`: contenedores y ritmo vertical.
- `assets/css/components.css`: navegación, chips, bloques de pregunta y formulario.
- `assets/css/sections.css`: hero, personas, mecanismo, eventos, participar, cierre y pie.
- `assets/css/responsive.css`: adaptaciones para tablet y mobile.
- `assets/css/motion.css`: entradas y movimiento reducido.
- `assets/js/state.js`: estado de la sesión (`rol`, `busca`, `eventos`, `gestos`).
- `assets/js/onboarding.js`: chips, eco, mecanismo y resumen.
- `assets/js/interactions.js`: validación del formulario y envío (hoy, placeholder).
- `assets/js/animations.js`: motivo visual del hero y menú móvil.

## Envío del contacto — todavía sin conectar

El formulario pide **nombre, ciudad y un contacto** (mail o WhatsApp: vale cualquiera de los dos,
se acepta un mail bien formado o un número de al menos 8 dígitos). Valida los tres campos, muestra
los errores en su lugar y recién entonces "envía".

**El envío es un placeholder.** Toda la lógica está en `enviarInscripcion()`, arriba de
`assets/js/interactions.js`: hoy sólo escribe los datos en la consola y devuelve `{ ok: true }`.
Nada se guarda en ningún lado.

Para conectarlo:

1. Reemplazar el cuerpo de `enviarInscripcion()` por el `fetch` al backend, y devolver `ok: true`
   **sólo** después de una respuesta exitosa del servidor. El resto —validación, estado del botón,
   confirmación, manejo de error— ya está armado alrededor y no hay que tocarlo.
2. Borrar los dos `<p class="pending-note">` del `index.html` (están marcados con un comentario
   `PLACEHOLDER`) y, si querés, la regla `.pending-note` de `assets/css/components.css`.

Mientras tanto esos dos avisos dejan claro en pantalla que el envío no está conectado, para que
nadie complete el formulario creyendo que se sumó. Si el envío falla, la confirmación no aparece:
se muestra un error y el botón vuelve a habilitarse.

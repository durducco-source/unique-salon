# UNIQUE Salon — Web oficial

Web editorial de lujo para **UNIQUE Salon**, salón de uñas y maquillaje profesional en **Carrer de Miquel Ferrer, 11 · 17310 Lloret de Mar (Girona)**.

🔗 **Web publicada:** https://durducco-source.github.io/unique-salon/
📸 Instagram: [@_unique.salon](https://www.instagram.com/_unique.salon/) · [@unique.nails](https://www.instagram.com/unique.nails/)

---

## Estructura

```
unique-salon/
├── index.html              ← página principal (SEO, Open Graph, datos estructurados)
├── 404.html                ← página de error con la marca
├── favicon.svg / favicon-32.png / apple-touch-icon.png / icon-512.png
├── site.webmanifest        ← icono al guardar la web en el móvil
├── robots.txt / sitemap.xml
├── .nojekyll               ← GitHub Pages sirve los archivos tal cual
└── assets/
    ├── css/styles.css      ← todo el diseño (mobile first)
    ├── js/config.js        ← ★ DATOS DE CONTACTO (WhatsApp, horario…)
    ├── js/main.js          ← animaciones e interacciones
    ├── vendor/             ← GSAP 3.12.5, ScrollTrigger y Lenis 1.1.13 (locales, sin CDN)
    └── img/                ← fotos reales del salón optimizadas (1080 px + versión -sm 560 px)
```

Web estática: **no necesita instalar nada ni compilar**. Basta con abrir `index.html` a través de un servidor o publicarla.

## Secciones

1. Hero cinematográfico (pantalla de carga, nombre animado letra a letra, fotos con parallax)
2. Introducción + datos clave (★ 5,0 en Google, horario, dirección)
3. Servicios (Uñas / Maquillaje) con vista previa de foto al pasar el ratón
4. La experiencia UNIQUE
5. Uñas — galería horizontal fijada al hacer scroll (carrusel deslizable en móvil)
6. Maquillaje
7. Galería editorial con lightbox
8. Opiniones de Google
9. Instagram
10. Ubicación (mapa, horario con "Abierto/Cerrado ahora", contacto)
11. Reserva (WhatsApp)
12. Footer

En móvil aparece una barra fija "Reservar cita" + botón de llamada.

## Cómo cambiar datos

| Qué | Dónde |
|---|---|
| Número de WhatsApp / mensaje prellenado | `assets/js/config.js` |
| Horario del indicador "Abierto ahora" | `assets/js/config.js` (y la tabla en `index.html`, sección *Ubicación*) |
| Textos | `index.html` |
| Colores / tipografías | variables al inicio de `assets/css/styles.css` |
| Fotos | sustituir en `assets/img/` manteniendo el mismo nombre |

## Datos utilizados (fuentes públicas, septiembre 2026)

- **Google Maps — UNIQUE SALON:** dirección, teléfono 663 09 10 30, horario (L–V 10–20 h, sáb 10–14 h, dom cerrado), valoración 5,0 con 26 opiniones y las 3 reseñas citadas.
- **Instagram @_unique.salon:** "Maquillaje profesional y Uñas", "Citas por DM", teléfono y email (`Salonunique976@gmail.com`) publicados en su post "Pide cita".
- **Instagram @unique.nails** (cuenta de uñas vinculada): "Uñas de gel", "Diseños personalizados", manicura francesa y nail art (hashtags de sus publicaciones).
- **Fotos:** publicaciones públicas de @_unique.salon / @unique.nails y fotos de la ficha de Google.
- **No se muestran precios** porque no hay precios públicos fiables.

## Publicar / volver a publicar (GitHub Pages)

```bash
git add .
git commit -m "Actualiza contenido"
git push
```

GitHub Pages está configurado en *Settings → Pages → Deploy from a branch → `main` / `(root)`*. Cada `push` actualiza la web en 1–2 minutos.

## Ver en local

Cualquier servidor estático sirve, por ejemplo:

```bash
npx serve .
```

o con Python: `python -m http.server 8000` y abrir http://localhost:8000

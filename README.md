# E-DIGNA — Educación Digital con Dignidad

Proyecto de investigación y concienciación en ciberseguridad desarrollado por **Alejandro Pérez Dávila**. Suite de herramientas web interactivas que enseñan seguridad digital de forma práctica y accesible.

**Demo en vivo:** [https://perezdAlejo.github.io/E-DIGNA](https://perezdAlejo.github.io/E-DIGNA)

---

## Herramientas

### 🔑 Comprobador Inteligente de Contraseñas
[`/comprobador-passwords`](./comprobador-passwords/)

Analiza la fortaleza de contraseñas en tiempo real usando el algoritmo `zxcvbn`. Simula retroalimentación de "IA" con detección de patrones comunes (fechas, secuencias, nombres) y genera una versión mejorada de la contraseña ingresada. **100% local — la contraseña nunca sale del dispositivo.**

---

### 🪞 El Espejo Digital
[`/espejo-digital`](./espejo-digital/)

Muestra la huella digital que cualquier sitio web puede leer silenciosamente: navegador, sistema operativo, resolución, zona horaria, idioma e IP pública. Usa la API de `ipify.org` para la IP; todo lo demás es `navigator` y `screen` del navegador, sin backend.

---

### 🎣 Simulador de Phishing
[`/simulador-phishing`](./simulador-phishing/)

Juego de 3 niveles donde el usuario identifica las "Banderas Rojas" en correos, SMS y mensajes de WhatsApp falsos. Clic en el elemento sospechoso → tooltip explicativo. Al completar los `flagsNeeded` del escenario, desbloquea el siguiente nivel. Añadir nuevos casos: agregar un objeto al array `scenarios` en `script.js`.

---

### 📷 Revelador de Metadatos EXIF
[`/visor-exif`](./visor-exif/)

Drag & drop de una foto → extrae y muestra metadatos EXIF con la biblioteca `exifr`. Resalta datos sensibles (GPS, modelo de cámara, fecha exacta). **La imagen no se sube a ningún servidor.** Las fotos de WhatsApp/redes ya tienen metadatos borrados; funciona mejor con fotos directas de la cámara.

---

## Uso Local

No requiere instalación ni servidor. Abrir directamente en el navegador:

```bash
# Opción 1: Doble clic en index.html

# Opción 2: Servidor local simple (evita restricciones CORS en algunos navegadores)
python -m http.server 8000
# Luego abrir http://localhost:8000
```

## Despliegue

GitHub Pages desde la rama `main`, raíz del repositorio. Ver [`DEPLOYMENT.md`](./DEPLOYMENT.md) para instrucciones paso a paso.

## Tecnologías

| Herramienta | Función |
|---|---|
| `zxcvbn.js` (CDN) | Análisis de entropía de contraseñas |
| `exifr` (CDN) | Parseo de metadatos EXIF |
| Font Awesome 6.4 | Iconografía |
| `api64.ipify.org` | IP pública (Espejo Digital) |

Sin frameworks, sin build step, sin dependencias npm.

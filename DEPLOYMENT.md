# Guía de Despliegue en GitHub Pages - E-DIGNA

Este documento te guiará paso a paso para publicar el proyecto **E-DIGNA** en internet usando GitHub Pages, un servicio gratuito para alojar sitios web estáticos.

## Requisitos Previos
1. Tener una cuenta en [GitHub](https://github.com/).
2. Tener instalado **Git** en tu computadora (opcional, si decides subirlo usando la web de GitHub directamente).

## Opción 1: Subida rápida y directa usando GitHub Web (Recomendado)

Si no quieres usar la consola, sigue estos pasos:

1. **Crear Repositorio:**
   - Inicia sesión en GitHub.
   - Ve a la esquina superior derecha, dale click al símbolo **+** y selecciona **New repository**.
   - Ponle un nombre, por ejemplo: `e-digna-project`.
   - Ponlo en **Public** (importante para que GitHub Pages funcione gratis).
   - Haz clic en **Create repository**.

2. **Subir los Archivos:**
   - En la página del repositorio recién creado, busca la opción que dice **"uploading an existing file"** (debajo de Quick setup).
   - Arrastra TODO el contenido de tu carpeta `e-digna` de tu computadora (incluyendo `index.html`, `styles.css`, `E-DIGNA.docx` y las carpetas `comprobador-passwords/` y `espejo-digital/`) al recuadro de GitHub.
   - Espera a que suban todos.
   - Escribe un mensaje de confirmación como "Versión inicial estática" y dale clic a **Commit changes**.

3. **Activar GitHub Pages:**
   - Ve a la pestaña **Settings** (Configuración) de tu repositorio.
   - En el menú lateral izquierdo, baja hasta la sección **Pages**.
   - En la sección **Build and deployment**, asegúrate de que **Source** sea `Deploy from a branch`.
   - En **Branch**, selecciona `main` (o `master`) y la carpeta `/ (root)`. Luego dale a **Save**.
   - ¡Listo! En un par de minutos, verás un mensaje en esa misma pantalla con el link de tu proyecto (Ej: `https://tu-usuario.github.io/e-digna-project/`).

---

## Opción 2: Subida usando Git y Consola

1. Abre tu terminal (PowerShell o CMD) en la carpeta `c:\Users\User\Desktop\e-digna`.
2. Ejecuta los siguientes comandos (reemplazando `TU-USUARIO` con tu usuario real):

```bash
git init
git add .
git commit -m "Primera versión completa de E-DIGNA (Landing + Herramientas reestructuradas)"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/e-digna-project.git
git push -u origin main
```
3. Luego, repite el Paso 3 (Activar GitHub Pages) de la Opción 1 para activarlo.

## Consideraciones Adicionales
- **Herramientas a Futuro:** Ya tienes preparadas en el código de la *Landing Page* las tarjetas para el **Simulador de Phishing** y el **Revelador EXIF**. Cuando quieras programarlos más adelante, solo debes crear sus carpetas correspondientes, programarlos, y activar sus botones en el `index.html` quitando la clase `disabled-card`.
- **Rutas Relativas:** Toda la estructura ahora usa rutas relativas (ej. `./espejo-digital/index.html`), por lo que navegar dentro de la página subida funcionará de manera automática.

# 📝 Resumen de cambios — Web Dra. Eliana Angarita Julio

Versión corregida lista para publicar en **constelaciones.qualitasas.com**.

## ✅ Correcciones aplicadas

### Identidad y datos profesionales
- Nombre corregido en TODA la web a **"Dra. Eliana Angarita Julio"** (antes "Elian Angarita Julio"): hero, navbar, sección "Sobre mí", footer, copyright, metadatos SEO y datos estructurados (schema.org).
- Título profesional actualizado a **"Psicóloga Clínica, Doctoranda y Consteladora Familiar Certificada Internacionalmente"** (antes "Psicóloga Infantil").
- Credenciales de la sección "Sobre mí" actualizadas a su formación real.

### Contacto y redes
- WhatsApp verificado: **+57 313 265 5265** (botón flotante, sección contacto y footer), con mensaje precargado.
- Email actualizado a **elianangarita@gmail.com**, ahora clicable (abre el correo).
- Facebook enlazado a **facebook.com/QUALITAIPS** (antes era un enlace roto `#`).
- Instagram marcado como **"Pronto"** (sin perfil activo aún), listo para enlazar cuando exista.
- Ubicación actualizada a **Bucaramanga · Barrancabermeja · Sesiones online** (antes "Bogotá").

### Imágenes
- **Retrato real de la Dra. Eliana** integrado en la sección "Sobre mí" (recortado de tus fotos, sin el texto sobreimpreso).
- Imagen para compartir en redes sociales (Open Graph) reemplazada por una foto real de Eliana (antes apuntaba a un archivo de Lovable).
- Imagen adicional `eliana-rojo.jpg` incluida en assets por si quieres usarla.

### Funcionalidad y robustez
- El formulario de contacto ahora tiene **plan B**: si falla el guardado en la base de datos, ofrece enviar el mensaje directo por WhatsApp (no se pierde ningún contacto).
- Metadatos genéricos de "Lovable App" reemplazados por la marca propia.

### Seguridad y despliegue
- Archivo `.env` (con tus claves) **protegido** para que no se suba a GitHub.
- Añadidos `.env.example` (plantilla segura) y `vercel.json` (configuración de despliegue).
- Build verificado: compila sin errores tanto en modo servidor como en preset Vercel.

## ⏸️ Pendiente / omitido (según lo acordado)
- **Chat de voz**: no existía en el código original (solo había música ambiental). Omitido para priorizar la publicación. La música ambiental se conserva, apagada por defecto.
- **Blog y guías descargables (lead magnet)**: el documento original los pedía como mejora de Fase 2. El blog actual muestra 3 artículos en modo "Próximamente". Se pueden desarrollar en una fase posterior.

## 📂 Archivos modificados
- `src/routes/index.tsx` — página principal (nombre, título, contacto, redes, testimonios, footer)
- `src/routes/__root.tsx` — metadatos globales SEO y Open Graph
- `src/components/site/Navbar.tsx` — nombre y subtítulo
- `src/components/site/ContactForm.tsx` — fallback a WhatsApp
- `src/assets/elian-portrait.jpg` — retrato real de Eliana (reemplazado)
- `src/assets/eliana-rojo.jpg` — foto adicional (nueva)
- `public/og-eliana.jpg` — imagen para redes sociales (nueva)
- `.gitignore`, `.env.example`, `vercel.json`, `DEPLOYMENT.md` — configuración y guía

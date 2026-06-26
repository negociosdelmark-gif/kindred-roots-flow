# 🚀 Guía de Despliegue — constelaciones.qualitasas.com

Sitio web de la **Dra. Eliana Angarita Julio** — Constelaciones Familiares.
Stack: TanStack Start (React 19 SSR) + Vite + Supabase. Destino: **Vercel + subdominio en Hostinger**.

---

## ⚠️ Antes de empezar — Seguridad

El archivo `.env` (con tus claves de Supabase) **YA está protegido** en `.gitignore`.
**Nunca lo subas a GitHub.** Las variables se cargan directamente en Vercel (Paso 3).

---

## PASO 1 — Subir el proyecto a GitHub

Tienes dos opciones:

### Opción A — Reemplazar tu repo existente (recomendado)
Ya tienes `github.com/negociosdelmark-gif/kindred-roots-flow`.

1. Descarga el `.zip` que te entregué y descomprímelo.
2. En tu repositorio de GitHub, sube/reemplaza **todos los archivos** con esta versión corregida.
   - Si usas GitHub Desktop: arrastra los archivos a la carpeta del repo, revisa los cambios y haz *Commit* → *Push*.
   - Si usas la web de GitHub: *Add file → Upload files*, arrastra todo, y confirma.
3. Verifica en GitHub que **NO aparezca el archivo `.env`** en la lista. (Si aparece, bórralo desde la web).

### Opción B — Crear un repo nuevo
1. En GitHub: *New repository* → nombre `constelaciones-eliana` → *Create*.
2. Sube todos los archivos del `.zip` (menos `.env`, `node_modules`, `.output`).

---

## PASO 2 — Conectar Vercel al repositorio

1. Entra a **https://vercel.com** y regístrate con tu cuenta de **GitHub** (botón "Continue with GitHub"). Es gratis.
2. En el panel: **Add New… → Project**.
3. Busca tu repositorio (`kindred-roots-flow` o `constelaciones-eliana`) y pulsa **Import**.
4. Vercel detectará la configuración automáticamente gracias al archivo `vercel.json` incluido. **No cambies nada** en "Build & Output Settings".
5. **NO pulses Deploy todavía** → primero ve a "Environment Variables" (Paso 3).

---

## PASO 3 — Cargar las variables de entorno en Vercel

En la pantalla de import (o luego en *Settings → Environment Variables*), agrega estas **5 variables**.
Cópialas EXACTAMENTE de tu archivo `.env`. Cada una debe estar marcada para los 3 entornos (Production, Preview, Development).

| Nombre | Valor |
|--------|-------|
| `SUPABASE_URL` | (tu valor de .env) |
| `SUPABASE_PUBLISHABLE_KEY` | (tu valor de .env) |
| `VITE_SUPABASE_PROJECT_ID` | (tu valor de .env) |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | (tu valor de .env) |
| `VITE_SUPABASE_URL` | (tu valor de .env) |

> 💡 Los valores reales están en el archivo `CREDENCIALES_VERCEL.txt` que te entregué por separado (ese archivo NO va a GitHub).

Luego pulsa **Deploy**. Espera 1-3 minutos. Vercel te dará una URL temporal como `constelaciones-eliana.vercel.app`. Ábrela y verifica que todo se ve bien.

---

## PASO 4 — Conectar tu subdominio de Hostinger

Ahora apuntamos `constelaciones.qualitasas.com` a Vercel.

### 4.1 — En Vercel
1. En tu proyecto → **Settings → Domains**.
2. Escribe `constelaciones.qualitasas.com` y pulsa **Add**.
3. Vercel te mostrará un registro **CNAME** que debes crear. Será algo como:
   - **Type:** CNAME
   - **Name:** `constelaciones`
   - **Value:** `cname.vercel-dns.com`
   (copia el valor exacto que te muestre Vercel).

### 4.2 — En Hostinger
1. Entra a **hPanel** de Hostinger → tu dominio `qualitasas.com`.
2. Ve a **DNS / Nameservers** (o "Zona DNS").
3. Pulsa **Agregar registro** y crea:
   - **Tipo:** CNAME
   - **Nombre:** `constelaciones`
   - **Apunta a / Destino:** `cname.vercel-dns.com` (el valor que te dio Vercel)
   - **TTL:** 3600 (o el que esté por defecto)
4. Guarda.

### 4.3 — Esperar propagación
La propagación DNS tarda entre **5 minutos y 24 horas** (normalmente < 1 hora).
Vercel verificará el dominio automáticamente y emitirá el certificado **HTTPS gratis**.
Cuando en Vercel → Domains veas el check verde ✅, tu sitio estará en:

### 🌐 https://constelaciones.qualitasas.com

---

## PASO 5 — Actualizaciones futuras

Cada vez que cambies algo:
1. Sube los cambios a GitHub (commit + push).
2. Vercel **redespliega automáticamente** en 1-2 minutos.

No necesitas tocar Hostinger de nuevo.

---

## ✅ Checklist de verificación final

- [ ] El sitio carga en la URL de Vercel
- [ ] El nombre dice "Dra. Eliana Angarita Julio"
- [ ] El botón verde de WhatsApp abre el chat al 313 265 5265
- [ ] El formulario de contacto envía (o muestra el fallback de WhatsApp)
- [ ] El enlace de Facebook abre facebook.com/QUALITAIPS
- [ ] El retrato de Eliana se ve en "Sobre mí"
- [ ] Se ve bien en celular
- [ ] El subdominio constelaciones.qualitasas.com resuelve con candado HTTPS 🔒

---

## 🆘 Solución de problemas

| Problema | Solución |
|----------|----------|
| Build falla en Vercel | Confirma que `vercel.json` está en el repo (trae el `--legacy-peer-deps`) |
| "Missing Supabase environment variable" | Revisa que cargaste las 5 variables en Vercel y volviste a desplegar |
| El dominio no resuelve | Espera más tiempo; verifica el CNAME en Hostinger sin errores de tipeo |
| Formulario no guarda | Normal si Supabase tiene restricciones; el fallback a WhatsApp lo cubre |

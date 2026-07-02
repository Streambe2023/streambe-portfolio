# Streambe Portfolio

Landing comercial con el portfolio de proyectos de Streambe + panel de administración privado (solo para correos `@streambe.com`) para agregar, editar y eliminar proyectos.

## Qué incluye

- **Landing pública (`/`)**: hero con el logo y tagline de Streambe ("Mejor tecnología. Mejor futuro."), grid de tarjetas de proyectos. Cada tarjeta muestra imagen, nombre y descripción, y al hacer click abre la URL del proyecto en una pestaña nueva.
- **Panel admin (`/admin`)**: login restringido a `@streambe.com` + contraseña, listado de proyectos, alta, edición y baja.
- **Marca**: colores y tipografías tomados del Manual de Marca de Streambe v1.0 (azul "Tech" `#0253E8`, celeste "Soft" `#2FB1FE`, marino "Digital" `#10192B`, tipografías Familjen Grotesk + Inter).
- **Stack**: Next.js 14 (App Router) + TypeScript + Tailwind CSS + Prisma (PostgreSQL). Autenticación propia, liviana, sin dependencias externas (hash de contraseña con `scrypt` nativo de Node, sesión firmada con `HMAC` nativo de Node — nada de servicios de terceros).

> **Importante:** este proyecto se escribió completo (código, estilos, base de datos, autenticación) pero **no pude instalar dependencias ni correrlo dentro de este entorno**, porque el sandbox no tiene acceso a los registros de paquetes (npm) por política de red. Revisé a mano cada archivo e imports para que compile, pero el primer `npm install && npm run dev` conviene hacerlo vos localmente (o dejar que Vercel lo haga en el deploy) para confirmar que todo levanta antes de darlo por cerrado.

---

## 1. Requisitos

- Node.js 18 o superior
- Una base de datos Postgres gratis. Recomendado: [Neon](https://neon.tech) (crea una en 1 minuto, plan free permanente) o [Supabase](https://supabase.com).
- Cuenta gratis en [Vercel](https://vercel.com) para el deploy (opcional pero recomendado).

## 2. Correrlo en tu computadora

```bash
cd streambe-portfolio
npm install
cp .env.example .env
```

Editá `.env`:

- `DATABASE_URL`: pegá la connection string de tu base Postgres (Neon te la da lista para copiar).
- `AUTH_SECRET`: una cadena larga y aleatoria. Generarla con:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- `ADMIN_EMAIL`: el correo del admin, debe terminar en `@streambe.com`.
- `ADMIN_PASSWORD`: la contraseña que va a usar para entrar a `/admin`.

Después:

```bash
npm run db:push       # crea las tablas en tu base de datos
npm run prisma:seed   # crea el usuario admin y 2 proyectos de ejemplo
npm run dev           # http://localhost:3000
```

Entrá a `http://localhost:3000` para ver la landing, y a `http://localhost:3000/admin/login` para entrar al panel con el `ADMIN_EMAIL` y `ADMIN_PASSWORD` que definiste.

## 3. Deploy en Vercel (recomendado)

1. Subí esta carpeta a un repositorio de GitHub (o pedime que te ayude a hacerlo).
2. En [vercel.com](https://vercel.com) → **Add New Project** → importá el repo.
3. En **Environment Variables** cargá las mismas 4 variables del `.env` (`DATABASE_URL`, `AUTH_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`).
4. Deploy. Vercel corre `npm install` (que ya deja Prisma listo) y `npm run build` automáticamente.
5. Una sola vez, desde tu computadora (apuntando a la misma `DATABASE_URL` de producción), corré:
   ```bash
   npm run db:push
   npm run prisma:seed
   ```
   Esto crea las tablas y el usuario admin en la base de producción.
6. Listo: tu landing va a estar en la URL que te da Vercel (podés conectarle un dominio propio, ej. `portfolio.streambe.com`, desde **Settings → Domains**).

## 4. Cómo cargar y mantener los proyectos

Desde `/admin`:

- **Agregar**: botón "+ Nuevo proyecto" → nombre, descripción corta, URL de imagen, URL del proyecto, orden.
- **Editar / Eliminar**: desde la tabla del panel.
- El campo de imagen es un **link directo a una imagen ya subida** (jpg/png/webp) — por ejemplo, un archivo de Google Drive compartido públicamente, Imgur, o una imagen ya alojada en el sitio del proyecto. No hay upload de archivos en esta versión (se priorizó simplicidad); si más adelante querés subir imágenes directamente desde el panel, se puede sumar con Cloudinary o similar.
- El campo "Orden" define en qué posición aparece cada tarjeta en la landing (menor número, primero).

## 5. Agregar o cambiar el usuario admin

Este MVP maneja el usuario admin en la base de datos (tabla `AdminUser`). Para crear o resetear uno:

1. Cambiá `ADMIN_EMAIL` / `ADMIN_PASSWORD` en tu `.env` (local o de producción).
2. Corré de nuevo `npm run prisma:seed` — crea el usuario si no existe, o le actualiza la contraseña si ya existe.

Para agregar un segundo admin sin tocar el que ya existe, se puede extender el seed o pedirme que te arme un pequeño script — avisame.

## 6. Personalización de marca

- Colores: `tailwind.config.ts` (sección `colors`).
- Tipografías: `src/app/layout.tsx` (Familjen Grotesk para títulos, Inter para texto — ambas vía Google Fonts, sin costo).
- Logo: `public/streambe-logo.svg` (usado en la landing y el login). También están `streambe-logo-color.svg` y `streambe-icon.svg` por si los querés usar en otro lado.
- Textos del hero: `src/app/page.tsx`.

## 7. Estructura del proyecto

```
streambe-portfolio/
├─ prisma/
│  ├─ schema.prisma       # modelos Project y AdminUser
│  └─ seed.ts             # crea admin + proyectos de ejemplo
├─ public/                # logos de Streambe
├─ src/
│  ├─ app/
│  │  ├─ page.tsx         # landing pública
│  │  ├─ layout.tsx       # fuentes + metadata
│  │  └─ admin/
│  │     ├─ login/page.tsx
│  │     └─ (dashboard)/  # protegido: listado, alta, edición
│  ├─ components/         # ProjectCard, ProjectForm, DeleteProjectButton
│  └─ lib/                # prisma, sesión/cookies, hash de contraseña, server actions
└─ README.md
```

## 8. Si algo no compila al primer `npm run dev`

- Chequeá que las 4 variables de entorno estén cargadas.
- Si tira un error relacionado a la tipografía `Familjen_Grotesk`, es porque esa versión puntual de Next.js no la tiene en su catálogo interno de Google Fonts — decime y la reemplazo por una carga vía `<link>` de Google Fonts directamente (alternativa igual de simple).
- Si Prisma se queja de que no encuentra el cliente generado, corré `npx prisma generate` a mano.

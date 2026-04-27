# Life as a Privilege — Contexto del proyecto

Plataforma web de salud holística (Ayurveda, MTC, Astrología, Cábala, Fitoterapia, Nutrición). Cursos, libros, vídeos, tests, recursos descargables y "espacio" privado para usuarios suscritos.

Idioma del código y UI: **español**. Idioma para hablar conmigo: **español**.

---

## Stack

**Backend** (`/backend`) — NestJS 11 + TypeScript
- Base de datos: **Supabase** (PostgreSQL) vía `@supabase/supabase-js` (NO TypeORM, aunque está instalado)
- Auth: JWT (`@nestjs/jwt` + `passport-jwt`) + Google OAuth (`passport-google-oauth20`)
- Pagos: Stripe
- Email: nodemailer
- Subida de ficheros: multer; sirve estáticos en `/img` desde `backend/img`
- Puerto local: 3000

**Frontend** (`/frontend`) — React 19 + Vite 7 + TypeScript
- UI: **Chakra UI v2** + Emotion + framer-motion + lucide-react
- Routing: react-router-dom v7
- HTTP: axios
- Pagos: `@stripe/react-stripe-js`
- PDFs: jspdf
- Puerto local: 5173

**Despliegue:** Render
- Frontend: `https://lifeasaprivilege.onrender.com`
- Backend: `https://life-as-a-privilege.onrender.com`
- `API_URL` se define en [frontend/src/GlobalVariables.tsx](frontend/src/GlobalVariables.tsx) (cambiar entre prod y `http://localhost:3000` para probar local)

---

## Estructura

```
backend/src/
  app.module.ts          ← módulos registrados
  main.ts                ← bootstrap, CORS, puerto
  database.service.ts    ← cliente Supabase (singleton)
  Global.ts              ← helpers (randomString, etc.)
  auth/                  ← JWT + Google OAuth (auth.service, jwt.strategy, jwt.guard, google.*)
  user/                  ← user.controller/service/module
  dtos/                  ← user.types.ts, respuesta.types.ts
  payment/               ← Stripe
  upload/                ← multer
  contact/ subscribe/    ← email/contacto
  fitoterapia/ tcm/ astrologia/ cabala/ nutricion/ ayurveda/ respuesta/
  img/                   ← estáticos servidos en /img

frontend/src/
  App.tsx                ← TODAS las rutas viven aquí
  main.tsx
  GlobalVariables.tsx    ← API_URL, colores por disciplina, iconos SVG inline (~30k tokens, ojo)
  GlobalHelper.ts
  style.css
  app/                   ← páginas (una carpeta por área)
    web/                 ← públicas: Welcome, QuienSoy, Productos, Reels, Videos, Libros, Contacto, ElMetodo, AyurvedaMiEspacio
    auth/                ← LogIn, SignIn, GoogleAuthCallback
    home/                ← Home (privada)
    aprendizaje/         ← cursos, módulos, herbario, alimentos, test doshas, calcular necesidades
    espacio/             ← área privada (preguntas, células, fisiología…)
    recursos/            ← recursos descargables
    user/                ← UserAccount
  components/            ← reutilizables agrupados por área (aprendizaje, espacio, global, home, recursos, welcome)
  data/ hardCoded/       ← contenido estático (cursos, módulos, etc.)
  dtos/                  ← aprendizaje, espacio, respuesta, user
  utils/
```

---

## Convenciones importantes

- **Identificación de usuario en frontend:** `sessionStorage.getItem("userId")`. `PrivateRoute` en [App.tsx](frontend/src/App.tsx) redirige a `/welcome` si no hay userId. (Ver Bitacora: "USAR OBJ+ID : userId").
- **IDs de BD:** strings generados con `randomString()` desde `backend/src/Global.ts` (no autoincrement).
- **Acceso a DB:** siempre `databaseService.getClient().from('tabla')...` (Supabase JS client). NO usar TypeORM aunque esté en `package.json`.
- **Variables de entorno backend** (no commiteadas): `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL`, `PORT`, secretos JWT, Google OAuth, Stripe, SMTP.
- **CORS** orígenes permitidos en [backend/src/main.ts](backend/src/main.ts): prod onrender + localhost 5173/3000/3001.
- **Estáticos del backend:** subidas a `backend/img`, accesibles en `/img/...`.
- **Rama de trabajo:** `develop` (es también la principal aquí).

---

## Comandos habituales

```bash
# Backend
cd backend && npm run start:dev       # nest watch en :3000
cd backend && npm run build
cd backend && npm test

# Frontend
cd frontend && npm run dev            # vite en :5173
cd frontend && npm run build          # tsc + vite build
```

---

## Notas sobre el código

- [frontend/src/GlobalVariables.tsx](frontend/src/GlobalVariables.tsx) es **muy grande** (~30k tokens): contiene `API_URL`, paletas de color por disciplina (fisiología, fitoterapia, etc.) y muchos iconos SVG inline como componentes Chakra `Box as="svg"`. Leerlo entero satura contexto — leer por offset/limit o `Grep` el símbolo concreto.
- Hay archivos sueltos en raíz que **no son código fuente** y se pueden ignorar salvo petición explícita: `Bitacora.txt` (notas/TODOs personales), `EmailCursoNuevo.txt`.
- Carpetas a ignorar al explorar: `node_modules/`, `dist/`, `.git/`.

---

## Pendientes vivos (de `Bitacora.txt`)

> Comprobar antes de tocar para no pisar trabajo en curso.

- Quitar el vídeo de "falsa superioridad" en la sección de anorexia.
- Poner foto `frontend/public/libros/img/fisioAnatomiaLibro.png` (ya existe el archivo, untracked) en Fisiología y Anatomía dentro de Libros.
- Poner nuevo vídeo de Einstein + vídeo de introducción.
- Bug en Libros: salen duplicados.
- Idea de curso futura: "Doshas en profundidad: hábitos y desequilibrios psicológicos".

---

## Cómo prefiero que me hables

- Respuestas concisas en español.
- Si una página/ruta no la encuentras, mira primero [App.tsx](frontend/src/App.tsx) — ahí está el mapa completo de rutas.
- Si una entidad de BD no la encuentras, mira el `*.service.ts` del módulo correspondiente en `backend/src/`: las queries Supabase indican el nombre real de la tabla (`.from('user')`, etc.).

# Páginas de la plataforma

Qué hace cada página, una por título. Las rutas salen de `frontend/src/App.tsx`.

**Cómo buscar (Ctrl+F):**
- Por ruta: `` `/metodo/tcm/ciclos` `` (con las comillas invertidas encuentras el título exacto).
- Por componente: `MetodoTcmCiclos`.
- Por endpoint: `metodo-tcm`, `payment/`, `recorrido-progreso`…
- Lo que falta probar: `Tests:** pendiente`.
- Lo dudoso: `(sin verificar)`.
- Un fallo concreto: `FALLO-23`. Los que quedan por arreglar: `· pendiente`.

**Acceso**, en cada ficha:
- *pública*: cualquiera.
- *con sesión*: `PrivateRoute`.
- *admin*: `AdminRoute`.
- *+ pago*: además hay que tener pagada la disciplina (`GuardiaPagoRecorrido` → `/home?entrar=<scope>`).

**Cuando se añade o cambia una página**, se actualiza su ficha aquí. Cuando tiene tests, `Tests:` pasa a decir en qué archivo están.

## Secciones

1. Públicas, cuenta y portada
2. Astrología y Psicología
3. Ayurveda y Medicina China
4. Fisiología y Nutrición
5. Cábala, Cultura, Espacio y Aprendizaje
6. Admin
7. Aparcadas (ruta comentada)
8. Correos que envía la plataforma
9. Fallos encontrados (`FALLO-NN`)


# 1. Públicas, cuenta y portada

## `/` — Portada (Bienvenida)
- **Componente:** `Welcome` en `frontend/src/app/web/Welcome.tsx`
- **Acceso:** pública
- **Qué hace:** Muestra el mandala, el nombre de la casa y el subtítulo. Debajo, 8 tarjetas de disciplinas (Psicología, Fisiología, Nutrición, Cultura, Medicina China, Astrología, Cábala, Hinduismo). Después: sección de opiniones, tarjeta de la creadora y caja de suscripción a la newsletter. Hasta que cargan las fotos de la primera pantalla (y un mínimo de 550 ms) se ve `LifeLoading`.
- **Datos:** `POST /subscribe` con `{ email }` (desde `SubscribeBox`, valida el formato del email antes). No lee nada más del backend.
- **Botones / a dónde lleva:** cada tarjeta → `/disciplina/<slug>` (psicologia, fisiologia, nutricion, cultura, medicinachina, astrologia, cabala, ayurveda). Botón de `OpinionesSection` → `/elMetodo`. `CreadoraCard` → `/quienSoy`. Header público y footer.
- **Condiciones y casos raros:** El modal «hace falta cuenta» (`showEspacioModal`, botón → `/logIn`) nunca se abre: ningún código pone el estado a `true` (código muerto). La landing de dos proyectos (`Landing.tsx`) está comentada.
- **Tests:** pendiente

---

## `/welcome` — Portada (alias)
- **Componente:** `Welcome` en `frontend/src/app/web/Welcome.tsx`
- **Acceso:** pública
- **Qué hace:** Es la misma página que `/`. Se mantiene para no romper enlaces antiguos.
- **Datos:** igual que `/` (`POST /subscribe`).
- **Botones / a dónde lleva:** igual que `/`.
- **Condiciones y casos raros:** `PrivateRoute` redirige aquí a quien no tiene `userId` en localStorage.
- **Tests:** pendiente

---

## `/logIn` — Iniciar sesión
- **Componente:** `LogIn` en `frontend/src/app/auth/LogIn.tsx`
- **Acceso:** pública
- **Qué hace:** Formulario de nombre o email + contraseña. Al entrar muestra «Bienvenido» y redirige a los 3 s (el botón queda bloqueado mientras). Si la cuenta no está confirmada, ofrece reenviar el correo de confirmación.
- **Datos:** `POST /user/logIn` con `{ name, password }`. Guarda en localStorage `userId`, `name`, `token`. Luego `GET /upload/profile-pic/:userId` y guarda `img` (o `/img/icono/noImg.webp`). Luego `GET /user/me` (Bearer) para saber si es admin; borra `isAdmin` de localStorage. `POST /user/confirmar` con `{ token }`. `POST /user/confirmar/reenviar` con `{ name }`.
- **Botones / a dónde lleva:** «Entrar» → destino (`?next=` o `/home`; `/admin/login` si `me.admin_email` y no hay `next`). «¿Olvidaste la contraseña?» → `/recuperar`. «No tengo cuenta» → `/signIn` (conserva `?next=`).
- **Condiciones y casos raros:** `?confirmar=<token>`: confirma la cuenta, quita el token de la barra, rellena el email y muestra «cuenta confirmada». `?pendiente=1`: aviso «mira tu correo» (viene de `/signIn`). `?next=<ruta>`: destino tras entrar. Error con `code === "EMAIL_SIN_CONFIRMAR"` → mensaje propio + botón de reenviar. Campos vacíos → error sin llamar al backend. No hay botón de Google en esta página (sin verificar si está en otro sitio).
- **Correos:** al confirmar con `?confirmar=` sale «Tu cuenta ya está activa» (solo la primera vez) → ver `Correo: Tu cuenta ya está activa` en la sección 8.
- **Tests:** `backend/src/user/registro.spec.ts` (confirmar, reenviar, entrar por nombre/email, 403 sin confirmar)

---

## `/signIn` — Crear cuenta
- **Componente:** `SignIn` en `frontend/src/app/auth/SignIn.tsx`
- **Acceso:** pública
- **Qué hace:** Formulario de registro: nombre, email, trato opcional («él»/«ella», excluyentes y desmarcables), teléfono opcional, fecha de nacimiento opcional (para el regalo de cumpleaños), contraseña y repetir contraseña. Al crear la cuenta no se entra: sale el popup «mira tu correo». Incluye el aviso de privacidad `InfoPrivacidad tipo="registro"`.
- **Datos:** `POST /user/signIn` con `{ name, email, password, trato, telefono, fecha_nacimiento }`. No guarda nada en localStorage.
- **Botones / a dónde lleva:** «Crear cuenta» → popup `MiraTuCorreoModal`; su «Aceptar» → `/logIn?pendiente=1` (+ `&next=` si venía). «Ya tengo cuenta» → `/logIn` (conserva `?next=`).
- **Condiciones y casos raros:** Validaciones en cliente: campos obligatorios, email con formato, teléfono de 6–15 dígitos (con `+` opcional), contraseña mínimo 4 caracteres, las dos contraseñas iguales. El botón queda bloqueado tras crear la cuenta. `?next=` se arrastra hasta el login.
- **Correos:** «Confirma tu cuenta» al registrarse → ver `Correo: Confirma tu cuenta` en la sección 8.
- **Tests:** `backend/src/user/registro.spec.ts` (registro en BD, correo de bienvenida, bloqueo sin confirmar)

---

## `/recuperar` — Recuperar contraseña
- **Componente:** `RecuperarPassword` en `frontend/src/app/auth/RecuperarPassword.tsx`
- **Acceso:** pública
- **Qué hace:** Sin token: pide el email y manda un enlace de recuperación. Con token: pide la contraseña nueva dos veces y la cambia.
- **Datos:** `POST /user/password/forgot` con `{ email }`. `POST /user/password/reset` con `{ token, password }`.
- **Botones / a dónde lleva:** botón de volver → `/logIn`. Tras cambiar la contraseña, redirige solo a `/logIn` a los 2,6 s.
- **Condiciones y casos raros:** `?token=<token>` decide el modo. El mensaje tras pedir el enlace es el mismo exista o no la cuenta. Contraseña nueva mínimo 6 caracteres (en el registro el mínimo es 4).
- **Tests:** `backend/src/user/recuperacion.spec.ts` (enlace de un solo uso, caduca a la hora, no cambia la contraseña de otra persona)

---

## `/auth/google/callback` — Vuelta del login con Google
- **Componente:** `GoogleAuthCallback` en `frontend/src/app/auth/GoogleAuthCallback.tsx`
- **Acceso:** pública
- **Qué hace:** Pantalla de carga (`LifeLoader`) sin contenido. Recoge la sesión de la URL y redirige.
- **Datos:** Lee de la query `token`, `userId`, `name`, `img`. Guarda en localStorage `token`, `userId`, `name`, `img` (o `/img/icono/noImg.webp`). Lee y borra `postAuthNext` de localStorage. Ningún endpoint.
- **Botones / a dónde lleva:** ninguno. Redirige a `postAuthNext` o `/home`.
- **Condiciones y casos raros:** Si falta `token`, `userId` o `name` → `/logIn`. El token viaja en la URL (queda en el historial del navegador).
- **Tests:** pendiente

---

## `/aviso-legal` — Aviso legal
- **Componente:** `AvisoLegal` en `frontend/src/app/legal/AvisoLegal.tsx` (armazón `PaginaLegal` en `frontend/src/app/legal/PaginaLegal.tsx`)
- **Acceso:** pública
- **Qué hace:** Texto legal en 8 secciones: titular, objeto, condiciones de uso, propiedad intelectual, naturaleza divulgativa, responsabilidad, modificaciones, legislación. Los datos del titular salen de la constante `TITULAR` de `PaginaLegal.tsx`.
- **Datos:** Ninguno.
- **Botones / a dónde lleva:** header público y footer.
- **Condiciones y casos raros:** El texto está solo en español; en inglés se pinta un aviso de que el texto vinculante es el español.
- **Tests:** pendiente

---

## `/privacidad` — Política de privacidad
- **Componente:** `Privacidad` en `frontend/src/app/legal/Privacidad.tsx`
- **Acceso:** pública
- **Qué hace:** 10 secciones: responsable, datos tratados, datos de categoría especial (salud), finalidad y base legal, quién accede, conservación, derechos, seguridad, menores, cookies.
- **Datos:** Ninguno.
- **Botones / a dónde lleva:** enlace interno → `/cookies`.
- **Condiciones y casos raros:** Solo en español (aviso en inglés, como las demás legales).
- **Tests:** pendiente

---

## `/cookies` — Política de cookies
- **Componente:** `Cookies` en `frontend/src/app/legal/Cookies.tsx`
- **Acceso:** pública
- **Qué hace:** 5 secciones (qué es una cookie, necesarias, analíticas, vídeos de YouTube, cómo revocar). Incluye un panel «Tus preferencias» que dice el estado actual y deja cambiarlo.
- **Datos:** localStorage `cookieConsent` (`aceptadas` / `rechazadas` / sin valor), vía `estadoCookies`, `guardarConsentimiento`, `revocarConsentimiento` de `components/global/cookies`. Ningún endpoint.
- **Botones / a dónde lleva:** «Aceptar analíticas», «Rechazar analíticas», «Volver a preguntarme» (borra la clave). Al rechazar se borran las cookies analíticas.
- **Condiciones y casos raros:** Los textos del panel están escritos a mano en español (no pasan por i18n).
- **Tests:** pendiente

---

## `/terminos` — Términos de contratación
- **Componente:** `Terminos` en `frontend/src/app/legal/Terminos.tsx`
- **Acceso:** pública
- **Qué hace:** 10 secciones: quién vende, qué se vende, precios y pago, cuándo hay acceso, condiciones de compra, si algo va mal, uso personal, naturaleza de los contenidos, reclamaciones, protección de datos.
- **Datos:** Ninguno.
- **Botones / a dónde lleva:** enlaces internos → `/aviso-legal` y `/privacidad`.
- **Condiciones y casos raros:** Solo en español (aviso en inglés).
- **Tests:** pendiente

---

## `/home` — Mi espacio (mandala de disciplinas)
- **Componente:** `Home` en `frontend/src/app/home/Home.tsx`
- **Acceso:** con sesión (PrivateRoute)
- **Qué hace:** Mandala con la foto de la persona en el centro y las 8 disciplinas alrededor; las no pagadas salen a media opacidad. Pulsar un círculo: si está pagada entra en `/metodo/<disciplina>`; si no, abre su box de pago. Muestra «Tu camino» (progreso por disciplina), el diario de sesiones (si hay entradas) y el botón «Continuar» a la última página del recorrido. Se puede cambiar la foto de perfil. La primera vez sale el popup de la comunidad de WhatsApp.
- **Datos:** `GET /user/me` (campos `<scope>_suscrito` de las 8 disciplinas, `comunidad_popup_visto`). `GET /payment/disciplina/verify?session_id=` y `GET /payment/<scope>/verify?session_id=` (metodo, psicologia, ayurveda, tcm, fisiologia, nutricion, cabala, cultura). `POST /upload/profile-pic/:userId` (FormData, foto encogida en el navegador). `GET /recorrido-progreso` (Tu camino). `GET /diario/:userId` (DiarioUsuario). `POST /user/me/comunidad-popup`. localStorage: lee `userId`, `token`, `name`, `img`, `ultimoRecorrido`; escribe `img`, marca de popup de comunidad visto. El pago redirige al Payment Link de Stripe con `client_reference_id=<scope>__<userId>` (`irAPagoDisciplina`).
- **Botones / a dónde lleva:** círculos → `/metodo/astrologia|psicologia|ayurveda|tcm|fisiologia|nutricion|cabala|cultura` o popup de pago (`Pago*Modal`, con casillas de consentimiento). Tras pagar, `PagoExitoModal` solo se cierra: se queda en el Mapa con la disciplina encendida (el pago desbloquea, no mete dentro; igual en las 8). «Continuar» → `ultimoRecorrido`. Tarjeta del diario → `/diario`. Filas de «Tu camino» → ruta de cada disciplina.
- **Condiciones y casos raros:** `?disciplina_pagada=<session>`: verifica el pago del Payment Link común y abre el éxito de la disciplina que diga el backend. `?<scope>_pagado=<session>`: verificación por disciplina (Checkout Session propio). `?entrar=<scope>`: espera a saber qué hay pagado y hace lo mismo que pulsar el círculo (entra o abre el pago); llega desde `GuardiaPagoRecorrido`. Todas estas queries se borran de la barra. Sin `userId` → `/` (y PrivateRoute → `/welcome`). Las suscripciones se cachean en memoria (`suscCache`): si no hay query de pago, no se vuelve a pedir `/user/me` en la misma sesión. «Continuar» solo aparece si Astrología (`metodo_suscrito`) está pagada, aunque haya otras disciplinas compradas. El popup de comunidad no sale si falta `WHATSAPP_COMUNIDAD_URL` o si la admin está «entrando como».
- **Tests:** parcial: los verify del pago y `conceder` idempotente en `backend/src/payment/payment.service.spec.ts`

---

## `/diario` — El diario de tus sesiones
- **Componente:** `Diario` en `frontend/src/app/home/Diario.tsx`
- **Acceso:** con sesión (PrivateRoute)
- **Qué hace:** Un calendario mensual (`CalendarioDiario`) con un puntito por disciplina en cada día con notas; tocar un día enseña SOLO las notas de ese día (dos días distintos nunca se ven a la vez). Se abre por el último día con notas. Cada nota lleva el color y la foto de su disciplina, el contenido con el mini-formato del diario (`TextoMarcado`: `**negrita**`, `*cursiva*`, `---` rayita separadora) y el bloque «por qué». Al abrir la página se marcan todas como leídas.
- **Datos:** `GET /diario/:userId` (si falla, lista vacía). `PATCH /diario/:userId/leidas` solo si alguna entrada no tiene `leida_at`. Lee `userId` de localStorage.
- **Botones / a dónde lleva:** flechas ← → del calendario cambian el mes; cada día del calendario selecciona sus notas. «Volver» → `/home`.
- **Condiciones y casos raros:** Sin entradas → texto «vacío» y el calendario no se pinta. Un día sin notas → texto «ese día no tiene ninguna nota». Mientras carga → `LifeLoading`. Tras marcar leídas borra la caché del diario del Home.
- **Tests:** pendiente

---

## `/quienSoy` — Quién soy
- **Componente:** `QuienSoy` en `frontend/src/app/web/QuienSoy.tsx`
- **Acceso:** pública
- **Qué hace:** Presentación de la creadora (bio y misión), bloque de donación, testimonio con enlace a LinkedIn, galería de certificados (imágenes de `src/assets/certificados`) con visor a pantalla completa, y frase de cierre.
- **Datos:** Ninguno.
- **Botones / a dónde lleva:** «Contactar» → `/contacto`. «Donar» → Payment Link de Stripe (nueva pestaña, constante `DONATION_LINK` en el propio archivo). Enlace a LinkedIn (nueva pestaña). Clic en un certificado → visor con anterior/siguiente y cerrar.
- **Condiciones y casos raros:** Header `variant="auto"` (público o privado según sesión, sin verificar).
- **Tests:** pendiente

---

## `/productos` — Productos
- **Componente:** `Productos` en `frontend/src/app/web/Productos.tsx`
- **Acceso:** pública
- **Qué hace:** Título, texto de introducción y tarjetas de productos sacadas de `frontend/src/data/productos.ts`. Con sesión, cada tarjeta tiene un corazón de favorito.
- **Datos:** localStorage `favoritos` (array de ids) y `userId` (solo para enseñar el corazón). Ningún endpoint.
- **Botones / a dónde lleva:** «Ver más» → `/productos/:id`.
- **Condiciones y casos raros:** BUG: no existe ruta `/productos/:id` en `App.tsx`, así que «Ver más» cae en la 404. No se ve enlace a esta página en el código revisado (sin verificar si está en el menú).
- **Tests:** pendiente

---

## `/libros` — Libros y apuntes
- **Componente:** `LibrosPage` en `frontend/src/app/web/LibrosPage.tsx`
- **Acceso:** pública
- **Qué hace:** Sección de libros de pago y, debajo, un tablero con libros y apuntes gratuitos (datos en `frontend/src/hardCoded/libros/libros`). Los gratuitos se descargan por enlace. Los de pago exigen marcar la casilla de consentimiento/renuncia al desistimiento antes de comprar.
- **Datos:** `POST /payment/libros/checkout` con `{ libroId }` (sin token) → redirige a la `url` de Stripe. Ningún dato guardado.
- **Botones / a dónde lleva:** «Comprar» → Stripe; al pagar vuelve a `/libros/descargar?session_id=…`, al cancelar a `/libros`. «Descargar» de los gratuitos → enlace externo en pestaña nueva.
- **Condiciones y casos raros:** Espera a precargar solo las primeras portadas (`PORTADAS_PRECARGA`); el resto carga en lazy. Error de checkout → toast.
- **Tests:** pendiente

---

## `/libros/descargar` — Descarga del libro comprado
- **Componente:** `DescargarLibroPage` en `frontend/src/app/web/DescargarLibroPage.tsx`
- **Acceso:** pública
- **Qué hace:** Verifica la compra y lanza la descarga del PDF automáticamente una vez. Muestra agradecimiento e instrucciones, con botón para volver a descargar.
- **Datos:** `GET /payment/libros/verify?session_id=` → `{ ok, libroId, titulo, pdfLink }` o `{ ok:false, reason }`.
- **Botones / a dónde lleva:** «Descargar» (repite la descarga). «Volver» → `/libros` (en éxito y en error).
- **Condiciones y casos raros:** Sin `?session_id=` → error «sin sesión». `reason === "unpaid"` → mensaje de no pagado; otro fallo → «no se pudo verificar». Cualquiera con el `session_id` puede volver a descargar (no pide sesión).
- **Tests:** pendiente

---

## `/contacto` — Contactar
- **Componente:** `Contacto` en `frontend/src/app/web/Contacto.tsx` (tarjetas en `frontend/src/components/contacto/ViasDeContacto.tsx`)
- **Acceso:** pública
- **Qué hace:** Título, retrato de la creadora y 6 tarjetas: llamada (de pago), conocernos (20 min sin coste), escribirme, WhatsApp, Instagram y comunidad.
- **Datos:** La llamada abre `AgendarLlamada`: `GET /booking/taken`, `GET /user/me` (si hay token), `GET /payment/llamada/verify`, checkout de llamada (sin verificar el detalle). «Conocernos» abre `BookCallModal`: `GET /booking/taken`, `POST /booking`. Lee `name` y `token` de localStorage.
- **Botones / a dónde lleva:** Llamada → popup `AgendarLlamada`. Conocernos → popup `BookCallModal`. Escribirme → `/contacto/escribir`. WhatsApp → `whatsappUrl(...)` (pestaña nueva). Instagram → `INSTAGRAM_URL`. Comunidad → `WHATSAPP_COMUNIDAD_URL`.
- **Condiciones y casos raros:** `?conocernos=1` abre sola la reserva de conocernos (destino del correo de bienvenida); al cerrarla se quita el parámetro. La tarjeta de comunidad sale apagada si no hay `WHATSAPP_COMUNIDAD_URL`. El comentario del archivo dice «cinco puertas» pero pinta seis.
- **Tests:** pendiente

---

## `/cumple` — Regalo de cumpleaños
- **Componente:** `CumpleRegalo` en `frontend/src/app/web/CumpleRegalo.tsx`
- **Acceso:** pública en la ruta, pero la página exige sesión (redirige al login si no hay `userId`)
- **Qué hace:** Destino del botón del correo de cumpleaños. Enseña las disciplinas que la persona aún no tiene, con el precio del regalo, y deja elegir una para pagarla a ese precio.
- **Datos:** `GET /payment/cumple/estado?t=<token>` → `{ valido, disciplinas[], precio }` o `{ valido:false, motivo }`. `POST /payment/cumple/checkout` con `{ token, scope }` → redirige a la `url` de Stripe. Lee `userId` de localStorage.
- **Botones / a dónde lleva:** cada disciplina → Stripe. Al pagar vuelve a `/home?disciplina_pagada=…`; al cancelar, a `/cumple?t=<token>` (según `payment.service.ts`).
- **Condiciones y casos raros:** `?t=<token>` obligatorio; sin él → motivo «invalido». Sin sesión → `/logIn?next=/cumple?t=<token>`. Motivos de rechazo: `invalido`, `otra-cuenta` (el token es de otro usuario), `caducado`, `usado` (ya usado este año). Si ya tiene todas → texto «todas tuyas». Header `variant="private"` aunque la ruta no esté en PrivateRoute.
- **Tests:** pendiente

---

## `/contacto/escribir` — Formulario de contacto
- **Componente:** `ContactoFormulario` en `frontend/src/app/web/ContactoFormulario.tsx`
- **Acceso:** pública
- **Qué hace:** Formulario con nombre, email, asunto y mensaje. Al enviarlo muestra confirmación y botón para escribir otro.
- **Datos:** `GET /contact/ping` al entrar (despierta el servidor). `POST /contact` con `{ nombre, email, titulo, mensaje }` (corta a los 90 s).
- **Botones / a dónde lleva:** «Enviar». Tras enviar, «Enviar otro» vuelve al formulario vacío.
- **Condiciones y casos raros:** Si el ping tarda más de 8 s, aviso de «servidor lento». Con algún campo vacío no envía (sin mensaje de error propio). Error → mensaje de error. No valida el formato del email en cliente (sin verificar si lo hace el input).
- **Tests:** pendiente

---

## `/opiniones` — Opiniones
- **Componente:** `Opiniones` en `frontend/src/app/web/Opiniones.tsx`
- **Acceso:** pública
- **Qué hace:** Lista de reseñas publicadas y, debajo, formulario para dejar una (nombre, texto, email opcional). El nombre viene prerrellenado con el `name` de la sesión.
- **Datos:** `GET /opinion` (lista). `POST /opinion` con `{ nombre, texto, email? }`. Lee `name` de localStorage. Al enviar guarda la marca de «opinión enviada» en localStorage (`marcarOpinionEnviada`, para que el final de los recorridos deje de pedirla).
- **Botones / a dónde lleva:** «Enviar». Con `?volver=`: botón de volver arriba y en la pantalla de gracias → esa ruta.
- **Condiciones y casos raros:** `?volver=<ruta>` (llega desde `PedirOpinion` al final de un recorrido): solo acepta rutas internas (empieza por `/` y no por `//`); si lo hay, baja sola al formulario a los 420 ms. Nombre o texto vacíos → no envía. Las reseñas se publican sin aprobación (según memoria del proyecto; sin verificar en backend).
- **Tests:** pendiente

---

## `/elMetodo` — El Mapa (página de venta)
- **Componente:** `ElMetodo` en `frontend/src/app/web/ElMetodo.tsx`
- **Acceso:** pública
- **Qué hace:** Página de presentación del recorrido de las 8 disciplinas: portada con dos botones (test «¿por dónde empiezo?» y escribir por WhatsApp), mandala con las disciplinas y vídeo, qué obtienes, qué recibirás, 8 cajas de detalle, precio, la creadora y botón de empezar. Textos desde `useRecorridoContenido()`. Hasta que cargan las fotos (y 550 ms mínimo) se ve `LifeLoading`.
- **Datos:** Ningún endpoint propio. Lee `userId` y `token` de localStorage. `ContactModal` («Tengo dudas») hace `POST /contact`. `BookCallModal` hace `GET /booking/taken` y `POST /booking`. El test (`TestDisciplinaModal`) no guarda nada.
- **Botones / a dónde lleva:** «Acceder/Empezar» → `/home` con sesión, o `/signIn?next=/home` sin ella. Test → popup `TestDisciplinaModal`, cuyo resultado lleva a `/d/<disciplina>`. WhatsApp → `whatsappUrl(...)`. Cada caja de detalle → popup de la modalidad. «Reservar llamada» → `BookCallModal`. «Tengo dudas» → `ContactModal`. Creadora → `/quienSoy`. Botones flotantes (mensaje + test).
- **Condiciones y casos raros:** El popup de la llamada gratuita (`PopupLlamada`) sale solo a los 20 s y, tras cerrarlo, cada 70 s mientras siga en la página (no sale si hay otro popup abierto).
- **Tests:** pendiente

---

## `/materiales` — Materiales gratuitos
- **Componente:** `MaterialesGratuitos` en `frontend/src/app/web/MaterialesGratuitos.tsx`
- **Acceso:** pública
- **Qué hace:** Hub con cajas centradas que llevan a los recursos gratuitos: Ilustraciones, Cursos y Libros. Las cajas de Vídeos y Programas están comentadas (aparcadas).
- **Datos:** Ninguno.
- **Botones / a dónde lleva:** Ilustraciones → `/ilustraciones`. Cursos → `/aprendizaje/aprendizajeHome`. Libros → `/libros`.
- **Condiciones y casos raros:** Ninguna.
- **Tests:** pendiente

---

## `/ilustraciones` — Galería de ilustraciones
- **Componente:** `Ilustraciones` en `frontend/src/app/web/Ilustraciones.tsx`
- **Acceso:** pública
- **Qué hace:** Rejilla de portadas de cómics (4 por fila en escritorio, 2 en tablet, 1 en móvil) con la selección barajada `ILUSTRACIONES_GALERIA` (alterna disciplinas). Pulsar una portada abre el cómic a pantalla completa con el estilo de su disciplina (`ComicModal`), en el idioma activo.
- **Datos:** Con sesión, al abrir un cómic hace `POST /actividad` con `{ recurso: "/ilustraciones#<id>", tipo: "ilustracion", disciplina, titulo }` (`registrarActividad`; no si la admin está «entrando como» ni si ya se registró). Lee `token` de localStorage.
- **Botones / a dónde lleva:** cada portada → popup `ComicModal`.
- **Condiciones y casos raros:** Espera a precargar solo las portadas de la primera pantalla; el resto en lazy.
- **Tests:** pendiente

---

## `/ilustraciones/:disciplina` — Ilustraciones de una disciplina
- **Componente:** `Ilustraciones` en `frontend/src/app/web/Ilustraciones.tsx`
- **Acceso:** pública
- **Qué hace:** La misma galería, pero con todas las ilustraciones de esa disciplina (filtradas por `ilustracionesLabel`) y su nombre como titular. Es la puerta «Ilustraciones» de `/disciplina/:disciplina`.
- **Datos:** igual que `/ilustraciones` (`POST /actividad`).
- **Botones / a dónde lleva:** cada portada → `ComicModal`.
- **Condiciones y casos raros:** `:disciplina` se resuelve con `presentacionPorKey` (acepta key, título o nombre, normalizados). Slug desconocido → no da 404: enseña la galería general. Disciplina sin ilustraciones (p. ej. Cultura) → texto «vacío».
- **Tests:** pendiente

---

## `/disciplina/:disciplina` — Portada de una disciplina (tres puertas)
- **Componente:** `DisciplinaPortada` en `frontend/src/app/web/DisciplinaPortada.tsx`
- **Acceso:** pública
- **Qué hace:** Portada común de cada disciplina con su color, icono y fondo. Tres puertas: Ilustraciones, Cursos y El Recorrido. Se llega pulsando una tarjeta de la portada (`/`).
- **Datos:** Ninguno. Los datos de cada disciplina salen de `frontend/src/data/presentacionDisciplinas.ts` (`presentacionPorKey`).
- **Botones / a dónde lleva:** Ilustraciones → `/ilustraciones/<key>`. Cursos → `/aprendizaje/cursos/<cursosLink>`. El Recorrido → `/d/<key>`.
- **Condiciones y casos raros:** Slug desconocido → redirige a `/elMetodo` (replace), sin 404. El slug casa por key, título o nombre normalizados. Al cambiar de disciplina la página se remonta (`key={d.key}`) para repetir las animaciones.
- **Tests:** pendiente

---

## `/d/:disciplina` — Presentación de una disciplina (QR de carteles)
- **Componente:** `PresentacionDisciplina` en `frontend/src/app/web/PresentacionDisciplina.tsx` (reparte a `PresentacionAstrologia`, `PresentacionPsicologia`, `PresentacionAyurveda`, `PresentacionTcm`, `PresentacionFisiologia`, `PresentacionNutricion`, `PresentacionCabala`, `PresentacionCultura` o `PresentacionGenerica`, en `frontend/src/app/web/`; piezas comunes en `frontend/src/components/metodo/presentacionUi.tsx`)
- **Acceso:** pública
- **Qué hace:** Página de venta pública de una disciplina concreta. Cada disciplina tiene su propio montaje de bloques (cajas sin borde, 4 ejemplos por bloque). Termina con un cierre que invita a crear cuenta o empezar.
- **Datos:** Ningún endpoint propio en el repartidor. Lee `userId` de localStorage para decidir el destino de «Empezar». El cierre monta `BookCallModal` (`GET /booking/taken`, `POST /booking`) y `ContactModal` (`POST /contact`).
- **Botones / a dónde lleva:** «Empezar» → `/home?entrar=<scope>` con sesión, o `/signIn?next=/home?entrar=<scope>` sin ella. «Crear cuenta» → `/signIn`. «Llamada» → `BookCallModal`. «Tengo dudas» → `ContactModal`. Enlace → `/elMetodo`. En Psicología, cursos → `<cursoLink>?volver=/d/psicologia` y `/aprendizaje/cursos/<nombre>`.
- **Condiciones y casos raros:** Slug desconocido → `/elMetodo` (replace). Rutas cortas porque van impresas en carteles (`/d/cabala`, `/d/nutricion`…).
- **Tests:** pendiente

---

## `/checkoutMetodo` — Checkout antiguo (redirección)
- **Componente:** `CheckoutMetodo` en `frontend/src/app/web/CheckoutMetodo.tsx`
- **Acceso:** pública
- **Qué hace:** No pinta nada. Redirige al instante a `/home`.
- **Datos:** Ninguno.
- **Botones / a dónde lleva:** ninguno; `navigate("/home", { replace: true })`.
- **Condiciones y casos raros:** Sin sesión, `/home` (PrivateRoute) manda después a `/welcome`. Parece una ruta heredada que se mantiene para enlaces viejos (sin verificar).
- **Tests:** pendiente

---

## `/user/account` — Mi cuenta
- **Componente:** `UserAccount` en `frontend/src/app/user/UserAccount.tsx`
- **Acceso:** con sesión (PrivateRoute)
- **Qué hace:** Muestra y deja editar nombre, email, teléfono, fecha de nacimiento, contraseña y foto de perfil. Permite cerrar sesión y borrar la cuenta (pide contraseña + escribir la palabra «BORRAR»/«DELETE»). Si es admin desbloqueada, enseña botón al panel.
- **Datos:** `GET /user/me` (name, email, is_admin, telefono, fecha_nacimiento). `PATCH /user/:id` solo con los campos cambiados (teléfono y fecha se pueden vaciar → `null`; vaciar la fecha apaga la felicitación). `POST /upload/profile-pic/:userId` (FormData, foto encogida). `DELETE /user/:id` con `{ password }`. localStorage: lee `userId`, `token`; escribe `name`, `img`; `cerrarSesionLocal()` limpia la sesión.
- **Botones / a dónde lleva:** «Guardar». «Cerrar sesión» → `/welcome` (si la admin está «entrando como», en vez de cerrar sesión le devuelve la suya). «Eliminar cuenta» → popup de confirmación → `/welcome`. «Panel de admin» → `/admin` (solo si `is_admin`).
- **Condiciones y casos raros:** Sin `userId` → `/welcome`. Si no hay cambios, «Guardar» no llama al backend. Error al cargar → mensaje de error. El mensaje de error del borrado que manda el backend llega en español aunque la web esté en inglés.
- **Tests:** pendiente

---

## `*` — Página no encontrada (404)
- **Componente:** `NoEncontrada` en `frontend/src/app/web/NoEncontrada.tsx`
- **Acceso:** pública
- **Qué hace:** Título y texto de «página no encontrada» con dos botones.
- **Datos:** Ninguno.
- **Botones / a dónde lleva:** «Inicio» → `/`. «El recorrido» → `/elMetodo`.
- **Condiciones y casos raros:** Cualquier ruta no declarada en `App.tsx` cae aquí (por ejemplo `/productos/:id`, que enlaza la página de productos).
- **Tests:** pendiente


# 2. Astrología y Psicología

## `/metodo/astrologia` — Astrología: datos de nacimiento + Sol, Luna y Ascendente (Paso 1)
- **Componente:** `MetodoAstrologia` en `frontend/src/app/metodo/MetodoAstrologia.tsx`
- **Acceso:** con sesión (PrivateRoute). Pago de astrología exigido por `GuardiaPagoRecorrido` (scope `metodo`; sin `metodo_suscrito` → `/home?entrar=metodo`).
- **Qué hace:** UNA sola página para empezar (antes eran dos). Al entrar salen siempre dos cómics de intro seguidos: el Origen (espiritualidad) y «La Historia de la Astrología» — volver a este paso es volver a verlos. Sin datos, muestra el formulario (día, mes, año, hora, país, lugar, región) para pedir la carta; un popup confirma los datos y otro avisa de que «la carta está en proceso». Con solicitud ya enviada, la MISMA página muestra: la chapa con los datos guardados (botón «Cambiar» para corregirlos aquí mismo), el box «¿Qué es una carta astral?» (tercer cómic) y el trío Sol · Luna · Ascendente: tres tarjetas con su signo y su casa (el Ascendente no lleva casa); pulsar «Leer» abre `SaberMasModal` y lo marca como leído. Bajo el trío, un aviso con enlace para corregir los datos si el trío no le cuadra.
- **Datos:** `GET /metodo-astrologia/:userId` (estado: `solicitud_enviada_at`, `link_carta`, fecha/hora/lugar, `data`). Con solicitud, también `GET /metodo-astrologia/carta-natal/:userId` (signo y casa salen de la carta calculada, no del `data` guardado). `POST /metodo-astrologia/solicitud/:userId` con `fecha_nacimiento`, `hora_nacimiento`, `pais`, `lugar`, `region` (el backend calcula la carta y manda email). Los leídos del trío se guardan con `PATCH /metodo-astrologia/:userId` `{ data }` (`data.<planeta>.profundizadoSigno` / `profundizadoCasa`; el backend fusiona `data`). Precarga las viñetas de los cómics.
- **Desbloqueo:** siempre accesible. Enviar la solicitud desbloquea el paso 2 (Arquetipos); el botón siguiente no se activa hasta leer los tres del trío.
- **Botones / a dónde lleva:** prev «← Home» (`rutaHome()`: panel si es admin). Next: sin solicitud (o corrigiendo) «Leer carta →» abre el popup de confirmación (desactivado si faltan campos); con solicitud, «Arquetipos →» (desactivado hasta leer los tres) abre dos cómics seguidos: signos → planetas → `/metodo/astrologia/cartaAstral`. «Ilustraciones» abre `ComicAstrologiaModal`. Cadena de cómics de entrada: Origen → Historia → (si ya hay solicitud) cómic de la carta, que al terminar se CIERRA y deja la página a la vista (el trío está aquí). Tras enviar, «Aceptar» del popup abre el cómic de la carta.
- **Condiciones y casos raros:** `?corregir=1` abre el formulario prerrellenado y NO lanza cómics. Mientras corrige, el trío se esconde y el botón siguiente se cierra hasta reenviar; al reenviar se recarga la carta (los signos nuevos, no los de antes). La ruta vieja `/metodo/astrologia/solascendenteluna` redirige aquí (quedan migas y marcadores). Sin `userId`/`token` → `/welcome`. Validación: día 1-31, año 1900-2100. Los mensajes de error y los nombres de los meses están en español fijo (no pasan por i18n).
- **Tests:** `backend/src/metodoAstrologia/metodoAstrologia.spec.ts` (solicitud: guardado + carta + correos, corrección con esCorreccion, geocoding caído, data fusionada, PATCH solo de campos permitidos)

---

## `/metodo/astrologia/cartaAstral` — Arquetipos: la carta en 3D (Paso 2)
- **Componente:** `MetodoAstrologiaCartaAstral` en `frontend/src/app/metodo/MetodoAstrologiaCartaAstral.tsx`
- **Acceso:** con sesión (PrivateRoute) + pago de astrología (`GuardiaPagoRecorrido`).
- **Qué hace:** Muestra la rueda de la carta natal (`CartaAstral3D`). Pulsar un planeta abre «Saber más» (`SaberMasModal`) y lo marca como leído (signo y, si tiene, casa). Los planetas leídos salen como completados.
- **Datos:** `GET /metodo-astrologia/:userId`, `GET /metodo-astrologia/carta-natal/:userId`. Si la carta no tiene Quirón o no coincide `localStorage["cartaCalcVersion:<userId>"]` con `v3-chiron-m0-28`, llama a `POST /metodo-astrologia/carta-natal/:userId/recalcular` una vez. Los leídos se guardan vía `useCartaPlanetas` (`PATCH /metodo-astrologia/:userId` `{ data }`, con debounce de 1,5 s y guardado al desmontar).
- **Desbloqueo:** requiere solicitud enviada (`useCartaPlanetas` y la página redirigen a `/metodo/astrologia`). Next desactivado hasta que todos los planetas estén leídos (`todoCompletado`) Y la carta esté procesada (`link_carta` o `retos` no vacío). Tooltip distinto para cada caso.
- **Botones / a dónde lleva:** prev → paso 1; next → `/metodo/astrologia/lectura`. «Ilustraciones», `BotonCompania`, `IndiceAstrologia`.
- **Condiciones y casos raros:** `EditarCuerpoModal` está montado pero nada lo abre (`setEditOpen(true)` no existe): código muerto. El guardado va con debounce y no se espera con flush al navegar con el botón (sin verificar si `flushSaves` lo cubre, ya que el PATCH puede no haber salido aún).
- **Correos:** al marcar como leído el ÚLTIMO arquetipo, el backend manda a la creadora «Le toca su carta astral» (una vez, y solo si la lectura no está escrita) → ver `Correo: Le toca su carta astral` en la sección 8.
- **Tests:** `backend/src/metodoAstrologia/metodoAstrologia.spec.ts` (carta cacheada / calculada al vuelo, recalcular, ajuste manual de nodos a 180°, leídos fusionados en `data`, aviso «le toca su carta»)

---

## `/metodo/astrologia/lectura` — Puntos clave (Paso 3)
- **Componente:** `MetodoAstrologiaLectura` en `frontend/src/app/metodo/MetodoAstrologiaLectura.tsx`
- **Acceso:** con sesión (PrivateRoute) + pago de astrología (`GuardiaPagoRecorrido`).
- **Qué hace:** Un cielo con una estrella por cada «punto clave» (reto) que la admin escribió. Al pulsar una estrella se abre un modal con su texto y queda marcada como leída. Un contador enseña «Has leído X de N».
- **Datos:** `GET /metodo-astrologia/:userId` (`retos`, `link_carta`). Leídos con `useAstroLeidos("retos")` → `data.retosLeidos` vía `PATCH /metodo-astrologia/:userId`, más una caché en memoria.
- **Desbloqueo:** necesita `link_carta` o al menos un reto; si no (o si falla el GET) → `/metodo/astrologia`. Next activo cuando todos los retos están leídos (o no hay ninguno).
- **Botones / a dónde lleva:** prev → paso 2. Next abre el cómic de las Casas (`ComicPasoModal`) → `/metodo/astrologia/casas`. «Ilustraciones», `BotonCompania`, `IndiceAstrologia`.
- **Condiciones y casos raros:** no comprueba si ya se leyeron los arquetipos del paso 2, así que desde el Índice se puede entrar sin haberlos leído. Textos «Has leído…» y el tooltip están en español fijo.
- **Tests:** parcial: el guardado de `retosLeidos` (fusión en `data`) en `backend/src/metodoAstrologia/metodoAstrologia.spec.ts`

---

## `/metodo/astrologia/casas` — Casas (Paso 4)
- **Componente:** `MetodoAstrologiaCasas` en `frontend/src/app/metodo/MetodoAstrologiaCasas.tsx`
- **Acceso:** con sesión (PrivateRoute) + pago de astrología (`GuardiaPagoRecorrido`).
- **Qué hace:** Una rueda de las 12 casas que se gira arrastrando o pulsando. La casa seleccionada muestra su info (según las cúspides) y el texto escrito por la admin; «Leer» la marca como leída.
- **Datos:** `GET /metodo-astrologia/:userId` (`retos`, `casas_texto`, `link_carta`), `GET /metodo-astrologia/carta-natal/:userId` (`cusps`). Leídos: `useAstroLeidos("casas")` → `data.casasLeidos`. También lee `retosLeidos` para el gate.
- **Desbloqueo:** necesita `link_carta` o retos (si no → `/metodo/astrologia`), y todos los retos leídos (si no → `/metodo/astrologia/lectura`, con replace). Next activo cuando todas las casas CON texto están leídas (si no hay ninguna escrita, pasa directo).
- **Botones / a dónde lleva:** prev → paso 3. Next abre el cómic de Aspectos → `/metodo/astrologia/aspectos`. «Ilustraciones», `IndiceAstrologia`.
- **Condiciones y casos raros:** mientras no está todo cargado o faltan retos, enseña el loader (no se llega a ver la página antes de rebotar).
- **Tests:** parcial: el guardado de `casasLeidos` y el merge de `casas_texto` en `backend/src/metodoAstrologia/metodoAstrologia.spec.ts`

---

## `/metodo/astrologia/aspectos` — Aspectos (Paso 5)
- **Componente:** `MetodoAstrologiaAspectos` en `frontend/src/app/metodo/MetodoAstrologiaAspectos.tsx`
- **Acceso:** con sesión (PrivateRoute) + pago de astrología (`GuardiaPagoRecorrido`).
- **Qué hace:** Los aspectos de la carta agrupados por planeta. Cada grupo se desbloquea al terminar el anterior (candado + aviso «termina los aspectos de X»). Al pulsar un aspecto se abre un popup con su texto (o un aviso si no hay lectura) y queda leído.
- **Datos:** `GET /metodo-astrologia/:userId` (`retos`, `aspectos_texto`, `casas_texto`), `GET /metodo-astrologia/carta-natal/:userId` (`aspectos`). Leídos: `useAstroLeidos("aspectos")` → `data.aspectosLeidos`; lee también `retosLeidos` y `casasLeidos`.
- **Desbloqueo:** `link_carta` o retos (si no → `/metodo/astrologia`); retos leídos (si no → `/lectura`); casas escritas leídas (si no → `/casas`). El next no pide nada.
- **Botones / a dónde lleva:** prev → paso 4; next → `/metodo/astrologia/pdf`. «Ilustraciones», `IndiceAstrologia`.
- **Condiciones y casos raros:** leer todos los aspectos no es obligatorio para seguir.
- **Tests:** parcial: el guardado de `aspectosLeidos` y el merge de `aspectos_texto` en `backend/src/metodoAstrologia/metodoAstrologia.spec.ts`

---

## `/metodo/astrologia/pdf` — Tu carta en PDF (Paso 6)
- **Componente:** `MetodoAstrologiaPdf` en `frontend/src/app/metodo/MetodoAstrologiaPdf.tsx`
- **Acceso:** con sesión (PrivateRoute) + pago de astrología (`GuardiaPagoRecorrido`).
- **Qué hace:** Explica el PDF y enseña un resumen de lo que lleva. El botón genera en el navegador un PDF con la carta, los datos de nacimiento, los puntos clave y los textos de casas y aspectos, con barra de progreso, y lo descarga. Avisa si todavía no hay lecturas escritas.
- **Datos:** `GET /metodo-astrologia/:userId` (retos, `casas_texto`, `aspectos_texto`, datos de nacimiento), `GET /metodo-astrologia/carta-natal/:userId`. Nombre desde `localStorage["name"]`. PDF con `generarPdfCarta` (`components/metodo/pdf/pdfCartaAstral`). No guarda nada.
- **Desbloqueo:** `link_carta` o retos; si no → `/metodo/astrologia`. No comprueba haber leído casas ni aspectos (el Índice sí lo exige para el paso 6).
- **Botones / a dónde lleva:** prev → paso 5; next → `/metodo/astrologia/llamada`. «Ilustraciones», `BotonCompania`, `IndiceAstrologia`.
- **Condiciones y casos raros:** si falla la carga sale un error en la página; si falla el PDF, «Algo se ha torcido…».
- **Tests:** pendiente

---

## `/metodo/astrologia/llamada` — Llamada (Paso 7)
- **Componente:** `MetodoAstrologiaLlamada` en `frontend/src/app/metodo/MetodoAstrologiaLlamada.tsx`
- **Acceso:** con sesión (PrivateRoute) + pago de astrología (`GuardiaPagoRecorrido`).
- **Qué hace:** Un texto de intro y el calendario `AgendarLlamada` para reservar y pagar una llamada de astrología (15 €).
- **Datos:** los de `AgendarLlamada`: `GET /booking/taken`, `GET /user/me`, `POST /payment/llamada/checkout` (redirige a Stripe con `returnPath`), `GET /payment/llamada/verify?session_id=` al volver.
- **Desbloqueo:** la página no tiene gate propio (no hay chequeo de sesión ni de carta). En el Índice se abre con el paso 5.
- **Botones / a dónde lleva:** prev → `/metodo/astrologia/pdf`; next → `/metodo/astrologia/cursos`. «Ilustraciones», `IndiceAstrologia`.
- **Condiciones y casos raros:** al volver de Stripe hay un parámetro de sesión en la URL que `AgendarLlamada` lee y limpia.
- **Tests:** pendiente

---

## `/metodo/astrologia/cursos` — Cursos de Astrología (Paso 8)
- **Componente:** `MetodoAstrologiaCursos` en `frontend/src/app/metodo/MetodoAstrologiaCursos.tsx`
- **Acceso:** con sesión (PrivateRoute) + pago de astrología (`GuardiaPagoRecorrido`).
- **Qué hace:** Cuadrícula con los cursos de astrología del catálogo, del más nuevo al más viejo (con un solo curso sale una tarjeta grande; sin cursos, «próximamente»). Al final, `PedirOpinion` para dejar una reseña.
- **Datos:** `GET /cursos` (vía `useCursosData`), `GET /user/me` (`psicologia_suscrito`). Precarga las portadas.
- **Desbloqueo:** sin gate propio (en el Índice va con el paso 5).
- **Botones / a dónde lleva:** prev → `/metodo/astrologia/llamada`. Next «Psicología →»: si no tiene psicología pagada abre `PagoPsicologiaModal` (el pago va por el Payment Link de Stripe `irAPagoDisciplina("psicologia")`) y lleva un candado; si la tiene → `/metodo/psicologia`. `PedirOpinion` → `/opiniones?volver=`. «Ilustraciones», `BotonCompania`, `IndiceAstrologia`.
- **Condiciones y casos raros:** sin token no redirige (solo deja de pedir `/user/me`). Mientras `psicologiaSuscrito` es `null` (no ha cargado), el botón navega directo y el guardia de pago decide.
- **Tests:** pendiente

---

## `/metodo/astrologia/:planetaKey/:campo` — Profundizar en un planeta (fuera del índice)
- **Componente:** `MetodoAstrologiaProfundizar` en `frontend/src/app/metodo/MetodoAstrologiaProfundizar.tsx`
- **Acceso:** con sesión (PrivateRoute) + pago de astrología (`GuardiaPagoRecorrido`).
- **Qué hace:** El texto largo del planeta `planetaKey` en su signo (`campo = signo`) o en su casa (cualquier otro valor se trata como casa), sobre fondo estrellado. Al entrar lo marca como profundizado.
- **Datos:** `GET /metodo-astrologia/:userId`; si faltaba el flag, `PATCH /metodo-astrologia/:userId` `{ data }` con `data.<planeta>.profundizadoSigno|profundizadoCasa`. Textos de `getTextoSigno`/`getTextoCasa` + overrides remotos (`useOverridesRemotos`).
- **Desbloqueo:** ninguno aparte de la sesión. Planeta desconocido → `/metodo/astrologia/planetas` (replace).
- **Botones / a dónde lleva:** solo prev «← Volver a planetas» (espera al PATCH) → `/metodo/astrologia/planetas`.
- **Condiciones y casos raros:** es una página heredada: solo se llega desde `/metodo/astrologia/planetas`. El signo y la casa salen del `data` guardado, no de la carta, así que tras corregir la fecha puede enseñar datos viejos. Título en español fijo.
- **Tests:** pendiente

---

## `/metodo/astrologia/planetas` — Planetas (página heredada, fuera del índice)
- **Componente:** `MetodoAstrologiaPlanetas` en `frontend/src/app/metodo/MetodoAstrologiaPlanetas.tsx`
- **Acceso:** con sesión (PrivateRoute) + pago de astrología (`GuardiaPagoRecorrido`).
- **Qué hace:** Una cuadrícula de todos los cuerpos (`PlanetaBox`) en la que se elige a mano el signo y la casa de cada uno (`PlanetaPickerModal`), con enlaces a «profundizar» signo o casa. Se guarda sola («Guardando…»).
- **Datos:** `useCartaPlanetas`: `GET /metodo-astrologia/:userId` y `PATCH /metodo-astrologia/:userId` `{ data }` (debounce de 1,5 s).
- **Desbloqueo:** exige solicitud enviada (si no → `/metodo/astrologia`, replace).
- **Botones / a dónde lleva:** prev → `/metodo/astrologia/cartaAstral`. Next «Psicología →» siempre desactivado («estará disponible próximamente»). Cada planeta → `/metodo/astrologia/<key>/signo|casa`.
- **Condiciones y casos raros:** ninguna página del recorrido enlaza aquí (solo Profundizar); no tiene Índice. Parece código viejo.
- **Tests:** pendiente

---

## `/metodo/psicologia` — Vuelve a ti: entrada de Psicología (Paso 1)
- **Componente:** `MetodoPsicologia` en `frontend/src/app/metodo/MetodoPsicologia.tsx`
- **Acceso:** con sesión (PrivateRoute) + pago de psicología (`GuardiaPagoRecorrido`, scope `psicologia`). Además la página comprueba `psicologia_suscrito` y, si falta, abre `PagoPsicologiaModal`.
- **Qué hace:** Siempre abre el cómic de intro de psicología. Un box explica el recorrido y avisa de que no es terapia individual. El botón «Aviso» abre un modal «Importante» con tres párrafos.
- **Datos:** `GET /user/me` (`psicologia_suscrito`). El pago va por el Payment Link de Stripe (`irAPagoDisciplina("psicologia")`). No guarda nada.
- **Desbloqueo:** sin requisito. Abre el paso 2.
- **Botones / a dónde lleva:** prev «← Astrología» → `/metodo/astrologia/cursos`. Next → `/metodo/psicologia/linea-de-Vida/problema` (si no ha pagado, abre el pago). `AyudaRecorrido pagina="inicio"` (Índice, Orientación con curso, llamada).
- **Condiciones y casos raros:** si falla `/user/me` → `/home`. La única experiencia es `linea-de-Vida` (el `:experienciaId` de todas las rutas siguientes). El cómic sale SIEMPRE al entrar (useIntroComic no persiste nada). Tras pagar, el popup de éxito del Home solo cierra: la entrada aquí es siempre decisión de la persona.
- **Tests:** el arranque (pagar solo desbloquea, cómic siempre, el problema se guarda) en `backend/src/metodoPsicologia/metodoPsicologia.spec.ts` y `backend/src/payment/payment.service.spec.ts`

---

## `/metodo/psicologia/:experienciaId/problema` — Problemas (Paso 2)
- **Componente:** `MetodoPsicologiaProblema` en `frontend/src/app/metodo/MetodoPsicologiaProblema.tsx`
- **Acceso:** con sesión (PrivateRoute) + pago de psicología (`GuardiaPagoRecorrido` y chequeo propio de `psicologia_suscrito`).
- **Qué hace:** Una pregunta grande, «¿Cuál es tu problema actual?», y un textarea con botón Guardar.
- **Datos:** `GET /user/me`, `GET /metodo-psicologia/:userId`. Guarda `data["problema-actual"]` con `PATCH /metodo-psicologia/:userId` `{ data }` (el blob entero, que el backend reemplaza).
- **Desbloqueo:** sin requisito de entrada. Para seguir hay que escribir algo (`puedeAvanzarPsicologia` caso 2).
- **Botones / a dónde lleva:** prev → `/metodo/psicologia` (guarda y hace flush antes). Next → `/:exp/ace` (guarda + `flushSaves`), desactivado si el texto está vacío. `AyudaRecorrido pagina="problema"` (ejemplos de problemas).
- **Condiciones y casos raros:** `experienciaId` desconocido o sin pago → `/metodo/psicologia` (replace). Sin sesión → `/welcome`.
- **Tests:** `backend/src/metodoPsicologia/metodoPsicologia.spec.ts` (el problema se guarda y se reencuentra, vale la última versión, contrato del blob entero, solo `data`/`intro_visto` desde fuera)

---

## `/metodo/psicologia/:experienciaId/ace` — Test ACE (Paso 3)
- **Componente:** `MetodoPsicologiaAce` en `frontend/src/app/metodo/MetodoPsicologiaAce.tsx`
- **Acceso:** con sesión (PrivateRoute) + pago de psicología (guardia + chequeo propio).
- **Qué hace:** Las 10 preguntas del test de Experiencias Adversas en la Infancia, cada una con «Sí» / «No» y un contador X/10. Al completarlo hace scroll a un bloque final.
- **Datos:** `GET /user/me`, `GET /metodo-psicologia/:userId`. Cada respuesta se guarda al momento en `data.ace.respuestas[key] = "si"|"no"` (`PATCH /metodo-psicologia/:userId`).
- **Desbloqueo:** sin gate de entrada. Next activo con las 10 respondidas (`aceCompleto`).
- **Botones / a dónde lleva:** prev → `/:exp/problema`. Next abre el cómic ACE (`ComicPasoModal`), que espera al guardado + `flushSaves` y lleva a `/:exp/ace-resultado`. `AyudaRecorrido pagina="ace"`.
- **Condiciones y casos raros:** exp desconocido o sin pago → `/metodo/psicologia`. No comprueba que el paso 2 esté escrito.
- **Tests:** el guardado y la recuperación de `data.ace.respuestas` en `backend/src/metodoPsicologia/metodoPsicologia.spec.ts` («Página por página»)

---

## `/metodo/psicologia/:experienciaId/ace-resultado` — Resultado del ACE (Paso 4)
- **Componente:** `MetodoPsicologiaAceResultado` en `frontend/src/app/metodo/MetodoPsicologiaAceResultado.tsx`
- **Acceso:** con sesión (PrivateRoute) + pago de psicología (guardia + chequeo propio).
- **Qué hace:** Muestra la puntuación ACE (número de «sí»), su banda (título y texto), qué significa, el riesgo asociado y un bloque de esperanza.
- **Datos:** `GET /user/me`, `GET /metodo-psicologia/:userId` (lee `data.ace`). No guarda nada.
- **Desbloqueo:** test ACE completo; si no → `/:exp/ace` (replace).
- **Botones / a dónde lleva:** prev → `/:exp/ace`; next y botón «Continuar» del final → `/:exp/des`. `AyudaRecorrido pagina="ace"`.
- **Condiciones y casos raros:** exp desconocido o sin pago → `/metodo/psicologia`.
- **Tests:** pendiente

---

## `/metodo/psicologia/:experienciaId/des` — Test DES-II de desconexión (Paso 5)
- **Componente:** `MetodoPsicologiaDes` en `frontend/src/app/metodo/MetodoPsicologiaDes.tsx`
- **Acceso:** con sesión (PrivateRoute) + pago de psicología (`GuardiaPagoRecorrido` y chequeo propio de `psicologia_suscrito`).
- **Qué hace:** Las 28 preguntas de la Escala de Experiencias Disociativas. Cada una se responde en % de tiempo (0–100, de diez en diez). Al completarlo hace scroll al bloque del resultado.
- **Datos:** `GET /user/me`, `GET /metodo-psicologia/:userId`. Cada respuesta va a `data.des.respuestas[key]` (número) con `PATCH /metodo-psicologia/:userId`. Cuando cambia el resultado calculado, además `PUT /metodo-psicologia/:userId/des` (tabla `psicologia_des`: score, banda, subescalas, alto).
- **Desbloqueo:** sin gate de entrada (no comprueba el ACE). Next activo con las 28 respondidas (`desCompleto`).
- **Botones / a dónde lleva:** prev → `/:exp/ace-resultado`. Next abre el cómic de la disociación (`ComicPasoModal`), que espera al guardado + `flushSaves` → `/:exp/des-resultado`. `AyudaRecorrido pagina="des"`.
- **Condiciones y casos raros:** al cargar solo acepta respuestas numéricas y las limita a 0–100 (0 cuenta como respondida). Exp desconocido o sin pago → `/metodo/psicologia`.
- **Tests:** el guardado del resultado (`PUT /des`: normalizado, banda válida, fecha del resultado) en `backend/src/metodoPsicologia/metodoPsicologia.spec.ts`

---

## `/metodo/psicologia/:experienciaId/des-resultado` — Resultado de la desconexión (Paso 6)
- **Componente:** `MetodoPsicologiaDesResultado` en `frontend/src/app/metodo/MetodoPsicologiaDesResultado.tsx`
- **Acceso:** con sesión (PrivateRoute) + pago de psicología (guardia + chequeo propio).
- **Qué hace:** Muestra la media DES, su banda, qué significa y las tres subescalas (amnesia, despersonalización, absorción), cada una con su descripción. Si la puntuación es alta (`desAlto`, umbral 30) enseña un aviso y un botón «Pedir llamada» que abre un popup con `AgendarLlamada`.
- **Datos:** `GET /user/me`, `GET /metodo-psicologia/:userId` (`data.des`). Repara el resultado con `PUT /metodo-psicologia/:userId/des` cada vez que se entra (upsert idempotente). La llamada usa `/booking/taken` y `/payment/llamada/checkout`.
- **Desbloqueo:** test DES completo; si no → `/:exp/des` (replace).
- **Botones / a dónde lleva:** prev → `/:exp/des`; next y botón del final → `/:exp/cerebro`. `AyudaRecorrido pagina="des"`.
- **Condiciones y casos raros:** la cifra que se ve se calcula de las respuestas, no de la tabla.
- **Tests:** pendiente

---

## `/metodo/psicologia/:experienciaId/cerebro` — Tu cerebro (Paso 7)
- **Componente:** `MetodoPsicologiaCerebro` en `frontend/src/app/metodo/MetodoPsicologiaCerebro.tsx`
- **Acceso:** con sesión (PrivateRoute) + pago de psicología (guardia + chequeo propio).
- **Qué hace:** Página de lectura: un dibujo del cerebro (`CerebroTrauma`) con zonas pulsables. Cada zona abre un popup con foto (`CerebroZonaModal`, con flechas para pasar de una a otra). No mide nada.
- **Datos:** `GET /user/me`, `GET /metodo-psicologia/:userId` (solo para el gate). No guarda nada.
- **Desbloqueo:** ACE completo (si no → `/:exp/ace`) y DES completo (si no → `/:exp/des`), los dos con replace.
- **Botones / a dónde lleva:** prev → `/:exp/des-resultado`. Next y el botón «Continuar a la línea» abren el cómic «línea del tiempo» → `/metodo/psicologia/:exp` (Línea de Vida). `AyudaRecorrido pagina="cerebro"`.
- **Condiciones y casos raros:** ninguno más.
- **Tests:** pendiente

---

## `/metodo/psicologia/:experienciaId` — Línea de Vida (Paso 8)
- **Componente:** `MetodoPsicologiaExperiencia` en `frontend/src/app/metodo/MetodoPsicologiaExperiencia.tsx`
- **Acceso:** con sesión (PrivateRoute) + pago de psicología (guardia + chequeo propio).
- **Qué hace:** Primero pide la edad (1–120) en un popup. Con ella dibuja una línea de tiempo año a año, repartida en tramos con flechas, más un nodo opcional de gestación (−1). Cada año abre una «página de libro» con 8 preguntas evocadoras (listas de ítems) o se marca «Sin recuerdos» (pastilla bajo el título del año; marcarla guarda y cierra). NO hay botones de Guardar: todo se autoguarda (debounce 900ms, incluidos los borradores a medio escribir) y cerrar el popup (✕ o fuera) también guarda.
- **Datos:** `GET /user/me`, `GET /metodo-psicologia/:userId`. Guarda con `PATCH /metodo-psicologia/:userId` `data.edad` y `data.anos[edad] = { respuestas: {key: string[]}, sinRecuerdos }` (el blob entero).
- **Desbloqueo:** sin gate de entrada. Next activo con al menos 1 año recorrido (`aniosRecorridos >= 1`).
- **Botones / a dónde lleva:** prev → `/:exp/des-resultado` (guarda y hace flush antes). Next: si la línea está completa abre el cómic de la familia; si no, un aviso con la opción «continuar igual» → cómic → `/:exp/familia`. `AyudaRecorrido pagina="linea-de-Vida"`.
- **Condiciones y casos raros:** el prev salta a des-resultado (paso 6), no a Tu cerebro (paso 7): parece un resto de antes de añadir el cerebro. Las respuestas antiguas en forma de string se normalizan a lista (`itemsDeRespuesta`). La gestación no cuenta para el progreso.
- **Tests:** el guardado y la recuperación de `data.edad` y `data.anos` (gestación −1, respuestas en listas, «sin recuerdos») en `backend/src/metodoPsicologia/metodoPsicologia.spec.ts` («Página por página»)

---

## `/metodo/psicologia/:experienciaId/familia` — Tu familia (Paso 9)
- **Componente:** `MetodoPsicologiaFamilia` en `frontend/src/app/metodo/MetodoPsicologiaFamilia.tsx`
- **Acceso:** con sesión (PrivateRoute) + pago de psicología (guardia + chequeo en `useMapaFamilia`).
- **Qué hace:** Un mapa en rejilla (`GenogramaMapa`) con la persona en el centro («Tú», con su foto de perfil). Va añadiendo familiares arriba, a los lados o abajo. Al abrir cada uno (`PopupPersonaje`) le pone nombre, parentesco, foto y hasta 2 personajes o animales simbólicos.
- **Datos:** `useMapaFamilia`: `GET /user/me` (foto `img`), `GET /metodo-psicologia/:userId`, `PATCH /metodo-psicologia/:userId` con `data.genograma` (debounce de 900 ms y guardado al cerrar el popup o desmontar). Las fotos suben a `POST /upload/genograma/:userId` (`FotoPersonaBoton`) y en el blob solo queda la URL.
- **Desbloqueo:** sin gate de entrada. Next activo si al menos una persona tiene símbolo (`familiaConSimbolo`), con un tooltip distinto si el mapa está vacío.
- **Botones / a dónde lleva:** prev → `/:exp` (Línea de Vida). Next hace flush y abre el cómic de la herencia → `/:exp/genograma`. `AyudaRecorrido pagina="familia"`.
- **Condiciones y casos raros:** si `experienciaId` no existe devuelve `null` (pantalla vacía, sin redirigir). Espera a que carguen todas las fotos del mapa antes de pintarse.
- **Tests:** el guardado y la recuperación de `data.genograma` (personas, posición y símbolos) en `backend/src/metodoPsicologia/metodoPsicologia.spec.ts` («Página por página»)

---

## `/metodo/psicologia/:experienciaId/genograma` — Genograma (Paso 10)
- **Componente:** `MetodoPsicologiaGenograma` en `frontend/src/app/metodo/MetodoPsicologiaGenograma.tsx`
- **Acceso:** con sesión (PrivateRoute) + pago de psicología (guardia + `useMapaFamilia`).
- **Qué hace:** La familia como TARJETAS en rejilla (3-4 por fila en ordenador; 1-2 en pantallas pequeñas): foto a la izquierda con el rol al lado (y el nombre debajo), rayita, sus personajes/animales y un botón «Rellenar». Rellenar abre la ficha (`FichaPersona`) con las preguntas guía: todo se autoguarda y el botón «Hecho ✓» abajo a la derecha cierra (control explícito de guardado). Ya no se pintan aquí los «+» del mapa: colocar/añadir familia se hace en «Tu familia»; desde la ficha se puede editar y quitar.
- **Datos:** `useMapaFamilia` (mismos endpoints que Tu familia). Guarda `data.genograma[i].notas[key]` y la foto vía `POST /upload/genograma/:userId`.
- **Desbloqueo:** sin gate de entrada. Next activo con al menos 1 persona.
- **Botones / a dónde lleva:** prev → `/:exp/familia`; next → `/:exp/huellas` (los dos hacen flush). `AyudaRecorrido pagina="genograma"`.
- **Condiciones y casos raros:** exp desconocido → `null`, sin redirección.
- **Tests:** el guardado y la recuperación de `data.genograma[i].notas` (y la URL de la foto) en `backend/src/metodoPsicologia/metodoPsicologia.spec.ts` («Página por página»)

---

## `/metodo/psicologia/:experienciaId/huellas` — Huellas (Paso 11)
- **Componente:** `MetodoPsicologiaHuellas` en `frontend/src/app/metodo/MetodoPsicologiaHuellas.tsx`
- **Acceso:** con sesión (PrivateRoute) + pago de psicología (guardia + chequeo propio de `psicologia_suscrito`).
- **Qué hace:** Un «libro» a doble página con los años que tienen recuerdos en la Línea de Vida, dos años por pliego y flechas para pasar. Al tocar un ítem escrito se marca o desmarca como huella (algo que dejó marca).
- **Datos:** `GET /user/me`, `GET /metodo-psicologia/:userId`. Guarda `data.anos[edad].huellas: string[]` (texto del ítem) con `PATCH /metodo-psicologia/:userId` en cada toque.
- **Desbloqueo:** sin gate de entrada. Next activo con al menos 1 huella marcada.
- **Botones / a dónde lleva:** prev → `/:exp/genograma`. Next abre el cómic de las creencias → flush → `/:exp/nudos`. `AyudaRecorrido pagina="huellas"`.
- **Condiciones y casos raros:** la huella se guarda por TEXTO del ítem: si luego se edita ese recuerdo en la Línea de Vida, la marca se pierde (sin verificar si se migra).
- **Tests:** el guardado y la recuperación de `data.anos[año].huellas` (marcar y desmarcar) en `backend/src/metodoPsicologia/metodoPsicologia.spec.ts` («Página por página»)

---

## `/metodo/psicologia/:experienciaId/nudos` — Nudos (Paso 12)
- **Componente:** `MetodoPsicologiaNudos` en `frontend/src/app/metodo/MetodoPsicologiaNudos.tsx`
- **Acceso:** con sesión (PrivateRoute) + pago de psicología (guardia + chequeo propio).
- **Qué hace:** Se escriben los conflictos o patrones de hoy («nudos») como una lista de chips. Se pueden añadir a mano o desde los ejemplos sugeridos (los ya usados no se repiten) y quitar.
- **Datos:** `GET /user/me`, `GET /metodo-psicologia/:userId`. Guarda `data.nudos: string[]` con `PATCH /metodo-psicologia/:userId`.
- **Desbloqueo:** sin gate de entrada. Next activo con al menos 1 nudo.
- **Botones / a dónde lleva:** prev → `/:exp/huellas`; next (flush) → `/:exp/necesidades`. `AyudaRecorrido pagina="nudos"` (ejemplos en chips).
- **Condiciones y casos raros:** no acepta duplicados (compara sin mayúsculas). Si `data.nudos` no es un array, se trata como vacío.
- **Tests:** el guardado, el borrado y la recuperación de `data.nudos` en `backend/src/metodoPsicologia/metodoPsicologia.spec.ts` («Página por página»)

---

## `/metodo/psicologia/:experienciaId/necesidades` — Las necesidades del niño (Paso 13)
- **Componente:** `MetodoPsicologiaNecesidades` en `frontend/src/app/metodo/MetodoPsicologiaNecesidades.tsx`
- **Acceso:** con sesión (PrivateRoute) + pago de psicología (guardia + chequeo propio).
- **Qué hace:** Las 18 necesidades de la infancia, en tarjetas que se desbloquean de una en una. Cada una abre un modal para responder si la recibió, «a veces» o le faltó.
- **Datos:** `GET /user/me`, `GET /metodo-psicologia/:userId`. Guarda `data.necesidades[key] = "recibida"|"a-veces"|"falto"` con `PATCH /metodo-psicologia/:userId`.
- **Desbloqueo:** sin gate de entrada. Dentro, cada necesidad pide la anterior (`necesidadDesbloqueada`). Next activo con las 18 respondidas.
- **Botones / a dónde lleva:** prev → `/:exp/nudos`. Next espera al guardado + flush → `/:exp/huellas-nudos`. `AyudaRecorrido pagina="necesidades"` (la Orientación usa `NECESIDADES_INTRO`).
- **Condiciones y casos raros:** ninguno más.
- **Tests:** el guardado y la recuperación de `data.necesidades` en `backend/src/metodoPsicologia/metodoPsicologia.spec.ts` («Página por página»)

---

## `/metodo/psicologia/:experienciaId/huellas-nudos` — Heridas: crear heridas (Paso 14)
- **Componente:** `MetodoPsicologiaHuellasNudos` en `frontend/src/app/metodo/MetodoPsicologiaHuellasNudos.tsx`
- **Acceso:** con sesión (PrivateRoute) + pago de psicología (guardia + chequeo propio).
- **Qué hace:** Tres columnas: huellas marcadas, necesidades no cubiertas («falto» o «a veces») y nudos. Se seleccionan piezas de cualquiera de ellas, se les pone nombre (opcional) y se guardan como una «herida» (Huella + Necesidad + Nudo). Las heridas creadas salen debajo, cada una con su color. Una columna vacía ofrece un botón para ir a rellenarla.
- **Datos:** `GET /user/me` y `GET /metodo-psicologia/:userId` en paralelo. Guarda `data.heridas: RelacionHuellaNudo[]` (`id`, `titulo`, `huellas`, `nudos`, `necesidades`, `texto`) con `PATCH /metodo-psicologia/:userId`.
- **Desbloqueo:** las 18 necesidades respondidas; si no → `/:exp/necesidades` (replace). Next activo con al menos 1 herida.
- **Botones / a dónde lleva:** prev (flush) → `/:exp/necesidades`; next (flush) → `/:exp/heridas-lista`. Columnas vacías → `/:exp/huellas`, `/:exp/necesidades` o `/:exp/nudos`. `AyudaRecorrido pagina="heridas"` (ejemplo estructurado).
- **Condiciones y casos raros:** sin nombre, el título cae en «herida sin título» (i18n). Heridas antiguas sin `titulo` se normalizan a `""`. Enter en el campo de nombre guarda.
- **Tests:** el guardado y la recuperación de `data.heridas` en `backend/src/metodoPsicologia/metodoPsicologia.spec.ts` («Página por página»)

---

## `/metodo/psicologia/:experienciaId/heridas-lista` — Tus heridas (Paso 15)
- **Componente:** `MetodoPsicologiaHeridasLista` en `frontend/src/app/metodo/MetodoPsicologiaHeridasLista.tsx`
- **Acceso:** con sesión (PrivateRoute) + pago de psicología (guardia + chequeo propio).
- **Qué hace:** La lista de las heridas creadas en el paso anterior, con la opción de borrarlas. Si no hay ninguna, sale un botón para crearlas.
- **Datos:** `GET /user/me`, `GET /metodo-psicologia/:userId`. Al borrar guarda `data.heridas` filtrado con `PATCH /metodo-psicologia/:userId`.
- **Desbloqueo:** sin requisito (tampoco para seguir).
- **Botones / a dónde lleva:** prev (flush) → `/:exp/huellas-nudos`. Next abre el cómic «narrar» → `/:exp/regulacion`. Botón del estado vacío → `/:exp/huellas-nudos`. `AyudaRecorrido pagina="heridas"`.
- **Condiciones y casos raros:** se puede seguir con 0 heridas si se borran todas aquí, aunque el paso 14 las exigía.
- **Tests:** que borrar también se guarda (el blob entero) en `backend/src/metodoPsicologia/metodoPsicologia.spec.ts` («Página por página»)

---

## `/metodo/psicologia/:experienciaId/regulacion` — Narra: regulación con audio bilateral (Paso 16)
- **Componente:** `MetodoPsicologiaRegulacion` en `frontend/src/app/metodo/MetodoPsicologiaRegulacion.tsx`
- **Acceso:** con sesión (PrivateRoute) + pago de psicología (guardia + chequeo propio).
- **Qué hace:** Ejercicio autoguiado (no es EMDR clínico): preparación con un lugar seguro, luego el audio de estimulación bilateral (play/pausa, reiniciar, barra de avance, volumen) mientras escribe libremente en tantos bloques como quiera. Al acabar, un cierre de grounding en popup.
- **Datos:** `GET /user/me`, `GET /metodo-psicologia/:userId`. Guarda `data.regulacion = { fragmentos: string[], texto }` (`texto` es la unión, por compatibilidad) con `PATCH /metodo-psicologia/:userId` (autoguardado con debounce, botón Guardar y guardado al desmontar). Audio en `/audio/estimulacion-bilateral.mp3`.
- **Desbloqueo:** sin requisito.
- **Botones / a dónde lleva:** prev → `/:exp/heridas-lista` (su etiqueta dice «Heridas», no «Tus heridas»). Next → `/:exp/integracion`. Los dos guardan y hacen flush antes. `AyudaRecorrido pagina="regulacion"`.
- **Condiciones y casos raros:** datos antiguos con solo `regulacion.texto` se convierten en un único fragmento. Si el audio falla, se marca `audioError` y se desactivan los controles. El audio se pausa al salir.
- **Tests:** el guardado y la recuperación de `data.regulacion.fragmentos` en `backend/src/metodoPsicologia/metodoPsicologia.spec.ts` («Página por página»)

---

## `/metodo/psicologia/:experienciaId/integracion` — Relación: heridas y arquetipos (Paso 17)
- **Componente:** `MetodoPsicologiaIntegracion` en `frontend/src/app/metodo/MetodoPsicologiaIntegracion.tsx`
- **Acceso:** con sesión (PrivateRoute) + pago de psicología (guardia + chequeo propio).
- **Qué hace:** Cruza dos disciplinas. En una columna, sus heridas; en otra, los arquetipos de su carta astral (planeta + signo/casa, con «Saber más» en `SaberMasModal`). Compone «relaciones» (constelaciones) uniendo nudos y arquetipos, les pone título y escribe su comprensión. Cada relación lleva su color.
- **Datos:** `GET /user/me`; en paralelo `GET /metodo-psicologia/:userId` y `GET /metodo-astrologia/:userId` (usa `solicitud_enviada_at` y `data.<planeta>.signo/casa`). Guarda `data.constelaciones: Constelacion[]` (`id`, `titulo`, `nudos`, `arquetipos`, `texto`) con `PATCH /metodo-psicologia/:userId` (debounce + indicador «guardado»).
- **Desbloqueo:** sin gate de entrada. Next activo con al menos 1 relación con contenido.
- **Botones / a dónde lleva:** prev → `/:exp/regulacion`; next → `/:exp/dones` (los dos hacen flush de lo pendiente). Sin carta astral: el bloque de arquetipos sale con candado y un botón → `/metodo/astrologia`. Sin heridas: un botón → `/:exp/huellas-nudos`. `AyudaRecorrido pagina="integracion"`.
- **Condiciones y casos raros:** si falla el GET de astrología, se sigue sin arquetipos (`allSettled`). Las constelaciones antiguas se blindan (arrays y strings por defecto). Los arquetipos salen del `data` de astrología, no de la carta calculada, así que pueden estar desfasados tras corregir la fecha.
- **Tests:** el guardado y la recuperación de `data.constelaciones` en `backend/src/metodoPsicologia/metodoPsicologia.spec.ts` («Página por página»)

---

## `/metodo/psicologia/:experienciaId/dones` — Recuérdate (Paso 18)
- **Componente:** `MetodoPsicologiaDones` en `frontend/src/app/metodo/MetodoPsicologiaDones.tsx`
- **Acceso:** con sesión (PrivateRoute) + pago de psicología (guardia + chequeo propio).
- **Qué hace:** Las preguntas de «Dones» de una en una, como páginas con flechas. Cada una se responde con texto o se marca «sin ideas». El botón «Siguiente» guarda y avanza; en la última pone «Guardar».
- **Datos:** `GET /user/me`, `GET /metodo-psicologia/:userId`. Guarda `data.dones.respuestas[key]` y `data.dones.sinIdeas: string[]` con `PATCH /metodo-psicologia/:userId` (debounce + guardado inmediato al pasar de página).
- **Desbloqueo:** sin gate de entrada. Next activo cuando todas están respondidas o marcadas «sin ideas».
- **Botones / a dónde lleva:** prev → `/:exp/integracion`; next → `/:exp/dones-espejo` (guardan + flush). `AyudaRecorrido pagina="dones"`.
- **Condiciones y casos raros:** `sinIdeas` que no sea un array se ignora.
- **Tests:** el guardado y la recuperación de `data.dones.respuestas` y `data.dones.sinIdeas` en `backend/src/metodoPsicologia/metodoPsicologia.spec.ts` («Página por página»)

---

## `/metodo/psicologia/:experienciaId/dones-espejo` — Dones: el espejo (Paso 19)
- **Componente:** `MetodoPsicologiaDonesEspejo` en `frontend/src/app/metodo/MetodoPsicologiaDonesEspejo.tsx`
- **Acceso:** con sesión (PrivateRoute) + pago de psicología (guardia + chequeo propio).
- **Qué hace:** Le devuelve sus respuestas de «Recuérdate» y los arquetipos de su carta. Con ellos escribe los dones que reconoce en sí misma, y a cada uno le une arquetipos y recuerdos.
- **Datos:** `GET /user/me`; en paralelo `GET /metodo-psicologia/:userId` y `GET /metodo-astrologia/:userId`. Guarda `data.dones.lista: DonReconocido[]` (`id`, `texto`, `arquetipos`, `recuerdos`) con `PATCH /metodo-psicologia/:userId` (debounce).
- **Desbloqueo:** sin gate de entrada. Next activo con al menos 1 don escrito.
- **Botones / a dónde lleva:** prev → `/:exp/dones`; next → `/:exp/miedos` (flush). Sin astrología, los arquetipos salen bloqueados con botón → `/metodo/astrologia`. `SaberMasModal` para cada arquetipo. `AyudaRecorrido pagina="dones-espejo"`.
- **Condiciones y casos raros:** los dones antiguos se normalizan con `coercionarDones`. Aquí la astrología cuenta como hecha también si hay arquetipos en `data`, aunque no haya solicitud (en Relación solo cuenta la solicitud).
- **Tests:** el guardado y la recuperación de `data.dones.lista` (sin pisar respuestas ni sinIdeas) en `backend/src/metodoPsicologia/metodoPsicologia.spec.ts` («Página por página»)

---

## `/metodo/psicologia/:experienciaId/miedos` — Miedos (Paso 20)
- **Componente:** `MetodoPsicologiaMiedos` en `frontend/src/app/metodo/MetodoPsicologiaMiedos.tsx`
- **Acceso:** con sesión (PrivateRoute) + pago de psicología (guardia + chequeo propio).
- **Qué hace:** Se nombran uno a uno los miedos más profundos (igual que los Nudos), con ejemplos sugeridos. Se pueden añadir y quitar.
- **Datos:** `GET /user/me`, `GET /metodo-psicologia/:userId`. Guarda `data.miedos: MiedoItem[]` (`id`, `texto`, `respuestas`) con `PATCH /metodo-psicologia/:userId`.
- **Desbloqueo:** sin gate de entrada. Next activo con al menos 1 miedo.
- **Botones / a dónde lleva:** prev → `/:exp/dones-espejo` (sin flush). Next hace flush y abre el cómic del miedo → `/:exp/miedos-preguntas`. `AyudaRecorrido pagina="miedos"` (ejemplos).
- **Condiciones y casos raros:** ninguno más.
- **Tests:** el guardado y la recuperación de `data.miedos` en `backend/src/metodoPsicologia/metodoPsicologia.spec.ts` («Página por página»)

---

## `/metodo/psicologia/:experienciaId/miedos-preguntas` — Atrévete: enfrenta tus miedos (Paso 21)
- **Componente:** `MetodoPsicologiaMiedosPreguntas` en `frontend/src/app/metodo/MetodoPsicologiaMiedosPreguntas.tsx`
- **Acceso:** con sesión (PrivateRoute) + pago de psicología (guardia + chequeo propio).
- **Qué hace:** Cada miedo sale en un box. Al abrirlo, un popup va pasando las preguntas para mirarlo de frente (anterior/siguiente, con foco automático en el campo). Se ve el progreso de cada miedo.
- **Datos:** `GET /user/me`, `GET /metodo-psicologia/:userId`. Guarda `data.miedos[i].respuestas[key]` con `PATCH /metodo-psicologia/:userId` (debounce y guardado al cerrar el popup).
- **Desbloqueo:** sin gate de entrada. Next activo cuando hay miedos y todos tienen todas las preguntas respondidas.
- **Botones / a dónde lleva:** prev → `/:exp/miedos`; next → `/:exp/mapa` (flush). `AyudaRecorrido pagina="miedos-preguntas"`.
- **Condiciones y casos raros:** si llega sin miedos, el next queda bloqueado para siempre hasta volver a Miedos.
- **Tests:** el guardado y la recuperación de `data.miedos[].respuestas` en `backend/src/metodoPsicologia/metodoPsicologia.spec.ts` («Página por página»)

---

## `/metodo/psicologia/:experienciaId/mapa` — Integración (Paso 22)
- **Componente:** `MetodoPsicologiaMapa` en `frontend/src/app/metodo/MetodoPsicologiaMapa.tsx`
- **Acceso:** con sesión (PrivateRoute) + pago de psicología (guardia + chequeo propio).
- **Qué hace:** Recupera las relaciones del paso 17. Al abrir cada una, un popup pide 4 bloques uno a uno: qué intentaba proteger el patrón, qué coste tiene, qué verdad más sana quiere practicar y una frase recordatorio.
- **Datos:** `GET /user/me`, `GET /metodo-psicologia/:userId`. Guarda `data.constelaciones[i].proteger|coste|verdadSana|recordatorio` con `PATCH /metodo-psicologia/:userId` (debounce y flush al cerrar el popup).
- **Desbloqueo:** sin gate de entrada. Next activo con al menos una relación con algún bloque relleno.
- **Botones / a dónde lleva:** prev → `/:exp/miedos-preguntas`. Next abre un popup de felicitación → cómic «compromiso» → `/:exp/compromiso` (flush). `AyudaRecorrido pagina="mapa"`.
- **Condiciones y casos raros:** si no creó relaciones en el paso 17, aquí no hay nada que rellenar y no puede avanzar (sin verificar si sale un aviso de vacío). Las relaciones antiguas se blindan al cargar.
- **Tests:** el guardado y la recuperación de `data.constelaciones[].proteger|coste|verdadSana|recordatorio` en `backend/src/metodoPsicologia/metodoPsicologia.spec.ts` («Página por página»)

---

## `/metodo/psicologia/:experienciaId/compromiso` — Compromiso (Paso 23)
- **Componente:** `MetodoPsicologiaCompromiso` en `frontend/src/app/metodo/MetodoPsicologiaCompromiso.tsx`
- **Acceso:** con sesión (PrivateRoute) + pago de psicología (guardia + chequeo propio).
- **Qué hace:** Dos preguntas de texto libre: «¿Qué necesitaste que nadie pudo darte?» y «¿Cómo puedes empezar a dártelo hoy?», con botón Guardar e indicador de guardado.
- **Datos:** `GET /user/me`, `GET /metodo-psicologia/:userId`. Guarda `data.compromiso = { necesitaste, dartelo }` con `PATCH /metodo-psicologia/:userId` (autoguardado y botón).
- **Desbloqueo:** sin gate de entrada. Next activo con las dos respuestas escritas.
- **Botones / a dónde lleva:** prev → `/:exp/mapa`; next → `/:exp/brujula` (guardan + flush). `AyudaRecorrido pagina="compromiso" ocultarCompania` (sin el botón de llamada).
- **Condiciones y casos raros:** ninguno más.
- **Tests:** el guardado y la recuperación de `data.compromiso` en `backend/src/metodoPsicologia/metodoPsicologia.spec.ts` («Página por página»)

---

## `/metodo/psicologia/:experienciaId/brujula` — Tu carta / brújula (Paso 24)
- **Componente:** `MetodoPsicologiaBrujula` en `frontend/src/app/metodo/MetodoPsicologiaBrujula.tsx`
- **Acceso:** con sesión (PrivateRoute) + pago de psicología (guardia + chequeo propio).
- **Qué hace:** Un mensaje libre de la persona a su yo del futuro, para los momentos de bloqueo. Botón Guardar con indicador.
- **Datos:** `GET /user/me`, `GET /metodo-psicologia/:userId`. Guarda `data.brujula.mensaje` con `PATCH /metodo-psicologia/:userId`. Los campos antiguos `herida`, `necesidad`, `miedo` y `don` se conservan para leer recorridos viejos.
- **Desbloqueo:** sin gate de entrada. Next activo con el mensaje escrito.
- **Botones / a dónde lleva:** prev → `/:exp/compromiso` (guarda + flush). Next guarda y abre el cómic «síntesis» → flush → `/:exp/sintesis`. `AyudaRecorrido pagina="brujula" ocultarCompania`.
- **Condiciones y casos raros:** en el next, `persistir` se lanza sin esperarlo, pero el cómic hace `flushSaves` antes de navegar.
- **Tests:** el guardado y la recuperación de `data.brujula.mensaje` en `backend/src/metodoPsicologia/metodoPsicologia.spec.ts` («Página por página»)

---

## `/metodo/psicologia/:experienciaId/sintesis` — Síntesis del camino (Paso 25)
- **Componente:** `MetodoPsicologiaSintesis` en `frontend/src/app/metodo/MetodoPsicologiaSintesis.tsx`
- **Acceso:** con sesión (PrivateRoute) + pago de psicología (guardia + chequeo propio).
- **Qué hace:** Resumen de solo lectura de todo el recorrido, en secciones numeradas unidas por flechas: de dónde vengo (problemas), lo que cargué, lo que dejó huella, los nudos, lo que me faltó, mis heridas, cómo me relaciono (con los 4 bloques de integración), mis miedos, mis dones, mi carta y mi compromiso. Al final, dos botones de descarga en PDF: el mapa completo y la Línea de Vida. Tiene un botón flotante para volver arriba.
- **Datos:** `GET /user/me`, `GET /metodo-psicologia/:userId`. Los PDF se generan en el navegador con `generatePsicologiaPdf(data)` y `generateLineaDeVidaPdf(data)`. No guarda nada.
- **Desbloqueo:** sin gate de entrada ni requisito para seguir.
- **Botones / a dónde lleva:** prev → `/:exp/brujula`; next → `/:exp/emociones`. Aquí no usa `AyudaRecorrido`: monta `BotonCompania` (llamada 15 €) e `IndiceRecorrido` directamente.
- **Condiciones y casos raros:** los errores al generar el PDF se tragan en silencio. Las heridas o relaciones sin título caen en un texto por defecto.
- **Tests:** pendiente

---

## `/metodo/psicologia/:experienciaId/emociones` — La rueda de las emociones (Paso 26)
- **Componente:** `MetodoPsicologiaEmociones` en `frontend/src/app/metodo/MetodoPsicologiaEmociones.tsx`
- **Acceso:** con sesión (PrivateRoute) + pago de psicología (guardia + chequeo propio).
- **Qué hace:** Una herramienta de consulta: una rueda SVG de emociones (`RuedaEmocionesSvg`, datos en `hardCoded/metodo/ruedaEmociones.ts`). Al tocar una palabra, un modal enseña esa emoción y sus 3 características.
- **Datos:** `GET /user/me` (solo el chequeo de pago). No guarda nada.
- **Desbloqueo:** sin requisito.
- **Botones / a dónde lleva:** prev → `/:exp/sintesis`; next → `/:exp/cursos`. `AyudaRecorrido pagina="emociones"`.
- **Condiciones y casos raros:** ninguno.
- **Tests:** pendiente

---

## `/metodo/psicologia/:experienciaId/cursos` — Cursos de Psicología (Paso 27)
- **Componente:** `MetodoPsicologiaCursos` en `frontend/src/app/metodo/MetodoPsicologiaCursos.tsx`
- **Acceso:** con sesión (PrivateRoute) + pago de psicología (guardia + chequeo propio).
- **Qué hace:** Cuadrícula con los cursos de psicología del catálogo (con uno solo sale una tarjeta grande) y `PedirOpinion` para dejar una reseña al final del recorrido.
- **Datos:** `GET /user/me` (`psicologia_suscrito`, `ayurveda_suscrito`), `GET /cursos` (`useCursosData`).
- **Desbloqueo:** sin requisito.
- **Botones / a dónde lleva:** prev → `/:exp/emociones`. Next «Ayurveda →»: si no tiene Ayurveda pagada abre `PagoAyurvedaModal` (`irAPagoDisciplina("ayurveda")`, Payment Link de Stripe); si la tiene → `/metodo/ayurveda`. `PedirOpinion` → `/opiniones?volver=`. `BotonCompania` (llamada 15 €) e `IndiceRecorrido` directos.
- **Condiciones y casos raros:** mientras `ayurvedaSuscrito` no ha cargado, el botón navega directo y decide el guardia de pago.
- **Tests:** pendiente


# 3. Ayurveda y Medicina China

## `/metodo/ayurveda` — Ayurveda: entrada (Paso 1 del Mapa)
- **Componente:** `MetodoAyurveda` en `frontend/src/app/metodo/MetodoAyurveda.tsx`
- **Acceso:** con sesión (PrivateRoute). Exige pago de Ayurveda: GuardiaPagoRecorrido global (si no `ayurveda_suscrito` → `/home?entrar=ayurveda`) y además la página abre `PagoAyurvedaModal` si no está pagada.
- **Qué hace:** Bienvenida con dos párrafos de introducción en un box con el fondo de la disciplina. Al entrar sale SIEMPRE el cómic del Origen (hinduismo) en `IntroComicModal` (saltable, no persiste). Botón «Aviso importante» abre un modal de aviso. Incluye botón Ilustraciones, BotonCompania (llamada 15 €) e Índice.
- **Datos:** `GET /user/me` (lee `ayurveda_suscrito`). Pago: `irAPagoDisciplina("ayurveda")` (Payment Link). No guarda nada.
- **Desbloqueo:** ninguno aparte del pago (orden de disciplinas solo aconsejado). No desbloquea nada.
- **Botones / a dónde lleva:** prev «← Psicología» → `/metodo/psicologia/linea-de-Vida/cursos`; next → `/metodo/ayurveda/test`. Cerrar el modal de pago → `/home`.
- **Condiciones y casos raros:** sin `userId`/`token` en localStorage → `/welcome`. Si falla `/user/me` → `/home`. `pageLabel` "1/4" (el Índice tiene 7 pasos en el Mapa).
- **Tests:** pendiente

---

## `/metodo/ayurveda/test` — Test de los doṣhas (Paso 2 del Mapa)
- **Componente:** `MetodoAyurvedaTest` en `frontend/src/app/metodo/MetodoAyurvedaTest.tsx` (usa `AyurvedaTestPage` de `frontend/src/components/espacio/components/AyurvedaTestPage.tsx`)
- **Acceso:** con sesión (PrivateRoute) + pago de Ayurveda (Guardia global; y si `!ayurveda_suscrito` → `/metodo/ayurveda`).
- **Qué hace:** 28 preguntas; en cada una se elige Vata, Pitta o Kapha. Al terminar calcula puntuación por doṣha y va al resultado. Si ya había resultado guardado, muestra un aviso «Ya hiciste el test» con tu doṣha y dos botones: «Ver mi resultado» y «Repetir el test».
- **Datos:** `GET /user/me`; `GET /ayurveda/:userId` (resultado previo, tabla `ayurveda`). Al terminar: `POST /ayurveda/resultado` con `{userId, dosha, vataScore, pittaScore, kaphaScore, respuestas[{preguntaIdx, pregunta, doshaElegida}]}` (en español siempre).
- **Desbloqueo:** entra cualquiera que haya pagado. Tener `dosha` guardada desbloquea el botón «Resultado →» y el resto del Mapa en el Índice (pasos ≥3 bloqueados sin doṣha).
- **Botones / a dónde lleva:** prev «← Equilibra» → `/metodo/ayurveda`; next «Resultado →» → `/metodo/ayurveda/resultado` (deshabilitado sin resultado guardado, tooltip «Completa el test…»). Al completar → `/metodo/ayurveda/resultado`.
- **Condiciones y casos raros:** empate de puntuaciones: gana el primero en orden vata > pitta > kapha (reduce con `>=`). Si el POST falla, solo `console.error` y navega igual al resultado, que rebotará al test por no haber dato. Repetir no borra el anterior: el POST lo reemplaza (sin verificar en el service).
- **Tests:** pendiente

---

## `/metodo/ayurveda/resultado` — Tu resultado (Paso 3 del Mapa)
- **Componente:** `MetodoAyurvedaResultado` en `frontend/src/app/metodo/MetodoAyurvedaResultado.tsx`
- **Acceso:** con sesión (PrivateRoute) + pago de Ayurveda (Guardia global; `!ayurveda_suscrito` → `/metodo/ayurveda`).
- **Qué hace:** Tarjeta con tres barras (Vata/Pitta/Kapha) que se rellenan una a una con cuenta ascendente sobre el total de 28, y después aparece con rebote el título del doṣha principal. Respeta prefers-reduced-motion.
- **Datos:** `GET /user/me`; `GET /ayurveda/:userId` (`dosha`, `vata_score`, `pitta_score`, `kapha_score`, `fecha`). No guarda nada.
- **Desbloqueo:** exige resultado del test; sin él → `/metodo/ayurveda/test`.
- **Botones / a dónde lleva:** prev «← Test» → `/metodo/ayurveda/test`; next «Energías →» abre el cómic intercalado de los doṣhas (`ComicPasoModal`, viñetas `hinduismo-doshas`); su continuar → `/metodo/ayurveda/tarjetas`.
- **Condiciones y casos raros:** cualquier error de red → `/metodo/ayurveda/test`. `pageLabel` "3/4".
- **Tests:** pendiente

---

## `/metodo/ayurveda/tarjetas` — Los doṣhas / Energías (Paso 4 del Mapa)
- **Componente:** `MetodoAyurvedaTarjetas` en `frontend/src/app/metodo/MetodoAyurvedaTarjetas.tsx`
- **Acceso:** con sesión (PrivateRoute) + pago de Ayurveda (Guardia global; `!ayurveda_suscrito` → `/metodo/ayurveda`).
- **Qué hace:** Tres tarjetas, una por doṣha, con tu puntuación. Se destacan las que tienen la puntuación máxima (admite empates: bidoṣha/tridoṣha). Pulsar una tarjeta abre el submapa de ese doṣha.
- **Datos:** `GET /user/me`; `GET /ayurveda/:userId` (scores y `dosha`). No guarda nada.
- **Desbloqueo:** exige resultado del test (sin él → `/metodo/ayurveda/test`). Da acceso a los tres submapas (se puede entrar en cualquier doṣha, no solo el tuyo).
- **Botones / a dónde lleva:** prev «← Resultado» → `/metodo/ayurveda/resultado`; next «Prāṇāyāma →» → `/metodo/ayurveda/dosha/<principal>/pranayama`; cada tarjeta → `/metodo/ayurveda/dosha/<dosha>`.
- **Condiciones y casos raros:** `principal` arranca en "vata" y solo cambia si el dato guardado es válido. `pageLabel` "4/4".
- **Tests:** pendiente

---

## `/metodo/ayurveda/dosha/:dosha` — Naturaleza del doṣha (Paso 1 del submapa)
- **Componente:** `MetodoAyurvedaDoshaIntro` en `frontend/src/app/metodo/MetodoAyurvedaDoshaIntro.tsx`
- **Acceso:** con sesión (PrivateRoute) + pago de Ayurveda (Guardia global; `!ayurveda_suscrito` → `/metodo/ayurveda`).
- **Qué hace:** Presentación del doṣha (hero «Bienvenido», textos de `doshaIntro`), una lista «¿Te reconoces?» para marcar (no se guarda) y una pregunta final de texto con botón Guardar.
- **Datos:** `GET /user/me`; `GET /metodo-ayurveda/:userId` (prerrellena); `PATCH /metodo-ayurveda/:userId` con el blob entero y `data.doshaIntro[dosha].cambio`.
- **Desbloqueo:** no exige nada para entrar. Para avanzar hace falta `doshaIntro[dosha].cambio` con texto (guardar vacío no desbloquea). Es el gate 1 de `pasoAlcanzableAyurveda`.
- **Botones / a dónde lleva:** prev «← Energías» (guarda antes) → `/metodo/ayurveda/tarjetas`; next «Descúbrete →» (deshabilitado sin guardar; si se pulsa sin guardar baja hasta la pregunta) abre el cómic del doṣha (`ComicPasoModal`, `ayurveda-<dosha>`) y su continuar → `/metodo/ayurveda/dosha/<dosha>/comenzar`.
- **Condiciones y casos raros:** `:dosha` acepta `vata`, `pitta`, `kapha`; otro valor → `/metodo/ayurveda/tarjetas` (replace). Si no hay contenido para el doṣha, página de cortesía con solo «← Energías». `pageLabel` "1/7" aunque el submapa tiene 8 pasos.
- **Tests:** pendiente

---

## `/metodo/ayurveda/dosha/:dosha/comenzar` — Descúbrete (Paso 2 del submapa)
- **Componente:** `MetodoAyurvedaDoshaDescubre` en `frontend/src/app/metodo/MetodoAyurvedaDoshaDescubre.tsx`
- **Acceso:** con sesión (PrivateRoute) + pago de Ayurveda (Guardia global; `!ayurveda_suscrito` → `/metodo/ayurveda`).
- **Qué hace:** Secciones de lectura: mente, dones, desafíos, «¿Te reconoces?» (checklist local, no se guarda), «Recuerda» y una reflexión de texto con Guardar.
- **Datos:** `GET /user/me`; `GET /metodo-ayurveda/:userId`; `PATCH /metodo-ayurveda/:userId` con `data.doshaDescubre[dosha].reflexion`.
- **Desbloqueo:** la página no comprueba el paso anterior al entrar (solo el Índice lo limita). Avanzar exige reflexión guardada con texto.
- **Botones / a dónde lleva:** prev «← Naturaleza» (guarda) → `/metodo/ayurveda/dosha/<dosha>`; next «Cuerpo →» → `/metodo/ayurveda/dosha/<dosha>/cuerpo` (deshabilitado sin guardar; si no, baja hasta la reflexión).
- **Condiciones y casos raros:** `:dosha` inválido → `/metodo/ayurveda/tarjetas`. Editar el texto vuelve a bloquear hasta guardar. Sin contenido → página de cortesía. `pageLabel` "2/7".
- **Tests:** pendiente

---

## `/metodo/ayurveda/dosha/:dosha/cuerpo` — Tu cuerpo (Paso 3 del submapa)
- **Componente:** `MetodoAyurvedaDoshaCuerpo` en `frontend/src/app/metodo/MetodoAyurvedaDoshaCuerpo.tsx`
- **Acceso:** con sesión (PrivateRoute) + pago de Ayurveda (Guardia global; `!ayurveda_suscrito` → `/metodo/ayurveda`).
- **Qué hace:** Secciones sobre el cuerpo del doṣha, checklist «¿Te reconoces?» (local), «Recuerda» y reflexión de texto con Guardar.
- **Datos:** `GET /user/me`; `GET /metodo-ayurveda/:userId`; `PATCH /metodo-ayurveda/:userId` con `data.doshaCuerpo[dosha].reflexion`.
- **Desbloqueo:** sin gate de entrada en la página. Avanzar exige reflexión guardada con texto.
- **Botones / a dónde lleva:** prev «← Descúbrete» (guarda) → `/comenzar`; next «Equilibrio →» → `/metodo/ayurveda/dosha/<dosha>/desequilibrio`.
- **Condiciones y casos raros:** `:dosha` inválido → `/metodo/ayurveda/tarjetas`. `pageLabel` "3/7".
- **Tests:** pendiente

---

## `/metodo/ayurveda/dosha/:dosha/desequilibrio` — Equilibrio / desequilibrio (Paso 4 del submapa)
- **Componente:** `MetodoAyurvedaDoshaDesequilibrio` en `frontend/src/app/metodo/MetodoAyurvedaDoshaDesequilibrio.tsx`
- **Acceso:** con sesión (PrivateRoute) + pago de Ayurveda (Guardia global; `!ayurveda_suscrito` → `/metodo/ayurveda`).
- **Qué hace:** «Qué lo aumenta» (checklist local), bloque «marcado», señales de desequilibrio, cómo volver al equilibrio y reflexión con Guardar.
- **Datos:** `GET /user/me`; `GET /metodo-ayurveda/:userId`; `PATCH /metodo-ayurveda/:userId` con `data.doshaDesequilibrio[dosha].reflexion`.
- **Desbloqueo:** sin gate de entrada. Avanzar exige reflexión guardada con texto.
- **Botones / a dónde lleva:** prev «← Cuerpo» (guarda) → `/cuerpo`; next «Alimentación →» → `/metodo/ayurveda/dosha/<dosha>/cuidarte`.
- **Condiciones y casos raros:** `:dosha` inválido → `/metodo/ayurveda/tarjetas`. `pageLabel` "4/7".
- **Tests:** pendiente

---

## `/metodo/ayurveda/dosha/:dosha/cuidarte` — Alimentación (Paso 5 del submapa)
- **Componente:** `MetodoAyurvedaDoshaCuidarte` en `frontend/src/app/metodo/MetodoAyurvedaDoshaCuidarte.tsx`
- **Acceso:** con sesión (PrivateRoute) + pago de Ayurveda (Guardia global; `!ayurveda_suscrito` → `/metodo/ayurveda`).
- **Qué hace:** Lectura sobre sabores, alimentos que aumentan, cómo comer, alimentos buenos y un día de ejemplo. Dos cajas interactivas («te desequilibran» / «te equilibran») donde se marcan opciones.
- **Datos:** `GET /user/me`; `GET /metodo-ayurveda/:userId`; `PATCH /metodo-ayurveda/:userId` al marcar (autoguardado) con `data.doshaCuidarte[dosha].desequilibranSel` y `.equilibranSel` (arrays; conserva reflexion/compromiso de Estilo).
- **Desbloqueo:** no pide nada para avanzar (paso 5 sin requisito en `puedeAvanzarAyurveda`).
- **Botones / a dónde lleva:** prev «← Equilibrio» → `/desequilibrio`; next «Estilo de vida →» → `/metodo/ayurveda/dosha/<dosha>/estilo`.
- **Condiciones y casos raros:** `:dosha` inválido → `/metodo/ayurveda/tarjetas`. Lee las listas con `Array.isArray` (datos antiguos no revientan). `pageLabel` "5/7".
- **Tests:** pendiente

---

## `/metodo/ayurveda/dosha/:dosha/estilo` — Estilo de vida (Paso 6 del submapa)
- **Componente:** `MetodoAyurvedaDoshaEstilo` en `frontend/src/app/metodo/MetodoAyurvedaDoshaEstilo.tsx`
- **Acceso:** con sesión (PrivateRoute) + pago de Ayurveda (Guardia global; `!ayurveda_suscrito` → `/metodo/ayurveda`).
- **Qué hace:** Secciones de hábitos, abhyanga y «Recuerda». Al final, una reflexión de texto y un compromiso a elegir de una lista (uno solo, se puede desmarcar), con Guardar.
- **Datos:** `GET /user/me`; `GET /metodo-ayurveda/:userId`; `PATCH /metodo-ayurveda/:userId` con `data.doshaCuidarte[dosha].reflexion` y `.compromiso` (sí: se guarda bajo `doshaCuidarte`, no `doshaEstilo`).
- **Desbloqueo:** sin gate de entrada. Avanzar exige reflexión o compromiso guardados.
- **Botones / a dónde lleva:** prev «← Alimentación» (guarda) → `/cuidarte`; next «Tu día →» → `/metodo/ayurveda/dosha/<dosha>/dia`.
- **Condiciones y casos raros:** `:dosha` inválido → `/metodo/ayurveda/tarjetas`. Al cargar, el desbloqueo usa `prevCom.length > 0` sin `trim` (inofensivo). `pageLabel` "6/7".
- **Tests:** pendiente

---

## `/metodo/ayurveda/dosha/:dosha/dia` — Tu día (Paso 7 del submapa)
- **Componente:** `MetodoAyurvedaDoshaDia` en `frontend/src/app/metodo/MetodoAyurvedaDoshaDia.tsx`
- **Acceso:** con sesión (PrivateRoute) + pago de Ayurveda (Guardia global; `!ayurveda_suscrito` → `/metodo/ayurveda`).
- **Qué hace:** Se construye un día ideal con bloques (hora + actividad; si es comida, se eligen alimentos con chips). Añadir/editar en un modal, borrar, ver un día de ejemplo y guardar. Botón PDF del día.
- **Datos:** `GET /user/me`; `GET /metodo-ayurveda/:userId`; `PATCH /metodo-ayurveda/:userId` con `data.doshaDia[dosha].bloques` (`{id, hora, actividad, comida, alimentos[]}`). PDF con `generateDiaPdf` en el navegador.
- **Desbloqueo:** sin gate de entrada. Avanzar exige `bloques` guardados y no vacíos.
- **Botones / a dónde lleva:** prev «← Estilo de Vida» → `/estilo`; next «Tu mapa →» → `/metodo/ayurveda/dosha/<dosha>/recorrido` (deshabilitado sin guardar; tooltip «Guarda tu día para continuar.»).
- **Condiciones y casos raros:** `:dosha` inválido → `/metodo/ayurveda/tarjetas`. Bloques antiguos sin `alimentos` se normalizan a `[]`. Cualquier cambio vuelve a bloquear hasta guardar. El prev no guarda antes de salir. No lleva `pageLabel`.
- **Tests:** pendiente

---

## `/metodo/ayurveda/dosha/:dosha/recorrido` — Tu mapa (Paso 8 del submapa)
- **Componente:** `MetodoAyurvedaDoshaRecorrido` en `frontend/src/app/metodo/MetodoAyurvedaDoshaRecorrido.tsx`
- **Acceso:** con sesión (PrivateRoute) + pago de Ayurveda (Guardia global; `!ayurveda_suscrito` → `/metodo/ayurveda`).
- **Qué hace:** Despedida del submapa: un box con título, intro y botón para descargar el PDF del recorrido del doṣha. Debajo, `PedirOpinion` (reseña).
- **Datos:** `GET /user/me`; `GET /metodo-ayurveda/:userId`. Lee `doshaIntro.cambio`, `doshaDescubre/Cuerpo/Desequilibrio.reflexion`, `doshaCuidarte.reflexion/compromiso`, `doshaDia.bloques`. PDF con `generateRecorridoPdf` (respuestas, compromiso, día, lo que desequilibra, señales…). No guarda nada.
- **Desbloqueo:** sin gate de entrada en la página (el Índice solo llega si todos los pasos anteriores cumplen). Es el último paso del submapa.
- **Botones / a dónde lleva:** prev «← Tu día» → `/dia`; next «Doṣhas →» → `/metodo/ayurveda/tarjetas`; botón PDF; reseña → `/opiniones?volver=…`.
- **Condiciones y casos raros:** `:dosha` inválido → `/metodo/ayurveda/tarjetas`. Bloques del día filtrados y ordenados por hora; `alimentos` blindado con `Array.isArray`. Respuestas vacías no entran en el PDF.
- **Tests:** pendiente

---

## `/metodo/ayurveda/dosha/:dosha/pranayama` — Prāṇāyāma (Paso 5 del Mapa)
- **Componente:** `MetodoAyurvedaDoshaPranayama` en `frontend/src/app/metodo/MetodoAyurvedaDoshaPranayama.tsx`
- **Acceso:** con sesión (PrivateRoute) + pago de Ayurveda (Guardia global; `!ayurveda_suscrito` → `/metodo/ayurveda`).
- **Qué hace:** Al entrar sale siempre un cómic de teoría (`IntroComicModal`, `ayurveda-pranayama`). La página muestra los tres doṣhas con botones para cambiar. Por cada uno: qué vas a hacer, un guía de respiración animado (`GuiaRespiracion`), precaución y preguntas con caja de texto. Botón Guardar.
- **Datos:** `GET /user/me`; `GET /metodo-ayurveda/:userId`; `PATCH /metodo-ayurveda/:userId` con `data.doshaPranayama[dosha] = {respuestas[], compromiso, practicado}`. Se guarda al pulsar Guardar, al terminar la práctica (`practicado: true`, automático), al cambiar de doṣha y al pulsar prev/next.
- **Desbloqueo:** no pide nada para avanzar. En el Índice, pasos 5-7 del Mapa bloqueados si no hay doṣha (ni en URL ni guardada).
- **Botones / a dónde lleva:** prev «← Doṣhas» → `/metodo/ayurveda/tarjetas`; next «Los chakras →» → `/metodo/ayurveda/dosha/<sel>/chakras`. Cambiar doṣha → `navigate(.../<k>/pranayama, replace)`.
- **Condiciones y casos raros:** `:dosha` inválido NO redirige: arranca en `vata`. Datos antiguos (`reflexion` en string) se convierten a `respuestas[0]` (`leerSlice`). `compromiso` ya no se pinta pero se conserva. No lleva `pageLabel`.
- **Tests:** pendiente

---

## `/metodo/ayurveda/dosha/:dosha/chakras` — Los chakras (Paso 6 del Mapa)
- **Componente:** `MetodoAyurvedaChakras` en `frontend/src/app/metodo/MetodoAyurvedaChakras.tsx`
- **Acceso:** con sesión (PrivateRoute) + pago de Ayurveda (Guardia global; `!ayurveda_suscrito` → `/metodo/ayurveda`).
- **Qué hace:** Al entrar sale siempre un cómic de introducción (`ayurveda-chakras`). Luego un mapa de 7 cajas (corona arriba, 6 en filas de dos). Pulsar una caja abre su cómic a pantalla completa (`ChakraComicModal`); al terminarlo, la caja queda con marca de leído. Texto cambia cuando están todos leídos.
- **Datos:** `GET /user/me`; `GET /metodo-ayurveda/:userId`; `PATCH /metodo-ayurveda/:userId` al terminar cada cómic, añadiendo la key del chakra a una lista en el blob (`CHAKRAS_LEIDOS_KEY` de `hardCoded/metodo/chakrasProgreso.ts`). Precarga las 7 fotos antes de mostrar.
- **Desbloqueo:** no pide nada; leer los chakras no bloquea el siguiente paso.
- **Botones / a dónde lleva:** prev «← Prāṇāyāma» → `/pranayama`; next «Cursos →» → `/metodo/ayurveda/dosha/<dosha>/cursos`.
- **Condiciones y casos raros:** no depende del doṣha; `:dosha` pasa por `doshaDeUrl` (valor por defecto con dosha inválido, sin verificar cuál). Lista de leídos blindada (solo strings). Si falla el PATCH no se reintenta hasta leer otro. Sin `pageLabel`.
- **Tests:** pendiente

---

## `/metodo/ayurveda/dosha/:dosha/cursos` — Cursos de Ayurveda (Paso 7 del Mapa)
- **Componente:** `MetodoAyurvedaDoshaCursos` en `frontend/src/app/metodo/MetodoAyurvedaDoshaCursos.tsx`
- **Acceso:** con sesión (PrivateRoute) + pago de Ayurveda (Guardia global; `!ayurveda_suscrito` → `/metodo/ayurveda`).
- **Qué hace:** Lista los cursos de Ayurveda del catálogo, del más nuevo al más antiguo: una tarjeta grande si hay uno, rejilla si hay varios, o aviso de «pronto» si no hay. Espera a precargar las portadas.
- **Datos:** `GET /user/me` (`ayurveda_suscrito`, `tcm_suscrito`); `GET /cursos` vía `useCursosData` (filtra `ayurvedaNomLink`). No guarda nada.
- **Desbloqueo:** no pide nada. Es el final de Ayurveda.
- **Botones / a dónde lleva:** prev «← Los chakras» → `/chakras`; next «Med. China →»: si consta que TCM no está pagada (con candado) abre `PagoTcmModal` (→ `irAPagoDisciplina("tcm")`); si está pagada o no se sabe → `/metodo/tcm`.
- **Condiciones y casos raros:** `:dosha` inválido → `/metodo/ayurveda/tarjetas`. Si `/user/me` falla, `tcmSuscrito` queda `null` y se navega a TCM sin pago.
- **Tests:** pendiente

---

## `/ayurveda/miEspacio` — Mi espacio de Ayurveda (fuera del recorrido)
- **Componente:** `AyurvedaMiEspacio` en `frontend/src/app/web/AyurvedaMiEspacio.tsx`
- **Acceso:** pública en el router (sin PrivateRoute ni pago), pero los endpoints piden JWT (`JwtAuthGuard` + `OwnerGuard`).
- **Qué hace:** Si hay resultado guardado, muestra un panel con tu doṣha, descripción y cuatro consejos, botón para descargar PDF y botón para borrar el resultado. Si no hay resultado, muestra el test de 28 preguntas (`AyurvedaTestPage` sin recorrido) y, al terminar, recarga y muestra el panel.
- **Datos:** `GET /ayurveda/:userId`; `GET /ayurveda/respuestas/:userId`; `DELETE /ayurveda/:userId`; `POST /ayurveda/resultado` (desde el test). PDF con `generateAyurvedaPdf`. Lee `userId` de localStorage.
- **Desbloqueo:** ninguno.
- **Botones / a dónde lleva:** Descargar PDF; Borrar resultado (vuelve al test). En el test, prev por defecto → `/aprendizaje/cursos/ayurveda`.
- **Condiciones y casos raros:** nadie enlaza a esta ruta en el frontend (solo está en App.tsx). Sin sesión: se ve el test, pero al terminar no se guarda nada (no hay `userId`) y `onComplete` sale sin hacer nada: la persona se queda en el test sin resultado (bug). Borrar no pide confirmación.
- **Tests:** pendiente

---

## `/metodo/tcm` — Medicina China: bienvenida (Paso 1)
- **Componente:** `MetodoTcm` en `frontend/src/app/metodo/MetodoTcm.tsx`
- **Acceso:** con sesión (PrivateRoute). Pago de TCM: GuardiaPagoRecorrido global (`/home?entrar=tcm`) y la página abre `PagoTcmModal` si no `tcm_suscrito`.
- **Qué hace:** Bienvenida con dos párrafos en un box. Al entrar sale siempre el cómic del Origen según el taoísmo (`tcm-origen`). Botón «Aviso importante» con modal. Botón Ilustraciones, BotonCompania e Índice.
- **Datos:** `GET /user/me`; `GET /ayurveda/:userId` (solo para que «← Ayurveda» lleve a los cursos de tu doṣha). Pago: `irAPagoDisciplina("tcm")`. No guarda nada.
- **Desbloqueo:** solo el pago.
- **Botones / a dónde lleva:** prev «← Ayurveda» → `/metodo/ayurveda/dosha/<dosha>/cursos` (o `/metodo/ayurveda` sin doṣha); next «Los 5 elementos →» abre el cómic intercalado de los Cinco Elementos (`ComicPasoModal`, `tcm-elementos`) y su continuar → `/metodo/tcm/elementos`.
- **Condiciones y casos raros:** sin sesión → `/welcome`; error en `/user/me` → `/home`. Cerrar el pago aquí NO manda a `/home` (a diferencia de Ayurveda). `pageLabel` "1/12".
- **Tests:** pendiente

---

## `/metodo/tcm/elementos` — Los Cinco Elementos (Paso 2)
- **Componente:** `MetodoTcmElementos` en `frontend/src/app/metodo/MetodoTcmElementos.tsx` (+ `ElementoComicModal` en `frontend/src/components/metodo/ElementoComicModal.tsx`)
- **Acceso:** con sesión (PrivateRoute) + pago de TCM (Guardia global; `!tcm_suscrito` → `/metodo/tcm`).
- **Qué hace:** Estrella interactiva con los 5 elementos. Pulsar uno abre su cómic a pantalla completa, con los 3 cuestionarios de escala 0-4 dentro (carga, rasgos, recursos). Una página de test no deja pasar hasta estar completa. Al terminar el cómic, el elemento queda como leído. Botón «¿Qué son los Cinco Elementos?» abre un cómic de intro opcional.
- **Datos:** `GET /user/me`; `GET /metodo-tcm/:userId`; `PATCH /metodo-tcm/:userId` en cada respuesta (autoguardado) con `data.elementos[el].miniTest = {respuestas, puntos}` y, al acabar el cómic, `leido: true`.
- **Desbloqueo:** desbloqueo secuencial Madera→Fuego→Tierra→Metal→Agua (el siguiente se abre cuando el anterior está `leido`). Next exige los tests de los 5 elementos completos (`elementosTestsCompletos`). En el Índice, sin esto solo se llega al paso 2.
- **Botones / a dónde lleva:** prev «← Medicina China» → `/metodo/tcm`; next «Tu Constitución →» → `/metodo/tcm/constitucion` (deshabilitado con tooltip de tests pendientes).
- **Condiciones y casos raros:** elementos sin contenido no se pueden pulsar. El next NO exige que los 5 estén `leido`: con los tests de Agua hechos y el cómic cerrado con la X antes del final, se pasa, pero Diagnóstico luego rebota aquí. Loader hasta precargar fondo e iconos. `pageLabel` "2/12".
- **Tests:** pendiente

---

## `/metodo/tcm/constitucion` — Tu Constitución (Paso 3)
- **Componente:** `MetodoTcmConstitucion` en `frontend/src/app/metodo/MetodoTcmConstitucion.tsx` (+ `TestConstitucion` en `frontend/src/components/metodo/TestConstitucion.tsx`, datos en `components/metodo/tcmConstitucion.ts`)
- **Acceso:** con sesión (PrivateRoute) + pago de TCM (Guardia global; `!tcm_suscrito` → `/metodo/tcm`).
- **Qué hace:** Test de 50 frases Sí/No en la propia página, en dos bloques (psicológico y fisiológico), con barra de progreso. Al completarlo sube arriba y muestra un pentágono con tus cinco porcentajes, tu elemento de fondo, su arquetipo y el segundo. Debajo, las cinco tarjetas de constitución (la tuya destacada). Con el test hecho se pliega y se puede «Repetir» (reabre sin borrar).
- **Datos:** `GET /user/me`; `GET /metodo-tcm/:userId`; `PATCH /metodo-tcm/:userId` en cada respuesta con `data.constitucion.respuestas` (`"1"`/`"0"`). El resultado no se guarda: se calcula al vuelo.
- **Desbloqueo:** la página no comprueba el paso 2 al entrar (solo el Índice). Es la puerta obligatoria antes de Los ciclos: next y BotonPaso deshabilitados hasta las 50 frases; Ciclos y Diagnóstico redirigen aquí si falta (4 sitios: esta página, Ciclos, Diagnóstico e `IndiceTcm`).
- **Botones / a dónde lleva:** prev «← Los Cinco Elementos» → `/metodo/tcm/elementos`; next «Los ciclos →» y BotonPaso abajo → `flushSaves()` y después `/metodo/tcm/ciclos`.
- **Condiciones y casos raros:** respuestas guardadas con forma rara (no objeto) se tratan como vacías. `pageLabel` "3/12".
- **Tests:** pendiente

---

## `/metodo/tcm/ciclos` — Los ciclos (Paso 4)
- **Componente:** `MetodoTcmCiclos` en `frontend/src/app/metodo/MetodoTcmCiclos.tsx`
- **Acceso:** con sesión (PrivateRoute) + pago de TCM (Guardia global; `!tcm_suscrito` → `/metodo/tcm`).
- **Qué hace:** Dos estrellas: Sheng (generación) y Ke (control). Cada flechita abre un popup-cómic con la relación (`RelacionModal`). Al final, el test del «par de control» (`TestParKe`): seis frases 0-4 sobre el par Ke que proponen tus cuestionarios.
- **Datos:** `GET /user/me`; `GET /metodo-tcm/:userId`; `PATCH /metodo-tcm/:userId` con `data.ciclosLeidos = true` (al ver las 10 relaciones) y `data.parKe.respuestas` (en cada respuesta).
- **Desbloqueo:** entrar exige `constitucionHecha` (si no → `/metodo/tcm/constitucion`). No comprueba los tests de elementos. Para avanzar: haber visto las 10 relaciones (o `ciclosLeidos` ya guardado) y el test del par hecho (`testParHecho`, da true si no hay par candidato).
- **Botones / a dónde lleva:** prev «← Tu Constitución» → `/constitucion`; next «Diagnóstico final →» abre el cómic intercalado «Las enfermedades» (`tcm-enfermedades`); su continuar → `/metodo/tcm/diagnostico`.
- **Condiciones y casos raros:** con `ciclosLeidos` todas las flechas se dan por vistas. Una relación cuenta como vista al pulsarla o al pasar por ella dentro del cómic. Los PATCH no se esperan antes de navegar (no hay `flushSaves`), aunque Diagnóstico no depende de estos flags. `pageLabel` "4/12".
- **Tests:** pendiente

---

## `/metodo/tcm/perfil` — Redirección antigua («Tu equilibrio»)
- **Componente:** ninguno: `<Navigate to="/metodo/tcm/diagnostico" replace />` en `frontend/src/App.tsx`
- **Acceso:** pública en el router (la redirección se hace sin PrivateRoute); el destino sí exige sesión y pago.
- **Qué hace:** Redirige a `/metodo/tcm/diagnostico`. «Tu equilibrio» se fusionó en el Diagnóstico.
- **Datos:** Ninguno.
- **Desbloqueo:** los del Diagnóstico.
- **Botones / a dónde lleva:** ninguno.
- **Condiciones y casos raros:** usa `replace`: no queda en el historial.
- **Tests:** pendiente

---

## `/metodo/tcm/diagnostico` — Diagnóstico final (Paso 5)
- **Componente:** `MetodoTcmDiagnostico` en `frontend/src/app/metodo/MetodoTcmDiagnostico.tsx`
- **Acceso:** con sesión (PrivateRoute) + pago de TCM (Guardia global; `!tcm_suscrito` → `/metodo/tcm`).
- **Qué hace:** Estrella-perfil con los 5 elementos iluminados según su estado (pulsar uno abre su cómic y deja cambiar respuestas). Métricas de balance por elemento (CARGA − RECURSOS, umbral 15 %: equilibrio / en carga / te sostiene) y Tipos de Adaptación primario y secundario. Resultado del par de control, tu constitución cruzada con lo de hoy, la estrella detallada con tu mensaje, y las dos estrellas Sheng/Ke para repasar relaciones.
- **Datos:** `GET /user/me`; `GET /metodo-tcm/:userId`. Si se abre un cómic de elemento: `PATCH /metodo-tcm/:userId` (`elementos[el].miniTest`).
- **Desbloqueo:** exige los 5 elementos `leido` Y sus tests completos (si no → `/metodo/tcm/elementos`), y `constitucionHecha` (si no → `/metodo/tcm/constitucion`). No comprueba `ciclosLeidos` ni `parKe`.
- **Botones / a dónde lleva:** prev «← Los ciclos» → `/ciclos`; next «Tu lengua →» y BotonPaso abajo → `/metodo/tcm/lengua`.
- **Condiciones y casos raros:** usuarios con tests antiguos (leídos pero sin respuestas que puntúen) rebotan a la estrella. Loader hasta precargar iconos y fotos. `pageLabel` "5/12".
- **Tests:** pendiente

---

## `/metodo/tcm/lengua` — Tu lengua (Paso 6)
- **Componente:** `MetodoTcmLengua` en `frontend/src/app/metodo/MetodoTcmLengua.tsx`
- **Acceso:** con sesión (PrivateRoute) + pago de TCM (Guardia global; `!tcm_suscrito` → `/metodo/tcm`).
- **Qué hace:** Página de lectura: cómo mirarse la lengua, el mapa de zonas (foto ampliable a pantalla completa) y unas 30 cajitas con fotos agrupadas por color, forma, movimiento, superficie… Las cajitas aparecen una a una al hacer scroll.
- **Datos:** `GET /user/me`. No guarda nada. Precarga el mapa y las fotos.
- **Desbloqueo:** la página no tiene gate (solo el Índice, que exige tests de elementos y constitución).
- **Botones / a dónde lleva:** prev «← Diagnóstico final» → `/diagnostico`; next «Lee tu lengua →» y botón abajo a la derecha → `/metodo/tcm/lengua/leer`.
- **Condiciones y casos raros:** error en `/user/me` → `/metodo/tcm`. `pageLabel` "6/12".
- **Tests:** pendiente

---

## `/metodo/tcm/lengua/leer` — Lee tu lengua (Paso 7)
- **Componente:** `MetodoTcmLenguaLeer` en `frontend/src/app/metodo/MetodoTcmLenguaLeer.tsx`
- **Acceso:** con sesión (PrivateRoute) + pago de TCM (Guardia global; `!tcm_suscrito` → `/metodo/tcm`).
- **Qué hace:** Herramienta con un apartado por capa de la lengua; en cada uno se elige la foto que más se parece a la tuya. Cuando todas las capas tienen elección, aparece «Tu lengua hoy» con la lectura y los patrones.
- **Datos:** `GET /user/me`; `GET /metodo-tcm/:userId` (prerrellena); `PATCH /metodo-tcm/:userId` en cada elección con `data.observarte[<clave de la capa>]`.
- **Desbloqueo:** sin gate de entrada ni de salida. La lectura solo sale con todas las capas elegidas (`lenguaCompleta`). Su dato lo usa Apuntes.
- **Botones / a dónde lleva:** prev «← Tu lengua» → `/metodo/tcm/lengua`; next «Taoísmo →» → `/metodo/tcm/taoismo`.
- **Condiciones y casos raros:** cada PATCH se construye sobre el `data` del render actual (clics muy seguidos podrían pisarse, sin verificar). `pageLabel` "7/12".
- **Tests:** pendiente

---

## `/metodo/tcm/taoismo` — Taoísmo (Paso 8)
- **Componente:** `MetodoTcmTaoismo` en `frontend/src/app/metodo/MetodoTcmTaoismo.tsx`
- **Acceso:** con sesión (PrivateRoute) + pago de TCM (Guardia global; `!tcm_suscrito` → `/metodo/tcm`).
- **Qué hace:** Cita de apertura, las leyes del Tao en tarjetas de dos en dos (pulsar una abre su ilustración y explicación en `QigongComicModal`) y un cierre con cita.
- **Datos:** `GET /user/me`. No guarda nada. Precarga fondo y las 10 ilustraciones.
- **Desbloqueo:** ninguno en la página.
- **Botones / a dónde lleva:** prev «← Lee tu lengua» → `/metodo/tcm/lengua/leer`; next «Tu cocina →» y BotonPaso → `/metodo/tcm/recetas`.
- **Condiciones y casos raros:** error en `/user/me` → `/metodo/tcm`. `pageLabel` "8/12".
- **Tests:** pendiente

---

## `/metodo/tcm/recetas` — Tu cocina diaria (Paso 9)
- **Componente:** `MetodoTcmRecetas` en `frontend/src/app/metodo/MetodoTcmRecetas.tsx`
- **Acceso:** con sesión (PrivateRoute) + pago de TCM (Guardia global; `!tcm_suscrito` → `/metodo/tcm`).
- **Qué hace:** Selector de los 5 elementos (abre por el más cargado). «Un gesto para hoy»: un gesto del elemento, con «dame otro» y un tick de hecho que se apaga solo al día siguiente. Una frase de principio y tarjetas de formas de cocinar; cada una abre un cómic con el cómo y el porqué.
- **Datos:** `GET /user/me`; `GET /metodo-tcm/:userId`; `PATCH /metodo-tcm/:userId` con `data.cocinaGesto[el] = {i, hecho: "aaaa-mm-dd"}` (autoguardado). Usa `elementoMasCargado(data)`.
- **Desbloqueo:** ninguno en la página.
- **Botones / a dónde lleva:** prev «← Taoísmo» → `/taoismo`; next «Qigong →» abre dos cómics seguidos: historia del Qigong → los cinco animales; el continuar del segundo → `/metodo/tcm/qigong`. La X de cualquiera cierra y deja la página.
- **Condiciones y casos raros:** «hoy» se calcula con la hora local, no UTC. `pageLabel` "9/12".
- **Tests:** pendiente

---

## `/metodo/tcm/qigong` — Qigong (Paso 10)
- **Componente:** `MetodoTcmQigong` en `frontend/src/app/metodo/MetodoTcmQigong.tsx`
- **Acceso:** con sesión (PrivateRoute) + pago de TCM (Guardia global; `!tcm_suscrito` → `/metodo/tcm`).
- **Qué hace:** Intro, una franja «Dao Yin» que abre su cómic, y las posturas (brocados) con foto y nombre; cada una abre su cómic con la explicación. Nota final.
- **Datos:** `GET /user/me`. No guarda nada.
- **Desbloqueo:** ninguno.
- **Botones / a dónde lleva:** prev «← Tu cocina» → `/metodo/tcm/recetas`; next «Cursos →» → `/metodo/tcm/cursos`.
- **Condiciones y casos raros:** los cómics de historia y animales ya no están aquí (se ven al salir de Recetas); entrar directo por URL o Índice se los salta. `pageLabel` "10/12".
- **Tests:** pendiente

---

## `/metodo/tcm/cursos` — Cursos de Medicina China (Paso 11)
- **Componente:** `MetodoTcmCursos` en `frontend/src/app/metodo/MetodoTcmCursos.tsx`
- **Acceso:** con sesión (PrivateRoute) + pago de TCM (Guardia global; `!tcm_suscrito` → `/metodo/tcm`).
- **Qué hace:** Cursos de Medicina China del catálogo, del más nuevo al más antiguo: una tarjeta grande, rejilla, o aviso de «pronto» si no hay.
- **Datos:** `GET /user/me`; `GET /cursos` vía `useCursosData` (filtra `tcmNomLink`). No guarda nada.
- **Desbloqueo:** ninguno.
- **Botones / a dónde lleva:** prev «← Qigong» → `/metodo/tcm/qigong`; next «Apuntes →» → `/metodo/tcm/apuntes`.
- **Condiciones y casos raros:** error en `/user/me` → `/metodo/tcm`. `pageLabel` "11/12".
- **Tests:** pendiente

---

## `/metodo/tcm/apuntes` — Crea tus propios apuntes (Paso 12)
- **Componente:** `MetodoTcmApuntes` en `frontend/src/app/metodo/MetodoTcmApuntes.tsx` (+ `CreaTusApuntes`, libro en `components/metodo/apuntes/tcmApuntes.ts`)
- **Acceso:** con sesión (PrivateRoute) + pago de TCM (Guardia global; `!tcm_suscrito` → `/metodo/tcm`).
- **Qué hace:** Se eligen los capítulos de todo lo recorrido y se descarga un PDF de apuntes con tu nombre en la portada. Los capítulos personales (diagnóstico y lectura de lengua) salen con candado si faltan esos datos. Debajo, `PedirOpinion`.
- **Datos:** `GET /user/me` (`name`, `fisiologia_suscrito`); `GET /metodo-tcm/:userId` (todo el blob, blindado si no es objeto). PDF en el navegador desde `CreaTusApuntes`. No guarda nada.
- **Desbloqueo:** ninguno para entrar. Último paso de TCM.
- **Botones / a dónde lleva:** prev «← Cursos» → `/metodo/tcm/cursos`; next «Fisiología →» (con candado si no está pagada) y BotonPaso → `/metodo/fisiologia` siempre (allí se ve el pago); reseña → `/opiniones?volver=…`.
- **Condiciones y casos raros:** sin datos guardados la página funciona igual, con los capítulos personales bloqueados. `pageLabel` "12/12".
- **Tests:** pendiente

---

## `/tcm/test/1` — Test de constitución clásico (fuera del recorrido)
- **Componente:** `TCMTest1` en `frontend/src/components/espacio/components/TCMTest1.tsx` (usa `TCMTestPage` en `frontend/src/components/espacio/components/TCMTestPage.tsx`)
- **Acceso:** pública (sin PrivateRoute ni pago). Con `?guest=true` funciona como invitado (así lo enlaza `/aprendizaje/cursos/medicinachina`).
- **Qué hace:** 7 constituciones clásicas (Equilibrado, Deficiencia de Qi/Yang/Yin, Flema-Humedad, Calor-Humedad, Estancamiento de Qi), 34 frases con escala de 3 niveles (0-2). Al pedir resultados: barras por sección, recomendaciones y dos PDF (respuestas y consejos). Botón Ilustraciones en el header.
- **Datos:** si hay `userId`: `POST /tcm/constitucion` `{userId, constitucion}` y `POST /tcm/respuestas` `{userId, testNum: 1, respuestas[]}`. Sin guest: `localStorage.tcm_test1_result`. PDF con `generateTcmPdf` / `generateTcmConsejosPdf`.
- **Desbloqueo:** ninguno.
- **Botones / a dónde lleva:** prev «← Volver» → `/aprendizaje/cursos/medicinachina`; «Volver a mi espacio» (no en guest) → `/espacio/questions/medicinachina`.
- **Condiciones y casos raros:** no prerrellena lo guardado (no hace GET de `/tcm/respuestas/:userId/1`). Con `guest=true` pero con sesión iniciada, sí manda los POST (solo se salta localStorage). Sin sesión los POST no salen. Empate: gana la primera sección con el máximo. No confundir con el test de Tu Constitución del recorrido (`metodo_tcm`).
- **Tests:** pendiente

---

## `/tcm/test/2` — Test del elemento (fuera del recorrido)
- **Componente:** `TCMTest2` en `frontend/src/components/espacio/components/TCMTest2.tsx` (usa `TCMTestPage`)
- **Acceso:** pública; `?guest=true` como invitado.
- **Qué hace:** 5 elementos (Madera…Agua) con frases de rasgos y escala de 4 niveles (0-3). Resultados con barras, nota de «perfil mixto» si los dos primeros se separan menos de 3 puntos, interpretaciones, recomendaciones y PDF.
- **Datos:** con `userId`: `POST /tcm/elemento` `{userId, elemento}` y `POST /tcm/respuestas` (`testNum: 2`). Sin guest: `localStorage.tcm_test2_result`.
- **Desbloqueo:** ninguno.
- **Botones / a dónde lleva:** igual que el test 1 (← `/aprendizaje/cursos/medicinachina`; «Volver a mi espacio» → `/espacio/questions/medicinachina`).
- **Condiciones y casos raros:** mismas que el test 1 (sin prerrelleno; guest con sesión sí guarda en BD).
- **Tests:** pendiente

---

## `/tcm/test/3` — Test del desequilibrio (fuera del recorrido)
- **Componente:** `TCMTest3` en `frontend/src/components/espacio/components/TCMTest3.tsx` (usa `TCMTestPage`)
- **Acceso:** pública; `?guest=true` como invitado.
- **Qué hace:** 5 elementos con frases de síntomas de desequilibrio (p. ej. Madera: ira, tensión, migrañas) y escala de 4 niveles (0-3). Resultados con barras, nota, interpretaciones, recomendaciones y PDF.
- **Datos:** con `userId`: `POST /tcm/desequilibrio` `{userId, desequilibrio}` y `POST /tcm/respuestas` (`testNum: 3`). Sin guest: `localStorage.tcm_test3_result`.
- **Desbloqueo:** ninguno.
- **Botones / a dónde lleva:** igual que el test 1.
- **Condiciones y casos raros:** mismas que el test 1.
- **Tests:** pendiente


# 4. Fisiología y Nutrición

## `/metodo/fisiologia` — Fisiología: introducción (antes del Paso 1)
- **Componente:** `MetodoFisiologia` en `frontend/src/app/metodo/MetodoFisiologia.tsx`
- **Acceso:** con sesión (PrivateRoute). Exige pago de Fisiología: `GuardiaPagoRecorrido` (global en App) manda a `/home?entrar=fisiologia` si `fisiologia_suscrito` no es true. Sin `userId`/`token` en localStorage → `/welcome`.
- **Qué hace:** Bienvenida con dos párrafos sobre la foto de la disciplina. Al entrar abre SIEMPRE el cómic del Origen «según la ciencia» (`IntroComicModal` con `ORIGEN_CIENCIA`), saltable con la X. Botón «Tus células» en el header (popup `TusCelulasModal`).
- **Datos:** `GET /user/me` (lee `fisiologia_suscrito`). El popup Tus células hace `GET /metodo-fisiologia/:userId` y lee `celulas_vistas`. Nada se guarda.
- **Desbloqueo:** solo el pago. No pide haber hecho otras disciplinas (orden aconsejado).
- **Botones / a dónde lleva:** prev «← Medicina China» → `/metodo/tcm/apuntes`; next «Comenzar →» → `/metodo/fisiologia/niveles` (si no ha pagado, abre `PagoFisiologiaModal` → `irAPagoDisciplina("fisiologia")`, Payment Link de Stripe).
- **Condiciones y casos raros:** si `/user/me` falla → `/home`. El modal de pago propio casi nunca llega a verse porque la guardia global redirige antes (solo si la guardia falla por red).
- **Tests:** pendiente

---

## `/metodo/fisiologia/niveles` — Niveles (hub del recorrido)
- **Componente:** `MetodoFisiologiaNiveles` en `frontend/src/app/metodo/MetodoFisiologiaNiveles.tsx`
- **Acceso:** con sesión (PrivateRoute) + pago de Fisiología (GuardiaPagoRecorrido; además la página comprueba `fisiologia_suscrito` y si no → `/metodo/fisiologia`).
- **Qué hace:** Tres tarjetas en fila: Nivel 1 «La materia», Nivel 2 «La vida» y «Profundiza» (avanzado). Las bloqueadas salen con candado y apagadas; las superadas llevan `MarcaLeido`. Pulsar una abierta lleva a su primera página.
- **Datos:** `GET /user/me`; `GET /metodo-fisiologia/:userId` → lee `estructuras_hecho` y `organismo_hecho`. No guarda.
- **Desbloqueo:** Materia siempre abierta (→ `/metodo/fisiologia/particulas`, superada con `estructuras_hecho`). Vida exige `estructuras_hecho` (→ `/metodo/fisiologia/celula`, superada con `organismo_hecho`). Profundiza exige `estructuras_hecho` + `organismo_hecho` (→ `/metodo/fisiologia/profundiza`).
- **Botones / a dónde lleva:** prev «← Introducción» → `/metodo/fisiologia`; next «La sonrisa interior →» abre el cómic intercalado «La meditación y el cerebro» (`ComicPasoModal`, `MEDITACION_CEREBRO`) y al continuar → `/metodo/fisiologia/sonrisa`. Botón Tus células.
- **Condiciones y casos raros:** el next a La sonrisa NO está bloqueado: se puede ir sin hacer ningún nivel. Sin fila en BD → todo bloqueado salvo Nivel 1. No pinta el botón flotante Índice.
- **Tests:** pendiente

---

## `/metodo/fisiologia/particulas` — Partículas (Paso 1)
- **Componente:** `MetodoFisiologiaParticulas` en `frontend/src/app/metodo/MetodoFisiologiaParticulas.tsx`
- **Acceso:** con sesión (PrivateRoute) + pago de Fisiología (guardia global + comprobación propia → `/metodo/fisiologia`).
- **Qué hace:** Juego de arrastrar: 2 quarks up, 1 down y 3 gluones al núcleo para montar un protón (posiciones fijas en triángulo). Al completarlo sale el resultado con foto del protón por dentro. Header «1/5».
- **Datos:** `GET /user/me`; `GET /metodo-fisiologia/:userId`; al completar `PATCH /metodo-fisiologia/:userId` con el blob entero + `particulas_hecho: true`.
- **Desbloqueo:** entrada libre (primer paso). Al terminar pone `particulas_hecho`, que abre el Paso 2.
- **Botones / a dónde lleva:** prev «← Niveles» → `/metodo/fisiologia/niveles`; next «Átomos →» → `/metodo/fisiologia/atomos`, deshabilitado hasta completar (tooltip). Índice flotante (`IndiceFisiologia`), Tus células.
- **Condiciones y casos raros:** si ya estaba `particulas_hecho`, entra con el protón montado. No espera a que termine el PATCH antes de dejar navegar.
- **Tests:** pendiente

---

## `/metodo/fisiologia/atomos` — Átomos (Paso 2)
- **Componente:** `MetodoFisiologiaAtomos` en `frontend/src/app/metodo/MetodoFisiologiaAtomos.tsx`
- **Acceso:** con sesión (PrivateRoute) + pago de Fisiología (guardia global + propia).
- **Qué hace:** Se montan dos átomos seguidos, hidrógeno y luego helio, arrastrando protones, neutrones y electrones a núcleo y órbita. Header «2/5».
- **Datos:** `GET /user/me`; `GET /metodo-fisiologia/:userId`; al completar el último átomo `PATCH /metodo-fisiologia/:userId` con `atomos_hecho: true`.
- **Desbloqueo:** la página no comprueba `particulas_hecho` (solo lo hace el Índice). Al terminar abre el Paso 3 (`atomos_hecho`).
- **Botones / a dónde lleva:** prev «← Partículas» → `/metodo/fisiologia/particulas`; next «Moléculas →» (deshabilitado hasta el último átomo) abre el cómic «Cómo una estrella forma los átomos» (`ComicEstrellaModal`); al continuar → `/metodo/fisiologia/moleculas`, la X cierra y te quedas aquí.
- **Condiciones y casos raros:** con `atomos_hecho` ya guardado entra completa. Por URL directa se entra aunque no se haya hecho el Paso 1. El comentario de `fisiologiaRecorrido.ts` habla de «los tres montados», pero son dos.
- **Tests:** pendiente

---

## `/metodo/fisiologia/moleculas` — Moléculas (Paso 3)
- **Componente:** `MetodoFisiologiaMoleculas` en `frontend/src/app/metodo/MetodoFisiologiaMoleculas.tsx`
- **Acceso:** con sesión (PrivateRoute) + pago de Fisiología.
- **Qué hace:** Se forman en orden tres moléculas (agua, CO₂, O₂) arrastrando átomos a la zona de enlace. Cada una tiene su celebración y botón «Ahora, el…». Al final sale un resumen con «Volver a hacer». Header «3/5».
- **Datos:** `GET /user/me`; `GET /metodo-fisiologia/:userId`; al terminar la última `PATCH /metodo-fisiologia/:userId` con `moleculas_hecho: true`.
- **Desbloqueo:** la página no comprueba `atomos_hecho`. Al terminar pone `moleculas_hecho` (abre el Paso 4).
- **Botones / a dónde lleva:** prev «← Átomos» → `/metodo/fisiologia/atomos`; next «Macromoléculas →» → `/metodo/fisiologia/macromoleculas`, deshabilitado hasta `terminado`.
- **Condiciones y casos raros:** «Empezar de cero» vuelve a bloquear el next en esa visita, aunque el flag siga guardado en BD.
- **Tests:** pendiente

---

## `/metodo/fisiologia/macromoleculas` — Macromoléculas (Paso 4)
- **Componente:** `MetodoFisiologiaMacromoleculas` en `frontend/src/app/metodo/MetodoFisiologiaMacromoleculas.tsx`
- **Acceso:** con sesión (PrivateRoute) + pago de Fisiología.
- **Qué hace:** Menú de 4 cajas (proteína, ADN, lípido, carbohidrato). Cada una se forma uniendo sus monómeros, en cualquier orden. Tras formar una, «Siguiente» salta a la primera que falte o vuelve al menú. Header «4/5».
- **Datos:** `GET /user/me`; `GET /metodo-fisiologia/:userId` → lee `macromoleculas_hechas` (filtra ids válidos). `PATCH` tras cada una con `macromoleculas_hechas: [...]` y `macromoleculas_hecho` (true si están las 4).
- **Desbloqueo:** no comprueba `moleculas_hecho`. Con las 4 pone `macromoleculas_hecho` (abre el Paso 5).
- **Botones / a dónde lleva:** prev «← Moléculas» → `/metodo/fisiologia/moleculas`; next «Estructuras →» → `/metodo/fisiologia/estructuras`, deshabilitado si hay menos de 4 formadas.
- **Condiciones y casos raros:** el progreso parcial se retoma. Espera a precargar todas las fotos antes de mostrarse.
- **Tests:** pendiente

---

## `/metodo/fisiologia/estructuras` — Estructuras celulares (Paso 5)
- **Componente:** `MetodoFisiologiaEstructuras` en `frontend/src/app/metodo/MetodoFisiologiaEstructuras.tsx`
- **Acceso:** con sesión (PrivateRoute) + pago de Fisiología.
- **Qué hace:** Igual que macromoléculas pero con 4 estructuras (núcleo, membrana, mitocondria, ribosoma), que se construyen con macromoléculas como ingredientes. Header «5/5».
- **Datos:** `GET /user/me`; `GET /metodo-fisiologia/:userId` → `estructuras_hechas`. `PATCH` tras cada una con `estructuras_hechas` y `estructuras_hecho` (true si están las 4).
- **Desbloqueo:** no comprueba el paso anterior. `estructuras_hecho` abre el Paso 6, el Nivel 2 «Vida» en Niveles y la mitad del requisito de Profundiza.
- **Botones / a dónde lleva:** prev «← Macromoléculas»; next «Crear la célula» (deshabilitado hasta las 4) abre el cómic `ComicCelulaModal`; al continuar → `/metodo/fisiologia/celula`.
- **Condiciones y casos raros:** ids guardados que ya no existen se descartan al cargar.
- **Tests:** pendiente

---

## `/metodo/fisiologia/celula` — La célula (Paso 6)
- **Componente:** `MetodoFisiologiaCelula` en `frontend/src/app/metodo/MetodoFisiologiaCelula.tsx` (monta `ConstruirFisio` de `frontend/src/components/metodo/ConstruirFisio.tsx`)
- **Acceso:** con sesión (PrivateRoute) + pago de Fisiología (ConstruirFisio comprueba `fisiologia_suscrito` → `/metodo/fisiologia`).
- **Qué hace:** Se arrastran núcleo, ADN, membrana, 2 mitocondrias y 3 ribosomas a la zona hasta montar una célula entera. Al completarla salen la foto y el texto del resultado, y «Volver a hacer». Header «1/4» (nivel Vida).
- **Datos:** `GET /user/me`; `GET /metodo-fisiologia/:userId`; al completar `PATCH /metodo-fisiologia/:userId` con `celula_hecho: true`.
- **Desbloqueo:** la página no comprueba `estructuras_hecho` (sí lo hacen la tarjeta de Niveles y el Índice). `celula_hecho` abre el Paso 7.
- **Botones / a dónde lleva:** prev «← Estructuras» → `/metodo/fisiologia/estructuras`; next «Órganos →» (bloqueado hasta completar) abre el cómic «De una célula a un órgano» (`ComicPasoModal`, `CELULAS_ORGANOS`), que continúa a `/metodo/fisiologia/todas-tus-celulas`.
- **Condiciones y casos raros:** con `celula_hecho` ya guardado entra completa.
- **Tests:** pendiente

---

## `/metodo/fisiologia/todas-tus-celulas` — Todas tus células (Paso 7)
- **Componente:** `MetodoFisiologiaTodasCelulas` en `frontend/src/app/metodo/MetodoFisiologiaTodasCelulas.tsx`
- **Acceso:** con sesión (PrivateRoute) + pago de Fisiología.
- **Qué hace:** Galería de órganos en tarjetas (tipo Pokédex) con barra de progreso global de células descubiertas (x/total y %). Al pulsar un órgano se abre su ficha a pantalla completa, con sus células y sus curiosidades. Cada célula abre `CelulaModal` y cada curiosidad `ConsejoModal`; lo abierto queda marcado. Header «2/4».
- **Datos:** `GET /user/me`; `GET /metodo-fisiologia/:userId` → `celulas_vistas` y `curiosidades_leidas`. Al abrir una célula o curiosidad nueva, `PATCH /metodo-fisiologia/:userId` con la lista actualizada (las curiosidades se guardan por su titular en español).
- **Desbloqueo:** sin requisito para pasar (se puede seguir con células sin abrir).
- **Botones / a dónde lleva:** prev «← La célula» → `/metodo/fisiologia/celula`; next «Sistemas →» → `/metodo/fisiologia/sistemas` (sin bloqueo). Dentro de la ficha, volver a la galería.
- **Condiciones y casos raros:** al abrir un órgano sale el loader hasta tener todas sus fotos. Algunas fotos de órganos siguen pendientes (comentario en el código).
- **Tests:** pendiente

---

## `/metodo/fisiologia/sistemas` — Los sistemas (Paso 8)
- **Componente:** `MetodoFisiologiaSistemas` en `frontend/src/app/metodo/MetodoFisiologiaSistemas.tsx`
- **Acceso:** con sesión (PrivateRoute) + pago de Fisiología.
- **Qué hace:** Rejilla de 12 sistemas (FotoBox). Cada uno abre `SistemaModal` (imagen + descripción, con flechas entre sistemas) y queda marcado como visto. Header «3/4».
- **Datos:** `GET /user/me`; `GET /metodo-fisiologia/:userId` → `sistemas_vistos`. `PATCH /metodo-fisiologia/:userId` cada vez que se ve uno nuevo.
- **Desbloqueo:** para pasar hay que haber abierto los 12 sistemas.
- **Botones / a dónde lleva:** prev «← Todas tus células»; next «Organismo →» → `/metodo/fisiologia/organismo`, deshabilitado mientras `vistos.size < SISTEMAS.length`.
- **Condiciones y casos raros:** la página cuenta `size` (una key vieja o desconocida en `sistemas_vistos` cuenta), mientras que el Índice exige `every` sobre las keys reales. Pueden no coincidir.
- **Tests:** pendiente

---

## `/metodo/fisiologia/organismo` — El organismo (Paso 9, cierre del nivel Vida)
- **Componente:** `MetodoFisiologiaOrganismo` en `frontend/src/app/metodo/MetodoFisiologiaOrganismo.tsx`
- **Acceso:** con sesión (PrivateRoute) + pago de Fisiología.
- **Qué hace:** Se arrastran las fotos circulares de los sistemas al círculo del cuerpo. Con cada uno aparece una frase. Con todos colocados, el organismo queda completo y sale «Volver a hacer». Al pie, invitación a dejar reseña (`PedirOpinion`). Header «4/4».
- **Datos:** `GET /user/me`; `GET /metodo-fisiologia/:userId`; al completar `PATCH /metodo-fisiologia/:userId` con `organismo_hecho: true`.
- **Desbloqueo:** la página no comprueba `sistemas_vistos`. `organismo_hecho` marca el Nivel 2 como superado y, junto a `estructuras_hecho`, abre Profundiza.
- **Botones / a dónde lleva:** prev «← Sistemas»; next «Niveles →» (bloqueado hasta completar) abre el cómic «Te reconstruyes cada día» (`ComicPasoModal`, `RECONSTRUCCION`), que lleva a `/metodo/fisiologia/niveles`. `PedirOpinion` → `/opiniones?volver=…`.
- **Condiciones y casos raros:** con `organismo_hecho` ya guardado entra con todo colocado.
- **Tests:** pendiente

---

## `/metodo/fisiologia/sonrisa` — La sonrisa interior (práctica, fuera del índice)
- **Componente:** `MetodoFisiologiaSonrisa` en `frontend/src/app/metodo/MetodoFisiologiaSonrisa.tsx`
- **Acceso:** con sesión (PrivateRoute) + pago de Fisiología.
- **Qué hace:** Un espejo con el cuerpo y puntos pulsables por órgano, más chips con los nombres. Los tres pasos de la práctica: mira, respira, agradece. Cada órgano abre `FichaFisioModal` con lo que está haciendo por ti y un botón «Gracias», que lo marca y pasa al siguiente pendiente. Con todos agradecidos sale el cierre.
- **Datos:** `GET /user/me`; `useLeidos("metodo-fisiologia")`: `GET` + `PATCH /metodo-fisiologia/:userId` con la lista `sonrisa_agradecidos` (fusiona con el blob actual).
- **Desbloqueo:** ninguno. No bloquea el paso a Cursos.
- **Botones / a dónde lleva:** prev «← Niveles» → `/metodo/fisiologia/niveles`; next «Cursos →» → `/metodo/fisiologia/cursos`.
- **Condiciones y casos raros:** se puede dejar a medias y retomar. La página espera a precargar el espejo y las fotos de los órganos.
- **Tests:** pendiente

---

## `/metodo/fisiologia/cursos` — Cursos para profundizar (Fisiología)
- **Componente:** `MetodoFisiologiaCursos` en `frontend/src/app/metodo/MetodoFisiologiaCursos.tsx`
- **Acceso:** con sesión (PrivateRoute) + pago de Fisiología.
- **Qué hace:** Lista los cursos de Fisiología del catálogo, ordenados por `createdAt`. Si hay uno, sale una tarjeta centrada; si hay varios, `CursosGrid`; si no hay ninguno, un estado vacío.
- **Datos:** `GET /user/me` (lee `fisiologia_suscrito` y `nutricion_suscrito`); `GET /cursos` (vía `useCursosData`, tabla `curso`).
- **Desbloqueo:** ninguno.
- **Botones / a dónde lleva:** prev «← La sonrisa interior» → `/metodo/fisiologia/sonrisa`; next «Nutrición →» → `/metodo/nutricion` (con candado si no ha pagado Nutrición, y entonces la guardia lo manda al pago en /home).
- **Condiciones y casos raros:** espera a precargar las portadas.
- **Tests:** pendiente

---

## `/metodo/fisiologia/profundiza` — Profundiza (nivel avanzado)
- **Componente:** `MetodoFisiologiaProfundiza` en `frontend/src/app/metodo/MetodoFisiologiaProfundiza.tsx`
- **Acceso:** con sesión (PrivateRoute) + pago de Fisiología.
- **Qué hace:** Rejilla de 18 temas (cerebro, neurotransmisores, hormonas, menstruación, metabolismo, cetosis, músculo, epigenética, detoxificación, estrés oxidativo, inmunitario, envejecimiento, apoptosis, regeneración, homeostasis, nervio vago, sistema entérico, cáncer). Un tema lleva tick cuando se han leído todas sus fichas. Botón «Volver arriba» al final.
- **Datos:** `GET /user/me`; `GET /metodo-fisiologia/:userId` → lee `profundiza_leidas` (mapa tema → keys leídas). No guarda.
- **Desbloqueo:** en Niveles la tarjeta exige `estructuras_hecho` + `organismo_hecho`, pero la página no lo comprueba: por URL directa se entra sin haberlos hecho.
- **Botones / a dónde lleva:** prev «← Niveles» → `/metodo/fisiologia/niveles`; cada tarjeta → `/metodo/fisiologia/profundiza/:temaKey`. Sin next ni Índice.
- **Condiciones y casos raros:** un tema sin fichas nunca sale completo.
- **Tests:** pendiente

---

## `/metodo/fisiologia/profundiza/:temaKey` — Tema de Profundiza
- **Componente:** `MetodoFisiologiaTema` en `frontend/src/app/metodo/MetodoFisiologiaTema.tsx`
- **Acceso:** con sesión (PrivateRoute) + pago de Fisiología.
- **Qué hace:** Rejilla de fichas del tema (p. ej. dopamina, serotonina…). En el cerebro van agrupadas por zonas. Cada ficha abre `FichaExploraModal` con flechas y queda leída. Si el tema tiene cómic de intro, hay un botón que abre `ComicTemaModal`. En los temas con `comicEnRejilla` (cáncer), las viñetas son las propias cajas. Cuando todo está leído aparece la frase de cierre.
- **Datos:** `GET /user/me`; `GET /metodo-fisiologia/:userId` → `profundiza_leidas[temaKey]` y `profundiza_comics_leidos`. `PATCH /metodo-fisiologia/:userId` al leer una ficha o viñeta nueva, o al abrir el cómic por primera vez.
- **Desbloqueo:** ninguno.
- **Botones / a dónde lleva:** prev «← Volver» → `/metodo/fisiologia/profundiza`.
- **Condiciones y casos raros:** `:temaKey` acepta las keys de `TEMAS_PROFUNDIZA` (`cerebro`, `neurotransmisores`, `hormonas`, `menstruacion`, `metabolismo`, `cetosis`, `musculo`, `epigenetica`, `detoxificacion`, `estres-oxidativo`, `inmunitario`, `envejecimiento`, `apoptosis`, `regeneracion`, `homeostasis`, `nervio-vago`, `sistema-enterico`, `cancer`). Una key que no existe → `replace` a `/metodo/fisiologia/profundiza`.
- **Tests:** pendiente

---

## `/metodo/fisiologia/cerebro` — Redirección (antiguo paso «El cerebro»)
- **Componente:** ninguno: `<Navigate to="/metodo/fisiologia/profundiza/cerebro" replace />` en `frontend/src/App.tsx`
- **Acceso:** sin PrivateRoute propio. El destino sí lo exige, y la guardia de pago también actúa.
- **Qué hace:** Mantiene vivos los enlaces viejos: el cerebro dejó de ser un paso y ahora es un tema de Profundiza.
- **Datos:** Ninguno.
- **Desbloqueo:** el del destino.
- **Botones / a dónde lleva:** redirige a `/metodo/fisiologia/profundiza/cerebro`.
- **Condiciones y casos raros:** `replace`, no queda en el historial.
- **Tests:** pendiente

---

## `/metodo/nutricion` — Nutrición: introducción (Paso 1)
- **Componente:** `MetodoNutricion` en `frontend/src/app/metodo/MetodoNutricion.tsx`
- **Acceso:** con sesión (PrivateRoute) + pago de Nutrición (GuardiaPagoRecorrido → `/home?entrar=nutricion`). Sin sesión → `/welcome`.
- **Qué hace:** Bienvenida con dos párrafos sobre la foto de la disciplina y un botón discreto de «Aviso importante» (popup). Al entrar abre siempre el cómic de intro (`NUTRICION_INTRO`, con loader `AppleLoader`).
- **Datos:** `GET /user/me` (lee `nutricion_suscrito`). Nada se guarda.
- **Desbloqueo:** solo el pago.
- **Botones / a dónde lleva:** prev «← Fisiología» → `/metodo/fisiologia/cursos`; extra «Biblioteca» → `/metodo/nutricion/alimentos`; next «Comenzar →» abre el cómic «Las calorías no existen» (`ComicCaloriasModal`) y al continuar → `/metodo/nutricion/macronutrientes`. Sin pago: `PagoNutricionModal` → `irAPagoDisciplina("nutricion")`. Índice flotante (`IndiceNutricion`).
- **Condiciones y casos raros:** si `/user/me` falla → `/home`.
- **Tests:** pendiente

---

## `/metodo/nutricion/macronutrientes` — Macronutrientes (Paso 2)
- **Componente:** `MetodoNutricionMacronutrientes` en `frontend/src/app/metodo/MetodoNutricionMacronutrientes.tsx`
- **Acceso:** con sesión (PrivateRoute) + pago de Nutrición (guardia + propia → `/metodo/nutricion`).
- **Qué hace:** Senda serpenteante (`SendaNutrientes`) con 7 grupos: carbohidratos, fibra, grasas, colesterol, proteínas, agua y etanol. Solo se abre el siguiente cuando el anterior está revisado. Cada nodo va a su página de detalle.
- **Datos:** `GET /user/me`; `GET /metodo-nutricion/:userId` → `nutrientes_explorados`. Aquí no guarda (el tick lo pone el detalle).
- **Desbloqueo:** entrada libre. Para pasar hay que tener los 7 macro en `nutrientes_explorados`.
- **Botones / a dónde lleva:** prev «← Nutrición» → `/metodo/nutricion`; extra Biblioteca; next «Micronutrientes →» → `/metodo/nutricion/micronutrientes`, deshabilitado si falta algún macro; cada nodo → `/metodo/nutricion/nutrientes/:key`.
- **Condiciones y casos raros:** —
- **Tests:** pendiente

---

## `/metodo/nutricion/nutrientes/:key` — Detalle de un grupo de nutrientes (dentro de los Pasos 2–3)
- **Componente:** `MetodoNutricionNutriente` en `frontend/src/app/metodo/MetodoNutricionNutriente.tsx`
- **Acceso:** con sesión (PrivateRoute) + pago de Nutrición.
- **Qué hace:** Caja grande con la foto y la descripción del grupo, una caja de ilustración (cómic del grupo) y tarjetas de subtipos. Cada tarjeta abre `NutrienteFichaModal` con flechas. Con todas las fichas vistas, el grupo queda revisado.
- **Datos:** `GET /user/me`; `GET /metodo-nutricion/:userId`. `PATCH /metodo-nutricion/:userId` con `nutrientes_fichas[key]` (índices vistos), `nutrientes_explorados` (se añade la key) y `nutrientes_comics_leidos` (al abrir el cómic).
- **Desbloqueo:** `nutrienteAlcanzable`: si los grupos anteriores de su misma lista no están explorados → `replace` a su rejilla. Marca el grupo como explorado al ver todas las fichas, o nada más entrar si no tiene tarjetas.
- **Botones / a dónde lleva:** prev «← Volver» y botón `VolverNutri` al final → `rutaListaNutriente(key)` (macro o micro); extra Biblioteca.
- **Condiciones y casos raros:** `:key` acepta `carbohidratos`, `fibra`, `grasas`, `colesterol`, `proteinas`, `agua`, `etanol`, `vitaminas`, `minerales`, `fitoquimicos`, `edulcorantes` y `drogas`. Si no existe → `replace` a `/metodo/nutricion/macronutrientes`. Autorreparación: si tiene todas las fichas vistas pero el grupo no quedó marcado, lo marca al entrar. Cambios de fichas y del explorado van en el mismo PATCH.
- **Tests:** pendiente

---

## `/metodo/nutricion/nutrientes` — Redirección antigua
- **Componente:** ninguno: `<Navigate to="/metodo/nutricion/macronutrientes" replace />` en `frontend/src/App.tsx`
- **Acceso:** sin PrivateRoute propio (lo exige el destino). La guardia de pago actúa.
- **Qué hace:** Enlace viejo de «Los nutrientes», que se partió en dos páginas.
- **Datos:** Ninguno.
- **Desbloqueo:** el del destino.
- **Botones / a dónde lleva:** → `/metodo/nutricion/macronutrientes`.
- **Condiciones y casos raros:** `replace`.
- **Tests:** pendiente

---

## `/metodo/nutricion/nutrientes-secundarios` — Redirección antigua
- **Componente:** ninguno: `<Navigate to="/metodo/nutricion/micronutrientes" replace />` en `frontend/src/App.tsx`
- **Acceso:** sin PrivateRoute propio (lo exige el destino). La guardia de pago actúa.
- **Qué hace:** Enlace viejo de los nutrientes secundarios.
- **Datos:** Ninguno.
- **Desbloqueo:** el del destino, que rebota a macronutrientes si faltan macros.
- **Botones / a dónde lleva:** → `/metodo/nutricion/micronutrientes`.
- **Condiciones y casos raros:** `replace`.
- **Tests:** pendiente

---

## `/metodo/nutricion/micronutrientes` — Micronutrientes (Paso 3)
- **Componente:** `MetodoNutricionMicronutrientes` en `frontend/src/app/metodo/MetodoNutricionMicronutrientes.tsx`
- **Acceso:** con sesión (PrivateRoute) + pago de Nutrición.
- **Qué hace:** Senda con 5 grupos: vitaminas, minerales, fitoquímicos, edulcorantes y drogas. Cada nodo abre su detalle.
- **Datos:** `GET /user/me`; `GET /metodo-nutricion/:userId` → `nutrientes_explorados`.
- **Desbloqueo:** gate de entrada: si no están los 7 macro explorados → `replace` a `/metodo/nutricion/macronutrientes`. Para pasar hay que tener los 5 micro explorados.
- **Botones / a dónde lleva:** prev «← Macronutrientes»; extra Biblioteca; next «Microbiota →» (bloqueado hasta los 5) abre `ComicMicrobiotaModal`, que continúa a `/metodo/nutricion/microbiota`.
- **Condiciones y casos raros:** —
- **Tests:** pendiente

---

## `/metodo/nutricion/microbiota` — La microbiota (Paso 4)
- **Componente:** `MetodoNutricionMicrobiota` en `frontend/src/app/metodo/MetodoNutricionMicrobiota.tsx`
- **Acceso:** con sesión (PrivateRoute) + pago de Nutrición.
- **Qué hace:** Primero las bacterias más conocidas y, tras un separador con el mandala, las moléculas que fabrican. Cada tarjeta abre su ficha (`NutrienteFichaModal`) y queda marcada, también las que se pasan con las flechas.
- **Datos:** `GET /user/me`; `useLeidos("metodo-nutricion")` (`GET` + `PATCH /metodo-nutricion/:userId`) con `microbiota_bacterias_leidas` y `microbiota_moleculas_leidas`.
- **Desbloqueo:** la página no comprueba que los micronutrientes estén hechos (solo el Índice y el botón de la página anterior). Sin requisito para pasar.
- **Botones / a dónde lleva:** prev «← Micronutrientes»; extra Biblioteca; next «El hambre →» abre `ComicHambreModal`, que continúa a `/metodo/nutricion/hambre`.
- **Condiciones y casos raros:** por URL directa se entra aunque el Paso 3 esté sin hacer.
- **Tests:** pendiente

---

## `/metodo/nutricion/hambre` — El hambre (Paso 5)
- **Componente:** `MetodoNutricionHambre` en `frontend/src/app/metodo/MetodoNutricionHambre.tsx`
- **Acceso:** con sesión (PrivateRoute) + pago de Nutrición.
- **Qué hace:** Cuatro tarjetas con foto («El hambre, una mirada holística»). Cada una abre el visor inmersivo (`NutrienteIlustracionModal`) por esa lectura, con flechas a las otras. Al final, una frase sobre el turquesa.
- **Datos:** `GET /user/me`. No guarda nada.
- **Desbloqueo:** ninguno.
- **Botones / a dónde lleva:** prev «← Microbiota»; extra Biblioteca; next «Ultraprocesados →» → `/metodo/nutricion/ultraprocesados`.
- **Condiciones y casos raros:** un comentario del código dice que el cómic «Lo integral» se abre aquí, pero ya está en Ultraprocesados (comentario desfasado).
- **Tests:** pendiente

---

## `/metodo/nutricion/ultraprocesados` — Los ultraprocesados (Paso 6)
- **Componente:** `MetodoNutricionUltraprocesados` en `frontend/src/app/metodo/MetodoNutricionUltraprocesados.tsx`
- **Acceso:** con sesión (PrivateRoute) + pago de Nutrición.
- **Qué hace:** Primero el ensayo del NIH, luego cómo leer una etiqueta (señales), después fichas agrupadas por nivel de certeza del dato, y un cierre. Cada ficha abre `NutrienteFichaModal` (sin «Saltar») y queda marcada.
- **Datos:** `GET /user/me`; `useLeidos("metodo-nutricion")` con `ultraprocesados_leidos`.
- **Desbloqueo:** ninguno.
- **Botones / a dónde lleva:** prev «← El hambre»; extra Biblioteca; next «Crea tu plato →» abre `ComicIntegralModal` («Lo integral»), que continúa a `/metodo/nutricion/plato`.
- **Condiciones y casos raros:** las fotos que no existen no bloquean la carga (`onerror` resuelve).
- **Tests:** pendiente

---

## `/metodo/nutricion/plato` — Crea el plato de Harvard (Paso 7)
- **Componente:** `MetodoNutricionPlato` en `frontend/src/app/metodo/MetodoNutricionPlato.tsx`
- **Acceso:** con sesión (PrivateRoute) + pago de Nutrición.
- **Qué hace:** Plato circular dividido en sectores (uno por grupo). Al pulsar un sector salen sus alimentos a la derecha y se arrastran al plato, con ratón o dedo. Un alimento se puede recolocar o quitar sacándolo fuera.
- **Datos:** `GET /user/me`; `GET /metodo-nutricion/:userId` → `plato_alimentos` (`{id, foodKey, macroKey, xPct, yPct}`). `PATCH /metodo-nutricion/:userId` en cada cambio con `plato_alimentos` y `plato_hecho` (true si hay al menos un alimento en cada sector).
- **Desbloqueo:** ninguno para entrar. `plato_hecho` desbloquea Calorías.
- **Botones / a dónde lleva:** prev «← Ultraprocesados»; extra Biblioteca; next → `/metodo/nutricion/calorias`, deshabilitado hasta completar, y antes de navegar hace flush (espera el PATCH en curso y envía otro final).
- **Condiciones y casos raros:** datos antiguos: cada alimento guardado se recoloca en el sector que le toca hoy (`sectorDeAlimento`), y los que ya no están en el plato se descartan.
- **Tests:** pendiente

---

## `/metodo/nutricion/calorias` — Tus calorías y macros (Paso 8)
- **Componente:** `MetodoNutricionCalorias` en `frontend/src/app/metodo/MetodoNutricionCalorias.tsx`
- **Acceso:** con sesión (PrivateRoute) + pago de Nutrición.
- **Qué hace:** Formulario con sexo, edad, peso, altura, actividad base, ejercicio (intensidad, días y minutos) y objetivo (perder, mantener, ganar). El cálculo se hace en el navegador (Mifflin-St Jeor × factor de actividad × objetivo, con suelo mínimo de kcal) y muestra kcal y gramos de proteína, grasa e hidratos. Lleva una nota educativa.
- **Datos:** `GET /user/me`; `GET /metodo-nutricion/:userId` → prerrellena desde `calorias.entrada`. `PATCH /metodo-nutricion/:userId` con debounce de 700 ms y `calorias: {hecho: true, kcal, macros:{prot,carb,fat}, entrada:{…}}`.
- **Desbloqueo:** gate de entrada: sin `plato_hecho` → `replace` a `/metodo/nutricion/plato`. `calorias.hecho` desbloquea Prediabetes y la cifra que usa Diseña tu día.
- **Botones / a dónde lleva:** prev «← El plato»; extra Biblioteca; next «Test →» (deshabilitado sin resultado válido): guarda ya, sin debounce, y abre `ComicDiabetesModal`, que continúa a `/metodo/nutricion/prediabetes`.
- **Condiciones y casos raros:** el resultado es null si edad no está entre 10 y 100, peso entre 25 y 300 o altura entre 100 y 250. Valores guardados no válidos se ignoran al prerrellenar.
- **Tests:** pendiente

---

## `/metodo/nutricion/prediabetes` — ¿Cómo va tu azúcar? (Paso 9)
- **Componente:** `MetodoNutricionPrediabetes` en `frontend/src/app/metodo/MetodoNutricionPrediabetes.tsx`
- **Acceso:** con sesión (PrivateRoute) + pago de Nutrición.
- **Qué hace:** Test de riesgo FINDRISC. Los datos corporales vienen ya rellenos, se pide la cintura (o «no me la mido») y se responden las preguntas. Da una banda de resultado y señales de alerta. El IMC puntúa pero nunca se muestra.
- **Datos:** `GET /user/me`; `GET /metodo-nutricion/:userId` → `prediabetes` y `calorias.entrada`. `PATCH /metodo-nutricion/:userId` con debounce de 700 ms y `prediabetes: {cintura, sinCintura, respuestas, base, hecho, puntos}`.
- **Desbloqueo:** gate de entrada: sin `calorias.hecho` → `replace` a `/metodo/nutricion/calorias`. No bloquea el paso siguiente.
- **Botones / a dónde lleva:** prev «← Calorías»; extra Biblioteca; next «Diseña tu día →» → `/metodo/nutricion/dia`.
- **Condiciones y casos raros:** prerrelleno: primero lo guardado en el test y, si no, lo de Calorías. El sexo por defecto es «mujer» si no es «hombre».
- **Tests:** pendiente

---

## `/metodo/nutricion/dia` — Diseña tu día (Paso 10)
- **Componente:** `MetodoNutricionDia` en `frontend/src/app/metodo/MetodoNutricionDia.tsx`
- **Acceso:** con sesión (PrivateRoute) + pago de Nutrición.
- **Qué hace:** Primero un popup para elegir el número de comidas. Luego dos columnas: las comidas (zonas donde soltar) y los alimentos por grupo, que se arrastran, con raciones y «a ojo». Cada alimento tiene una ficha (ojo) con ración, kcal, macros y moléculas. Hay «Crea tu alimento» con un formulario propio. Va sumando kcal y macros frente a tu objetivo.
- **Datos:** `GET /user/me`; `GET /metodo-nutricion/:userId` → `calorias.kcal` y `dia` (`numComidas`, `comidas`, `customFoods`). `PATCH /metodo-nutricion/:userId` en cada cambio con `dia: {numComidas, comidas, customFoods}`.
- **Desbloqueo:** no redirige. Sin `calorias.hecho` + `kcal` numérico sale bloqueada, con un texto y un botón «Calcular» → `/metodo/nutricion/calorias`.
- **Botones / a dónde lleva:** prev «← Tu azúcar» → `/metodo/nutricion/prediabetes`; extra Biblioteca; next «Valores nutricionales →» → `/metodo/nutricion/macros` (sin bloqueo).
- **Condiciones y casos raros:** datos antiguos blindados: los alimentos creados sin key o nombre se descartan y un grupo desconocido pasa a «capricho». Un `numComidas` que no esté en `REPARTO_COMIDAS` se ignora. Las porciones ≤0 pasan a 1.
- **Tests:** pendiente

---

## `/metodo/nutricion/macros` — Valores nutricionales (Paso 11)
- **Componente:** `MetodoNutricionMacros` en `frontend/src/app/metodo/MetodoNutricionMacros.tsx`
- **Acceso:** con sesión (PrivateRoute) + pago de Nutrición.
- **Qué hace:** Juego de estimación. Sale un alimento con su ración y hay que adivinar con tres reguladores los gramos de proteína, hidratos y grasa. Al comprobar, cada macro dice si está clavado, cerca o lejos. Son `RONDAS` alimentos barajados, sin puntos: solo el marcador de ronda.
- **Datos:** `GET /user/me`. No guarda nada.
- **Desbloqueo:** ninguno.
- **Botones / a dónde lleva:** prev «← Diseña tu día»; extra Biblioteca; next «Mitos →» → `/metodo/nutricion/mitos` (también desde el final del juego). Un botón único hace «Comprobar» y luego «Siguiente alimento».
- **Condiciones y casos raros:** los textos «Ver el resultado» y «Siguiente alimento →» están escritos a mano en español (sin i18n).
- **Tests:** pendiente

---

## `/metodo/nutricion/mitos` — Preguntas y mitos (Paso 12)
- **Componente:** `MetodoNutricionMitos` en `frontend/src/app/metodo/MetodoNutricionMitos.tsx`
- **Acceso:** con sesión (PrivateRoute) + pago de Nutrición.
- **Qué hace:** Una tarjeta por pregunta o mito. Cada una abre la respuesta en `NutrienteFichaModal` (con flechas, sin «Saltar») y queda marcada como leída.
- **Datos:** `GET /user/me`; `useLeidos("metodo-nutricion")` con `mitos_leidos`.
- **Desbloqueo:** ninguno.
- **Botones / a dónde lleva:** prev «← Valores nutricionales» → `/metodo/nutricion/macros`; extra Biblioteca; next «Origen →» → `/metodo/nutricion/origen`.
- **Condiciones y casos raros:** un comentario dice que se llega desde el plato de Harvard (desfasado).
- **Tests:** pendiente

---

## `/metodo/nutricion/origen` — ¿De dónde vienen los nutrientes? (Paso 13)
- **Componente:** `MetodoNutricionOrigen` en `frontend/src/app/metodo/MetodoNutricionOrigen.tsx`
- **Acceso:** con sesión (PrivateRoute) + pago de Nutrición.
- **Qué hace:** Seis lecturas de zoom creciente: ciclos del planeta, suelo y raíz, planta, hoja, fruto, y la rama animal. Cada tarjeta abre su cómic en `ComicModal` y queda marcada.
- **Datos:** `GET /user/me`; `useLeidos("metodo-nutricion")` con `origen_leidos`.
- **Desbloqueo:** ninguno.
- **Botones / a dónde lleva:** prev «← Mitos»; extra Biblioteca; next «Cursos →» → `/metodo/nutricion/cursos`.
- **Condiciones y casos raros:** —
- **Tests:** pendiente

---

## `/metodo/nutricion/cursos` — Cursos para profundizar (Paso 14, último)
- **Componente:** `MetodoNutricionCursos` en `frontend/src/app/metodo/MetodoNutricionCursos.tsx`
- **Acceso:** con sesión (PrivateRoute) + pago de Nutrición.
- **Qué hace:** Lista los cursos de Nutrición del catálogo, con el mismo patrón que Fisiología (uno centrado, rejilla o estado vacío). Al pie, `PedirOpinion` para dejar reseña.
- **Datos:** `GET /user/me` (lee `nutricion_suscrito` y `cabala_suscrito`); `GET /cursos` (`useCursosData`).
- **Desbloqueo:** ninguno.
- **Botones / a dónde lleva:** prev «← Origen» → `/metodo/nutricion/origen`; extra Biblioteca; next «Cábala →» → `/metodo/cabala` (con candado si no ha pagado Cábala; entonces la guardia lo manda a `/home?entrar=cabala`). `PedirOpinion` → `/opiniones?volver=…`.
- **Condiciones y casos raros:** —
- **Tests:** pendiente

---

## `/metodo/nutricion/alimentos` — Biblioteca de Nutrición (fuera del índice)
- **Componente:** `MetodoNutricionAlimentos` en `frontend/src/app/metodo/MetodoNutricionAlimentos.tsx`
- **Acceso:** con sesión (PrivateRoute) + pago de Nutrición.
- **Qué hace:** Hub con título y tres cartas. «Alimentación molecular» abre `NutricionMaterialesModal` (rejilla de alimentos y su desglose molecular). «Ilustraciones» abre `NutricionIlustracionesModal` (todos los cómics). «Respuestas» abre los mitos en `NutrienteFichaModal` desde el primero.
- **Datos:** `GET /user/me`; `useLeidos("metodo-nutricion")`: marca `mitos_leidos` al leer respuestas.
- **Desbloqueo:** ninguno. Se abre desde el botón «Biblioteca» de cualquier página de Nutrición.
- **Botones / a dónde lleva:** prev «← Volver» → `navigate(-1)` (página anterior del historial).
- **Condiciones y casos raros:** si se entra por URL directa, `navigate(-1)` puede sacarte de la app (sin verificar).
- **Tests:** pendiente

---

## `/metodo/nutricion/alimentos/:key` — Ficha de un alimento (fuera del índice)
- **Componente:** `MetodoNutricionAlimento` en `frontend/src/app/metodo/MetodoNutricionAlimento.tsx`
- **Acceso:** con sesión (PrivateRoute) + pago de Nutrición.
- **Qué hace:** Ficha de un alimento con su barra de macros («de qué está hecho») y sus moléculas agrupadas por tipo, cada una con una píldora de función. Al tocar una molécula se abre `MoleculaModal` con su explicación.
- **Datos:** `GET /user/me`. No guarda nada.
- **Desbloqueo:** ninguno.
- **Botones / a dónde lleva:** botón `VolverNutri` → `/metodo/nutricion/alimentos`.
- **Condiciones y casos raros:** `:key` = key de un alimento de `AlimentosNutricion` (vía `useAlimento`). Si no existe → `replace` a `/metodo/nutricion/alimentos`. No encontré ningún enlace en el código que lleve a esta ruta: la biblioteca usa un modal (posible ruta huérfana, sin verificar).
- **Tests:** pendiente


# 5. Cábala, Cultura, Espacio y Aprendizaje

## `/metodo/cabala` — Intro de Cábala (Paso 1/39)
- **Componente:** `MetodoCabala` en `frontend/src/app/metodo/MetodoCabala.tsx`
- **Acceso:** con sesión (PrivateRoute + puerta de consentimiento de salud). Exige `cabala_suscrito`: GuardiaPagoRecorrido manda a `/home?entrar=cabala`; además la página abre `PagoCabalaModal` si no ha pagado.
- **Qué hace:** Caja de bienvenida con dos textos sobre el Árbol de la Vida. Al entrar abre siempre el cómic del Origen de Cábala (saltable, no persiste). Botón «Ilustraciones» abre la galería de Cábala. Lleva el botón Índice (IndiceCabala) y el botón de compañía.
- **Datos:** `GET /user/me` (lee `cabala_suscrito`). El Índice hace `GET /metodo-cabala/:userId` y apunta el avance del camino (`POST /recorrido-progreso/camino-cabala/avanzar`, sin verificar el método). Pago: `irAPagoDisciplina("cabala")` (Payment Link de Stripe).
- **Desbloqueo:** Solo el pago. Sin prerrequisitos de otras disciplinas (orden aconsejado).
- **Botones / a dónde lleva:** prev «← Nutrición» → `/metodo/nutricion/cursos`. next «El Árbol de la Vida →» abre primero el cómic intercalado de la historia de la Cábala (`ComicPasoModal`); su «continuar» lleva a `/metodo/cabala/arbol`. Sin pagar, next reabre el pago.
- **Condiciones y casos raros:** Sin userId/token → `/welcome`. Si `/user/me` falla → `/home`.
- **Tests:** pendiente

---

## `/metodo/cabala/arbol` — El Árbol de la Vida (Paso 2/39)
- **Componente:** `MetodoCabalaArbol` en `frontend/src/app/metodo/MetodoCabalaArbol.tsx`
- **Acceso:** con sesión (PrivateRoute). Exige pago de Cábala (GuardiaPagoRecorrido; y la página misma rebota a `/metodo/cabala` si no).
- **Qué hace:** Pinta el Árbol de la Vida animado (SVG) con las 11 sefirot incluida Daat. Al pulsar una sefirá se abre su ilustración (cómic); cada viñeta vista pone el sello de «leída» en el árbol. Desde el visor se puede pasar de una sefirá a otra con las flechas.
- **Datos:** `GET /user/me`; `GET /metodo-cabala/:userId` (lee `data.ilustracionesVistas`); `PATCH /metodo-cabala/:userId` con el blob entero y `ilustracionesVistas` ampliado en cada viñeta nueva.
- **Desbloqueo:** Entrar: solo pago (no hay otro gate). Al ver TODAS las ilustraciones (`CABALA_ILUSTRACIONES_KEYS`) se habilita «Keter →» y en el índice se abre la primera sefirá.
- **Botones / a dónde lleva:** prev → `/metodo/cabala`; «Ilustraciones» → galería; next «Keter →» → `/metodo/cabala/sefira/kether` (desactivado con tooltip hasta verlas todas).
- **Condiciones y casos raros:** Si no hay fila en metodo_cabala se sigue con vacío. `ilustracionesVistas` se blinda con Array.isArray. El PATCH no espera (sin flushSaves en el botón next; el interceptor global sí lo cuenta si alguien llama flushSaves).
- **Tests:** pendiente

---

## `/metodo/cabala/sefira/:key` — Una sefirá / dimensión (Pasos 3–13)
- **Componente:** `MetodoCabalaSefira` en `frontend/src/app/metodo/MetodoCabalaSefira.tsx`
- **Acceso:** con sesión (PrivateRoute). Exige pago de Cábala.
- **Qué hace:** Página de una de las 11 dimensiones (Keter…Malkhut, con Daat). Frase, carrusel de introducción (flechas, teclado, swipe) con la foto de la sefirá (abre su ilustración), nota (popup `CabalaNotaModal`), columnas Equilibrado/Desequilibrado, autoevaluación 1-10, «Escala de Equilibrio» (5 preguntas 1-10) y clave de desarrollo. Al pie, barras de progreso y qué falta por nombre.
- **Datos:** `GET /user/me`; `GET /metodo-cabala/:userId`; `PATCH /metodo-cabala/:userId` en cada respuesta. Campos del blob: `test[key]` (5 números), `autoeval[key]`, `sefirotVistas` (se añade la actual al entrar), `escalaTest: 10`.
- **Desbloqueo:** Entrar por URL: solo pago (la página NO comprueba las anteriores; el bloqueo secuencial solo lo aplica el Índice: ilustraciones del Árbol vistas + sefirot anteriores completas, o ya visitada). Para pasar a la siguiente hay que completar autoevaluación Y escala de esta (`SEFIROT_GATE = true`). En Malkuth, «Diagnóstico →» exige además todas las sefirot rellenas.
- **Botones / a dónde lleva:** prev → sefirá anterior (en Keter, → `/metodo/cabala/arbol`). next y botón del pie → siguiente sefirá o, en la última, `/metodo/cabala/diagnostico`. «Ilustraciones» → galería.
- **Condiciones y casos raros:** `:key` acepta `kether, chokmah, binah, daat, chesed, geburah, tipharet, netzach, hod, yesod, malkuth`; otra clave → `/metodo/cabala/arbol`. Datos antiguos: si el test estaba en escala 1-5 se reescala entero a 1-10 y se guarda al entrar. Si falla el guardado sale un aviso de error. El número de paso es `numero + 2`.
- **Tests:** pendiente

---

## `/metodo/cabala/diagnostico` — Diagnóstico / Mapa evolutivo (Paso 14/39)
- **Componente:** `MetodoCabalaDiagnostico` en `frontend/src/app/metodo/MetodoCabalaDiagnostico.tsx`
- **Acceso:** con sesión (PrivateRoute). Exige pago de Cábala.
- **Qué hace:** Calcula el nivel de cada sefirá (escala + autoevaluación) y su polaridad (déficit/equilibrio/exceso). Muestra el cuello de botella principal entre sefirot con narrativa y botones para repasar una y trabajar la otra, otras transiciones a observar, capacidades desarrolladas (nivel ≥7) y por fortalecer (≤4).
- **Datos:** `GET /user/me`; `GET /metodo-cabala/:userId` (lee `test`, `autoeval`, `escalaTest`); `PATCH` para poner `diagnosticoVisto: true` la primera vez.
- **Desbloqueo:** Gate: todas las sefirot con contenido (`sefirotContenidoCompleto`); si no → `/metodo/cabala/arbol`. Al visitarla marca `diagnosticoVisto`, que abre «Los Senderos» en el índice.
- **Botones / a dónde lleva:** prev «← Malkhut» → `/metodo/cabala/sefira/malkuth`; next → `/metodo/cabala/senderos`; botones «repasar/trabajar» → `/metodo/cabala/sefira/<key>`; «Ilustraciones».
- **Condiciones y casos raros:** Reescala tests 1-5 a 1-10 antes del gate. Ojo: el gate usa `sefiraEvaluable` = test O autoevaluación completos, más flojo que el botón de cada sefirá (que exige los dos).
- **Tests:** pendiente

---

## `/metodo/cabala/senderos` — Los 22 Senderos (Paso 15/39)
- **Componente:** `MetodoCabalaSenderos` en `frontend/src/app/metodo/MetodoCabalaSenderos.tsx`
- **Acceso:** con sesión (PrivateRoute). Exige pago de Cábala.
- **Qué hace:** Árbol en modo senderos: al pulsar un camino se abre su ilustración y queda marcado como visto. Botón «Comenzar por Aleph» que se activa al ver todas.
- **Datos:** `GET /user/me`; `GET /metodo-cabala/:userId` (lee `senderoIlustracionesVistas`); `PATCH` con el número del sendero añadido a `senderoIlustracionesVistas`.
- **Desbloqueo:** Entrar por URL: solo pago (no comprueba `diagnosticoVisto`; eso solo lo hace el Índice). Al ver las 22 ilustraciones se abre el primer sendero.
- **Botones / a dónde lleva:** prev → `/metodo/cabala/diagnostico`; next y botón central → `/metodo/cabala/sendero/11` (esperan flushSaves antes de navegar); «Ilustraciones».
- **Condiciones y casos raros:** Array blindado con Array.isArray y los números se pasan a Number.
- **Tests:** pendiente

---

## `/metodo/cabala/sendero/:num` — Un sendero (Pasos 16–37)
- **Componente:** `MetodoCabalaSendero` en `frontend/src/app/metodo/MetodoCabalaSendero.tsx`
- **Acceso:** con sesión (PrivateRoute). Exige pago de Cábala.
- **Qué hace:** Cabecera con la foto y la letra hebrea (la foto abre su ilustración), significado tradicional, traducción psicológica, pregunta de reflexión, qué une el sendero, test 1-5, interpretación según la suma, señales de práctica, «has cruzado este umbral cuando…» y frase de integración.
- **Datos:** `GET /user/me`; `GET /metodo-cabala/:userId` (lee `senderos[num]`); `PATCH` en cada respuesta con `senderos[num]` actualizado.
- **Desbloqueo:** Entrar por URL: solo pago (el Índice exige todas las ilustraciones de senderos vistas y los anteriores completos). Para pasar al siguiente hay que completar este test. En el último (Tav), «Diagnóstico →» exige los 22 completos.
- **Botones / a dónde lleva:** prev → sendero anterior (en el primero, `/metodo/cabala/senderos`); next y botón del pie → siguiente sendero o `/metodo/cabala/senderos/diagnostico`; todos esperan flushSaves. «Ilustraciones».
- **Condiciones y casos raros:** `:num` va de 11 a 32 (numeración cabalística; Aleph = 11). Otro valor → `/metodo/cabala/senderos`. Paso = 15 + orden.
- **Tests:** pendiente

---

## `/metodo/cabala/senderos/diagnostico` — Diagnóstico de los Senderos (Paso 38/39)
- **Componente:** `MetodoCabalaSenderosDiagnostico` en `frontend/src/app/metodo/MetodoCabalaSenderosDiagnostico.tsx`
- **Acceso:** con sesión (PrivateRoute). Exige pago de Cábala.
- **Qué hace:** Muestra los senderos prioritarios y la lista de los 22 con su interpretación según la puntuación.
- **Datos:** `GET /user/me`; `GET /metodo-cabala/:userId` (lee `senderos`). No guarda.
- **Desbloqueo:** Gate: los 22 tests completos (`senderosContenidoCompleto`); si no → `/metodo/cabala/senderos`. Abre el Diagnóstico final (que además pide las sefirot).
- **Botones / a dónde lleva:** prev → `/metodo/cabala/senderos`; next → `/metodo/cabala/final`; «Ilustraciones».
- **Condiciones y casos raros:** Acepta claves de `senderos` como string o número.
- **Tests:** pendiente

---

## `/metodo/cabala/final` — Diagnóstico final (Paso 39/39)
- **Componente:** `MetodoCabalaFinal` en `frontend/src/app/metodo/MetodoCabalaFinal.tsx`
- **Acceso:** con sesión (PrivateRoute). Exige pago de Cábala.
- **Qué hace:** Resumen de las 11 dimensiones (nivel y estado) y de los 22 senderos, con los prioritarios marcados. Botón para descargar el PDF del diagnóstico.
- **Datos:** `GET /user/me` (también el nombre para el PDF); `GET /metodo-cabala/:userId` (lee `test`, `autoeval`, `escalaTest`, `senderos`). No guarda. PDF generado en el navegador con `generarPdfCabala` (utils/generateCabalaPdf.ts): portada con cabala.webp y su Árbol dibujado.
- **Desbloqueo:** Gate: sefirot completas (si no → `/metodo/cabala/arbol`) y 22 senderos completos (si no → `/metodo/cabala/senderos`). Es el último paso del índice.
- **Botones / a dónde lleva:** prev → `/metodo/cabala/senderos/diagnostico`; next «Cursos →» → `/metodo/cabala/cursos`; «Descargar» → PDF; «Ilustraciones».
- **Condiciones y casos raros:** El paso «10 días» que iba detrás está aparcado (`/metodo/cabala/dias` comentada).
- **Tests:** pendiente

---

## `/metodo/cabala/cursos` — Cursos de Cábala (fuera del índice)
- **Componente:** `MetodoCabalaCursos` en `frontend/src/app/metodo/MetodoCabalaCursos.tsx`
- **Acceso:** con sesión (PrivateRoute). Exige pago de Cábala.
- **Qué hace:** Lista los cursos de Cábala del catálogo (una tarjeta grande si hay uno, rejilla si hay varios), ordenados por fecha de creación. Si no hay ninguno, caja «preparando cursos».
- **Datos:** `GET /user/me` (`cabala_suscrito`, `cultura_suscrito`); `GET /cursos` vía `useCursosData` (filtra por `cabalaNom`). Precarga las portadas.
- **Desbloqueo:** Solo pago; no exige haber terminado el recorrido.
- **Botones / a dónde lleva:** prev → `/metodo/cabala/final`; next «Cultura» → `/metodo/cultura` (con candado si no ha pagado Cultura, pero navega igual y allí sale el pago); «Ilustraciones»; tarjetas → curso.
- **Condiciones y casos raros:** No está en IndiceCabala (el índice acaba en Final).
- **Tests:** pendiente

---

## `/metodo/cultura` — Intro de Cultura
- **Componente:** `MetodoCultura` en `frontend/src/app/metodo/MetodoCultura.tsx`
- **Acceso:** con sesión (PrivateRoute). Exige `cultura_suscrito` (GuardiaPagoRecorrido → `/home?entrar=cultura`; la página abre `PagoCulturaModal`).
- **Qué hace:** Caja de introducción («último paso de El Mapa»). No tiene cómic de intro, ni Índice, ni número de paso: Cultura no tiene índice numerado; su avance se cuenta por Historias abiertas (6 piezas).
- **Datos:** `GET /user/me`. Pago con `irAPagoDisciplina("cultura")`.
- **Desbloqueo:** Solo pago.
- **Botones / a dónde lleva:** prev «← Cábala» → `/metodo/cabala/cursos`; next «Historias →» → `/metodo/cultura/historias` (sin pagar reabre el pago).
- **Condiciones y casos raros:** Cerrar el popup de pago lleva a `/home`. Si `/user/me` falla → `/home`.
- **Tests:** pendiente

---

## `/metodo/cultura/historias` — Las 6 Historias
- **Componente:** `MetodoCulturaHistorias` en `frontend/src/app/metodo/MetodoCulturaHistorias.tsx`
- **Acceso:** con sesión (PrivateRoute). Exige pago de Cultura.
- **Qué hace:** Rejilla de 6 tarjetas con foto (o emoji si falta): Universal, Religiones, Filosofía, Ciencia, Medicina, Arte y literatura. Se pueden abrir en cualquier orden.
- **Datos:** `GET /user/me`. Precarga las portadas. No guarda.
- **Desbloqueo:** Solo pago; las 6 abiertas desde el principio.
- **Botones / a dónde lleva:** prev → `/metodo/cultura`; next «Tus apuntes» → `/metodo/cultura/apuntes`; tarjeta → `/metodo/cultura/historia/<key>`.
- **Condiciones y casos raros:** Sin pago o error → `/metodo/cultura` (replace).
- **Tests:** pendiente

---

## `/metodo/cultura/historia/:historiaKey` — Línea del tiempo de una Historia
- **Componente:** `MetodoCulturaHistoria` en `frontend/src/app/metodo/MetodoCulturaHistoria.tsx`
- **Acceso:** con sesión (PrivateRoute). Exige pago de Cultura.
- **Qué hace:** Línea del tiempo con las eras/etapas de esa Historia (círculos con foto). Pulsar una era abre su página.
- **Datos:** `GET /user/me`. Apunta la pieza del camino: `apuntarCamino("cultura", 1, historiaKey)` → `/recorrido-progreso/camino-cultura-<key>/avanzar`. Contenido local (`culturaHistoria*.ts` + overlay `.en.ts` vía `useHistoriaCultura`). Precarga las 6 primeras fotos.
- **Desbloqueo:** Solo pago. Abrirla cuenta como 1 de las 6 piezas del camino de Cultura.
- **Botones / a dónde lleva:** prev → `/metodo/cultura/historias`; círculo → `/metodo/cultura/historia/<historiaKey>/<eraKey>`.
- **Condiciones y casos raros:** `:historiaKey` acepta `universal, religiones, filosofia, ciencia, medicina, arte`; otra → `/metodo/cultura/historias` (replace).
- **Tests:** pendiente

---

## `/metodo/cultura/historia/:historiaKey/:eraKey` — Una era (mini línea del tiempo + cómic)
- **Componente:** `MetodoCulturaHistoriaEra` en `frontend/src/app/metodo/MetodoCulturaHistoriaEra.tsx`
- **Acceso:** con sesión (PrivateRoute). Exige pago de Cultura.
- **Qué hace:** Mini línea del tiempo con los momentos (sub-hitos) de la era. Pulsar uno con viñetas abre un cómic con TODOS los momentos de la era seguidos, empezando por el pulsado. Al acabar el cómic salta a la era siguiente.
- **Datos:** `GET /user/me`. Contenido local. No guarda nada. Precarga 6 fotos.
- **Desbloqueo:** Solo pago.
- **Botones / a dónde lleva:** prev «← Historia» → `/metodo/cultura/historia/<key>`; extra/next = era anterior/siguiente (desactivados en la primera/última); «continuar» del cómic → era siguiente.
- **Condiciones y casos raros:** Historia inexistente → `/metodo/cultura/historias`; era inexistente → la línea de su Historia. Momentos sin viñetas no abren nada. Si la era no tiene momentos, la página sale solo con el header.
- **Tests:** pendiente

---

## `/metodo/cultura/apuntes` — Tus apuntes (elegir Historia)
- **Componente:** `MetodoCulturaApuntes` en `frontend/src/app/metodo/MetodoCulturaApuntes.tsx`
- **Acceso:** con sesión (PrivateRoute). Exige pago de Cultura.
- **Qué hace:** Sin clave en la URL: rejilla para elegir la Historia de la que hacer apuntes, con cuántas etapas y momentos trae cada una. Solo salen las que tienen apuntes: Universal, Religiones, Filosofía. Al pie, invitación a dejar reseña (`PedirOpinion`).
- **Datos:** `GET /user/me` (nombre). Precarga portadas. No guarda en BD.
- **Desbloqueo:** Solo pago.
- **Botones / a dónde lleva:** prev «Historias» → `/metodo/cultura/historias`; tarjeta → `/metodo/cultura/apuntes/<key>`; `PedirOpinion` → `/opiniones?volver=…`.
- **Condiciones y casos raros:** —
- **Tests:** pendiente

---

## `/metodo/cultura/apuntes/:historiaKey` — Crea tus apuntes de una Historia (PDF)
- **Componente:** `MetodoCulturaApuntes` (mismo) en `frontend/src/app/metodo/MetodoCulturaApuntes.tsx`, con `CreaTusApuntes`
- **Acceso:** con sesión (PrivateRoute). Exige pago de Cultura.
- **Qué hace:** Taller común de apuntes: marcar qué capítulos llevarse, elegir portada, con o sin fotos, ver el peso aproximado en MB, previsualizar y descargar el PDF. Al pie, `PedirOpinion`.
- **Datos:** `GET /user/me` (el nombre va en la portada). La selección se recuerda en localStorage `apuntes:<archivo>` ({seleccion, portada, conFotos}). PDF generado en el navegador (`utils/pdf/apuntes`).
- **Desbloqueo:** Solo pago.
- **Botones / a dónde lleva:** prev «Tus apuntes» → `/metodo/cultura/apuntes`; previsualizar / descargar PDF; reseña → `/opiniones?volver=…`.
- **Condiciones y casos raros:** `:historiaKey` acepta solo `universal, religiones, filosofia`; otra → `/metodo/cultura/apuntes` (replace). Ciencia, Medicina y Arte no tienen apuntes todavía.
- **Tests:** pendiente

---

## `/espacio/espacioHome` — Mi espacio (mandala antiguo)
- **Componente:** `EspacioHome` en `frontend/src/app/espacio/main/EspacioHome.tsx`
- **Acceso:** con sesión (PrivateRoute). Sin pago.
- **Qué hace:** Título «Mi espacio» y un mandala con la foto de perfil en el centro y 8 círculos de disciplina alrededor. Pulsar la foto permite subir otra foto de perfil (se reduce antes de subir).
- **Datos:** Lee localStorage `img`. `POST /upload/profile-pic/:userId` (multipart `file`) y guarda la URL nueva en localStorage `img`.
- **Desbloqueo:** —
- **Botones / a dónde lleva:** Astrología → `/espacio/questions/Astrología`; Psicología → `/espacio/questions/Psicología`; Fisiología → `/espacio/fisiologia`; Nutrición → `/espacio/questions/nutricion`; Ayurveda → `/espacio/questions/ayurveda`; MTC → `/espacio/questions/medicinachina`; Cábala → `/espacio/questions/Cábala`; Cultura → `/aprendizaje/cursos/cultura`.
- **Condiciones y casos raros:** Si localStorage `img` no existe, la página se queda con el cargador para siempre (solo pinta el mandala cuando `img != null`). Parece vieja: solo llega desde `FloatingActionButton` (acción "espacio"/"espacio-auth" en VideoLessonPage y páginas de espacio/recursos antiguas).
- **Tests:** pendiente

---

## `/espacio/questions/:themeId` — Espacio de una disciplina (antiguo)
- **Componente:** `ThemePreguntas` (exportado como `ExpandablePage`) en `frontend/src/app/espacio/main/ThemePreguntas.tsx`
- **Acceso:** con sesión (PrivateRoute). Sin pago.
- **Qué hace:** Solo reparte según `:themeId` a otra página: `Psicología` → NeurosicologiaEspacio; `medicinachina` → TCMespacio; `Astrología` → AstrologiaEspacio; `Cábala` → CabalaEspacio; `nutricion` → NutricionEspacio; `ayurveda` → AyurvedaMiEspacio; `Fisiología` → FisiologiaEspacio.
- **Datos:** Los de cada subpágina (sin verificar en detalle).
- **Desbloqueo:** —
- **Botones / a dónde lleva:** Los de cada subpágina. Los tests de MTC (`/tcm/test/1..3`) vuelven a `/espacio/questions/medicinachina`.
- **Condiciones y casos raros:** Los valores van con tilde y mayúscula (`Astrología`, `Cábala`, `Psicología`, `Fisiología`), mezclados con slugs (`nutricion`, `ayurveda`, `medicinachina`). Cualquier otro valor pinta una página en blanco (`return null`), sin redirección. Llega desde EspacioHome y los tests de MTC; los `link` de MandalaRecorrido parecen no usarse para navegar (sin verificar).
- **Tests:** pendiente

---

## `/espacio/fisiologia` — Espacio de Fisiología (test de órganos)
- **Componente:** `FisiologiaEspacio` en `frontend/src/components/espacio/pages/FisiologiaEspacio.tsx`
- **Acceso:** con sesión (PrivateRoute). Sin pago.
- **Qué hace:** Botón «Las células de tu cuerpo» y una rejilla de órganos. Al pulsar un órgano se abre un popup con preguntas sí/no una a una; al acabar, si los «sí» llegan al umbral, sale un resultado con descripción y plantas recomendadas; si no, «tu órgano está bien». Se puede repetir.
- **Datos:** Ninguno (contenido local `hardCoded/espacio/OrganosFisiologia` + `useOrganosFisiologia`). No guarda nada.
- **Desbloqueo:** —
- **Botones / a dónde lleva:** «Las células de tu cuerpo» → `/espacio/celulas-cuerpo`; popup: No / Sí / Repetir / Cerrar.
- **Condiciones y casos raros:** La misma página sale también en `/espacio/questions/Fisiología`. Solo llega desde EspacioHome (antigua).
- **Tests:** pendiente

---

## `/espacio/herbario` — Mi herbario (plantas favoritas, antiguo)
- **Componente:** `FitoterapiaEspacio` en `frontend/src/components/espacio/pages/FitoterapiaEspacio.tsx`
- **Acceso:** con sesión (PrivateRoute). Sin pago.
- **Qué hace:** Muestra las plantas que la persona marcó como favoritas en tarjetas. Al pulsar una se abre su ficha (beneficios, forma de uso, datos curiosos, precauciones) con botón para quitarla de favoritas. Si no hay favoritas, mensaje y botón para explorar el herbario.
- **Datos:** `GET /fitoterapia/:userId` (lista de `{idPlanta}`); `DELETE /fitoterapia/:userId/:idPlanta`. El token lo pone el interceptor global (`api/axiosSetup.ts`). Las plantas salen de datos locales (`usePlantas`).
- **Desbloqueo:** —
- **Botones / a dónde lleva:** «Explorar» → `/aprendizaje/cursos/Fitoterapia`; tarjeta → popup de ficha; «Quitar de favoritas».
- **Condiciones y casos raros:** No encontré ningún enlace que lleve aquí (ni EspacioHome); parece huérfana. El botón «Explorar» va a `/aprendizaje/cursos/Fitoterapia`, modalidad que probablemente no existe → «en construcción» (sin verificar). El herbario vigente es `/aprendizaje/herbario/favoritos`.
- **Tests:** pendiente

---

## `/espacio/celulas-cuerpo` — Tus células
- **Componente:** `CelulasCuerpoPage` en `frontend/src/app/espacio/CelulasCuerpoPage.tsx`
- **Acceso:** pública (sin PrivateRoute; header `variant="auto"`).
- **Qué hace:** Rejilla de tarjetas de tipos de célula del cuerpo (4 columnas en ordenador, 1 en móvil). Al pulsar una se abre su ficha en popup, desde el que se puede pasar a otras células.
- **Datos:** Ninguno (datos locales `hardCoded/espacio/CelulasCuerpoData` vía `useCelulas`). `RegistroActividad` la apunta como herramienta gratuita de fisiología si hay sesión.
- **Desbloqueo:** —
- **Botones / a dónde lleva:** «← Volver» → `/aprendizaje/cursos/Fisiología` (siempre, venga de donde venga).
- **Condiciones y casos raros:** Llega desde `/espacio/fisiologia` y desde un botón comentado de CursosModalidad; en «Cursos de Fisiología» se usa ahora un popup «Tus células» (`useTusCelulas`) en su lugar.
- **Tests:** pendiente

---

## `/aprendizaje/aprendizajeHome` — Cursos (Materiales)
- **Componente:** `AprendizajeHome` en `frontend/src/app/aprendizaje/AprendizajeHome.tsx`
- **Acceso:** pública.
- **Qué hace:** Título y lema, 8 cajas de disciplina en orden escaparate (Psicología, Fisiología, Nutrición, Cultura, MTC, Astrología, Cábala, Ayurveda) y debajo todos los cursos de todas las disciplinas mezclados, los más nuevos primero.
- **Datos:** `GET /cursos` (vía `useCursosData`). Precarga las 6 primeras portadas.
- **Desbloqueo:** —
- **Botones / a dónde lleva:** caja → `/aprendizaje/cursos/<slug>` (slugs: `Psicología`, `Fisiología`, `nutricion`, `Cultura`, `medicinachina`, `Astrología`, `Cábala`, `ayurveda`); tarjeta de curso → su curso.
- **Condiciones y casos raros:** Mientras carga `/cursos` solo se ve el mandala de carga.
- **Tests:** pendiente

---

## `/aprendizaje/cursos/:moduloId` — Cursos de una disciplina
- **Componente:** `CursosModalidad` en `frontend/src/app/aprendizaje/CursosModalidad.tsx`
- **Acceso:** pública.
- **Qué hace:** Header grande de la disciplina y sus cursos (tarjeta grande si hay uno, rejilla si hay varios), los más recientes primero. Cada disciplina trae botones propios en el header: MTC e Hinduismo/Ayurveda y Astrología → popup de ilustraciones; Ayurveda → Test de doshas; Astrología → «Cartas históricas» (Google Doc en pestaña nueva); Nutrición → Herbario, Alimentos y Calcular necesidades; Fisiología → popup «Tus células».
- **Datos:** `GET /cursos` (vía `useCursosData`, agrupado por slug). No guarda.
- **Desbloqueo:** —
- **Botones / a dónde lleva:** `/aprendizaje/test-doshas`, `/aprendizaje/herbario`, `/aprendizaje/alimentos`, `/aprendizaje/calcular-necesidades`; tarjeta de curso → `/aprendizaje/modulosPage/<modalidad>/<curso>` (sin verificar la ruta exacta de la tarjeta). Si se llegó desde el recorrido, `VolverAlMapa` pone el botón de vuelta al paso exacto (extra2).
- **Condiciones y casos raros:** `:moduloId` acepta `Astrología`, `Psicología`, `Fisiología`, `nutricion`, `ayurveda`, `medicinachina`, `Cábala`, `Cultura` (se decodifica si llega con %). Sin cursos pero con slug conocido: header y lista vacía (fallback). Slug desconocido: texto «en construcción» sin footer. Ojo: `/aprendizaje/cursos/cultura` (minúscula, lo usa EspacioHome) y `/aprendizaje/cursos/Fitoterapia` (herbario antiguo) caen en «en construcción». Código muerto: el popup de tests de MTC (`/tcm/test/N?guest=true`) y «saber más» no se abren desde ningún sitio (no hay `set…Open(true)`).
- **Tests:** pendiente

---

## `/aprendizaje/herbario` — Herbario
- **Componente:** `HerbarioPage` en `frontend/src/app/aprendizaje/HerbarioPage.tsx`
- **Acceso:** pública.
- **Qué hace:** Rejilla de plantas medicinales; al pulsar una sale su ficha (beneficios, forma de uso, datos curiosos, precauciones). Con sesión se puede marcar/desmarcar favoritas (corazón) y las favoritas salen primero.
- **Datos:** Plantas locales (`usePlantas`). Con sesión: `GET /fitoterapia/:userId`, `POST /fitoterapia` `{idPlanta, idUser}`, `DELETE /fitoterapia/:userId/:idPlanta` (token por el interceptor global).
- **Desbloqueo:** —
- **Botones / a dónde lleva:** «← Volver» → `/aprendizaje/cursos/nutricion`; `VolverAlMapa` si viene del recorrido; ficha en popup.
- **Condiciones y casos raros:** Sin sesión el corazón no hace nada (`toggleFavorite` sale sin avisar) (sin verificar si el corazón se oculta).
- **Tests:** pendiente

---

## `/aprendizaje/herbario/favoritos` — Mis plantas favoritas
- **Componente:** `HerbarioPage` con `favoritesOnly` en `frontend/src/app/aprendizaje/HerbarioPage.tsx`
- **Acceso:** con sesión (PrivateRoute).
- **Qué hace:** Igual que el herbario pero solo con las favoritas; si no hay ninguna, mensaje vacío.
- **Datos:** Los mismos que `/aprendizaje/herbario`.
- **Desbloqueo:** —
- **Botones / a dónde lleva:** «← Volver» → `/aprendizaje/cursos/nutricion`; quitar favorita la saca de la lista.
- **Condiciones y casos raros:** Solo llega desde el espacio de Nutrición (`NutricionEspacio`: `/aprendizaje/calcular-necesidades` y `/espacio/questions/nutricion`).
- **Tests:** pendiente

---

## `/aprendizaje/alimentos` — Alimentos
- **Componente:** `AlimentosPage` en `frontend/src/app/aprendizaje/AlimentosPage.tsx`
- **Acceso:** pública.
- **Qué hace:** Rejilla de alimentos con su ficha en popup; con sesión, favoritos con corazón.
- **Datos:** Alimentos locales. Con sesión: `GET /alimentos/:userId`, `POST /alimentos` `{idAlimento, idUser}`, `DELETE /alimentos/:userId/:id`.
- **Desbloqueo:** —
- **Botones / a dónde lleva:** «← Volver» → `/aprendizaje/cursos/nutricion`; ficha en popup.
- **Condiciones y casos raros:** BUG: en el backend NO existe ningún controlador `alimentos`; las llamadas de favoritos fallan (404) y se tragan el error, así que los favoritos de alimentos nunca se guardan.
- **Tests:** pendiente

---

## `/aprendizaje/alimentos/favoritos` — Mis alimentos favoritos
- **Componente:** `AlimentosPage` con `favoritesOnly` en `frontend/src/app/aprendizaje/AlimentosPage.tsx`
- **Acceso:** con sesión (PrivateRoute).
- **Qué hace:** Solo los alimentos favoritos; si no hay, mensaje vacío.
- **Datos:** Los mismos que `/aprendizaje/alimentos`.
- **Desbloqueo:** —
- **Botones / a dónde lleva:** «← Volver» → `/aprendizaje/cursos/nutricion`.
- **Condiciones y casos raros:** Por el bug anterior (sin endpoint `/alimentos`) la lista siempre sale vacía. Llega desde NutricionEspacio.
- **Tests:** pendiente

---

## `/aprendizaje/calcular-necesidades` — Calcula tus necesidades (calculadora de nutrición)
- **Componente:** `CalcularNecesidadesPage` en `frontend/src/app/aprendizaje/CalcularNecesidadesPage.tsx` → `NutricionEspacio isGuest` en `frontend/src/components/espacio/pages/NutricionEspacio.tsx`
- **Acceso:** pública.
- **Qué hace:** Calculadora de calorías/necesidades (peso, altura, edad, género, actividad). Con sesión muestra además accesos a «mis plantas» y «mis alimentos» favoritos.
- **Datos:** Con sesión: `GET /nutricion/:userId` (prerrellena), `POST /nutricion` `{userId, peso, altura, edad, genero, actividadIdx, …}` al calcular, `DELETE /nutricion/:userId` al reiniciar. Aunque es modo invitado, si hay sesión guarda igual.
- **Desbloqueo:** —
- **Botones / a dónde lleva:** «← Volver» → `/aprendizaje/cursos/nutricion`; con sesión → `/aprendizaje/herbario/favoritos` y `/aprendizaje/alimentos/favoritos`.
- **Condiciones y casos raros:** Sin sesión calcula en pantalla y no guarda.
- **Tests:** pendiente

---

## `/aprendizaje/test-doshas` — Test de doshas (invitado)
- **Componente:** `TestDoshasPage` en `frontend/src/app/aprendizaje/TestDoshasPage.tsx` → `AyurvedaTestPage isGuest` en `frontend/src/components/espacio/components/AyurvedaTestPage.tsx`
- **Acceso:** pública.
- **Qué hace:** Test de preguntas de Ayurveda; al responder todas calcula la dosha dominante (Vata/Pitta/Kapha) y la muestra con su puntuación.
- **Datos:** Ninguno en modo invitado: el resultado solo se muestra, no llama a `POST /ayurveda/resultado`.
- **Desbloqueo:** —
- **Botones / a dónde lleva:** «← Volver» → `/aprendizaje/cursos/ayurveda`.
- **Condiciones y casos raros:** Aunque haya sesión, aquí no se guarda (solo guarda la versión del recorrido).
- **Tests:** pendiente

---

## `/aprendizaje/modulosPage/:modalidadId/:cursoId` — Portada de un curso (sus módulos)
- **Componente:** `ModulosPage` en `frontend/src/app/aprendizaje/ModulosPage.tsx`
- **Acceso:** pública.
- **Qué hace:** Header grande con el título del curso y la lista de módulos en acordeón; cada módulo despliega sus lecciones (las de vídeo con ▶). Si el curso no tiene módulos, «sin contenido».
- **Datos:** `GET /cursos` (vía `useCursosData`). No guarda.
- **Desbloqueo:** —
- **Botones / a dónde lleva:** prev «← Cursos de X» → `/aprendizaje/cursos/<modalidadId>`; lección → `/aprendizaje/leccion/<modalidad>/<curso>/<leccion>`; `extra` = volver al paso del Mapa, solo si se vino del recorrido (`?volver=` o miga automática).
- **Condiciones y casos raros:** `:modalidadId` es el slug de disciplina (`Astrología`, `nutricion`, …) y `:cursoId` el id de la fila `curso`. Si no existen: «curso no encontrado» (sin redirección). Acepta `?volver=<ruta>`.
- **Tests:** pendiente

---

## `/aprendizaje/leccion/:modalidadId/:cursoId/:submoduloId` — Lección de un curso
- **Componente:** `TextLessonPage` en `frontend/src/app/aprendizaje/TextLessonPage.tsx`
- **Acceso:** pública.
- **Qué hace:** Según el tipo de lección: texto (Markdown por secciones), vídeo (reproductor de YouTube `VideoYoutube` con el Markdown debajo como notas) o test (`CursoTest` con ejercicios). Flechas a lección anterior/siguiente dentro del curso (en el header y al pie).
- **Datos:** `GET /cursos` (vía `useCursosData`); traducción de la lección con `useLeccionTraducida` (catálogo local, sin verificar). No guarda progreso.
- **Desbloqueo:** —
- **Botones / a dónde lleva:** prev/next → lección anterior/siguiente (desactivados en los extremos); botón central → `/aprendizaje/modulosPage/<modalidad>/<curso>`; volver al Mapa si se vino del recorrido.
- **Condiciones y casos raros:** Si falta la disciplina, el curso o la lección → «lección no encontrada». Una lección `video` con enlace que no es de YouTube se muestra como texto.
- **Tests:** pendiente

---

## `/aprendizaje/videoLessonPage/:moduloId/:submoduloId` — Lección antigua (hardcoded)
- **Componente:** `VideoLessonPage` en `frontend/src/app/aprendizaje/VideoLessonPage.tsx`
- **Acceso:** pública.
- **Qué hace:** Versión vieja de la lección: busca el submódulo en los arrays `hardCoded/aprendizajes/*` según la disciplina y muestra cabecera, texto y una transcripción plegable («letra»). El reproductor de YouTube se quitó. Lleva un botón flotante («saber más» / contacto o servicios de astrología).
- **Datos:** Ninguno (todo local).
- **Desbloqueo:** —
- **Botones / a dónde lleva:** anterior/siguiente → `linkAnterior`/`linkNext` del hardcoded; icono → `/aprendizaje/modulosPage/<moduloId>/<cursoId>` (ids antiguos que probablemente ya no existen en la tabla `curso`, sin verificar); botón flotante → popup de contacto.
- **Condiciones y casos raros:** `:moduloId` acepta `Psicología`, `medicinachina`, `Astrología`, `Cábala`, `nutricion`, `ayurveda`, `Fisiología` y el slug de cultura (`culturaNomLink`); si no encuentra el submódulo no pinta contenido. Página vieja: los cursos actuales llevan a `/aprendizaje/leccion/...`; solo le llegan enlaces desde las páginas de `/recursos/*` (Nutrición, Microbiota, MTC) y los hardcoded.
- **Tests:** pendiente

---

## `/recursos/:moduloId` — Recursos de un curso antiguo
- **Componente:** `RecursosPage` en `frontend/src/app/recursos/RecursosPage.tsx`
- **Acceso:** pública.
- **Qué hace:** Solo reparte a una página de recursos según `:moduloId`: `medicinachina` → TCMrecursos; `Cábala` → CabalaRecursos; `Cábala-camino` → CabalaRecursos2; `nutricion` → NutricionRecursos; `microbiota` → MicrobiotaRecursos; `Astrología` → AstrologiaRecursos; `CartaAstral` → CartaAstralRecursos; `ayurveda` → AyurvedaRecursos.
- **Datos:** Los de cada subpágina (sin verificar).
- **Desbloqueo:** —
- **Botones / a dónde lleva:** Los de cada subpágina; varias llevan a `/aprendizaje/videoLessonPage/...`.
- **Condiciones y casos raros:** Valor desconocido → página totalmente en blanco (ni header ni footer). Solo la enlazan los módulos hardcoded antiguos (`hardCoded/aprendizajes/*`); parece vieja.
- **Tests:** pendiente


# 6. Admin

## `/admin/login` — Desbloqueo del panel de administración
- **Componente:** `AdminLogin` en `frontend/src/app/admin/AdminLogin.tsx`
- **Acceso:** admin (AdminRoute). AdminRoute solo envuelve `PrivateRoute`: comprueba que exista `userId` en localStorage (si no, → `/welcome`) y aplica `zoom: 1.2`. NO comprueba ser admin. Esta página NO usa `useAdminGuard`; hace su propia comprobación con `GET /user/me`.
- **Qué hace:** pide la contraseña de administración (ADMIN_PASSWORD). Estar en ADMIN_EMAILS no basta. Si acierta, el backend devuelve un token nuevo con el claim `admin: true`, que sustituye al de la sesión, y se guarda `isAdmin=1`.
- **Datos:** `GET /user/me` (JwtAuthGuard) para saber `is_admin` / `admin_email`. `POST /user/admin/verify` (JwtAuthGuard + `@Throttle(LIMITE_AUTH)`, sin AdminGuard, lógico: es la puerta) con `{ password }`; compara en tiempo constante con ADMIN_PASSWORD y exige email en ADMIN_EMAILS.
- **Botones / a dónde lleva:** «Entrar» (o Enter) → `/admin` si acierta; «Volver» → `/home`.
- **Condiciones y casos raros:** sin `userId` o sin `token` → `/welcome`. Si ya está desbloqueada → `/admin`. Si el email no es de admin → `/home`. Si falla `/user/me` → `/home`. Sin ADMIN_PASSWORD configurada no entra nadie. Contraseña errónea: mensaje y se vacía el campo.
- **Tests:** pendiente

---

## `/admin` — Inicio del panel («Administración de El Mapa»)
- **Componente:** `AdminHome` en `frontend/src/app/admin/AdminHome.tsx`
- **Acceso:** admin (AdminRoute + `useAdminGuard`). `useAdminGuard` pide `GET /user/me`. Si `is_admin` es false, borra `isAdmin` y manda a `/admin/login` (email de admin sin desbloquear) o a `/home` (no admin). Sin token o userId → `/welcome`; si falla la petición → `/home`.
- **Qué hace:** muestra una rejilla con las 8 disciplinas de `ADMIN_DISCIPLINAS`. Las que tienen `disponible: false` (fisiología, nutrición, tcm, cábala, cultura) llevan «próximamente». Los botones sueltos de debajo se quitaron: lo de personas (regalar, diario, borrar, entrar como) vive en la tabla de `/admin/usuarios`, y Arquetipos y Suscriptores están en el menú de la derecha.
- **Datos:** solo `GET /user/me` (JwtAuthGuard) a través del guard.
- **Botones / a dónde lleva:** cada disciplina → `/admin/<key>`. El menú de la derecha (SiteHeader, en todo `/admin`): «El Mapa» → `/admin`, «Cursos» → `/admin/cursos`, «Usuarios» → `/admin/usuarios`, «Arquetipos de Astrología» → `/admin/astrologia-textos`, «Suscriptores» → `/admin/suscriptores`.
- **Condiciones y casos raros:** Vídeos ya no aparece por ningún lado (panel aparcado, como su sección pública).
- **Tests:** pendiente

---

## `/admin/cursos` — Lista de cursos
- **Componente:** `AdminCursos` en `frontend/src/app/admin/AdminCursos.tsx`
- **Acceso:** admin (AdminRoute + `useAdminGuard`, ver `/admin`).
- **Qué hace:** lista todos los cursos (publicados y ocultos) en dos bloques: «En progreso» y «Completados». Cada fila muestra el icono de su disciplina, las etiquetas De pago/Gratis y Publicado/Oculto, y el número de lecciones. Permite crear un curso, copiar todo su texto al portapapeles, marcarlo como completado o reabrirlo, marcarlo como «Revisado» (marca personal), editarlo y borrarlo.
- **Datos:** `GET /cursos/admin/todos` (Jwt + AdminGuard). `POST /cursos` (Jwt + AdminGuard) al crear, con `contenido: []`. `PATCH /cursos/:id` (Jwt + AdminGuard) con `{ completado }`. `PATCH /cursos/:id/revisado` (Jwt + AdminGuard), optimista: si falla, se deshace. `DELETE /cursos/:id` (Jwt + AdminGuard).
- **Botones / a dónde lleva:** «Crear» abre un modal (disciplina, título, foto, descripción, de pago, publicado) → «Crear y editar» lleva a `/admin/cursos/:id`. «Editar» → `/admin/cursos/:id`. «Borrar» abre un modal de confirmación («no se puede deshacer») y borra el curso (acción peligrosa, sin escribir nada para confirmar). «Copiar texto» solo copia en local.
- **Condiciones y casos raros:** crear sin título → aviso. Los errores salen como toast.
- **Tests:** pendiente

---

## `/admin/cursos/:id` — Editor de un curso
- **Componente:** `AdminCursoEditor` en `frontend/src/app/admin/AdminCursoEditor.tsx`
- **Acceso:** admin (AdminRoute + `useAdminGuard`).
- **Qué hace:** edita los datos del curso: disciplina, título, foto, descripción, frase bajo «Contenido del curso», de pago (5 €), publicado, completado y orden. También edita su contenido: módulos con lecciones de tipo texto (Markdown con vista previa), vídeo (enlace de YouTube, avisa si no lo reconoce) o test (`CursoTestEditor`). Se pueden añadir, insertar, subir/bajar y borrar módulos y lecciones, y añadir arriba un módulo «Podcast del curso». Tiene un buscador interno que salta a la lección y selecciona el texto encontrado. Nada se guarda hasta pulsar «Guardar».
- **Datos:** `GET /cursos/:id`: **público, sin guard** (se le mandan cabeceras de admin, pero no hacen falta). `PATCH /cursos/:id` (Jwt + AdminGuard) con todos los campos y el contenido entero.
- **Botones / a dónde lleva:** «Volver» → `/admin/cursos`. «Ver curso ↗» abre `/aprendizaje/modulosPage/<modalidad>/<id>` en otra pestaña. «Guardar» (arriba y abajo). Borrar un módulo o una lección es inmediato, sin confirmación (solo en memoria hasta guardar).
- **Condiciones y casos raros:** si el GET da error → «Curso no encontrado». Pero si el id no existe, el backend responde 200 con `null`; el front hace `{...c, contenido: []}` y el editor se pinta vacío en vez de «no encontrado», y «Guardar» haría `PATCH /cursos/undefined` (sin verificar en ejecución). Si sales sin guardar no hay aviso de cambios perdidos. Esta página lleva un `zoom: 1.15` extra además del 1.2 de AdminRoute.
- **Tests:** pendiente

---

## `/admin/astrologia-textos` — Editor de interpretaciones de la carta (arquetipos)
- **Componente:** `AdminAstrologiaTextos` en `frontend/src/app/admin/AdminAstrologiaTextos.tsx`
- **Acceso:** admin (AdminRoute + `useAdminGuard`).
- **Qué hace:** edita el texto de cada arquetipo del recorrido (cuerpo × signo y cuerpo × casa) que sale en el popup «Saber más». Se elige cuerpo, faceta (signo/casa) y celda; se escribe encima del texto original, y se puede «restaurar el original». Muestra el progreso por cuerpo y el total de textos personalizados. Si el texto queda vacío o igual al original, se quita el override.
- **Datos:** `GET /astrologia-arquetipos` (público) para cargar los overrides de la BD; si no hay, usa `astrologiaTextos.overrides.ts` del bundle. `PUT /astrologia-arquetipos` (Jwt + AdminGuard) con el conjunto COMPLETO `{ overrides }`. Lo guarda en la tabla `astrologia_arquetipos` y, si el back corre en local, también reescribe el archivo del proyecto.
- **Botones / a dónde lleva:** «Guardar» (desactivado si no hay cambios), con un toast que dice si se escribió también el archivo local. No tiene botón de volver propio (solo el header).
- **Condiciones y casos raros:** no deja editar hasta que llegan los overrides de la BD, para no machacar lo guardado con los del bundle. Guardar reemplaza el conjunto entero.
- **Tests:** pendiente

---

## `/admin/usuarios` — Usuarios (la tabla del panel)
- **Componente:** `AdminTodosUsuarios` en `frontend/src/app/admin/AdminTodosUsuarios.tsx`
- **Acceso:** admin (AdminRoute + `useAdminGuard`).
- **Qué hace:** la tabla de TODAS las cuentas, paginada de 15 en 15, con buscador local por nombre/email. Cada fila: nombre y email (sin foto), edad (de `fecha_nacimiento`; «—» si no la dio), un puntito por disciplina abierta con su color (y el total x/8), la marca «Sesiones» (está haciendo sesiones conmigo) y las acciones de la fila: «Intereses», «Entrar como» y, con «Sesiones» encendida, «Diario de terapias». Al desplegar la ficha (▸) SOLO lo de regalar y quitar: cada una de las 8 disciplinas por separado, «Todo el recorrido gratis», «Quitar acceso» (cierra las 8) y «Borrar cuenta». Ver o editar el contenido de un usuario no vive aquí: se hace desde la rejilla de disciplinas de `/admin`. Avisa si la cuenta tiene acceso libre por ACCESO_LIBRE_EMAILS. Absorbió `/admin/accesos` (aparcada).
- **Datos:** `GET /user/admin/todos` (Jwt + AdminGuard; tope de 500): añade `acceso_libre`, `fecha_nacimiento`, `en_sesiones` y las fechas de compra. `POST /user/admin/sesiones` con `{ userId, enSesiones }` (optimista; si falla, se revierte y avisa — 409 si falta correr `sql/user-en-sesiones.sql`). `POST /user/admin/acceso` con `{ userId, disciplina: <scope>|'all', abierta }`; valida contra DISCIPLINAS_ORDEN. `POST /user/admin/acceso/revocar`. `DELETE /user/admin/usuario/:id`. `POST /user/admin/suplantar` desde `BotonEntrarComo`.
- **Botones / a dónde lleva:** «Diario de terapias» → `/admin/diario/:userId`. «Intereses» (en la fila) → `/admin/actividad/:userId` (pasa nombre y email en `location.state`). «Quitar acceso» pide `window.confirm` (también quita lo pagado). «Borrar cuenta» abre un modal donde hay que escribir el email exacto; borra la cuenta y todos sus datos, no se puede deshacer y no avisa a la persona. «Entrar como» (`BotonEntrarComo` → `api/suplantar.ts`): llama a `POST /user/admin/suplantar` (Jwt + AdminGuard), aparca la sesión de admin en `suplantacionAdmin`, limpia el localStorage, guarda el token de la persona (claim `admin: false`, `sup` = id de la admin, caduca en 12 h) y recarga en `/home`. Todo lo que se escriba se guarda en su recorrido. La persona no se entera. El servidor lo apunta en `console.log`. Para volver está `BarraSuplantacion` (`salirDeLaSuplantacion` → `/admin/usuarios`). «← Anterior» / «Siguiente →» pasan de página; buscar vuelve a la página 1.
- **Condiciones y casos raros:** el backend se niega a borrar tu propia cuenta o una cuenta de ADMIN_EMAILS (409 con mensaje, que se muestra). Desde una sesión suplantada no se puede entrar al panel (el token no es de admin) ni borrar la cuenta propia (`DELETE /user/:id` lo rechaza si hay `suplantadoPor`). Usa el scope `metodo` para Astrología (DISCIPLINAS_PAGO). Las pastillas de disciplinas no disponibles llevan al placeholder. Sin correr `sql/user-en-sesiones.sql`, la marca de sesiones sale apagada y al tocarla avisa.
- **Tests:** pendiente

---

## `/admin/suscriptores` — Suscriptores
- **Componente:** `AdminSuscriptores` en `frontend/src/app/admin/AdminSuscriptores.tsx`
- **Acceso:** admin (AdminRoute + `useAdminGuard`).
- **Qué hace:** lista los correos de la tabla `suscriptor` (formulario y voluntarios, campo `origen`) del más nuevo al más antiguo, con un buscador por email/origen. Permite copiar todos los correos filtrados separados por comas, copiar el enlace de baja genérico o el enlace de baja firmado de una persona, y descargar un CSV.
- **Datos:** `GET /subscribe/admin/todos` (Jwt + AdminGuard). El enlace genérico es `${API_URL}/subscribe/baja`.
- **Botones / a dónde lleva:** «Copiar correos», «Copiar enlace de baja», «Descargar CSV» (`suscriptores.csv`), copiar la baja por fila, «Volver» → `/admin`. No borra nada.
- **Condiciones y casos raros:** el CSV no escapa comas ni comillas.
- **Tests:** pendiente

---

## `/admin/diario/:userId` — Diario de terapias de una persona
- **Componente:** `AdminDiario` en `frontend/src/app/admin/AdminDiario.tsx`
- **Acceso:** admin (AdminRoute + `useAdminGuard`).
- **Qué hace:** el mismo calendario que `/diario` (`CalendarioDiario`), con borradores incluidos: un puntito por disciplina en cada día con notas, y tocar un día enseña SOLO sus notas (con estado BORRADOR / PUBLICADA · LEÍDA / SIN LEER y opciones de editar, publicar o volver a borrador, y borrar). Cada nota (y el formulario al elegir disciplina) lleva de fondo la FOTO de su disciplina con su velo, no el color plano; en Astrología, el cielo con el velo ligero. Se abre por el último día con notas. Debajo, el formulario para escribir otra nota más (siempre se puede seguir escribiendo): fecha (sincronizada con el calendario en los dos sentidos), disciplina opcional —que tiñe el formulario y la nota de su color—, título opcional, «Qué trabajamos» (obligatorio, admite `**negrita**`, `*cursiva*` y `---` rayita) y «Por qué te digo esto». Se guarda como borrador o se publica; lo publicado lo lee la persona en `/diario`.
- **Datos:** `GET /user/:userId` (Jwt + **OwnerGuard**, no AdminGuard) para el nombre y el email. `GET /diario/admin/:userId`, `POST /diario/admin/:userId`, `PATCH /diario/admin/:userId/:entradaId` y `DELETE /diario/admin/:userId/:entradaId` (todos Jwt + AdminGuard), vía `api/diario.ts`.
- **Botones / a dónde lleva:** flechas ← → del calendario cambian el mes; un día del calendario selecciona sus notas y pone esa fecha en el formulario; teclear la fecha en el formulario mueve el calendario. «Publicar», «Guardar como borrador», «Cancelar y escribir una nueva». «Borrar» pide `window.confirm`. «← Volver a los usuarios» → `/admin/usuarios`. Publicar no manda correo; solo aparece la marca «nuevo» en su Home.
- **Condiciones y casos raros:** si el `userId` no existe, la cabecera sale vacía, pero el formulario deja intentar crear entradas (dependerá de la FK, sin verificar). Si falla la carga inicial, la lista sale vacía sin error. Tras guardar, la vista salta al día de la nota recién guardada.
- **Tests:** pendiente

---

## `/admin/actividad/:userId` — Intereses (recursos gratuitos vistos)
- **Componente:** `AdminActividad` en `frontend/src/app/admin/AdminActividad.tsx`
- **Acceso:** admin (AdminRoute + `useAdminGuard`).
- **Qué hace:** muestra un ranking de visitas por disciplina (barras) y la lista de recursos gratuitos que ha abierto la persona (tipo, disciplina, veces, última vez). Resuelve el título de cursos y lecciones con el catálogo. Es la base para los emails semanales.
- **Datos:** `GET /actividad/admin/:userId` (Jwt + AdminGuard; tabla `actividad_recurso`). `useCursosData` (catálogo público `/cursos`) para poner nombre a los cursos.
- **Botones / a dónde lleva:** «← Todas las cuentas» → `/admin/usuarios`. Solo lectura.
- **Condiciones y casos raros:** el nombre y el email salen solo del `location.state`. Si se entra pegando la URL, no se ve de quién es. Si el usuario no existe o no tiene actividad → «Todavía no ha abierto ningún recurso…».
- **Tests:** pendiente

---

## `/admin/astrologia/:userId` — Lectura de la carta de un usuario (editor)
- **Componente:** `AdminAstrologiaEditor` en `frontend/src/app/admin/AdminAstrologiaEditor.tsx`
- **Acceso:** admin (AdminRoute + `useAdminGuard`).
- **Qué hace:** panel para escribir la lectura de la carta de una persona. Se pueden editar sus datos de nacimiento (día/mes/año, hora 24 h, ciudad, región, país), lo que recalcula la carta. Se consulta su carta (`CartaAstral3D`, sus planetas con el popup «Saber más», sus casas y aspectos). Se escriben los «puntos clave» (retos: mínimo 1, con título y descripción), los textos de las 12 casas y los de los aspectos. Las secciones de escritura arrancan plegadas.
- **Datos:** `GET /user/:userId` (Jwt + **OwnerGuard**). `GET /metodo-astrologia/carta-natal/:userId` (Jwt + **OwnerGuard**). `GET /metodo-astrologia/:userId` (Jwt + **OwnerGuard**). `PATCH /metodo-astrologia/admin/:userId/nacimiento` (Jwt + AdminGuard; no manda correos ni toca `solicitud_enviada_at`). `PATCH /metodo-astrologia/admin/:userId/textos` (Jwt + AdminGuard) con casas_texto, aspectos_texto y retos. `POST /metodo-astrologia/admin/:userId/avisar/:tipo` (Jwt + AdminGuard; `tipo` = proceso|leida, validado en el servicio).
- **Botones / a dónde lleva:** «Guardar» (no manda nada por correo). «Avisar por email»: «En proceso» / «Carta leída» **manda un correo real a la persona**; si ya se mandó, pide `window.confirm` con la fecha. «Leída» falla si no hay puntos clave guardados. «Guardar datos de nacimiento». Volver → `/admin/astrologia`.
- **Condiciones y casos raros:** sin carta calculada → «Este usuario aún no tiene carta natal calculada». «Avisar» falla si la persona no tiene fila de solicitud. Validaciones de nacimiento: fecha completa, hora `H:MM`, día 1–31, año 1900–2100, ciudad y país. Los errores de carga y de «Guardar» textos se tragan en silencio: si falla el guardado, la admin no ve ningún aviso. Un userId inexistente sale como página vacía, sin error.
- **Tests:** `backend/src/metodoAstrologia/metodoAstrologia.spec.ts` (guardarTextos fusiona casas/aspectos y reemplaza retos, guardar no manda correos, avisar «leída» se niega sin retos, corregir nacimiento sin correos ni tocar la puerta, lista del panel)

---

## `/admin/psicologia/:userId` — Lectura del recorrido de psicología
- **Componente:** `AdminPsicologiaLectura` en `frontend/src/app/admin/AdminPsicologiaLectura.tsx`
- **Acceso:** admin (AdminRoute + `useAdminGuard`).
- **Qué hace:** solo lectura de lo que escribió la persona. Muestra el problema actual, las necesidades de la infancia marcadas, la Línea de Vida (gestación y años con recuerdo o «sin recuerdos»), los nudos, las heridas, la integración (constelaciones con arquetipos de la carta) y la síntesis (`proximoCapitulo`).
- **Datos:** `GET /user/:userId` (Jwt + **OwnerGuard**). `GET /metodo-psicologia/:userId` (Jwt + **OwnerGuard** a nivel de controlador), del que lee `data`.
- **Botones / a dónde lleva:** volver → `/admin/psicologia`. No escribe nada.
- **Condiciones y casos raros:** sin datos → «Este usuario todavía no ha escrito nada en su mapa de psicología». Los errores se tragan en silencio. No enseña los pasos nuevos del recorrido de 25 pasos (genograma / Tu familia, DES-II, rueda de emociones…) (sin verificar al 100 %; no aparecen en el componente).
- **Tests:** pendiente

---

## `/admin/ayurveda/:userId` — Lectura del recorrido de ayurveda
- **Componente:** `AdminAyurvedaLectura` en `frontend/src/app/admin/AdminAyurvedaLectura.tsx`
- **Acceso:** admin (AdminRoute + `useAdminGuard`).
- **Qué hace:** solo lectura, por dosha (vata/pitta/kapha, solo los que tienen algo escrito). Muestra «Antes de empezar» (cambio), «Tu tendencia mental», «Así funciona tu cuerpo», «¿Qué te desequilibra?», «Cuidarte» (reflexión, compromiso, lo que desequilibra y lo que equilibra) y «Crea tu día» (bloques).
- **Datos:** `GET /user/:userId` (Jwt + **OwnerGuard**). `GET /metodo-ayurveda/:userId` (Jwt + **OwnerGuard**), del que lee `data`.
- **Botones / a dónde lleva:** volver → `/admin/ayurveda`. No escribe nada.
- **Condiciones y casos raros:** sin datos → «Este usuario todavía no ha escrito nada en su mapa de…». Los errores se tragan en silencio. No enseña chakras ni otros pasos fuera de los doshas (sin verificar).
- **Tests:** pendiente

---

## `/admin/:disciplina/:userId` — Placeholder «editor aún no disponible»
- **Componente:** `AdminEditorPlaceholder` en `frontend/src/app/admin/AdminEditorPlaceholder.tsx`
- **Acceso:** admin (AdminRoute + `useAdminGuard`).
- **Qué hace:** para las disciplinas sin panel por usuario (fisiologia, nutricion, tcm, cabala, cultura), enseña el icono, el nombre y «El editor de contenido de esta disciplina aún no está disponible».
- **Datos:** ninguno más allá de `GET /user/me`. No usa `:userId`.
- **Botones / a dónde lleva:** «← Volver a la lista» → `/admin/<key>`.
- **Condiciones y casos raros:** astrologia, psicologia y ayurveda (y diario y actividad) tienen rutas propias antes que esta. Con una disciplina desconocida sale el título «Disciplina» y el botón lleva a `/admin/` (que es `/admin`).
- **Tests:** pendiente

---

## `/admin/:disciplina` — Cuentas de una disciplina y quién ha pagado
- **Componente:** `AdminUsuarios` en `frontend/src/app/admin/AdminUsuarios.tsx`
- **Acceso:** admin (AdminRoute + `useAdminGuard`).
- **Qué hace:** con la cabecera de la disciplina, lista todas las cuentas con un buscador. Arriba van las que tienen esa disciplina abierta («Pagada» + fecha) y debajo «Sin pagar», por nombre. «Pagada» significa abierta, por Stripe o regalada. En las disciplinas no disponibles avisa de que la lectura llegará pronto.
- **Datos:** `GET /user/admin/recorrido` (Jwt + AdminGuard). Mira la columna `<scope>_suscrito`, donde el scope de astrologia es `metodo`.
- **Botones / a dónde lleva:** cada fila → `/admin/<key>/:userId`.
- **Condiciones y casos raros:** `:disciplina` acepta astrologia, psicologia, fisiologia, nutricion, ayurveda, tcm, cabala y cultura (`ADMIN_DISCIPLINAS`). Cualquier otro valor → redirige a `/admin`. Las rutas fijas (`login`, `cursos`, `accesos`, `usuarios`, `videos`, `suscriptores`, `astrologia-textos`) van antes y no las captura.
- **Tests:** pendiente


# 7. Aparcadas

## Aparcadas: la ruta está comentada en `App.tsx`

El código de estas páginas sigue en el repo, pero hoy no se puede entrar: la URL cae en la 404.

- `/` → `Landing`: la landing de los dos proyectos. `/` vuelve a pintar `Welcome` hasta que exista «Nace una madre».
- `/programas`, `/programas/:slug`, `/programas/:slug/podcast` → `ProgramasPage`, `ProgramaPage`, `ProgramaPodcastPage`: el apartado Programas.
- `/videos` → `VideosPage`: la sección Vídeos (shorts de YouTube).
- `/metodo/cabala/dias` → `MetodoCabalaDiezDias`: «10 días» de Cábala. Su paso también está comentado en el índice.
- `/estudio`, `/estudio/datos`, `/estudio/preguntas`, `/estudio/resultados`, `/estudio/estadisticas` → `Estudio*`: el estudio estadístico de astrología.
- `/admin/estudio` → `AdminEstudio`: su panel en admin.
- `/admin/videos` → `AdminVideos`: el panel de vídeos, aparcado como su sección pública. Su backend (`/videos/*`) sigue vivo.
- `/admin/accesos` → `AdminAccesos`: regalar, revocar y borrar cuentas viven ahora dentro de la tabla de `/admin/usuarios`. Los endpoints que usaba siguen vivos (los usa la tabla).


# 8. Correos

## Correos que envía la plataforma

Todos salen de `backend/src/mail/mail.service.ts`. El texto es el que se ve en el correo; los botones van entre [corchetes].

---

## Correo: Confirma tu cuenta (bienvenida)
- **Cuándo sale:** al registrarse con contraseña (`POST /user/signIn`). También desde /logIn con «reenviar» (`POST /user/confirmar/reenviar`).
- **Función:** `enviarBienvenidaCuenta`
- **Asunto:** Confirma tu cuenta — Life as a Privilege
- **Tests:** `backend/src/user/registro.spec.ts`

> **Qué alegría tenerte aquí**
>
> Muy buenas, **{nombre}**.
>
> Has creado tu cuenta en **Life as a Privilege**. Solo falta un paso: confirma que este correo es tuyo con el botón de abajo, y ya podrás iniciar sesión.
>
> Te dejo aquí el enlace:
>
> [Confirmar e iniciar sesión] → `/logIn?confirmar=<token>` (caduca en 30 días)
>
> Si el botón no te funciona, puedes copiar esta dirección en tu navegador: {enlace}
>
> Entras con tu nombre o tu email y la contraseña que elegiste. Y si algún día se te olvida, no pasa nada: se recupera desde esa misma página.
>
> ———
>
> Déjame decirte una cosa: abrir esta cuenta no es poca cosa. Querer conocerte es un acto que requiere valor, y me alegra mucho que quieras empezar este viaje.
>
> Si aún no sabes por dónde empezar, o dudas entre una disciplina y otra, podemos hablarlo con calma. Son **veinte minutos, sin coste y sin ningún compromiso**. Hablemos de cómo estás y qué disciplina te puede ayudar mejor ahora mismo.
>
> [Buscamos un hueco] → `/contacto?conocernos=1`
>
> Y si prefieres curiosear tú primero, también me parece muy bien. La llamada seguirá aquí el día que te apetezca.
>
> Un abrazo,
> María

---

## Correo: Tu cuenta ya está activa
- **Cuándo sale:** al pulsar el enlace del correo anterior (`POST /user/confirmar`), **solo la primera vez**.
- **Función:** `enviarCuentaActivada`
- **Asunto:** Tu cuenta ya está activa — Life as a Privilege
- **Tests:** `backend/src/user/registro.spec.ts`

> **Tu cuenta ya está activa**
>
> Muy buenas, **{nombre}**.
>
> Has confirmado tu correo, así que tu cuenta en **Life as a Privilege** ya está activa.
>
> El siguiente paso es elegir tu primera disciplina. Cuando entres verás tu Mapa con las ocho: pulsa la que más te llame y la desbloqueas desde ahí.
>
> No hay un orden obligatorio. El Mapa te propone uno, pero puedes empezar por la que te apetezca.
>
> [Entrar y elegir mi disciplina] → `/logIn`
>
> Si dudas entre una y otra, lo hablamos: son veinte minutos, sin coste y sin compromiso. [Buscamos un hueco] → `/contacto?conocernos=1`
>
> Un abrazo,
> María

---

## Correo: Le toca su carta astral (aviso a la creadora)
- **Cuándo sale:** cuando la persona termina de leer TODOS sus arquetipos (los 15 cuerpos, `PATCH /metodo-astrologia/:userId` completa el último `profundizado*`). Va a `NOTIFY_EMAIL` (por defecto el de la creadora). Solo UNA vez por persona (`data.aviso_arquetipos_at`) y solo si su lectura no está escrita todavía (sin `retos` y sin `link_carta`).
- **Función:** `enviarAvisoArquetiposLeidos`
- **Asunto:** Le toca su carta astral: {email}
- **Tests:** `backend/src/metodoAstrologia/metodoAstrologia.spec.ts` (sección «El aviso a María»)

> **Le toca su carta astral**
>
> **{nombre}** ha terminado de leer **todos sus arquetipos**. Su recorrido se ha quedado parado en Puntos clave, esperando tu lectura: **le toca su carta astral**.
>
> Nombre: {nombre} · Email: {email} · Cuándo: {fecha y hora}
>
> [Escribir su carta →] → `/admin/astrologia/<userId>`


# 9. Fallos encontrados

Salieron al documentar las páginas y al escribir los tests. Cada uno lleva un código `FALLO-NN` para buscarlo, y un estado: **pendiente**, **arreglado** o **a decidir**.

Las entradas con «(sin verificar)» son lo que vio un agente al leer el código, sin comprobarlo en ejecución.

## Seguridad y dinero

- **FALLO-01 · arreglado.** `OwnerGuard` dejaba tocar los datos de cualquier usuario con solo el email de admin, sin la contraseña de administración. Ahora pide las dos llaves. Test: `backend/src/auth/guards.spec.ts`.
- **FALLO-02 · pendiente.** `GET /cursos/:id` es público y devuelve cualquier curso completo, oculto o de pago.
- **FALLO-03 · pendiente.** `/libros/descargar` no pide sesión: cualquiera con el `session_id` vuelve a bajar el PDF.
- **FALLO-04 · pendiente.** `/auth/google/callback`: el token llega en la URL y queda en el historial del navegador.
- **FALLO-05 · pendiente.** «Entrar como» solo deja rastro en un `console.log` del servidor, que se pierde.

## Cuenta

- **FALLO-06 · arreglado** (emails en minúsculas y búsqueda sin distinguir mayúsculas; test: `recuperacion.spec.ts`). El registro guarda el email tal cual se escribe, pero la recuperación de contraseña lo busca en minúsculas. `Ana@x.com` no puede recuperar su contraseña, y `Ana@` y `ana@` cuentan como cuentas distintas.
- **FALLO-07 · arreglado** (6 en registro, recuperación, «Mi cuenta» y servidor). Largo mínimo de la contraseña: el registro pide 4, la recuperación 6 y el servidor, al registrarse, nada.

## Saltarse pasos del recorrido por URL

El pago se comprueba siempre. Lo que no se comprueba al entrar en cada página es el paso anterior: solo lo frenan el botón «siguiente» y el Índice.

- **FALLO-08 · a decidir.** Pasa en Fisiología, Nutrición, Ayurveda (también en el submapa del doṣha), Medicina China (Constitución y Ciclos) y Cábala (sefirá, senderos y sendero/:num).
- **FALLO-09 · pendiente.** Nutrición: `/nutrientes/<micronutriente>` se abre sin los macro (`nutrienteAlcanzable` solo mira su propia lista), y Microbiota no mira los micronutrientes.
- **FALLO-10 · pendiente.** Astrología: el Índice abre el paso 3 solo con la solicitud enviada y el 4 solo con la carta procesada, sin haber hecho las lecturas. PDF, Llamada y Cursos no tienen gate propio.
- **FALLO-11 · pendiente.** Fisiología: Profundiza no exige `estructuras_hecho` + `organismo_hecho` (solo lo pide la tarjeta de Niveles). Sistemas cuenta `vistos.size` y el Índice cuenta las keys reales, así que una key vieja las descuadra.

## Criterios que no coinciden

- **FALLO-12 · pendiente.** Medicina China: el paso de Los Cinco Elementos deja avanzar con los tests hechos, sin haber leído los 5 elementos. Luego el Diagnóstico te devuelve atrás.
- **FALLO-13 · pendiente.** Cábala: el Diagnóstico acepta el test **o** la autoevaluación, pero el botón de cada sefirá pide **los dos**.
- **FALLO-14 · pendiente.** Psicología: Tus heridas (paso 15) deja borrarlas todas y seguir, aunque el paso 14 exige al menos una.
- **FALLO-15 · pendiente.** Psicología: Relación (17) y Dones espejo (19) leen el `data` de astrología, no la carta recalculada, y cada una decide de una forma distinta si la astrología está hecha.

## Navegación rota

- **FALLO-16 · pendiente.** `/productos`: el botón «Ver más» lleva a `/productos/:id`, que no existe, y acaba en la 404.
- **FALLO-17 · pendiente.** Psicología: el «volver» de la Línea de Vida (paso 8) salta a `des-resultado` y se pierde «Tu cerebro». El «volver» de Regulación dice «Heridas» y lleva a «Tus heridas».
- **FALLO-18 · pendiente.** Qigong: sus cómics solo salen si se llega desde Tu cocina; entrando por el Índice o la URL no aparecen.
- **FALLO-19 · pendiente.** Prāṇāyāma con un `:dosha` que no existe entra como vata. Las demás páginas del doṣha vuelven a `/tarjetas`.
- **FALLO-20 · pendiente.** Familia y Genograma con un `experienciaId` que no existe se quedan en blanco en vez de redirigir.
- **FALLO-21 · pendiente.** `/home`: el botón «Continuar» solo sale si se ha pagado Astrología.
- **FALLO-22 · pendiente.** Biblioteca de Nutrición: su «← Volver» es `navigate(-1)` y, entrando por URL, puede sacarte de la web.

## No guarda o no carga

- **FALLO-23 · pendiente.** Favoritos de alimentos: el front llama a `/alimentos` pero el backend no tiene esa ruta, así que fallan sin avisar (comprobado).
- **FALLO-24 · pendiente.** `/tcm/test/1-3` no rellenan lo ya respondido, aunque `GET /tcm/respuestas/:userId/:testNum` existe. Choca con la regla de no hacer repetir nada.
- **FALLO-25 · pendiente.** `/espacio/espacioHome` se queda cargando si falta `img` en localStorage. Su círculo de Cultura lleva a `/aprendizaje/cursos/cultura` (en minúscula) y sale «en construcción».
- **FALLO-26 · pendiente.** `/aprendizaje/calcular-necesidades` y `/tcm/test/*` con `?guest=true` guardan en la BD si hay sesión.
- **FALLO-27 · pendiente.** Admin: si falla «Guardar» en el editor de la carta no sale ningún aviso, y tampoco si falla la carga de las lecturas de psicología y ayurveda.
- **FALLO-28 · pendiente.** Admin: `/admin/cursos/<id que no existe>` abre un editor vacío y al guardar hace `PATCH /cursos/undefined` (sin verificar).
- **FALLO-29 · pendiente.** Admin: la lectura de psicología no enseña genograma, DES-II ni la rueda de emociones, y la de ayurveda no enseña los chakras.
- **FALLO-30 · pendiente.** CSV de suscriptores: no escapa comas ni comillas.

## Páginas huérfanas o viejas

- **FALLO-31 · a decidir.** Nadie enlaza a estas: `/ayurveda/miEspacio` (y sin sesión no guarda el resultado), `/metodo/nutricion/alimentos/:key`, `/metodo/astrologia/planetas`, `/metodo/astrologia/:planetaKey/:campo` y `/espacio/herbario`.
- **FALLO-32 · a decidir.** Son de cuando el contenido iba escrito en el código: `/espacio/*`, `/recursos/*` y `/aprendizaje/videoLessonPage/*`. Con un valor desconocido en la URL se quedan en blanco.
- **FALLO-33 · pendiente.** Código muerto: el modal de `Welcome`, el `EditarCuerpoModal` de la carta y los popups de `CursosModalidad`. Nada los abre.

## Detalles

- **FALLO-34 · pendiente.** Números de página de Ayurveda: dicen «1/4» y «1/7», pero el Índice tiene 7 y 8 pasos.
- **FALLO-35 · pendiente.** Textos fuera del i18n: el panel de cookies, los botones de Macros, los errores del formulario de astrología, «Has leído X de N» y los tooltips de Lectura y Casas.
- **FALLO-36 · pendiente.** Comentarios desfasados: los pasos 16/17 en `cabalaSefirot.ts` (son 38/39), «cinco puertas» en `ViasDeContacto` (son 6), el tope de 200 en `AdminAccesos` (el backend pone 500) y los átomos, el hambre y los mitos de Nutrición.


# Registro de actividades de tratamiento (art. 30 RGPD)

Documento interno. No se publica, pero hay que tenerlo al día y enseñarlo si la
AEPD lo pide. Es obligatorio aunque no haya empleados, porque se tratan datos de
salud (art. 30.5).

**Responsable:** María Escribano · NIF 48790731A · Calle Deportista Juan Matos, nº 4, Alicante · darkcake141@gmail.com
**Delegado de protección de datos:** no hay (no es obligatorio a este tamaño).
**Última revisión:** 26 de septiembre de 2026

---

## 1. Cuentas de usuario

| | |
|---|---|
| Finalidad | Crear la cuenta, iniciar sesión, dar acceso a lo comprado |
| Base legal | Ejecución del contrato (6.1.b) |
| Interesados | Personas registradas (mayores de 18) |
| Datos | Nombre de usuario, email, contraseña (hash bcrypt), trato (él/ella), foto de perfil |
| Destinatarios | Supabase (BD), Render (servidor), Google/Gmail (emails) |
| Transferencias | EE. UU.: cláusulas contractuales tipo / Data Privacy Framework |
| Conservación | Mientras la cuenta exista; se borra entera al eliminarla desde el perfil |

## 2. Recorrido de las disciplinas (datos de salud)

| | |
|---|---|
| Finalidad | Guardar las respuestas, tests y textos del recorrido; que la responsable los lea para acompañar y preparar lecturas personalizadas |
| Base legal | Contrato (6.1.b) + **consentimiento explícito** (9.2.a), casilla aparte en el pago de cada disciplina |
| Interesados | Usuarios con alguna disciplina comprada o regalada |
| Datos | Respuestas y textos libres; tests de salud emocional (p. ej. DES-II); constitución (TCM, Ayurveda); datos de nacimiento para la carta astral; genograma (**datos y fotos de familiares: terceros**) |
| Destinatarios | Supabase, Render |
| Conservación | Mientras la cuenta exista |
| Prueba del consentimiento | Fila `consentimiento-salud` de `recorrido_progreso` con su fecha (`updated_at`). Se apunta al marcar la casilla del pago o, para cuentas regaladas/antiguas, en la ventana que sale al entrar en /metodo. Desde «entrar como» no se puede dar |

## 3. Pagos y facturación

| | |
|---|---|
| Finalidad | Cobrar las disciplinas, libros y llamadas; facturar |
| Base legal | Contrato (6.1.b) y obligación legal fiscal (6.1.c) |
| Datos | Qué se compra, cuándo, importe, email. La tarjeta la trata solo Stripe |
| Destinatarios | Stripe |
| Conservación | 6 años (Código de Comercio / normativa tributaria) |

## 4. Reserva de llamadas y diario de sesiones

| | |
|---|---|
| Finalidad | Gestionar las sesiones reservadas y las notas de la sesión que se le dejan al usuario |
| Base legal | Contrato (6.1.b); datos de salud: consentimiento explícito (9.2.a) |
| Datos | Nombre, email, fecha, hora, tema; notas de la sesión |
| Destinatarios | Supabase, Render, Stripe (si es de pago) |
| Conservación | Mientras la cuenta exista (las reservas se borran por email al eliminarla) |

## 5. Lista de correo

| | |
|---|---|
| Finalidad | Avisar de contenidos nuevos |
| Base legal | Consentimiento (6.1.a), al suscribirse con información en el propio formulario |
| Datos | Email |
| Destinatarios | Supabase, Google/Gmail |
| Conservación | Hasta la baja (enlace en el formulario, en el pie de la web y en cada correo) |

## 6. Reseñas

| | |
|---|---|
| Finalidad | Publicar opiniones en /opiniones |
| Base legal | Consentimiento (6.1.a), al enviarla |
| Datos | Nombre y texto (públicos), email opcional (no público) |
| Conservación | Hasta que se pida retirarla o se borre la cuenta |

## 7. Analítica web

| | |
|---|---|
| Finalidad | Medir visitas de forma agregada |
| Base legal | Consentimiento (6.1.a + art. 22.2 LSSI), aviso de cookies con Aceptar/Rechazar al mismo nivel |
| Datos | Identificador de navegador, páginas vistas, IP anonimizada |
| Destinatarios | Google (Analytics) |
| Conservación | La que tenga configurada la propiedad de GA (poner 14 meses) |

## 8. Estudio estadístico de astrología (aparcado)

| | |
|---|---|
| Finalidad | Estudio de correlaciones carta natal / autopercepción |
| Base legal | Consentimiento (6.1.a) |
| Datos | Email, datos de nacimiento, respuestas |
| Estado | Aparcado (rutas comentadas). Si se reactiva: revisar el aviso de su formulario |

---

## Medidas de seguridad

- HTTPS en todo el tráfico; contraseñas con bcrypt; API con JWT y comprobación de que cada cual solo toca lo suyo.
- Supabase con RLS activado en todas las tablas de `public` y sin políticas (solo entra el backend con `service_role`). Tabla nueva ⇒ activarle RLS.
- Fotos del genograma con nombre no adivinable (`<userId>-<fecha>`); se borran al eliminar la cuenta.
- Tipografías servidas desde la propia web (no Google Fonts); YouTube en modo `youtube-nocookie`.
- «Entrar como usuario» del admin: solo la responsable, sesión de 12 h.

## Contratos de encargado (art. 28)

| Proveedor | Qué hay que hacer | Hecho |
|---|---|---|
| Stripe | Nada: el contrato va dentro de sus condiciones, aceptadas al abrir la cuenta. Guardar el PDF de stripe.com/legal/dpa | [ ] |
| Render | Nada: igual que Stripe (render.com/dpa). Guardar el PDF | [ ] |
| Supabase | Panel › Organization › Legal Documents › pedir el DPA (se firma online en un minuto) y guardar el PDF | [ ] |
| Google Analytics | Administrar › Configuración de la cuenta › «Condiciones de tratamiento de datos» › Aceptar | [ ] |
| Correo | Gmail personal NO tiene contrato. Pasar a Brevo (empresa francesa, datos en la UE, gratis hasta 300 correos/día): ver las variables EMAIL_* en `backend/src/mail/mail.service.ts`. Después, cambiar «Google — Gmail» por «Brevo» en /privacidad | [ ] |

(Comprobar los enlaces: los proveedores los cambian de vez en cuando.)

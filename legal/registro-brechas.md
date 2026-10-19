# Brechas de seguridad: qué hacer y registro (arts. 33 y 34 RGPD)

Documento interno. Es obligatorio **apuntar toda brecha**, también las que no se notifican.

## Qué es una brecha
Cualquier pérdida, acceso, cambio o difusión de datos personales que no debía pasar: una
clave filtrada (Supabase `service_role`, `JWT_SECRET`, Stripe, correo), una tabla sin RLS
abierta, una cuenta ajena vista por error, un correo enviado a quien no era, un dispositivo
perdido con sesión abierta.

## Qué hacer, por orden
1. **Cortar**: rotar la clave afectada, cerrar la ruta o la tabla, cambiar contraseñas.
2. **Apuntar** en la tabla de abajo, con la fecha y hora en que te enteraste.
3. **Valorar el riesgo** para las personas. Aquí casi todo es dato de salud, así que ante la duda: riesgo alto.
4. **AEPD: en 72 horas** desde que lo sabes, salvo que sea improbable que haya riesgo para las personas. Sede electrónica de la AEPD › «Brechas de seguridad» (sedeagpd.gob.es).
5. **Avisar a las personas afectadas sin demora** si el riesgo es alto: qué ha pasado, qué datos, qué ha hecho María y qué pueden hacer ellas. Por email.
6. **Corregir la causa** y anotarla.

Los encargados (Supabase, Render, Stripe) deben avisar a María si les pasa a ellos; si llega un aviso, empieza este mismo procedimiento.

## Registro

| Fecha y hora en que se supo | Qué pasó | Datos y personas afectadas | Riesgo | ¿AEPD? ¿Personas? | Qué se hizo | Cierre |
|---|---|---|---|---|---|---|
| 19-oct-2026 | Revisión interna: el endpoint `/cabala` permitía leer y escribir respuestas de cualquier cuenta sin sesión | Respuestas de Cábala de cualquier usuario | Posible; **no consta que se haya explotado** (el frontend no lo usaba). Revisar los logs de Render si se conservan | Valorar con los logs | Ruta protegida con sesión, dueño y consentimiento | Cerrado el 19-oct-2026 |

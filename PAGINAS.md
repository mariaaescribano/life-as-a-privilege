# Cómo funciona la plataforma, paso a paso

Busca con Ctrl+F el nombre del flujo en mayúsculas (por ejemplo `CREAR CUENTA`).
Los textos entre «comillas» son los que ve la persona, tal cual.

---

## CREAR CUENTA

1. Entra en «Crear cuenta» (desde Iniciar sesión, en «¿No tienes cuenta? Crear cuenta»).
2. Rellena sus datos:
   - Nombre, email, contraseña y repetir la contraseña.
   - Opcionales:
     - «¿Cómo prefieres que me dirija hacia ti?»: Él / Ella.
     - Teléfono.
     - Fecha de nacimiento, con la nota «El día de tu cumpleaños tendrás un 50 % en una disciplina.»
   - Marca «Aceptar condiciones».
3. Pulsa «Registrarme». Si algo está mal, sale un aviso y no se crea nada:
   - «Faltan datos — Rellena todos los campos»
   - «Falta aceptar las condiciones — Marca la casilla «Aceptar condiciones» para crear tu cuenta.»
   - «Email no válido — Introduce un email correcto»
   - «Contraseña muy corta — Tiene que tener al menos 6 caracteres»
   - «Las contraseñas no coinciden — Repite la misma contraseña en los dos campos»
   - «El nombre ya existe. Elige otro»
   - «El email ya está registrado» (da igual que lo escriba con mayúsculas: Ana@gmail.com y ana@gmail.com son el mismo)
4. La cuenta se guarda, pero todavía no puede entrar. Le sale el popup:
   > **Mira tu correo**
   > Tu cuenta está creada. Para activarla, pulsa el enlace que te acabamos de enviar a: *su email*
   > Después ya podrás iniciar sesión con tu nombre o tu email y tu contraseña. Si no lo ves en unos minutos, mira en spam o en promociones.
   > [Entendido]
5. Al pulsar «Entendido» va a Iniciar sesión, con el aviso «Mira tu correo — Pulsa el enlace que te hemos enviado para confirmar tu cuenta, y luego entra aquí con tu nombre o tu email y tu contraseña.»
6. Le llega el **correo 1, «Confirma tu cuenta»** (texto abajo). A ti te llega el aviso de cuenta nueva.
   - Si intenta entrar antes de confirmar: «Falta confirmar tu cuenta — Pulsa el enlace del correo que te enviamos al crearla. Mira también en spam o promociones.»
   - Debajo le sale «¿No te ha llegado? Envíamelo otra vez». Si lo pulsa: «Hecho. Si la cuenta está pendiente de confirmar, te acaba de llegar un correo nuevo.»
7. En el correo pulsa «Confirmar e iniciar sesión». Se abre Iniciar sesión con su email ya escrito y el aviso «Cuenta confirmada — Ya puedes iniciar sesión con tu nombre o tu email y tu contraseña.»
8. Le llega el **correo 2, «Tu cuenta ya está activa»** (texto abajo). Solo sale la primera vez que pulsa el enlace.
9. Escribe su contraseña y pulsa «Entrar». Sale «Bienvenido — Lo estoy preparando para ti» y llega a su Mapa, con las 8 disciplinas apagadas.
   - La primera vez sale también el popup de la comunidad de WhatsApp, si está puesto el enlace.
10. Siguiente paso: **COMPRAR DISCIPLINA**.

**Probado:** del paso 3 al 9 (`backend/src/user/registro.spec.ts`).
**Arreglado:** el email se guarda siempre en minúsculas; la contraseña pide 6 caracteres en todos los sitios.

### Correo 1 · «Confirma tu cuenta — Life as a Privilege»

> **Qué alegría tenerte aquí**
>
> Muy buenas, **{nombre}**.
>
> Has creado tu cuenta en **Life as a Privilege**. Solo falta un paso: confirma que este correo es tuyo con el botón de abajo, y ya podrás iniciar sesión.
>
> Te dejo aquí el enlace:
> [Confirmar e iniciar sesión]
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
> [Buscamos un hueco]
>
> Y si prefieres curiosear tú primero, también me parece muy bien. La llamada seguirá aquí el día que te apetezca.
>
> Un abrazo,
> María

### Correo 2 · «Tu cuenta ya está activa — Life as a Privilege» (borrador, pendiente de tu corrección)

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
> [Entrar y elegir mi disciplina]
>
> Si dudas entre una y otra, lo hablamos: son veinte minutos, sin coste y sin compromiso. [Buscamos un hueco]
>
> Un abrazo,
> María

---

## RECUPERAR CONTRASEÑA

1. En Iniciar sesión pulsa «¿Has olvidado tu contraseña?».
2. Llega a «Recuperar contraseña — Te enviamos un enlace al email de tu cuenta». Escribe su email y pulsa «Enviar enlace».
   - Si lo deja vacío: «Falta el email — Escribe el email de tu cuenta»
3. Le sale: «Mira tu correo — Si ese email tiene una cuenta, te acabamos de enviar un enlace para elegir una contraseña nueva. Caduca en una hora.»
   - Sale lo mismo aunque el email no tenga cuenta, para no desvelar quién está registrado. En ese caso no se manda nada.
   - Da igual cómo escriba el email (mayúsculas, espacios).
4. Le llega el **correo «Recupera tu contraseña»** (texto abajo).
5. Pulsa «Elegir nueva contraseña» y llega a «Nueva contraseña — Elige la contraseña con la que entrarás a partir de ahora». Escribe la nueva dos veces y pulsa «Guardar».
   - Si es corta: «Contraseña muy corta — Tiene que tener al menos 6 caracteres»
   - Si no coinciden: «No coinciden — Las dos contraseñas tienen que ser iguales»
   - Si el enlace ya se usó o ha pasado más de una hora: «El enlace ha caducado o ya se ha usado» → tiene que pedir otro (paso 2)
6. Le sale «Contraseña cambiada — Ya puedes entrar con la nueva. Te llevamos al inicio de sesión…» y a los 2 segundos está en Iniciar sesión.
7. Entra con la nueva. La vieja ya no vale.
   - Si la cuenta estaba sin confirmar, queda confirmada: el enlace le llegó a su correo.

**Probado:** del paso 2 al 7 (`backend/src/user/recuperacion.spec.ts`): el enlace sirve una sola vez, caduca a la hora, no vale para cambiar la contraseña de otra persona, y si pide dos enlaces y usa uno, el otro deja de valer.
**Arreglado:**
- Quien se registró con mayúsculas en el email no recibía nunca el enlace.
- Si el nombre estaba vacío, el correo decía «Hola ,».

### Correo · «Recupera tu contraseña — Life as a Privilege»

> **Recupera tu contraseña**
>
> Hola **{nombre}**, has pedido restablecer la contraseña de tu cuenta.
>
> Pulsa el botón para elegir una nueva. El enlace **caduca en 1 hora** y solo se puede usar una vez.
>
> [Elegir nueva contraseña]
>
> Si el botón no funciona, copia esta dirección en tu navegador: {enlace}
>
> Si no has pedido tú este cambio, puedes ignorar este correo: tu contraseña seguirá siendo la misma.

---

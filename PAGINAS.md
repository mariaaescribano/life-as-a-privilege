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

## COMPRAR DISCIPLINA

1. En su Mapa (`/home`) las disciplinas sin pagar se ven a media luz. Pulsa el círculo de la que quiere.
2. Se abre el box de pago, vestido con los colores y la foto de esa disciplina:
   - El ordinal («Primera disciplina», «Séptima disciplina»…) y un resumen de dos líneas.
   - El precio, «30 €», con el precio de antes tachado y «Ahora a precio reducido» (solo si hay precio tachado).
   - La casilla «Acepto las condiciones de compra» (el enlace abre `/terminos` en otra pestaña sin marcar la casilla).
   - Botones «Pagar» y «Ahora no», y debajo «Pago seguro a través de Stripe».
   - Sin marcar la casilla, «Pagar» está apagado y no hace nada.
3. Al pulsar «Pagar» va a la página de pago de Stripe. Todas las disciplinas cuestan lo mismo y pasan por el mismo enlace de pago.
4. Al terminar el pago vuelve a su Mapa y sale el popup:
   > **Pago de {disciplina} realizado**
   > Ya puedes acceder.
   > [Aceptar]
   Al pulsar «Aceptar» el popup se cierra y **se queda en el Mapa**, con la disciplina ya encendida. El pago solo desbloquea: no le mete dentro. Entra cuando quiera, pinchando su círculo.
5. Le llega el **correo «{Disciplina} ya te espera en tu Mapa»** (texto abajo). A ti te llega el aviso «Ha pagado {disciplina}: {email}».
6. La disciplina queda encendida para siempre en su Mapa. Los dos correos salen solo la primera vez: recargar la página o repetir la verificación no los repite.

Casos que están cubiertos:
- Si intenta entrar en una disciplina sin pagar (por ejemplo con un enlace guardado), no entra: vuelve al Mapa con el box de pago de esa disciplina ya abierto.
- El desbloqueo llega por dos caminos a la vez (la vuelta a la web y el aviso que Stripe manda al servidor): aunque cierre el navegador justo después de pagar, la disciplina se desbloquea igual.
- Nadie puede desbloquearse una disciplina con el pago de otra persona, ni con un pago que se quedó pendiente (transferencia sin completar).
- No hay orden obligatorio: se puede comprar cualquiera, en el orden que se quiera.

**Probado:** todo el flujo de dinero (`backend/src/payment/payment.service.spec.ts`): webhook de Stripe con firma, los dos caminos de verificación, que los correos salen solo la primera vez, el regalo de cumpleaños (15 €, token de 7 días, una vez al año), la llamada de pago y los libros. Y los cierres de puerta (`backend/src/auth/guards.spec.ts`): nadie toca lo de otra persona, la admin solo con la doble llave.

### Correo · «{Disciplina} ya te espera en tu Mapa»

> **Qué bonito que empieces con {disciplina}**
>
> Muy buenas, **{nombre}**.
>
> Ya está todo listo: **{disciplina}** te espera abierta en tu Mapa.
>
> Me hace mucha ilusión que hayas elegido esta, y creo que te va a sentar bien. Ve sin prisa: poco a poco irás notando cómo el conocimiento {de esta disciplina} se te va colando en el día a día — no para saber más, sino para entenderte un poco mejor.
>
> Y si en algún momento te apetece que lo hablemos, aquí estoy: una duda, un atasco, o simplemente contarme cómo lo llevas.
>
> [Entrar en mi Mapa] [Hablamos cuando quieras]
>
> Un abrazo,
> María

---

## PEDIR LA CARTA ASTRAL (empezar Astrología)

1. Entra en Astrología desde su Mapa (hace falta tenerla pagada). Al entrar salen siempre dos cómics seguidos: el del Origen y «La Historia de la Astrología».
2. Rellena sus datos de nacimiento: día, mes, año, hora, país, lugar (ciudad) y región/provincia.
3. Pulsa «Leer carta →». Sale el popup «¿Seguro que estos son tus datos?» con sus datos tal cual y el botón «Volver a revisar» por si algo está mal.
4. Al confirmar, la carta se calcula al momento y sale el popup:
   > Tu carta está en proceso. Yo misma leeré tu carta. Mientras tanto, puedes continuar para ver tus arquetipos.
5. Le llega el **correo «Tu carta ha sido registrada correctamente»** (texto abajo), con la caja de sus datos. A ti te llega la solicitud con sus datos, para escribir la lectura.
6. En la misma página aparecen: la chapa con sus datos guardados (botón «Cambiar»), el box «¿Qué es una carta astral?» (tercer cómic) y el trío **Sol · Luna · Ascendente**. Hasta que no lee los tres, el botón «Arquetipos →» no se activa («Lee los tres para continuar»).
   - Desde aquí puede ver sus **Arquetipos** (la rueda de la carta), pero **no puede seguir más allá**: los Puntos clave y todo lo que viene después quedan con candado hasta que tú hayas leído su carta (paso 8). Es el orden del recorrido: datos → arquetipos → *espera a la lectura* → puntos clave → casas → aspectos → PDF → llamada → cursos.
7. **Si corrige sus datos** (con «Cambiar») y los reenvía: la carta se recalcula con los nuevos, el popup dice «He recibido tus datos corregidos. Tu carta se ha vuelto a calcular con ellos y yo misma la leeré de nuevo…» y el correo es el de **«Tus datos corregidos han quedado registrados»**. Lo que ya llevaba leído no se pierde.
8. Tú escribes la lectura en el panel (puntos clave, casas, aspectos) y avisas **a mano** con los botones:
   - «En proceso» → **correo «Tu carta está en proceso de ser leída»**.
   - «Leída» → **correo «Tu carta ya ha sido leída»**, que lleva a Puntos clave. El panel se niega a mandarlo si no hay ningún punto clave guardado (llevaría a una puerta cerrada).
   - Guardar la lectura no manda nada: solo avisan los botones.
9. Con la lectura publicada se le abren los Puntos clave, y a partir de ahí **termina el recorrido por su cuenta**, leyendo lo que has escrito (puntos clave → casas → aspectos → PDF → llamada → cursos). Ya no intervienes más, salvo que reserve una llamada.

**Probado:** el orden entero — pagar solo desbloquea, arquetipos sí pero sin seguir hasta la lectura, los dos avisos, y que termina sola — en la sección «El orden del recorrido» de `backend/src/metodoAstrologia/metodoAstrologia.spec.ts` (la cadena de candados vive en `frontend/src/hooks/astrologiaDesbloqueo.ts` y esos tests son su contrato).

Casos que están cubiertos:
- Si el buscador de lugares falla al corregir solo la hora (mismo lugar), se aprovechan las coordenadas de antes y no se queda sin carta.
- Si falla con un lugar nuevo, los datos se guardan igual (la carta queda pendiente de calcular).
- Nadie puede abrirse pasos ni ponerse el enlace de la lectura por su cuenta: desde fuera solo se puede tocar el progreso (leídos y cómics vistos), y siempre se fusiona con lo guardado, nunca se pisa.
- Corregir el nacimiento desde tu panel recalcula la carta **sin** mandar correos y **sin** tocar la puerta del recorrido.
- En la rueda, mover a mano el Nodo Norte recoloca el Sur justo enfrente (180°).

**Probado:** todo lo de arriba (`backend/src/metodoAstrologia/metodoAstrologia.spec.ts`, 26 tests).

### Correo · «Tu carta ha sido registrada correctamente»

> **Tu carta ha sido registrada correctamente**
>
> Hola **{nombre}**, tus datos de nacimiento ya están guardados y tu carta está calculada. Estos son los datos con los que se ha hecho:
>
> | Fecha | {dd-mm-aaaa} |
> | Hora | {hh:mm} |
> | Lugar | {lugar, región, país} |
>
> Si algo no es exacto —sobre todo la **hora**, que es la que fija tu Ascendente y tus casas— entra en tu recorrido, pulsa **Cambiar** y vuelve a enviarlos. Mientras tu carta no esté escrita, corregirla no cuesta nada.
>
> A partir de aquí la leo yo misma, a mano. Te aviso cuando empiece y cuando esté terminada.
>
> [Ver mi recorrido]

*(La versión de corrección se titula «Tus datos corregidos han quedado registrados» y empieza: «Hola {nombre}, he recibido tus datos corregidos. Tu carta se ha vuelto a calcular con ellos, y estos son los que valen:».)*

### Correo · «Tu carta está en proceso de ser leída»

> **Tu carta está en proceso de ser leída**
>
> Hola **{nombre}**, ya tengo tu carta delante y he empezado a leerla.
>
> La escribo a mano, mirando tu carta: los planetas, las casas y las relaciones que forman entre ellos. Eso lleva su tiempo, así que te pido un poco de paciencia, por favor.
>
> No hace falta que esperes para seguir: puedes continuar con tu recorrido mientras yo escribo. Te aviso en cuanto esté terminada.
>
> [Seguir mi recorrido]

### Correo · «Tu carta ya ha sido leída»

> **Tu carta ya ha sido leída**
>
> Hola **{nombre}**, he terminado de leer tu carta. Ya te espera en tu recorrido, en **Puntos clave**.
>
> Ahí tienes lo que más me ha llamado la atención de tu cielo: cada punto es una estrella que puedes abrir para leer lo que he escrito sobre ti.
>
> Léela sin prisa y sin juzgarte: en tu carta no hay nada bueno ni malo. Si quieres que la recorramos juntos, puedes agendar una llamada desde tu recorrido.
>
> [Leer mi carta]

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

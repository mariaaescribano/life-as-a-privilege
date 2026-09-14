// ─────────────────────────────────────────────────────────────────────────────
// La página que se ve al pulsar «darse de baja» en un correo.
//
// La pinta el backend (no la web) para que el enlace funcione tal cual, sin
// depender de que el front esté levantado ni de una ruta nueva. Mismo turquesa
// y misma letra que los correos.
// ─────────────────────────────────────────────────────────────────────────────

const escapar = (t: string): string =>
  t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Formulario de baja: solo el correo. Va por POST a esta misma ruta. */
function formulario(email: string): string {
  return `
      <form method="post" action="baja" style="margin:26px 0 0;">
        <input type="email" name="email" required value="${escapar(email)}"
               placeholder="tu@correo.com"
               style="width:100%;box-sizing:border-box;padding:12px 16px;border-radius:999px;border:1px solid #5fc9c0;background:rgba(255,255,255,0.08);color:#ffffff;font-family:inherit;font-size:16px;" />
        <button type="submit"
                style="margin-top:14px;padding:12px 22px;border-radius:999px;border:1px solid #5fc9c0;background:transparent;color:#ffffff;font-family:inherit;font-size:16px;cursor:pointer;">
          Darme de baja
        </button>
      </form>`;
}

export type EstadoBaja = 'hecha' | 'error' | 'formulario';

export function paginaBaja(estado: EstadoBaja, email: string): string {
  const web = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '');
  const p = (t: string) =>
    `<p style="margin:18px 0 0;font-size:17px;line-height:1.75;color:#eaf7f5;">${t}</p>`;

  const titulo =
    estado === 'hecha'
      ? 'Ya estás fuera de la lista'
      : estado === 'formulario'
        ? 'Darse de baja'
        : 'No hemos podido darte de baja';

  const cuerpo =
    estado === 'hecha'
      ? p(`Hemos borrado <strong style="color:#ffffff;">${escapar(email)}</strong> de la lista de correo. No volverás a recibir novedades.`) +
        p('Si algún día te apetece volver, puedes apuntarte otra vez desde la web.')
      : estado === 'formulario'
        ? p('Escribe el correo con el que te apuntaste y lo borramos de la lista.') + formulario('')
        : p('No hemos encontrado ese correo en la lista, o el enlace está incompleto. Puedes intentarlo aquí:') +
          formulario(email);

  const boton =
    estado === 'formulario'
      ? ''
      : `<p style="margin:30px 0 0;">
        <a href="${web}" style="display:inline-block;padding:12px 22px;border:1px solid #5fc9c0;border-radius:999px;color:#ffffff;text-decoration:none;font-size:16px;">
          Volver a la web
        </a>
      </p>`;

  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="color-scheme" content="only light" />
<meta name="robots" content="noindex" />
<title>${titulo} — Life as a Privilege</title>
</head>
<body style="margin:0;background:#006b6b;font-family:'EB Garamond',Garamond,Georgia,'Times New Roman',serif;">
  <div style="max-width:600px;margin:0 auto;padding:36px 16px 44px;">
    <div style="background:#008080;border-radius:20px;padding:40px 36px;">
      <div style="font-size:11px;letter-spacing:0.3em;text-transform:uppercase;color:#a9e6df;">
        Life as a Privilege
      </div>
      <div style="height:1px;background:#4fada6;margin:22px 0 0;"></div>
      <h1 style="margin:24px 0 0;font-size:29px;line-height:1.28;font-weight:400;color:#ffffff;">
        ${titulo}
      </h1>
      ${cuerpo}
      ${boton}
    </div>
  </div>
</body>
</html>`;
}

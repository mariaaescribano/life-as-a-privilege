// El marco de los correos de la casa: el mármol de la web (con sus zonas
// turquesas) de fondo y, arriba, la cabecera de la web: el mandala turquesa y
// MARÍA / ESCRIBANO al lado, con su filete debajo. Lo usan la bienvenida de la
// intro gratuita y todos los correos de `MailService.plantilla`, para que no
// puedan volver a separarse.

/** El turquesa oscuro de la letra sobre el mármol. */
export const TINTA_MARMOL = '#004f4f';

// Garamond que sí tiene la gente (Gmail no carga tipografías de la web).
export const SERIF_CORREO =
  "'EB Garamond',Garamond,'Hoefler Text',Baskerville,Palatino,Georgia,serif";

const WEB_PUBLICA = 'https://mariaescribano.onrender.com';

/**
 * La web de la que salen las IMÁGENES de un correo. Los ENLACES van a `FRONTEND_URL`
 * (en local, localhost), pero las imágenes las descarga el cliente de correo de quien
 * lo recibe, que no puede abrir el localhost de tu ordenador: en local se piden a la
 * web publicada (o a `IMAGENES_CORREO_URL` si se define).
 */
export function webParaImagenes(web: string): string {
  const w = web.replace(/\/+$/, '');
  if (!/^https?:\/\/(localhost|127\.0\.0\.1)(:|\/|$)/i.test(w)) return w;
  return (process.env.IMAGENES_CORREO_URL ?? '').trim().replace(/\/+$/, '') || WEB_PUBLICA;
}

/**
 * `web` es la dirección pública de la web (de ahí salen las dos imágenes);
 * `titulo` va grande bajo la cabecera y `cuerpo` es el HTML de debajo. Debajo
 * del mármol va un `bgcolor` beige por si el cliente de correo no pinta imágenes.
 */
export function marcoMarmol({ web, titulo, cuerpo }: { web: string; titulo: string; cuerpo: string }): string {
  const T = TINTA_MARMOL;
  const SERIF = SERIF_CORREO;
  const imagenes = webParaImagenes(web);
  const fondo = `${imagenes}/img/correo/marmol-bienvenida.jpg`;
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#efe5cf" background="${fondo}" style="max-width:600px;margin:0 auto;border-radius:16px;background-color:#efe5cf;background-image:url('${fondo}');background-size:cover;background-position:center;">
<tr><td style="padding:44px 40px 12px;font-family:${SERIF};">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
    <td style="padding-right:14px;vertical-align:middle;"><img src="${imagenes}/img/correo/mandala-turquesa.png" width="58" height="58" alt="" style="display:block;border:0;"></td>
    <td style="vertical-align:middle;font-family:${SERIF};color:${T};font-size:20px;font-weight:600;letter-spacing:0.18em;line-height:1.2;">MARÍA<br>ESCRIBANO</td>
  </tr></table>
  <div style="height:1px;background:${T};opacity:0.45;margin:26px 0 0;"></div>
</td></tr>
<tr><td style="padding:22px 40px 40px;font-family:${SERIF};color:${T};">
<h1 style="margin:0 0 20px;font-size:30px;line-height:1.25;letter-spacing:0.03em;font-weight:700;color:${T};">${titulo}</h1>
${cuerpo}
</td></tr></table>`;
}

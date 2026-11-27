// El marco de los correos de la casa: SENCILLO. Una HOJA centrada (600 px, esquinas redondeadas) de beige liso (el de
// la web) con letra turquesa oscuro; fuera de la hoja queda el fondo propio del cliente de correo. Con la
// cabecera de la web (el mandala turquesa y MARÍA / ESCRIBANO al lado, con su filete debajo) y la firma al pie.
// Sin mármol ni fotos ni fondo a todo el ancho. Lo usan la bienvenida de la intro gratuita y todos los correos de `MailService.plantilla`,
// para que no puedan volver a separarse. (El nombre del fichero y de `marcoMarmol` es histórico.)

/** El beige de fondo: el mismo de la web (FONDO_PAGINA_BEIGE). */
export const FONDO_CORREO = '#F0DCC0';

/** El turquesa oscuro de la letra: el mismo de la web (FONDO_PAGINA_TURQUESA). */
export const TINTA_MARMOL = '#3B2418';

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
 * La firma de TODOS los correos: «Un abrazo, María», abajo a la derecha. Si el cuerpo ya la lleva (algunos
 * correos la escriben a su manera), no se repite.
 */
export function conFirma(cuerpo: string, tinta: string, serif: string): string {
  if (/Un abrazo/i.test(cuerpo)) return cuerpo;
  return `${cuerpo}
<p style="margin:28px 0 0;font-family:${serif};font-size:17px;line-height:1.75;text-align:right;color:${tinta};">Un abrazo,<br>María</p>`;
}

/**
 * `web` es la dirección pública de la web (de ahí sale el mandala); `titulo` va grande bajo la cabecera (si va vacío,
 * no se pinta) y `cuerpo` es el HTML de debajo. Una hoja beige centrada; no hay foto ni mármol.
 */
export function marcoMarmol({ web, titulo, cuerpo, firma = true }: { web: string; titulo: string; cuerpo: string; firma?: boolean }): string {
  const T = TINTA_MARMOL;
  const SERIF = SERIF_CORREO;
  const imagenes = webParaImagenes(web);
  const B = FONDO_CORREO;
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${B}" style="max-width:600px;margin:0 auto;background-color:${B};border-radius:16px;">
<tr><td style="padding:44px 40px 12px;font-family:${SERIF};">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
    <td style="padding-right:14px;vertical-align:middle;"><img src="${imagenes}/img/correo/mandala-chocolate.png" width="58" height="58" alt="" style="display:block;border:0;"></td>
    <td style="vertical-align:middle;font-family:${SERIF};color:${T};font-size:20px;font-weight:600;letter-spacing:0.18em;line-height:1.2;">MARÍA<br>ESCRIBANO</td>
  </tr></table>
  <div style="height:1px;background:${T};opacity:0.45;margin:26px 0 0;"></div>
</td></tr>
<tr><td style="padding:22px 40px 40px;font-family:${SERIF};color:${T};">
${titulo ? `<h1 style="margin:0 0 20px;font-size:30px;line-height:1.25;letter-spacing:0.03em;font-weight:700;color:${T};">${titulo}</h1>
` : ''}${firma ? conFirma(cuerpo, T, SERIF) : cuerpo}
</td></tr></table>`;
}

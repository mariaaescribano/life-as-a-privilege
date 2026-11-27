import React from "react";
import PaginaLegal, { Lista, P, Seccion } from "./PaginaLegal";

/**
 * Política de cookies. Esta web NO usa cookies de seguimiento ni analíticas (se quitó Google Analytics en nov-2026),
 * así que no hay aviso ni panel de preferencias: solo se explica qué guarda en el navegador para funcionar.
 */
export default function Cookies() {
  return (
    <PaginaLegal
      titulo="Política de cookies"
      entradilla="Esta web no utiliza cookies de seguimiento ni analíticas."
    >
      <Seccion titulo="1. Qué es una cookie">
        <P>
          Una cookie es un pequeño fichero que una web guarda en tu navegador. Sirve, por ejemplo,
          para recordar que has iniciado sesión o para contar cuánta gente visita una página.
        </P>
      </Seccion>

      <Seccion titulo="2. Qué guarda esta web">
        <P>
          No usamos cookies publicitarias, de seguimiento ni de analítica, y no medimos tu navegación
          con herramientas de terceros. Solo guardamos lo imprescindible para que el sitio funcione, que
          no requiere tu consentimiento (artículo 22.2 de la LSSI):
        </P>
        <Lista
          items={[
            <>
              <strong>Sesión</strong> (almacenamiento local del navegador) — guarda tu identificador
              y tu token de acceso para que no tengas que entrar cada vez. Se borra al cerrar
              sesión.
            </>,
            <>
              <strong>Idioma</strong> (almacenamiento local) — recuerda si prefieres español o inglés.
            </>,
            <>
              <strong>Stripe</strong> — durante el pago, para prevenir el fraude. Solo se activa si
              inicias una compra.
            </>,
          ]}
        />
      </Seccion>

      <Seccion titulo="3. Vídeos de YouTube">
        <P>
          Los vídeos de los cursos se incrustan desde youtube-nocookie.com, el modo de privacidad
          mejorada de YouTube: no instala cookies para seguirte mientras no reproduzcas el vídeo. Al
          darle al play, YouTube puede guardar datos en tu navegador según su propia política de
          privacidad.
        </P>
      </Seccion>

      <Seccion titulo="4. Cómo eliminar lo guardado">
        <P>
          Puedes eliminar o bloquear cookies y datos del sitio desde la configuración de tu navegador
          (Chrome, Firefox, Safari, Edge y el resto ofrecen esta opción en su apartado de privacidad). Ten
          en cuenta que bloquear lo necesario puede impedir que inicies sesión.
        </P>
      </Seccion>
    </PaginaLegal>
  );
}

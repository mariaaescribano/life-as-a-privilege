import React from "react";
import { Box } from "@chakra-ui/react";
import PaginaLegal, { Lista, P, Seccion, TITULAR } from "./PaginaLegal";

export default function AvisoLegal() {
  return (
    <PaginaLegal
      titulo="Aviso legal"
      entradilla="Quién está detrás de esta web y en qué condiciones puedes usarla."
    >
      <Seccion titulo="1. Titular del sitio">
        <P>
          En cumplimiento del artículo 10 de la Ley 34/2002 de Servicios de la Sociedad de la
          Información y de Comercio Electrónico (LSSI-CE), se informa de los datos del titular:
        </P>
        <Lista
          items={[
            <>
              <strong>Titular:</strong> {TITULAR.nombre}
            </>,
            <>
              <strong>NIF:</strong> {TITULAR.nif}
            </>,
            <>
              <strong>Domicilio:</strong> {TITULAR.domicilio}
            </>,
            <>
              <strong>Correo electrónico:</strong> {TITULAR.email}
            </>,
            <>
              <strong>Sitio web:</strong> {TITULAR.web}
            </>,
          ]}
        />
      </Seccion>

      <Seccion titulo="2. Objeto">
        <P>
          Este aviso regula el acceso y el uso de Life as a Privilege, una plataforma de
          divulgación y aprendizaje sobre salud holística que ofrece contenidos formativos,
          recorridos guiados, libros digitales y sesiones de acompañamiento.
        </P>
        <P>
          Navegar por el sitio te otorga la condición de usuario e implica que aceptas estas
          condiciones. Si no estás de acuerdo con ellas, te pedimos que no lo utilices.
        </P>
      </Seccion>

      <Seccion titulo="3. Condiciones de uso">
        <P>Al usar el sitio te comprometes a:</P>
        <Lista
          items={[
            "Facilitar información veraz al crear tu cuenta y mantenerla actualizada.",
            "Custodiar tus credenciales de acceso y no cederlas a terceros. Cada cuenta es personal e intransferible.",
            "No emplear el sitio con fines ilícitos, ni introducir código malicioso, ni intentar acceder a áreas o datos de otras personas.",
            "No realizar peticiones automatizadas masivas ni acciones que puedan dañar o sobrecargar el servicio.",
          ]}
        />
      </Seccion>

      <Seccion titulo="4. Propiedad intelectual">
        <P>
          Todos los contenidos del sitio —textos, ilustraciones, fotografías, vídeos, audios,
          material descargable, diseño, marca y código— son titularidad de {TITULAR.nombre} o se
          utilizan con la debida autorización, y están protegidos por la normativa de propiedad
          intelectual e industrial.
        </P>
        <P>
          Al adquirir un contenido obtienes una licencia de uso <strong>personal, privada y no
          transferible</strong>. No está permitido reproducirlo, distribuirlo, comunicarlo
          públicamente, revenderlo ni compartirlo, en todo o en parte, sin autorización escrita.
        </P>
      </Seccion>

      <Seccion titulo="5. Naturaleza divulgativa de los contenidos">
        <P>
          <Box as="strong" color="white">
            Los contenidos de esta web tienen finalidad divulgativa, formativa y de autoconocimiento.
            No constituyen asesoramiento médico, psicológico, nutricional ni sanitario de ningún
            tipo, ni sustituyen la consulta, el diagnóstico o el tratamiento de un profesional
            colegiado.
          </Box>
        </P>
        <P>
          Disciplinas como la astrología, el ayurveda, la cábala o la medicina tradicional china se
          presentan desde una perspectiva cultural, histórica y de crecimiento personal, y no cuentan
          con validación científica como métodos diagnósticos o terapéuticos.
        </P>
        <P>
          Si tienes o sospechas que puedes tener un problema de salud, consulta con tu médico. No
          abandones ni modifiques ningún tratamiento prescrito basándote en lo que leas aquí. En caso
          de urgencia, llama al 112.
        </P>
      </Seccion>

      <Seccion titulo="6. Responsabilidad">
        <P>
          El titular trabaja para que el sitio funcione correctamente y sus contenidos sean
          rigurosos, pero no puede garantizar la ausencia de errores ni la disponibilidad
          ininterrumpida del servicio, que puede verse afectada por causas ajenas (mantenimiento,
          fallos de los proveedores de alojamiento, incidencias de red).
        </P>
        <P>
          El sitio puede contener enlaces a páginas de terceros. El titular no controla ni se
          responsabiliza de sus contenidos ni de sus políticas.
        </P>
      </Seccion>

      <Seccion titulo="7. Modificaciones">
        <P>
          El titular puede modificar en cualquier momento la presentación, la configuración y los
          contenidos del sitio, así como estas condiciones. La versión vigente será siempre la
          publicada en esta página.
        </P>
      </Seccion>

      <Seccion titulo="8. Legislación aplicable">
        <P>
          Esta relación se rige por la legislación española. Para cualquier controversia, y salvo que
          la normativa de consumo establezca otro fuero imperativo, las partes se someten a los
          juzgados y tribunales del domicilio del consumidor.
        </P>
      </Seccion>
    </PaginaLegal>
  );
}

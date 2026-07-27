import React from "react";
import { Box, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import PaginaLegal, { Lista, P, Seccion, TITULAR } from "./PaginaLegal";

const Enlace = ({ to, children }: { to: string; children: React.ReactNode }) => {
  const navigate = useNavigate();
  return (
    <Text as="span" onClick={() => navigate(to)} cursor="pointer" textDecoration="underline" _hover={{ color: "white" }}>
      {children}
    </Text>
  );
};

/** Recuadro para lo que la persona debe leer sí o sí antes de pagar. */
const Destacado = ({ children }: { children: React.ReactNode }) => (
  <Box
    border="1px solid rgba(255,255,255,0.4)"
    borderRadius="xl"
    bg="rgba(255,255,255,0.09)"
    p={{ base: 4, md: 5 }}
    my={4}
  >
    {children}
  </Box>
);

export default function Terminos() {
  return (
    <PaginaLegal
      titulo="Términos de contratación"
      entradilla="Qué compras exactamente, cómo se paga, y qué pasa si te arrepientes."
    >
      <Seccion titulo="1. Quién vende y a quién">
        <P>
          Los productos y servicios de esta web los vende {TITULAR.nombre} (NIF {TITULAR.nif}), con
          domicilio en {TITULAR.domicilio} y correo {TITULAR.email}.
        </P>
        <P>
          Para comprar hay que ser mayor de 18 años y tener capacidad legal para contratar. Al
          completar un pago aceptas estos términos.
        </P>
      </Seccion>

      <Seccion titulo="2. Qué se vende">
        <Lista
          items={[
            <>
              <strong>Disciplinas de El Recorrido</strong> — acceso digital, personal e indefinido, a
              los contenidos interactivos de cada disciplina, mientras el servicio siga activo. Se
              adquieren por separado y en orden: cada una se abre al haber adquirido la anterior.
            </>,
            <>
              <strong>Libros digitales</strong> — un PDF que se descarga tras el pago. También se
              envía el enlace de descarga por correo electrónico.
            </>,
            <>
              <strong>Llamadas de acompañamiento</strong> — una sesión individual en la fecha y hora
              que reservas.
            </>,
          ]}
        />
        <P>
          Antes de pagar verás siempre el precio final y una descripción de lo que incluye. Las
          imágenes e ilustraciones son orientativas.
        </P>
      </Seccion>

      <Seccion titulo="3. Precios y pago">
        <Lista
          items={[
            "Los precios se muestran en euros e incluyen los impuestos aplicables.",
            <>
              El pago se realiza con tarjeta a través de <strong>Stripe</strong>. Los datos de tu
              tarjeta se introducen en el entorno seguro de Stripe y no pasan en ningún momento por
              nuestros servidores.
            </>,
            "El importe lo fija siempre el servidor en el momento de la compra.",
            "Recibirás justificante del pago de Stripe y, en el caso de El Recorrido, un correo confirmando que la disciplina ha quedado abierta.",
          ]}
        />
      </Seccion>

      <Seccion titulo="4. Cuándo tienes acceso">
        <P>
          El acceso se activa automáticamente en cuanto el pago queda confirmado, normalmente en
          segundos. La confirmación nos llega directamente de Stripe, así que{" "}
          <strong>tu acceso se activa aunque cierres la pestaña</strong> nada más pagar.
        </P>
        <P>
          Si pasados unos minutos no ves tu contenido desbloqueado, escríbenos a {TITULAR.email} con
          el justificante y lo resolvemos.
        </P>
      </Seccion>

      <Seccion titulo="5. Condiciones de compra">
        <P>
          Esto es lo que aceptas al marcar la casilla «Acepto las condiciones de compra» antes de
          pagar. Léelo antes de completar el pago: son las reglas del trato.
        </P>

        <Destacado>
          <Lista
            items={[
              <>
                <strong>El acceso se activa de inmediato.</strong> Pides expresamente que la entrega
                del contenido empiece en cuanto se confirme el pago, sin esperar ningún plazo.
              </>,
              <>
                <strong>El pago no se devuelve.</strong> Al tratarse de contenido digital de entrega
                inmediata, y una vez activado el acceso, la compra no admite desistimiento ni
                devolución. Reconoces que pierdes ese derecho justamente por recibirlo al instante
                (artículo 103.m del Real Decreto Legislativo 1/2007).
              </>,
              <>
                <strong>El uso es personal.</strong> Lo que compras es para ti: no se comparte la
                cuenta, no se revende y no se difunden los materiales.
              </>,
              <>
                <strong>Aceptas el resto de estos términos</strong> y la política de privacidad.
              </>,
            ]}
          />
          <P>
            <strong>
              Si no estás de acuerdo con alguno de estos puntos, no marques la casilla y no
              completes la compra.
            </strong>
          </P>
        </Destacado>

        <P>
          Con carácter general, un consumidor dispone de 14 días naturales para desistir de una
          compra a distancia (artículo 102). La excepción del punto segundo es la prevista
          expresamente por la ley para el contenido digital de entrega inmediata, y por eso se
          recoge tu consentimiento antes de cobrar.
        </P>

        <P>
          <strong>Llamadas de acompañamiento:</strong> aquí sí puedes cancelar. Recuperas el importe
          íntegro avisando con al menos 48 horas de antelación. Con menos de 48 horas, o si no te
          presentas, la sesión se considera prestada. Si necesitas cambiar la fecha, escríbenos y
          buscamos otro hueco.
        </P>
      </Seccion>

      <Seccion titulo="6. Si algo va mal">
        <P>
          Si el contenido no se corresponde con lo descrito, no es accesible por un fallo nuestro, o
          el servicio no funciona como debería, tienes derecho a que lo solucionemos y, si no es
          posible, a la devolución del importe. Escríbenos a {TITULAR.email} y te respondemos lo
          antes posible.
        </P>
        <P>
          Las devoluciones se abonan por el mismo medio de pago utilizado en la compra.
        </P>
      </Seccion>

      <Seccion titulo="7. Uso personal del contenido">
        <P>
          Lo que adquieres es una licencia de uso personal e intransferible. No puedes compartir tu
          cuenta, revender el contenido, ni difundir los materiales descargados. El incumplimiento
          puede conllevar la suspensión del acceso sin derecho a devolución.
        </P>
      </Seccion>

      <Seccion titulo="8. Naturaleza de los contenidos">
        <P>
          <Box as="strong" color="white">
            Los contenidos son divulgativos y de autoconocimiento. No son asesoramiento médico,
            psicológico ni nutricional, y no sustituyen la consulta con un profesional sanitario
            colegiado.
          </Box>{" "}
          Puedes leer el detalle en el <Enlace to="/aviso-legal">aviso legal</Enlace>.
        </P>
      </Seccion>

      <Seccion titulo="9. Reclamaciones y resolución de conflictos">
        <P>
          Puedes dirigir cualquier reclamación a {TITULAR.email}. Si no quedas conforme, la Comisión
          Europea pone a tu disposición una plataforma de resolución de litigios en línea en
          ec.europa.eu/consumers/odr.
        </P>
        <P>
          Estos términos se rigen por la legislación española. Como consumidor, puedes acudir a los
          tribunales de tu domicilio.
        </P>
      </Seccion>

      <Seccion titulo="10. Protección de datos">
        <P>
          El tratamiento de tus datos se explica en la{" "}
          <Enlace to="/privacidad">política de privacidad</Enlace>.
        </P>
      </Seccion>
    </PaginaLegal>
  );
}

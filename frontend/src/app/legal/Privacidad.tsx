import React from "react";
import { Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import PaginaLegal, { Lista, P, Seccion, TITULAR } from "./PaginaLegal";

const Enlace = ({ to, children }: { to: string; children: React.ReactNode }) => {
  const navigate = useNavigate();
  return (
    <Text
      as="span"
      onClick={() => navigate(to)}
      cursor="pointer"
      textDecoration="underline"
      _hover={{ color: "white" }}
    >
      {children}
    </Text>
  );
};

export default function Privacidad() {
  return (
    <PaginaLegal
      titulo="Política de privacidad"
      entradilla="Qué datos tuyos tratamos, para qué, durante cuánto tiempo y qué puedes exigirnos."
    >
      <Seccion titulo="1. Responsable del tratamiento">
        <Lista
          items={[
            <>
              <strong>Responsable:</strong> {TITULAR.nombre}
            </>,
            <>
              <strong>NIF:</strong> {TITULAR.nif}
            </>,
            <>
              <strong>Domicilio:</strong> {TITULAR.domicilio}
            </>,
            <>
              <strong>Contacto:</strong> {TITULAR.email}
            </>,
          ]}
        />
      </Seccion>

      <Seccion titulo="2. Qué datos tratamos">
        <Lista
          items={[
            <>
              <strong>De tu cuenta:</strong> nombre de usuario, email, contraseña (guardada siempre
              cifrada con bcrypt: nadie, tampoco nosotros, puede leerla) y, si la subes, tu foto de
              perfil.
            </>,
            <>
              <strong>Si entras con Google:</strong> nombre, email y foto que Google nos comunica.
            </>,
            <>
              <strong>De tu recorrido:</strong> las respuestas, textos, tests y notas que escribes en
              las distintas disciplinas. Incluye datos que escribes libremente sobre tu bienestar,
              tus hábitos y tus experiencias personales.
            </>,
            <>
              <strong>Para la carta astral:</strong> fecha, hora y lugar de nacimiento.
            </>,
            <>
              <strong>De tus compras:</strong> qué has adquirido y cuándo. Los datos de tu tarjeta
              los trata directamente Stripe: <strong>nunca pasan por nuestros servidores</strong>.
            </>,
            <>
              <strong>De las sesiones:</strong> nombre, email, fecha, hora y el tema que quieras
              tratar.
            </>,
            <>
              <strong>De navegación:</strong> datos estadísticos agregados, solo si aceptas las
              cookies analíticas.
            </>,
          ]}
        />
      </Seccion>

      <Seccion titulo="3. Datos de categoría especial">
        <P>
          Parte de lo que escribes en el recorrido puede revelar información sobre tu salud física o
          emocional, que el RGPD considera de categoría especial (artículo 9). Tratamos esos datos{" "}
          <strong>únicamente sobre la base de tu consentimiento explícito</strong>, que otorgas al
          decidir escribirlos, y con la única finalidad de mostrarte tu propio recorrido.
        </P>
        <P>
          No los usamos para elaborar perfiles, no los cedemos a terceros y no tomamos decisiones
          automatizadas con ellos. Escribe solo lo que quieras: ningún campo del recorrido es
          obligatorio.
        </P>
      </Seccion>

      <Seccion titulo="4. Para qué y con qué base legal">
        <Lista
          items={[
            <>
              <strong>Gestionar tu cuenta y darte acceso</strong> — ejecución del contrato.
            </>,
            <>
              <strong>Guardar tu progreso en el recorrido</strong> — ejecución del contrato y, para
              los datos de salud, tu consentimiento explícito.
            </>,
            <>
              <strong>Cobrar y facturar</strong> — ejecución del contrato y obligación legal (la
              normativa fiscal obliga a conservar la documentación).
            </>,
            <>
              <strong>Gestionar las sesiones que reservas</strong> — ejecución del contrato.
            </>,
            <>
              <strong>Responder a tus mensajes</strong> — tu consentimiento.
            </>,
            <>
              <strong>Enviarte novedades, si te suscribes</strong> — tu consentimiento, revocable en
              cualquier momento.
            </>,
            <>
              <strong>Medir el uso de la web</strong> — tu consentimiento mediante el aviso de
              cookies.
            </>,
          ]}
        />
      </Seccion>

      <Seccion titulo="5. Quién más accede a tus datos">
        <P>
          No vendemos tus datos ni los cedemos a terceros con fines comerciales. Sí utilizamos
          proveedores que los tratan por nuestra cuenta para que el servicio funcione:
        </P>
        <Lista
          items={[
            <>
              <strong>Supabase</strong> — base de datos y almacenamiento de ficheros.
            </>,
            <>
              <strong>Render</strong> — alojamiento de la web y de la API.
            </>,
            <>
              <strong>Stripe</strong> — procesamiento de los pagos.
            </>,
            <>
              <strong>Google</strong> — inicio de sesión con Google y, si lo aceptas, Google
              Analytics.
            </>,
            <>
              <strong>Proveedor de correo</strong> — envío de los emails del servicio.
            </>,
          ]}
        />
        <P>
          Algunos de estos proveedores están en Estados Unidos. Las transferencias se amparan en las
          cláusulas contractuales tipo de la Comisión Europea o en el Marco de Privacidad de Datos
          UE-EE. UU., según el proveedor.
        </P>
      </Seccion>

      <Seccion titulo="6. Cuánto tiempo los conservamos">
        <Lista
          items={[
            "Los datos de tu cuenta y de tu recorrido, mientras la cuenta siga activa.",
            "Si borras tu cuenta, se eliminan junto con todo tu contenido del recorrido y tu foto de perfil. Puedes hacerlo tú desde tu perfil, sin pedir permiso a nadie.",
            "Los datos de facturación se conservan el plazo que exige la normativa fiscal y mercantil (hasta 6 años).",
            "Los emails de suscripción, hasta que te des de baja.",
          ]}
        />
      </Seccion>

      <Seccion titulo="7. Tus derechos">
        <P>Puedes ejercer en cualquier momento, escribiendo a {TITULAR.email}, tus derechos de:</P>
        <Lista
          items={[
            "Acceso — saber qué datos tuyos tenemos.",
            "Rectificación — corregir los que sean inexactos.",
            "Supresión — pedir que los borremos.",
            "Oposición y limitación del tratamiento.",
            "Portabilidad — recibirlos en un formato reutilizable.",
            "Retirar tu consentimiento en cualquier momento, sin que ello afecte a la licitud del tratamiento previo.",
          ]}
        />
        <P>
          Si consideras que no hemos atendido bien tu solicitud, puedes reclamar ante la Agencia
          Española de Protección de Datos (www.aepd.es).
        </P>
      </Seccion>

      <Seccion titulo="8. Seguridad">
        <P>
          Aplicamos medidas técnicas y organizativas para proteger tus datos: cifrado del tráfico
          (HTTPS), contraseñas almacenadas con función de hash bcrypt, acceso a la API mediante
          tokens firmados y comprobación de que cada persona solo puede leer y modificar su propia
          información.
        </P>
      </Seccion>

      <Seccion titulo="9. Menores de edad">
        <P>
          El servicio está dirigido a mayores de 18 años. No recogemos deliberadamente datos de
          menores; si detectamos una cuenta de un menor, la eliminaremos.
        </P>
      </Seccion>

      <Seccion titulo="10. Cookies">
        <P>
          El uso de cookies se detalla en la <Enlace to="/cookies">política de cookies</Enlace>.
        </P>
      </Seccion>
    </PaginaLegal>
  );
}

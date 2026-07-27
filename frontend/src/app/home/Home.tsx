import React, { useEffect, useState } from "react";
import { Box, Flex, Image, Text, Tooltip, useBreakpointValue, useToast } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { useNavigate } from "react-router-dom";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { LifeLoader } from "../../components/metodo/comicLoaders";
import { PagoMetodoModal } from "../../components/metodo/PagoMetodoModal";
import { PagoPsicologiaModal } from "../../components/metodo/PagoPsicologiaModal";
import { PagoAyurvedaModal } from "../../components/metodo/PagoAyurvedaModal";
import { PagoTcmModal } from "../../components/metodo/PagoTcmModal";
import { PagoFisiologiaModal } from "../../components/metodo/PagoFisiologiaModal";
import { PagoNutricionModal } from "../../components/metodo/PagoNutricionModal";
import { PagoCabalaModal } from "../../components/metodo/PagoCabalaModal";
import { PagoCulturaModal } from "../../components/metodo/PagoCulturaModal";
import { PagoExitoModal } from "../../components/metodo/PagoExitoModal";
import axios from "axios";
import {
  API_URL,
  astrologiaBg, AstrologiaIcon, astrologiaNom, astrologiaTxt,
  ayurvedaBg, AyurvedaIcon, ayurvedaNom, ayurvedaNomLink, ayurvedaTxt,
  cabalaBg, CabalaIcon, cabalaNom, cabalaTxt,
  culturaBg, CulturaIcon, culturaNom, culturaTxt,
  fisiologiaBg, FisiologiaIcon, fisiologiaNom, fisiologiaTxt,
  neuropsicologiaBg, NeuropsicologiaIcon, neuropsicologiaNom, neuropsicologiaTxt,
  nutricionBg, NutricionIcon, nutricionNom, nutricionNomLink, nutricionTxt,
  tcmBg, TCMIcon, tcmNom, tcmNomLink, tcmTxt,
} from "../../GlobalVariables";
import { DisciplinaBgLayer, hasDisciplinaBg, disciplinaBgImg } from "../../components/global/DisciplinaBgLayer";
import { irAPagoDisciplina } from "../../components/metodo/pagoDisciplinaLink";

const popIn = keyframes`
  from { opacity: 0; transform: scale(0.2); }
  to   { opacity: 1; transform: scale(1); }
`;

// Orden del Método: Astrología → Psicología → Hinduismo → TCM →
// Fisiología → Nutrición → Cábala → Cultura
// Astrología tiene flujo propio (/metodo/astrologia con aviso_visto). El resto
// salta directamente a la página del curso correspondiente en aprendizaje.
const disciplines = [
  { name: astrologiaNom,      bg: astrologiaBg,      txt: astrologiaTxt,      Icon: AstrologiaIcon,      link: "/metodo/astrologia" },
  { name: neuropsicologiaNom, bg: neuropsicologiaBg, txt: neuropsicologiaTxt, Icon: NeuropsicologiaIcon, link: `/aprendizaje/cursos/${neuropsicologiaNom}` },
  { name: ayurvedaNom,        bg: ayurvedaBg,        txt: ayurvedaTxt,        Icon: AyurvedaIcon,        link: `/aprendizaje/cursos/${ayurvedaNomLink}` },
  { name: tcmNom,             bg: tcmBg,             txt: tcmTxt,             Icon: TCMIcon,             link: `/aprendizaje/cursos/${tcmNomLink}` },
  { name: fisiologiaNom,      bg: fisiologiaBg,      txt: fisiologiaTxt,      Icon: FisiologiaIcon,      link: `/aprendizaje/cursos/${fisiologiaNom}` },
  { name: nutricionNom,       bg: nutricionBg,       txt: nutricionTxt,       Icon: NutricionIcon,       link: `/aprendizaje/cursos/${nutricionNomLink}` },
  { name: cabalaNom,          bg: cabalaBg,          txt: cabalaTxt,          Icon: CabalaIcon,          link: `/aprendizaje/cursos/${cabalaNom}` },
  { name: culturaNom,         bg: culturaBg,         txt: culturaTxt,         Icon: CulturaIcon,         link: `/aprendizaje/cursos/${culturaNom}` },
];

// Astrología lleva candado hasta pagarse (metodo_suscrito), pero su círculo es
// clickable: al pulsarlo abre el pago si aún no está pagada, o entra al recorrido
// si ya lo está. Psicología se abre una vez pagada la primera disciplina
// (metodo_suscrito) — clickable igual: navega si ya está pagada, o abre el pago
// si todavía no. El resto queda con candado.

// Disciplina según la ruta del Mapa guardada (para el botón «Continuar por dónde
// lo dejé», que se pinta con el fondo, el icono y el color de esa disciplina).
type DiscInfo = { nom: string; bg: string; txt: string; Icon: (typeof disciplines)[number]["Icon"] };
function disciplinaDeRuta(path: string): DiscInfo | null {
  const p = path.toLowerCase();
  if (p.startsWith("/metodo/astrologia")) return { nom: astrologiaNom, bg: astrologiaBg, txt: astrologiaTxt, Icon: AstrologiaIcon };
  if (p.startsWith("/metodo/psicologia")) return { nom: neuropsicologiaNom, bg: neuropsicologiaBg, txt: neuropsicologiaTxt, Icon: NeuropsicologiaIcon };
  if (p.startsWith("/metodo/ayurveda"))   return { nom: ayurvedaNom, bg: ayurvedaBg, txt: ayurvedaTxt, Icon: AyurvedaIcon };
  if (p.startsWith("/metodo/tcm"))        return { nom: tcmNom, bg: tcmBg, txt: tcmTxt, Icon: TCMIcon };
  if (p.startsWith("/metodo/fisiologia")) return { nom: fisiologiaNom, bg: fisiologiaBg, txt: fisiologiaTxt, Icon: FisiologiaIcon };
  if (p.startsWith("/metodo/nutricion"))  return { nom: nutricionNom, bg: nutricionBg, txt: nutricionTxt, Icon: NutricionIcon };
  if (p.startsWith("/metodo/cabala"))     return { nom: cabalaNom, bg: cabalaBg, txt: cabalaTxt, Icon: CabalaIcon };
  if (p.startsWith("/metodo/cultura"))    return { nom: culturaNom, bg: culturaBg, txt: culturaTxt, Icon: CulturaIcon };
  return null;
}

// ── Caché de sesión (a nivel de módulo, persiste entre navegaciones dentro de
// la SPA). El objetivo: /home solo hace su carga completa (spinner + GET
// /user/me + precarga de fondos) UNA vez. Al volver a /home más tarde, el
// mandala se pinta ya en su estado final —con los candados donde toca— sin
// spinner ni parpadeo. Se resetea solo con recarga completa del navegador
// (p.ej. tras un pago, que redirige con window.location.href → estado fresco).
type SuscCache = {
  metodo: boolean; psicologia: boolean; ayurveda: boolean; tcm: boolean;
  fisiologia: boolean; nutricion: boolean; cabala: boolean; cultura: boolean;
};
let suscCache: SuscCache | null = null;
let imagesReadyCache = false;

const Home = () => {
  const navigate = useNavigate();
  const toast = useToast();

  // Iniciamos la foto ya desde sessionStorage: así, al volver a /home con la
  // caché caliente, el mandala se pinta en el primer render (sin un frame con
  // img=null que mostraría el spinner).
  const [img, setImg] = useState<string | null>(() => {
    try { return sessionStorage.getItem("img"); } catch { return null; }
  });
  const [uploading, setUploading] = useState(false);
  const [name, setName] = useState<string>("");
  // Estado inicial desde la caché de sesión (si ya se cargó antes → sin null,
  // el mandala se pinta directo sin pasar por el spinner).
  const [metodoSuscrito, setMetodoSuscrito] = useState<boolean | null>(suscCache ? suscCache.metodo : null);
  const [psicologiaSuscrito, setPsicologiaSuscrito] = useState<boolean | null>(suscCache ? suscCache.psicologia : null);
  const [ayurvedaSuscrito, setAyurvedaSuscrito] = useState<boolean | null>(suscCache ? suscCache.ayurveda : null);
  const [tcmSuscrito, setTcmSuscrito] = useState<boolean | null>(suscCache ? suscCache.tcm : null);
  const [fisiologiaSuscrito, setFisiologiaSuscrito] = useState<boolean | null>(suscCache ? suscCache.fisiologia : null);
  const [nutricionSuscrito, setNutricionSuscrito] = useState<boolean | null>(suscCache ? suscCache.nutricion : null);
  const [cabalaSuscrito, setCabalaSuscrito] = useState<boolean | null>(suscCache ? suscCache.cabala : null);
  const [culturaSuscrito, setCulturaSuscrito] = useState<boolean | null>(suscCache ? suscCache.cultura : null);
  const [pagoOpen, setPagoOpen] = useState(false);
  const [pagoLoading, setPagoLoading] = useState(false);
  const [verificandoPago, setVerificandoPago] = useState(false);
  const [pagoExitoOpen, setPagoExitoOpen] = useState(false);
  // Pago de Psicología (2ª disciplina)
  const [pagoPsicoOpen, setPagoPsicoOpen] = useState(false);
  const [pagoPsicoLoading, setPagoPsicoLoading] = useState(false);
  const [pagoPsicoError, setPagoPsicoError] = useState<string | null>(null);
  const [pagoPsicoExitoOpen, setPagoPsicoExitoOpen] = useState(false);
  // Pago de Ayurveda (3ª disciplina)
  const [pagoAyurOpen, setPagoAyurOpen] = useState(false);
  const [pagoAyurLoading, setPagoAyurLoading] = useState(false);
  const [pagoAyurError, setPagoAyurError] = useState<string | null>(null);
  const [pagoAyurExitoOpen, setPagoAyurExitoOpen] = useState(false);
  // Pago de Medicina China (4ª disciplina)
  const [pagoTcmOpen, setPagoTcmOpen] = useState(false);
  const [pagoTcmLoading, setPagoTcmLoading] = useState(false);
  const [pagoTcmError, setPagoTcmError] = useState<string | null>(null);
  const [pagoTcmExitoOpen, setPagoTcmExitoOpen] = useState(false);
  // Pago de Fisiología (5ª disciplina)
  const [pagoFisioOpen, setPagoFisioOpen] = useState(false);
  const [pagoFisioLoading, setPagoFisioLoading] = useState(false);
  const [pagoFisioError, setPagoFisioError] = useState<string | null>(null);
  const [pagoFisioExitoOpen, setPagoFisioExitoOpen] = useState(false);
  // Pago de Nutrición (6ª disciplina)
  const [pagoNutriOpen, setPagoNutriOpen] = useState(false);
  const [pagoNutriLoading, setPagoNutriLoading] = useState(false);
  const [pagoNutriError, setPagoNutriError] = useState<string | null>(null);
  const [pagoNutriExitoOpen, setPagoNutriExitoOpen] = useState(false);
  // Pago de Cábala (7ª disciplina)
  const [pagoCabalaOpen, setPagoCabalaOpen] = useState(false);
  const [pagoCabalaLoading, setPagoCabalaLoading] = useState(false);
  const [pagoCabalaError, setPagoCabalaError] = useState<string | null>(null);
  const [pagoCabalaExitoOpen, setPagoCabalaExitoOpen] = useState(false);
  // Pago de Cultura (8ª disciplina)
  const [pagoCulturaOpen, setPagoCulturaOpen] = useState(false);
  const [pagoCulturaLoading, setPagoCulturaLoading] = useState(false);
  const [pagoCulturaError, setPagoCulturaError] = useState<string | null>(null);
  const [pagoCulturaExitoOpen, setPagoCulturaExitoOpen] = useState(false);
  // No mostramos NADA del mandala hasta que TODAS las fotos (fondos de las
  // disciplinas + foto central del usuario) estén cargadas. Si ya se precargaron
  // en una visita anterior de esta sesión, arrancamos en true (sin re-precargar).
  const [imagesReady, setImagesReady] = useState(imagesReadyCache);

  const continuarAstrologia = async () => {
    navigate("/metodo/astrologia");
  };

  const irAstrologia = async () => {
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) {
      navigate("/welcome");
      return;
    }
    // El box de pago SOLO debe salir si el usuario NO ha pagado. Si aún no
    // sabemos su estado (carga inicial todavía en curso → metodoSuscrito null),
    // lo consultamos antes de decidir, para no mostrar el pago a quien ya pagó.
    let suscrito = metodoSuscrito;
    if (suscrito === null) {
      try {
        const me = await axios.get(`${API_URL}/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        suscrito = !!me.data?.metodo_suscrito;
        setMetodoSuscrito(suscrito);
      } catch {
        suscrito = false;
      }
    }
    if (!suscrito) {
      setPagoOpen(true);
      return;
    }
    await continuarAstrologia();
  };

  const [pagoError, setPagoError] = useState<string | null>(null);

  // Pago de Astrología: el backend crea un Checkout Session de Stripe (con el
  // userId en metadata y success_url a /home?metodo_pagado={SESSION_ID}); al
  // volver del pago, el efecto de arriba llama a /payment/metodo/verify y
  // desbloquea. Flujo autocontenido: NO usar Payment Links estáticos, que no
  // llevan el userId ni vuelven a la URL de verificación.
  const pagarMetodo = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/welcome");
      return;
    }
    setPagoLoading(true);
    setPagoError(null);
    // Todas las disciplinas se cobran por separado, pero comparten el mismo
    // Payment Link: el scope y el userId viajan en el client_reference_id
    // para que, al volver a /home, el verify sepa qué desbloquear.
    const errPago = irAPagoDisciplina("metodo");
    if (errPago) {
      setPagoError(errPago);
      setPagoLoading(false);
    }
  };

  // Psicología (2ª disciplina): clic en su círculo del mandala.
  const irPsicologia = () => {
    if (psicologiaSuscrito) {
      navigate("/metodo/psicologia");
    } else {
      setPagoPsicoError(null);
      setPagoPsicoOpen(true);
    }
  };

  const pagarPsicologia = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) { navigate("/welcome"); return; }
    setPagoPsicoLoading(true);
    setPagoPsicoError(null);
    // Todas las disciplinas se cobran por separado, pero comparten el mismo
    // Payment Link: el scope y el userId viajan en el client_reference_id
    // para que, al volver a /home, el verify sepa qué desbloquear.
    const errPago = irAPagoDisciplina("psicologia");
    if (errPago) {
      setPagoPsicoError(errPago);
      setPagoPsicoLoading(false);
    }
  };

  // Ayurveda (3ª disciplina): clic en su círculo del mandala.
  const irAyurveda = () => {
    if (ayurvedaSuscrito) {
      navigate("/metodo/ayurveda");
    } else {
      setPagoAyurError(null);
      setPagoAyurOpen(true);
    }
  };

  const pagarAyurveda = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) { navigate("/welcome"); return; }
    setPagoAyurLoading(true);
    setPagoAyurError(null);
    // Todas las disciplinas se cobran por separado, pero comparten el mismo
    // Payment Link: el scope y el userId viajan en el client_reference_id
    // para que, al volver a /home, el verify sepa qué desbloquear.
    const errPago = irAPagoDisciplina("ayurveda");
    if (errPago) {
      setPagoAyurError(errPago);
      setPagoAyurLoading(false);
    }
  };

  // Medicina China (4ª disciplina): clic en su círculo del mandala.
  const irTcm = () => {
    if (tcmSuscrito) {
      navigate("/metodo/tcm");
    } else {
      setPagoTcmError(null);
      setPagoTcmOpen(true);
    }
  };

  const pagarTcm = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) { navigate("/welcome"); return; }
    setPagoTcmLoading(true);
    setPagoTcmError(null);
    // Todas las disciplinas se cobran por separado, pero comparten el mismo
    // Payment Link: el scope y el userId viajan en el client_reference_id
    // para que, al volver a /home, el verify sepa qué desbloquear.
    const errPago = irAPagoDisciplina("tcm");
    if (errPago) {
      setPagoTcmError(errPago);
      setPagoTcmLoading(false);
    }
  };

  // Fisiología (5ª disciplina): clic en su círculo del mandala.
  const irFisiologia = () => {
    if (fisiologiaSuscrito) {
      navigate("/metodo/fisiologia");
    } else {
      setPagoFisioError(null);
      setPagoFisioOpen(true);
    }
  };

  const pagarFisiologia = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) { navigate("/welcome"); return; }
    setPagoFisioLoading(true);
    setPagoFisioError(null);
    // Todas las disciplinas se cobran por separado, pero comparten el mismo
    // Payment Link: el scope y el userId viajan en el client_reference_id
    // para que, al volver a /home, el verify sepa qué desbloquear.
    const errPago = irAPagoDisciplina("fisiologia");
    if (errPago) {
      setPagoFisioError(errPago);
      setPagoFisioLoading(false);
    }
  };

  // Nutrición (6ª disciplina): clic en su círculo del mandala.
  const irNutricion = () => {
    if (nutricionSuscrito) {
      navigate("/metodo/nutricion");
    } else {
      setPagoNutriError(null);
      setPagoNutriOpen(true);
    }
  };

  const pagarNutricion = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) { navigate("/welcome"); return; }
    setPagoNutriLoading(true);
    setPagoNutriError(null);
    // Todas las disciplinas se cobran por separado, pero comparten el mismo
    // Payment Link: el scope y el userId viajan en el client_reference_id
    // para que, al volver a /home, el verify sepa qué desbloquear.
    const errPago = irAPagoDisciplina("nutricion");
    if (errPago) {
      setPagoNutriError(errPago);
      setPagoNutriLoading(false);
    }
  };

  // Cábala (7ª disciplina): clic en su círculo del mandala.
  const irCabala = () => {
    if (cabalaSuscrito) {
      navigate("/metodo/cabala");
    } else {
      setPagoCabalaError(null);
      setPagoCabalaOpen(true);
    }
  };

  const pagarCabala = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) { navigate("/welcome"); return; }
    setPagoCabalaLoading(true);
    setPagoCabalaError(null);
    // Todas las disciplinas se cobran por separado, pero comparten el mismo
    // Payment Link: el scope y el userId viajan en el client_reference_id
    // para que, al volver a /home, el verify sepa qué desbloquear.
    const errPago = irAPagoDisciplina("cabala");
    if (errPago) {
      setPagoCabalaError(errPago);
      setPagoCabalaLoading(false);
    }
  };

  // Cultura (8ª disciplina): clic en su círculo del mandala.
  const irCultura = () => {
    if (culturaSuscrito) {
      navigate("/metodo/cultura");
    } else {
      setPagoCulturaError(null);
      setPagoCulturaOpen(true);
    }
  };

  const pagarCultura = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) { navigate("/welcome"); return; }
    setPagoCulturaLoading(true);
    setPagoCulturaError(null);
    // Todas las disciplinas se cobran por separado, pero comparten el mismo
    // Payment Link: el scope y el userId viajan en el client_reference_id
    // para que, al volver a /home, el verify sepa qué desbloquear.
    const errPago = irAPagoDisciplina("cultura");
    if (errPago) {
      setPagoCulturaError(errPago);
      setPagoCulturaLoading(false);
    }
  };

  const radius       = useBreakpointValue({ base: 112, sm: 138, md: 196, lg: 248, xl: 284 });
  const containerSize = useBreakpointValue({ base: "286px", sm: "356px", md: "498px", lg: "622px", xl: "712px" });
  const centerSize    = useBreakpointValue({ base: "102px", sm: "124px", md: "160px", lg: "196px", xl: "232px" });
  const circleSize    = useBreakpointValue({ base: "67px", sm: "79px", md: "96px", lg: "116px" });
  const iconSize      = useBreakpointValue({ base: "34px", sm: "43px", md: "53px", lg: "64px" });
  const numberSize    = useBreakpointValue({ base: "22px", sm: "25px", md: "29px", lg: "34px" });
  const mandalaScale  = useBreakpointValue({ base: "none", md: "scale(0.7)" });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId) {
      navigate("/");
      return;
    }
    if (img == null) {
      const stored = sessionStorage.getItem("img");
      setImg(stored);
    }
    setName(sessionStorage.getItem("name") || "");

    const url = new URL(window.location.href);
    const metodoPagado = url.searchParams.get("metodo_pagado");
    const psicologiaPagado = url.searchParams.get("psicologia_pagado");
    const ayurvedaPagado = url.searchParams.get("ayurveda_pagado");
    const tcmPagado = url.searchParams.get("tcm_pagado");
    const fisiologiaPagado = url.searchParams.get("fisiologia_pagado");
    const nutricionPagado = url.searchParams.get("nutricion_pagado");
    const cabalaPagado = url.searchParams.get("cabala_pagado");
    const culturaPagado = url.searchParams.get("cultura_pagado");
    // Vuelta del Payment Link compartido: una sola query para las ocho, porque
    // el enlace es el mismo. Qué disciplina se ha pagado lo dice el backend, que
    // lo saca del client_reference_id de la sesión.
    const disciplinaPagada = url.searchParams.get("disciplina_pagada");

    // Si ya cargamos las suscripciones antes en esta sesión y NO venimos de un
    // pago (que obliga a re-verificar), no volvemos a pedir /user/me: el estado
    // ya se inicializó desde la caché y el mandala se pinta directo.
    const hayPagoQuery =
      metodoPagado || psicologiaPagado || ayurvedaPagado || tcmPagado ||
      fisiologiaPagado || nutricionPagado || cabalaPagado || culturaPagado ||
      disciplinaPagada;
    if (suscCache && !hayPagoQuery) {
      return;
    }

    const cargarSuscripcion = async () => {
      try {
        const me = await axios.get(`${API_URL}/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const suscrito = !!me.data?.metodo_suscrito;
        setMetodoSuscrito(suscrito);
        setPsicologiaSuscrito(!!me.data?.psicologia_suscrito);
        setAyurvedaSuscrito(!!me.data?.ayurveda_suscrito);
        setTcmSuscrito(!!me.data?.tcm_suscrito);
        setFisiologiaSuscrito(!!me.data?.fisiologia_suscrito);
        setNutricionSuscrito(!!me.data?.nutricion_suscrito);
        setCabalaSuscrito(!!me.data?.cabala_suscrito);
        setCulturaSuscrito(!!me.data?.cultura_suscrito);
        return suscrito;
      } catch {
        setMetodoSuscrito(false);
        setPsicologiaSuscrito(false);
        setAyurvedaSuscrito(false);
        setTcmSuscrito(false);
        setFisiologiaSuscrito(false);
        setNutricionSuscrito(false);
        setCabalaSuscrito(false);
        setCulturaSuscrito(false);
        return false;
      }
    };

    if (disciplinaPagada) {
      setVerificandoPago(true);
      url.searchParams.delete("disciplina_pagada");
      window.history.replaceState({}, "", url.pathname + url.search);

      // El scope viene de vuelta en la respuesta, así que abrimos el box de
      // «pagado» de la disciplina que toque.
      const EXITO: Record<string, () => void> = {
        metodo:     () => setPagoExitoOpen(true),
        psicologia: () => setPagoPsicoExitoOpen(true),
        ayurveda:   () => setPagoAyurExitoOpen(true),
        tcm:        () => setPagoTcmExitoOpen(true),
        fisiologia: () => setPagoFisioExitoOpen(true),
        nutricion:  () => setPagoNutriExitoOpen(true),
        cabala:     () => setPagoCabalaExitoOpen(true),
        cultura:    () => setPagoCulturaExitoOpen(true),
      };

      axios
        .get(`${API_URL}/payment/disciplina/verify`, {
          params: { session_id: disciplinaPagada },
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(async (res) => {
          // Recargamos SIEMPRE las suscripciones: es la fuente de verdad y deja
          // el mandala coherente aunque el verify haya fallado.
          await cargarSuscripcion();
          if (res.data?.ok) {
            EXITO[res.data.scope]?.();
          }
        })
        .catch(async () => {
          await cargarSuscripcion();
        })
        .finally(() => setVerificandoPago(false));
    } else if (metodoPagado) {
      setVerificandoPago(true);
      url.searchParams.delete("metodo_pagado");
      window.history.replaceState({}, "", url.pathname + url.search);

      axios
        .get(`${API_URL}/payment/metodo/verify`, {
          params: { session_id: metodoPagado },
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(async (res) => {
          if (res.data?.ok) {
            setMetodoSuscrito(true);
            setPagoExitoOpen(true);
            await cargarSuscripcion();
          } else {
            await cargarSuscripcion();
          }
        })
        .catch(async () => {
          await cargarSuscripcion();
        })
        .finally(() => setVerificandoPago(false));
    } else if (psicologiaPagado) {
      setVerificandoPago(true);
      url.searchParams.delete("psicologia_pagado");
      window.history.replaceState({}, "", url.pathname + url.search);

      axios
        .get(`${API_URL}/payment/psicologia/verify`, {
          params: { session_id: psicologiaPagado },
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(async (res) => {
          await cargarSuscripcion();
          if (res.data?.ok) {
            setPsicologiaSuscrito(true);
            setPagoPsicoExitoOpen(true);
          }
        })
        .catch(async () => {
          await cargarSuscripcion();
        })
        .finally(() => setVerificandoPago(false));
    } else if (ayurvedaPagado) {
      setVerificandoPago(true);
      url.searchParams.delete("ayurveda_pagado");
      window.history.replaceState({}, "", url.pathname + url.search);

      axios
        .get(`${API_URL}/payment/ayurveda/verify`, {
          params: { session_id: ayurvedaPagado },
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(async (res) => {
          await cargarSuscripcion();
          if (res.data?.ok) {
            setAyurvedaSuscrito(true);
            setPagoAyurExitoOpen(true);
          }
        })
        .catch(async () => {
          await cargarSuscripcion();
        })
        .finally(() => setVerificandoPago(false));
    } else if (tcmPagado) {
      setVerificandoPago(true);
      url.searchParams.delete("tcm_pagado");
      window.history.replaceState({}, "", url.pathname + url.search);

      axios
        .get(`${API_URL}/payment/tcm/verify`, {
          params: { session_id: tcmPagado },
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(async (res) => {
          await cargarSuscripcion();
          if (res.data?.ok) {
            setTcmSuscrito(true);
            setPagoTcmExitoOpen(true);
          }
        })
        .catch(async () => {
          await cargarSuscripcion();
        })
        .finally(() => setVerificandoPago(false));
    } else if (fisiologiaPagado) {
      setVerificandoPago(true);
      url.searchParams.delete("fisiologia_pagado");
      window.history.replaceState({}, "", url.pathname + url.search);

      axios
        .get(`${API_URL}/payment/fisiologia/verify`, {
          params: { session_id: fisiologiaPagado },
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(async (res) => {
          await cargarSuscripcion();
          if (res.data?.ok) {
            setFisiologiaSuscrito(true);
            setPagoFisioExitoOpen(true);
          }
        })
        .catch(async () => {
          await cargarSuscripcion();
        })
        .finally(() => setVerificandoPago(false));
    } else if (nutricionPagado) {
      setVerificandoPago(true);
      url.searchParams.delete("nutricion_pagado");
      window.history.replaceState({}, "", url.pathname + url.search);

      axios
        .get(`${API_URL}/payment/nutricion/verify`, {
          params: { session_id: nutricionPagado },
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(async (res) => {
          await cargarSuscripcion();
          if (res.data?.ok) {
            setNutricionSuscrito(true);
            setPagoNutriExitoOpen(true);
          }
        })
        .catch(async () => {
          await cargarSuscripcion();
        })
        .finally(() => setVerificandoPago(false));
    } else if (cabalaPagado) {
      setVerificandoPago(true);
      url.searchParams.delete("cabala_pagado");
      window.history.replaceState({}, "", url.pathname + url.search);

      axios
        .get(`${API_URL}/payment/cabala/verify`, {
          params: { session_id: cabalaPagado },
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(async (res) => {
          await cargarSuscripcion();
          if (res.data?.ok) {
            setCabalaSuscrito(true);
            setPagoCabalaExitoOpen(true);
          }
        })
        .catch(async () => {
          await cargarSuscripcion();
        })
        .finally(() => setVerificandoPago(false));
    } else if (culturaPagado) {
      setVerificandoPago(true);
      url.searchParams.delete("cultura_pagado");
      window.history.replaceState({}, "", url.pathname + url.search);

      axios
        .get(`${API_URL}/payment/cultura/verify`, {
          params: { session_id: culturaPagado },
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(async (res) => {
          await cargarSuscripcion();
          if (res.data?.ok) {
            setCulturaSuscrito(true);
            setPagoCulturaExitoOpen(true);
          }
        })
        .catch(async () => {
          await cargarSuscripcion();
        })
        .finally(() => setVerificandoPago(false));
    } else {
      cargarSuscripcion();
    }
  }, []);

  // Precarga de TODAS las fotos del mandala. Hasta que no estén todas cargadas
  // (o fallen) no se muestra nada — evita que aparezcan círculos sin su fondo.
  useEffect(() => {
    if (img == null) return;
    // Ya precargadas en una visita anterior de la sesión → nada que hacer.
    if (imagesReadyCache) return;
    const srcs = disciplines
      .map((d) => disciplinaBgImg(d.name))
      .filter((s): s is string => !!s);
    srcs.push(img);
    let cancelled = false;
    let pending = srcs.length;
    const done = () => {
      if (cancelled) return;
      pending -= 1;
      if (pending <= 0) setImagesReady(true);
    };
    srcs.forEach((src) => {
      const im = new window.Image();
      im.onload = done;
      im.onerror = done;
      im.src = src;
    });
    return () => { cancelled = true; };
  }, [img]);

  // Mantiene la caché de suscripciones al día. En cuanto se resuelven (deja de
  // ser null), la guardamos para que la próxima visita a /home no vuelva a
  // pedir /user/me. Cubre las dos vías que las fijan: la carga inicial y la
  // verificación tras el pago.
  useEffect(() => {
    if (metodoSuscrito === null) return;
    suscCache = {
      metodo: !!metodoSuscrito,
      psicologia: !!psicologiaSuscrito,
      ayurveda: !!ayurvedaSuscrito,
      tcm: !!tcmSuscrito,
      fisiologia: !!fisiologiaSuscrito,
      nutricion: !!nutricionSuscrito,
      cabala: !!cabalaSuscrito,
      cultura: !!culturaSuscrito,
    };
  }, [metodoSuscrito, psicologiaSuscrito, ayurvedaSuscrito, tcmSuscrito,
      fisiologiaSuscrito, nutricionSuscrito, cabalaSuscrito, culturaSuscrito]);

  // Una vez precargadas las fotos, lo recordamos para no re-precargar al volver.
  useEffect(() => {
    if (imagesReady) imagesReadyCache = true;
  }, [imagesReady]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const userId = sessionStorage.getItem("userId");
    const token  = sessionStorage.getItem("token");
    if (!userId || !token) {
      navigate("/");
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", e.target.files[0]);
      const res  = await fetch(`${API_URL}/upload/profile-pic/${userId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!data.url) throw new Error("Sin URL devuelta");
      const freshUrl = `${data.url}?v=${Date.now()}`;
      sessionStorage.setItem("img", freshUrl);
      setImg(freshUrl);
    } catch (err) {
      toast({
        title: "No se pudo subir la foto",
        description: "Inténtalo de nuevo en un momento.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    } finally {
      setUploading(false);
    }
  };

  const angleStep = (2 * Math.PI) / disciplines.length;

  // Estado de pago de cada disciplina, en el MISMO orden que `disciplines`
  // (Astrología → Psicología → Ayurveda → TCM → Fisiología → Nutrición →
  // Cábala → Cultura). Con esto el mandala aplica el ORDEN del Mapa: una
  // disciplina solo se puede abrir —o pagar— si la anterior ya está pagada.
  const pagadas = [
    metodoSuscrito, psicologiaSuscrito, ayurvedaSuscrito, tcmSuscrito,
    fisiologiaSuscrito, nutricionSuscrito, cabalaSuscrito, culturaSuscrito,
  ].map(Boolean);

  // El mandala se pinta UNA sola vez y ya en su estado correcto (candados donde
  // toca). Para eso hace falta esperar a TRES cosas: la foto del usuario, la
  // precarga de los fondos, y —clave— el estado de suscripciones. Como
  // cargarSuscripcion() fija los 8 estados a la vez, con que metodoSuscrito deje
  // de ser null ya están todos resueltos. Sin esto, los círculos aparecerían
  // bloqueados y luego «saltarían» a desbloqueados (el doble render).
  const suscripcionesCargadas = metodoSuscrito !== null;
  const mandalaListo = img != null && imagesReady && suscripcionesCargadas;

  // Botón «Continuar por dónde lo dejé»: lleva a la última página del Mapa que
  // el usuario visitó (guardada en localStorage por SiteHeader) y se pinta con
  // el color de esa disciplina. Solo aparece si hay un recorrido guardado Y la
  // usuaria ha comprado al menos una disciplina (metodoSuscrito) — si acaba de
  // llegar y no ha comprado nada, no tiene sentido ofrecerle «Continuar».
  const ultimoRecorrido = (() => { try { return localStorage.getItem("ultimoRecorrido"); } catch { return null; } })();
  const contDisc = ultimoRecorrido ? disciplinaDeRuta(ultimoRecorrido) : null;
  const ContIcon = contDisc?.Icon;
  const continuarBtn = metodoSuscrito && ultimoRecorrido && contDisc ? (
    <Box
      as="button"
      onClick={() => navigate(ultimoRecorrido)}
      position="relative"
      overflow="hidden"
      display="inline-flex"
      alignItems="center"
      gap={2.5}
      px={{ base: 5, md: 5 }}
      py={2.5}
      borderRadius="full"
      bg={contDisc.bg}
      color={contDisc.txt}
      border={`2px solid ${contDisc.txt}`}
      fontFamily="'EB Garamond', serif"
      fontWeight={700}
      fontSize={{ base: "sm", md: "md" }}
      letterSpacing="0.03em"
      whiteSpace="nowrap"
      cursor="pointer"
      boxShadow={`0 4px 18px rgba(0,0,0,0.28), 0 0 16px ${contDisc.txt}3a`}
      transition="all 0.2s"
      _hover={{ transform: "translateY(-1px)", boxShadow: `0 6px 22px rgba(0,0,0,0.34), 0 0 24px ${contDisc.txt}5a` }}
    >
      {/* Fondo de la disciplina NÍTIDO: velo muy suave para que la IMAGEN se vea
          de verdad. */}
      <DisciplinaBgLayer nom={contDisc.nom} borderRadius="full" overlay={`${contDisc.bg}59`} />
      {/* Icono de la disciplina, a la izquierda. */}
      {ContIcon && (
        <Box as="span" position="relative" zIndex={1} display="inline-flex" alignItems="center" flexShrink={0}>
          <ContIcon size={{ base: "20px", md: "22px" }} />
        </Box>
      )}
      <Box as="span" position="relative" zIndex={1} textShadow="none">
        Continuar por dónde lo dejé →
      </Box>
    </Box>
  ) : null;

  return (
    <Box
      minH="100vh"
      display="flex"
      flexDirection="column"
      bg="#008080"
      fontFamily="'EB Garamond', serif"
    >
      <SiteHeader variant="private" userImg={img ?? undefined} />

      {/* Continuar por dónde lo dejé — escritorio: fijo arriba a la derecha,
          bajo el header. En móvil se pinta debajo del mandala (más abajo). */}
      {continuarBtn && (
        <Box position="fixed" top={{ md: "120px" }} right={{ md: "22px" }} zIndex={30}
             display={{ base: "none", md: "block" }}>
          {continuarBtn}
        </Box>
      )}

      <Box flex="1" display="flex" alignItems="flex-start" justifyContent="center" transform={mandalaScale} transformOrigin="top center">
        {mandalaListo ? (
          <Flex
            direction="column"
            alignItems="center"
            justifyContent="center"
            pt={{ base: 8, md: 10 }}
            pb={{ base: 20, md: 10 }}
            px={{ base: 5, md: 10 }}
            w="100%"
          >
            {/* ── SALUDO ── */}
            <Text
              color="white"
              fontSize={{ base: "3xl", md: "5xl" }}
              fontWeight="700"
              letterSpacing="0.06em"
              textAlign="center"
              lineHeight="1.15"
              textShadow="0 0 18px rgba(255,255,255,0.75), 0 0 38px rgba(255,255,255,0.45), 0 0 70px rgba(180,255,245,0.35)"
              mb={{ base: 10, md: 8 }}
            >
              Te damos la bienvenida al Mapa{name ? `, ${name}` : ""}
            </Text>

            {/* <Text
              color="rgba(255,255,255,0.92)"
              // En móvil: clamp() escala el tamaño según el ancho del viewport
              // para que la frase entre siempre en una sola línea, sea cual
              // sea el dispositivo (desde 320px hasta tablet).
              fontSize={{ base: "clamp(0.7rem, 3.4vw, 1.05rem)", md: "2xl" }}
              fontStyle="italic"
              textAlign="center"
              letterSpacing={{ base: "0.02em", md: "0.04em" }}
              whiteSpace={{ base: "nowrap", md: "normal" }}
              textShadow="0 0 12px rgba(255,255,255,0.55), 0 0 26px rgba(255,255,255,0.3)"
              mb={{ base: 10, md: 8 }}
              px={2}
            >
              Este es «El Recorrido» para empezar el camino de vuelta a ti.
            </Text> */}

            {/* Mandala */}
            <Box
              position="relative"
              w={containerSize}
              h={containerSize}
              display="flex"
              alignItems="center"
              justifyContent="center"
              sx={{
                "&::before": {
                  content: '""',
                  position: "absolute",
                  inset: 0,
                  backgroundImage: "url('/img/icono/life.png')",
                  backgroundSize: "100%",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  opacity: 0.1,
                  zIndex: 0,
                },
              }}
            >
              {/* Centro: foto del usuario, clic para cambiarla */}
              <Box
                position="absolute"
                w={centerSize}
                h={centerSize}
                borderRadius="full"
                overflow="hidden"
                boxShadow="0 8px 32px rgba(0,0,0,0.4), 0 0 32px rgba(255,255,255,0.7), 0 0 70px rgba(255,255,255,0.35), 0 0 110px rgba(180,255,245,0.3)"
                border="2px solid rgba(255,255,255,0.9)"
                zIndex={10}
              >
                <Image src={img} alt="Tu foto" w="100%" h="100%" objectFit="cover" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{
                    position: "absolute", top: 0, left: 0,
                    width: "100%", height: "100%",
                    opacity: 0, cursor: "pointer",
                  }}
                />
                {uploading && (
                  <Box
                    position="absolute"
                    top={0} left={0}
                    w="100%" h="100%"
                    bg="rgba(0,0,0,0.55)"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    zIndex={20}
                  >
                    <SpinnerTurquesa fullScreen={false} size={44} thickness={4} />
                  </Box>
                )}
              </Box>

              {/* Disciplinas alrededor — habilitadas según ABIERTAS */}
              {disciplines.map((d, index) => {
                const angle = angleStep * index - Math.PI / 2;
                const x = Math.cos(angle) * (radius ?? 200);
                const y = Math.sin(angle) * (radius ?? 200);
                const delay = `${index * 0.18}s`;
                const number = index + 1;
                const Icon = d.Icon;
                // Astrología tiene txt muy claro → usar bg para el badge solo en ese caso.
                const badgeColor = d.bg === astrologiaBg ? d.bg : d.txt;
                // `abierta` = estado visual desbloqueado (iluminado, sin candado).
                //   · Astrología: solo cuando está PAGADA (metodo_suscrito === true).
                //     Por defecto (aún sin pagar o mientras carga) sale bloqueada.
                //   · Psicología: solo cuando está PAGADA (psicologia_suscrito).
                // Ambas siguen con candado hasta que se pague / se pruebe el pago,
                // pero siguen siendo clicables para poder abrir su pago.
                const abierta =
                  (d.name === astrologiaNom && metodoSuscrito === true) ||
                  (d.name === neuropsicologiaNom && psicologiaSuscrito === true) ||
                  (d.name === ayurvedaNom && ayurvedaSuscrito === true) ||
                  (d.name === tcmNom && tcmSuscrito === true) ||
                  (d.name === fisiologiaNom && fisiologiaSuscrito === true) ||
                  (d.name === nutricionNom && nutricionSuscrito === true) ||
                  (d.name === cabalaNom && cabalaSuscrito === true) ||
                  (d.name === culturaNom && culturaSuscrito === true);
                // `clickable` = se puede pulsar aunque siga con candado, para poder
                //   abrir su pago. BLOQUEO SECUENCIAL: el Mapa se hace en orden, así
                //   que una disciplina solo es clicable si la ANTERIOR de la cadena
                //   ya está pagada (Astrología, la primera, siempre lo es). Las que
                //   aún no tocan quedan con candado y no responden al clic.
                const clickable = index === 0 || pagadas[index - 1];
                const hasBg = hasDisciplinaBg(d.name);
                // Astrología: flujo propio. Psicología: navega (si pagada) o abre el pago.
                // Las demás abiertas saltarían directamente a su página.
                const handleClick = d.name === astrologiaNom
                  ? irAstrologia
                  : d.name === neuropsicologiaNom
                  ? irPsicologia
                  : d.name === ayurvedaNom
                  ? irAyurveda
                  : d.name === tcmNom
                  ? irTcm
                  : d.name === fisiologiaNom
                  ? irFisiologia
                  : d.name === nutricionNom
                  ? irNutricion
                  : d.name === cabalaNom
                  ? irCabala
                  : d.name === culturaNom
                  ? irCultura
                  : () => navigate(d.link);
                // Tooltip al pasar el ratón sobre un círculo bloqueado.
                const tooltipLabel =
                  d.name === astrologiaNom
                    ? "Haz clic en Astrología para empezar tu mapa."
                    : d.name === neuropsicologiaNom && clickable
                    ? "Desbloquea Psicología para empezar la 2ª disciplina."
                    : d.name === ayurvedaNom && clickable
                    ? "Desbloquea Ayurveda para empezar la 3ª disciplina."
                    : d.name === tcmNom && clickable
                    ? "Desbloquea Medicina China para empezar la 4ª disciplina."
                    : d.name === fisiologiaNom && clickable
                    ? "Desbloquea Fisiología para empezar la 5ª disciplina."
                    : d.name === nutricionNom && clickable
                    ? "Desbloquea Nutrición para empezar la 6ª disciplina."
                    : d.name === cabalaNom && clickable
                    ? "Desbloquea Cábala para empezar la 7ª disciplina."
                    : d.name === culturaNom && clickable
                    ? "Desbloquea Cultura para empezar la 8ª disciplina."
                    : "El Mapa se hace en orden — por favor, completa la disciplina anterior.";

                const disciplinaCircle = (
                  <Box
                    onClick={clickable ? handleClick : undefined}
                    cursor={clickable ? "pointer" : "not-allowed"}
                    w="100%"
                    h="100%"
                    borderRadius="full"
                    overflow="visible"
                    position="relative"
                    opacity={abierta ? 1 : 0.5}
                    animation={`${popIn} 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay} both`}
                    filter={abierta ? "none" : "grayscale(0.35)"}
                    transition="transform 0.2s ease, filter 0.2s ease, opacity 0.2s ease"
                    _hover={abierta ? { transform: "scale(1.06)" } : { opacity: 0.75 }}
                  >
                    {/* Círculo principal con icono */}
                    <Box
                      w="100%"
                      h="100%"
                      borderRadius="full"
                      overflow="hidden"
                      border={`4px solid ${abierta ? d.txt : "#ffffff"}`}
                      boxShadow={abierta
                        ? `0 0 22px rgba(255,255,255,0.55), 0 0 50px rgba(255,255,255,0.3), 0 0 90px rgba(180,255,245,0.28), 0 0 60px ${d.txt}88, 0 2px 30px ${d.txt}55`
                        : `0 0 14px rgba(255,255,255,0.22), 0 0 32px rgba(255,255,255,0.12), 0 0 40px ${d.txt}55, 0 2px 24px ${d.txt}33`}
                      bg={hasBg ? "transparent" : d.bg}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      position="relative"
                    >
                      {hasBg && <DisciplinaBgLayer nom={d.name} borderRadius="full" />}
                      <Box position="relative" zIndex={1} display="flex" alignItems="center" justifyContent="center">
                        <Icon size={{ base: iconSize ?? "44px", md: iconSize ?? "60px" }} />
                      </Box>

                      {/* Overlay candado en las disciplinas bloqueadas */}
                      {!abierta && (
                        <Box
                          position="absolute"
                          inset={0}
                          bg="rgba(0,40,40,0.55)"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          sx={{ backdropFilter: "blur(2px)" }}
                          zIndex={2}
                        >
                          <Box
                            as="svg"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 -960 960 960"
                            w={{ base: "30px", md: "42px", lg: "50px" }}
                            h={{ base: "30px", md: "42px", lg: "50px" }}
                            fill="#ffffff"
                            style={{ filter: "drop-shadow(0 0 8px rgba(255,255,255,0.6)) drop-shadow(0 0 16px rgba(0,0,0,0.4))" }}
                          >
                            <path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm0-80h480v-400H240v400Zm296.5-143.5Q560-327 560-360t-23.5-56.5Q513-440 480-440t-56.5 23.5Q400-393 400-360t23.5 56.5Q447-280 480-280t56.5-23.5ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80ZM240-160v-400 400Z" />
                          </Box>
                        </Box>
                      )}
                    </Box>

                    {/* Badge con número */}
                    <Box
                      position="absolute"
                      top="-8px"
                      right="-8px"
                      w={numberSize}
                      h={numberSize}
                      borderRadius="full"
                      bg="white"
                      border={`2px solid ${badgeColor}`}
                      boxShadow={`0 2px 6px rgba(0,0,0,0.2)`}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      opacity={1}
                    >
                      <Text
                        color={badgeColor}
                        fontSize={{ base: "sm", md: "md", lg: "lg" }}
                        fontWeight="800"
                        fontFamily="'EB Garamond', serif"
                        lineHeight="1"
                      >
                        {number}
                      </Text>
                    </Box>
                  </Box>
                );

                return (
                  <Box
                    key={index}
                    position="absolute"
                    transform={`translate(${x}px, ${y}px)`}
                    w={circleSize}
                    h={circleSize}
                  >
                    {abierta ? (
                      disciplinaCircle
                    ) : (
                      <Tooltip
                        label={tooltipLabel}
                        placement="top"
                        hasArrow
                        bg="rgba(0,40,40,0.95)"
                        color="white"
                        fontFamily="'EB Garamond', serif"
                        fontSize="sm"
                        letterSpacing="0.03em"
                        px={4}
                        py={3}
                        maxW="260px"
                        textAlign="center"
                        borderRadius="lg"
                        boxShadow="0 0 18px rgba(255,255,255,0.25), 0 6px 20px rgba(0,0,0,0.35)"
                        openDelay={150}
                      >
                        {disciplinaCircle}
                      </Tooltip>
                    )}
                  </Box>
                );
              })}
            </Box>

            {/* Continuar por dónde lo dejé — móvil: debajo del mandala */}
            {continuarBtn && (
              <Box display={{ base: "flex", md: "none" }} justifyContent="center" mt={8} w="100%">
                {continuarBtn}
              </Box>
            )}
          </Flex>
        ) : (
          // Carga: mientras espera, la animación del mandala de LIFE (misma que
          // en Inicio y El Mapa), centrada sobre el turquesa.
          <Flex flex="1" w="100%" minH="80vh" align="center" justify="center">
            <Box transform={{ base: "scale(1.4)", md: "scale(1.9)" }}>
              <LifeLoader color="#ffffff" />
            </Box>
          </Flex>
        )}
      </Box>

      <SiteFooter />

      <PagoExitoModal isOpen={pagoExitoOpen} onAceptar={() => { setPagoExitoOpen(false); navigate("/metodo/astrologia"); }} />
      <PagoExitoModal
        isOpen={pagoPsicoExitoOpen}
        onAceptar={() => setPagoPsicoExitoOpen(false)}
        titulo="Pago de Psicología realizado"
        mensaje="Ya puedes empezar tu Línea de Vida."
        nom={neuropsicologiaNom}
        txtColor={neuropsicologiaTxt}
        bgColor={neuropsicologiaBg}
      />
      <PagoMetodoModal
        isOpen={pagoOpen}
        onClose={() => { setPagoOpen(false); setPagoError(null); }}
        onPagar={pagarMetodo}
        loading={pagoLoading}
        error={pagoError}
      />
      <PagoPsicologiaModal
        isOpen={pagoPsicoOpen}
        onClose={() => { setPagoPsicoOpen(false); setPagoPsicoError(null); }}
        onPagar={pagarPsicologia}
        loading={pagoPsicoLoading}
        error={pagoPsicoError}
      />
      <PagoExitoModal
        isOpen={pagoAyurExitoOpen}
        onAceptar={() => setPagoAyurExitoOpen(false)}
        titulo="Pago de Ayurveda realizado"
        mensaje="Ya puedes empezar la 3ª disciplina del Mapa."
        nom={ayurvedaNom}
        txtColor={ayurvedaTxt}
        bgColor={ayurvedaBg}
      />
      <PagoAyurvedaModal
        isOpen={pagoAyurOpen}
        onClose={() => { setPagoAyurOpen(false); setPagoAyurError(null); }}
        onPagar={pagarAyurveda}
        loading={pagoAyurLoading}
        error={pagoAyurError}
      />
      <PagoExitoModal
        isOpen={pagoTcmExitoOpen}
        onAceptar={() => setPagoTcmExitoOpen(false)}
        titulo="Pago de Medicina China realizado"
        mensaje="Ya puedes empezar la 4ª disciplina del Mapa."
        nom={tcmNom}
        txtColor={tcmTxt}
        bgColor={tcmBg}
      />
      <PagoTcmModal
        isOpen={pagoTcmOpen}
        onClose={() => { setPagoTcmOpen(false); setPagoTcmError(null); }}
        onPagar={pagarTcm}
        loading={pagoTcmLoading}
        error={pagoTcmError}
      />
      <PagoExitoModal
        isOpen={pagoFisioExitoOpen}
        onAceptar={() => setPagoFisioExitoOpen(false)}
        titulo="Pago de Fisiología realizado"
        mensaje="Ya puedes empezar la 5ª disciplina del Mapa."
        nom={fisiologiaNom}
        txtColor={fisiologiaTxt}
        bgColor={fisiologiaBg}
      />
      <PagoFisiologiaModal
        isOpen={pagoFisioOpen}
        onClose={() => { setPagoFisioOpen(false); setPagoFisioError(null); }}
        onPagar={pagarFisiologia}
        loading={pagoFisioLoading}
        error={pagoFisioError}
      />
      <PagoExitoModal
        isOpen={pagoNutriExitoOpen}
        onAceptar={() => setPagoNutriExitoOpen(false)}
        titulo="Pago de Nutrición realizado"
        mensaje="Ya puedes empezar la 6ª disciplina del Mapa."
        nom={nutricionNom}
        txtColor={nutricionTxt}
        bgColor={nutricionBg}
      />
      <PagoNutricionModal
        isOpen={pagoNutriOpen}
        onClose={() => { setPagoNutriOpen(false); setPagoNutriError(null); }}
        onPagar={pagarNutricion}
        loading={pagoNutriLoading}
        error={pagoNutriError}
      />
      <PagoExitoModal
        isOpen={pagoCabalaExitoOpen}
        onAceptar={() => setPagoCabalaExitoOpen(false)}
        titulo="Pago de Cábala realizado"
        mensaje="Ya puedes empezar la 7ª disciplina del Mapa."
        nom={cabalaNom}
        txtColor={cabalaTxt}
        bgColor={cabalaBg}
      />
      <PagoCabalaModal
        isOpen={pagoCabalaOpen}
        onClose={() => { setPagoCabalaOpen(false); setPagoCabalaError(null); }}
        onPagar={pagarCabala}
        loading={pagoCabalaLoading}
        error={pagoCabalaError}
      />
      <PagoExitoModal
        isOpen={pagoCulturaExitoOpen}
        onAceptar={() => setPagoCulturaExitoOpen(false)}
        titulo="Pago de Cultura realizado"
        mensaje="Ya puedes empezar la 8ª disciplina del Mapa."
        nom={culturaNom}
        txtColor={culturaTxt}
        bgColor={culturaBg}
      />
      <PagoCulturaModal
        isOpen={pagoCulturaOpen}
        onClose={() => { setPagoCulturaOpen(false); setPagoCulturaError(null); }}
        onPagar={pagarCultura}
        loading={pagoCulturaLoading}
        error={pagoCulturaError}
      />
      {verificandoPago && <SpinnerTurquesa />}
    </Box>
  );
};

export default Home;

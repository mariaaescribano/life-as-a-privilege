import React, { lazy, Suspense, useEffect } from "react";
import { Box } from "@chakra-ui/react";
// La raíz ahora es la landing de bienvenida (elegir proyecto); la portada de
// Life as a Privilege sigue viva y sin cambios en /welcome.
// La landing de dos proyectos está aparcada (ver la nota en la ruta «/»).
// import Landing from "./app/web/Landing";
import Welcome from "./app/web/Welcome";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { cargarTextosMetodo } from "./i18n";

/**
 * Igual que `lazy()`, pero además se trae los textos del RECORRIDO
 * (`metodo.*`: 1.035 claves, ~100 KB) antes de dar por buena la página.
 *
 * Esos textos ya no viajan en el paquete de entrada —que descarga TODO el
 * mundo, también quien solo entra a leer «Quién soy»—, sino en un archivo
 * aparte. Las DOS descargas salen a la vez, así que no se pierde ni un viaje:
 * mientras baja la página, baja el diccionario. Y como la ruta no se pinta
 * hasta que las dos han llegado, no hay ni un fotograma con claves peladas.
 *
 * Quién la lleva puesta: /metodo/* y todo lo que use sus componentes (la
 * galería de ilustraciones, el mandala de /home, las presentaciones /d/…).
 * Se calcula siguiendo los imports, no a ojo: si una página nueva usa una
 * clave `metodo.*`, tiene que declararse aquí con `lazyConMetodo`.
 */
const lazyConMetodo = <T extends { default: React.ComponentType<any> }>(
  carga: () => Promise<T>,
) => lazy(() => Promise.all([carga(), cargarTextosMetodo()]).then(([modulo]) => modulo));
const LogIn = lazy(() => import("./app/auth/LogIn"));
const SignIn = lazy(() => import("./app/auth/SignIn"));
const GoogleAuthCallback = lazy(() => import("./app/auth/GoogleAuthCallback"));
const Home = lazyConMetodo(() => import("./app/home/Home"));
const Diario = lazy(() => import("./app/home/Diario"));
const AprendizajeHome = lazy(() => import("./app/aprendizaje/AprendizajeHome").then((m) => ({ default: m.AprendizajeHome })));
const ModulosPage = lazyConMetodo(() => import("./app/aprendizaje/ModulosPage"));
const VideoLessonPage = lazy(() => import("./app/aprendizaje/VideoLessonPage"));
const CursosModalidad = lazyConMetodo(() => import("./app/aprendizaje/CursosModalidad"));
const TextLessonPage = lazyConMetodo(() => import("./app/aprendizaje/TextLessonPage"));
const HerbarioPage = lazyConMetodo(() => import("./app/aprendizaje/HerbarioPage"));
const AlimentosPage = lazyConMetodo(() => import("./app/aprendizaje/AlimentosPage"));
const CalcularNecesidadesPage = lazyConMetodo(() => import("./app/aprendizaje/CalcularNecesidadesPage"));
const TestDoshasPage = lazyConMetodo(() => import("./app/aprendizaje/TestDoshasPage"));
const EspacioHome = lazy(() => import("./app/espacio/main/EspacioHome"));
const ExpandablePage = lazyConMetodo(() => import("./app/espacio/main/ThemePreguntas"));
const QuienSoy = lazy(() => import("./app/web/QuienSoy"));
const Productos = lazy(() => import("./app/web/Productos"));
const LibrosPage = lazy(() => import("./app/web/LibrosPage"));
const DescargarLibroPage = lazy(() => import("./app/web/DescargarLibroPage"));
const Contacto = lazy(() => import("./app/web/Contacto"));
const CumpleRegalo = lazy(() => import("./app/web/CumpleRegalo"));
const ContactoFormulario = lazy(() => import("./app/web/ContactoFormulario"));
const Opiniones = lazy(() => import("./app/web/Opiniones"));
const ElMetodo = lazy(() => import("./app/web/ElMetodo"));
const MaterialesGratuitos = lazy(() => import("./app/web/MaterialesGratuitos"));
// const ProgramasPage = lazy(() => import("./app/web/ProgramasPage"));
// const ProgramaPage = lazyConMetodo(() => import("./app/web/ProgramaPage"));
// const ProgramaPodcastPage = lazy(() => import("./app/web/ProgramaPodcastPage"));
const Ilustraciones = lazyConMetodo(() => import("./app/web/Ilustraciones"));
const DisciplinaPortada = lazy(() => import("./app/web/DisciplinaPortada"));
// Vídeos: apartado aparcado (la página y su panel de admin siguen en el repo).
// const VideosPage = lazyConMetodo(() => import("./app/web/VideosPage"));
const PresentacionDisciplina = lazyConMetodo(() => import("./app/web/PresentacionDisciplina"));
const CheckoutMetodo = lazy(() => import("./app/web/CheckoutMetodo"));
const MetodoAstrologia = lazyConMetodo(() => import("./app/metodo/MetodoAstrologia"));
const MetodoAstrologiaCartaAstral = lazyConMetodo(() => import("./app/metodo/MetodoAstrologiaCartaAstral"));
const MetodoAstrologiaPlanetas = lazyConMetodo(() => import("./app/metodo/MetodoAstrologiaPlanetas"));
const MetodoAstrologiaProfundizar = lazyConMetodo(() => import("./app/metodo/MetodoAstrologiaProfundizar"));
const MetodoAstrologiaSolAscLuna = lazyConMetodo(() => import("./app/metodo/MetodoAstrologiaSolAscLuna"));
const MetodoAstrologiaLectura = lazyConMetodo(() => import("./app/metodo/MetodoAstrologiaLectura"));
const MetodoAstrologiaCasas = lazyConMetodo(() => import("./app/metodo/MetodoAstrologiaCasas"));
const MetodoAstrologiaAspectos = lazyConMetodo(() => import("./app/metodo/MetodoAstrologiaAspectos"));
const MetodoAstrologiaPdf = lazyConMetodo(() => import("./app/metodo/MetodoAstrologiaPdf"));
const MetodoAstrologiaLlamada = lazyConMetodo(() => import("./app/metodo/MetodoAstrologiaLlamada"));
const MetodoAstrologiaCursos = lazyConMetodo(() => import("./app/metodo/MetodoAstrologiaCursos"));
const AdminHome = lazy(() => import("./app/admin/AdminHome"));
const AdminLogin = lazy(() => import("./app/admin/AdminLogin"));
const AdminUsuarios = lazyConMetodo(() => import("./app/admin/AdminUsuarios"));
const AdminTodosUsuarios = lazy(() => import("./app/admin/AdminTodosUsuarios"));
const AdminAstrologiaEditor = lazyConMetodo(() => import("./app/admin/AdminAstrologiaEditor"));
const AdminPsicologiaLectura = lazyConMetodo(() => import("./app/admin/AdminPsicologiaLectura"));
const AdminAyurvedaLectura = lazyConMetodo(() => import("./app/admin/AdminAyurvedaLectura"));
const AdminEditorPlaceholder = lazy(() => import("./app/admin/AdminEditorPlaceholder"));
const AdminCursos = lazy(() => import("./app/admin/AdminCursos"));
const AdminCursoEditor = lazy(() => import("./app/admin/AdminCursoEditor"));
const AdminAstrologiaTextos = lazy(() => import("./app/admin/AdminAstrologiaTextos"));
const AdminAccesos = lazy(() => import("./app/admin/AdminAccesos"));
// const AdminEstudio = lazy(() => import("./app/admin/AdminEstudio"));
const AdminVideos = lazy(() => import("./app/admin/AdminVideos"));
const AdminSuscriptores = lazy(() => import("./app/admin/AdminSuscriptores"));
const AdminDiario = lazy(() => import("./app/admin/AdminDiario"));
const AdminActividad = lazy(() => import("./app/admin/AdminActividad"));
const NoEncontrada = lazy(() => import("./app/web/NoEncontrada"));
const MetodoPsicologia = lazyConMetodo(() => import("./app/metodo/MetodoPsicologia"));
const MetodoPsicologiaProblema = lazyConMetodo(() => import("./app/metodo/MetodoPsicologiaProblema"));
const MetodoPsicologiaNecesidades = lazyConMetodo(() => import("./app/metodo/MetodoPsicologiaNecesidades"));
const MetodoPsicologiaAce = lazyConMetodo(() => import("./app/metodo/MetodoPsicologiaAce"));
const MetodoPsicologiaAceResultado = lazyConMetodo(() => import("./app/metodo/MetodoPsicologiaAceResultado"));
const MetodoPsicologiaDes = lazyConMetodo(() => import("./app/metodo/MetodoPsicologiaDes"));
const MetodoPsicologiaDesResultado = lazyConMetodo(() => import("./app/metodo/MetodoPsicologiaDesResultado"));
const MetodoPsicologiaCerebro = lazyConMetodo(() => import("./app/metodo/MetodoPsicologiaCerebro"));
const MetodoPsicologiaExperiencia = lazyConMetodo(() => import("./app/metodo/MetodoPsicologiaExperiencia"));
const MetodoPsicologiaFamilia = lazyConMetodo(() => import("./app/metodo/MetodoPsicologiaFamilia"));
const MetodoPsicologiaGenograma = lazyConMetodo(() => import("./app/metodo/MetodoPsicologiaGenograma"));
const MetodoPsicologiaHuellas = lazyConMetodo(() => import("./app/metodo/MetodoPsicologiaHuellas"));
const MetodoPsicologiaNudos = lazyConMetodo(() => import("./app/metodo/MetodoPsicologiaNudos"));
const MetodoPsicologiaHuellasNudos = lazyConMetodo(() => import("./app/metodo/MetodoPsicologiaHuellasNudos"));
const MetodoPsicologiaHeridasLista = lazyConMetodo(() => import("./app/metodo/MetodoPsicologiaHeridasLista"));
const MetodoPsicologiaIntegracion = lazyConMetodo(() => import("./app/metodo/MetodoPsicologiaIntegracion"));
const MetodoPsicologiaMapa = lazyConMetodo(() => import("./app/metodo/MetodoPsicologiaMapa"));
const MetodoPsicologiaRegulacion = lazyConMetodo(() => import("./app/metodo/MetodoPsicologiaRegulacion"));
const MetodoPsicologiaDones = lazyConMetodo(() => import("./app/metodo/MetodoPsicologiaDones"));
const MetodoPsicologiaDonesEspejo = lazyConMetodo(() => import("./app/metodo/MetodoPsicologiaDonesEspejo"));
const MetodoPsicologiaMiedos = lazyConMetodo(() => import("./app/metodo/MetodoPsicologiaMiedos"));
const MetodoPsicologiaMiedosPreguntas = lazyConMetodo(() => import("./app/metodo/MetodoPsicologiaMiedosPreguntas"));
const MetodoPsicologiaCompromiso = lazyConMetodo(() => import("./app/metodo/MetodoPsicologiaCompromiso"));
const MetodoPsicologiaBrujula = lazyConMetodo(() => import("./app/metodo/MetodoPsicologiaBrujula"));
const MetodoPsicologiaSintesis = lazyConMetodo(() => import("./app/metodo/MetodoPsicologiaSintesis"));
const MetodoPsicologiaEmociones = lazyConMetodo(() => import("./app/metodo/MetodoPsicologiaEmociones"));
const MetodoPsicologiaCursos = lazyConMetodo(() => import("./app/metodo/MetodoPsicologiaCursos"));
const MetodoAyurveda = lazyConMetodo(() => import("./app/metodo/MetodoAyurveda"));
const MetodoAyurvedaTest = lazyConMetodo(() => import("./app/metodo/MetodoAyurvedaTest"));
const MetodoAyurvedaResultado = lazyConMetodo(() => import("./app/metodo/MetodoAyurvedaResultado"));
const MetodoAyurvedaTarjetas = lazyConMetodo(() => import("./app/metodo/MetodoAyurvedaTarjetas"));
const MetodoAyurvedaDoshaIntro = lazyConMetodo(() => import("./app/metodo/MetodoAyurvedaDoshaIntro"));
const MetodoAyurvedaDoshaDescubre = lazyConMetodo(() => import("./app/metodo/MetodoAyurvedaDoshaDescubre"));
const MetodoAyurvedaDoshaCuerpo = lazyConMetodo(() => import("./app/metodo/MetodoAyurvedaDoshaCuerpo"));
const MetodoAyurvedaDoshaDesequilibrio = lazyConMetodo(() => import("./app/metodo/MetodoAyurvedaDoshaDesequilibrio"));
const MetodoAyurvedaDoshaCuidarte = lazyConMetodo(() => import("./app/metodo/MetodoAyurvedaDoshaCuidarte"));
const MetodoAyurvedaDoshaEstilo = lazyConMetodo(() => import("./app/metodo/MetodoAyurvedaDoshaEstilo"));
const MetodoAyurvedaDoshaDia = lazyConMetodo(() => import("./app/metodo/MetodoAyurvedaDoshaDia"));
const MetodoAyurvedaDoshaPranayama = lazyConMetodo(() => import("./app/metodo/MetodoAyurvedaDoshaPranayama"));
const MetodoAyurvedaDoshaCursos = lazyConMetodo(() => import("./app/metodo/MetodoAyurvedaDoshaCursos"));
const MetodoAyurvedaChakras = lazyConMetodo(() => import("./app/metodo/MetodoAyurvedaChakras"));
const MetodoAyurvedaDoshaRecorrido = lazyConMetodo(() => import("./app/metodo/MetodoAyurvedaDoshaRecorrido"));
const MetodoTcm = lazyConMetodo(() => import("./app/metodo/MetodoTcm"));
const MetodoTcmElementos = lazyConMetodo(() => import("./app/metodo/MetodoTcmElementos"));
const MetodoTcmConstitucion = lazyConMetodo(() => import("./app/metodo/MetodoTcmConstitucion"));
const MetodoTcmCiclos = lazyConMetodo(() => import("./app/metodo/MetodoTcmCiclos"));
const MetodoTcmDiagnostico = lazyConMetodo(() => import("./app/metodo/MetodoTcmDiagnostico"));
const MetodoTcmLengua = lazyConMetodo(() => import("./app/metodo/MetodoTcmLengua"));
const MetodoTcmLenguaLeer = lazyConMetodo(() => import("./app/metodo/MetodoTcmLenguaLeer"));
const MetodoTcmTaoismo = lazyConMetodo(() => import("./app/metodo/MetodoTcmTaoismo"));
const MetodoTcmRecetas = lazyConMetodo(() => import("./app/metodo/MetodoTcmRecetas"));
const MetodoTcmQigong = lazyConMetodo(() => import("./app/metodo/MetodoTcmQigong"));
const MetodoTcmCursos = lazyConMetodo(() => import("./app/metodo/MetodoTcmCursos"));
const MetodoTcmApuntes = lazyConMetodo(() => import("./app/metodo/MetodoTcmApuntes"));
const MetodoFisiologia = lazyConMetodo(() => import("./app/metodo/MetodoFisiologia"));
const MetodoFisiologiaNiveles = lazyConMetodo(() => import("./app/metodo/MetodoFisiologiaNiveles"));
const MetodoFisiologiaSonrisa = lazyConMetodo(() => import("./app/metodo/MetodoFisiologiaSonrisa"));
const MetodoFisiologiaCursos = lazyConMetodo(() => import("./app/metodo/MetodoFisiologiaCursos"));
const MetodoFisiologiaParticulas = lazyConMetodo(() => import("./app/metodo/MetodoFisiologiaParticulas"));
const MetodoFisiologiaAtomos = lazyConMetodo(() => import("./app/metodo/MetodoFisiologiaAtomos"));
const MetodoFisiologiaMoleculas = lazyConMetodo(() => import("./app/metodo/MetodoFisiologiaMoleculas"));
const MetodoFisiologiaMacromoleculas = lazyConMetodo(() => import("./app/metodo/MetodoFisiologiaMacromoleculas"));
const MetodoFisiologiaEstructuras = lazyConMetodo(() => import("./app/metodo/MetodoFisiologiaEstructuras"));
const MetodoFisiologiaCelula = lazyConMetodo(() => import("./app/metodo/MetodoFisiologiaCelula"));
const MetodoFisiologiaTodasCelulas = lazyConMetodo(() => import("./app/metodo/MetodoFisiologiaTodasCelulas"));
const MetodoFisiologiaSistemas = lazyConMetodo(() => import("./app/metodo/MetodoFisiologiaSistemas"));
const MetodoFisiologiaOrganismo = lazyConMetodo(() => import("./app/metodo/MetodoFisiologiaOrganismo"));
const MetodoFisiologiaProfundiza = lazyConMetodo(() => import("./app/metodo/MetodoFisiologiaProfundiza"));
const MetodoFisiologiaTema = lazyConMetodo(() => import("./app/metodo/MetodoFisiologiaTema"));
const MetodoNutricion = lazyConMetodo(() => import("./app/metodo/MetodoNutricion"));
const MetodoNutricionMacronutrientes = lazyConMetodo(() => import("./app/metodo/MetodoNutricionMacronutrientes"));
const MetodoNutricionMicronutrientes = lazyConMetodo(() => import("./app/metodo/MetodoNutricionMicronutrientes"));
const MetodoNutricionPlato = lazyConMetodo(() => import("./app/metodo/MetodoNutricionPlato"));
const MetodoNutricionCalorias = lazyConMetodo(() => import("./app/metodo/MetodoNutricionCalorias"));
const MetodoNutricionPrediabetes = lazyConMetodo(() => import("./app/metodo/MetodoNutricionPrediabetes"));
const MetodoNutricionDia = lazyConMetodo(() => import("./app/metodo/MetodoNutricionDia"));
const MetodoNutricionMacros = lazyConMetodo(() => import("./app/metodo/MetodoNutricionMacros"));
const MetodoNutricionMitos = lazyConMetodo(() => import("./app/metodo/MetodoNutricionMitos"));
const MetodoNutricionUltraprocesados = lazyConMetodo(() => import("./app/metodo/MetodoNutricionUltraprocesados"));
const MetodoNutricionOrigen = lazyConMetodo(() => import("./app/metodo/MetodoNutricionOrigen"));
const MetodoNutricionNutriente = lazyConMetodo(() => import("./app/metodo/MetodoNutricionNutriente"));
const MetodoNutricionMicrobiota = lazyConMetodo(() => import("./app/metodo/MetodoNutricionMicrobiota"));
const MetodoNutricionHambre = lazyConMetodo(() => import("./app/metodo/MetodoNutricionHambre"));
const MetodoNutricionAlimentos = lazyConMetodo(() => import("./app/metodo/MetodoNutricionAlimentos"));
const MetodoNutricionAlimento = lazyConMetodo(() => import("./app/metodo/MetodoNutricionAlimento"));
const MetodoNutricionCursos = lazyConMetodo(() => import("./app/metodo/MetodoNutricionCursos"));
const MetodoCabala = lazyConMetodo(() => import("./app/metodo/MetodoCabala"));
const MetodoCabalaArbol = lazyConMetodo(() => import("./app/metodo/MetodoCabalaArbol"));
const MetodoCabalaSefira = lazyConMetodo(() => import("./app/metodo/MetodoCabalaSefira"));
const MetodoCabalaDiagnostico = lazyConMetodo(() => import("./app/metodo/MetodoCabalaDiagnostico"));
const MetodoCabalaSenderos = lazyConMetodo(() => import("./app/metodo/MetodoCabalaSenderos"));
const MetodoCabalaSendero = lazyConMetodo(() => import("./app/metodo/MetodoCabalaSendero"));
const MetodoCabalaSenderosDiagnostico = lazyConMetodo(() => import("./app/metodo/MetodoCabalaSenderosDiagnostico"));
const MetodoCabalaFinal = lazyConMetodo(() => import("./app/metodo/MetodoCabalaFinal"));
// APARCADO · «10 días con tus dimensiones». La página y sus textos siguen en
// el repo intactos; solo está descolgada del recorrido. Para volver a ponerla:
// descomentar esto, su <Route> más abajo, su paso en IndiceCabala, la página
// `dias` de CABALA_PAG y los botones de Diagnóstico final ↔ Cursos.
// const MetodoCabalaDiezDias = lazyConMetodo(() => import("./app/metodo/MetodoCabalaDiezDias"));
const MetodoCabalaCursos = lazyConMetodo(() => import("./app/metodo/MetodoCabalaCursos"));
const MetodoCultura = lazyConMetodo(() => import("./app/metodo/MetodoCultura"));
const MetodoCulturaHistorias = lazyConMetodo(() => import("./app/metodo/MetodoCulturaHistorias"));
const MetodoCulturaApuntes = lazyConMetodo(() => import("./app/metodo/MetodoCulturaApuntes"));
const MetodoCulturaHistoria = lazyConMetodo(() => import("./app/metodo/MetodoCulturaHistoria"));
const MetodoCulturaHistoriaEra = lazyConMetodo(() => import("./app/metodo/MetodoCulturaHistoriaEra"));
const AyurvedaMiEspacio = lazyConMetodo(() => import("./app/web/AyurvedaMiEspacio"));
const RecursosPage = lazy(() => import("./app/recursos/RecursosPage"));
// Estudio estadístico sobre astrología: APARCADO (ver las rutas, más abajo).
// const EstudioHome = lazy(() => import("./app/estudio/EstudioHome"));
// const EstudioDatos = lazy(() => import("./app/estudio/EstudioDatos"));
// const EstudioPreguntas = lazy(() => import("./app/estudio/EstudioPreguntas"));
// const EstudioResultados = lazy(() => import("./app/estudio/EstudioResultados"));
// const EstudioEstadisticas = lazy(() => import("./app/estudio/EstudioEstadisticas"));
const UserAccount = lazy(() => import("./app/user/UserAccount"));
const TCMTest1 = lazyConMetodo(() => import("./components/espacio/components/TCMTest1"));
const TCMTest2 = lazyConMetodo(() => import("./components/espacio/components/TCMTest2"));
const TCMTest3 = lazyConMetodo(() => import("./components/espacio/components/TCMTest3"));
const FisiologiaEspacio = lazy(() => import("./components/espacio/pages/FisiologiaEspacio"));
const FitoterapiaEspacio = lazy(() => import("./components/espacio/pages/FitoterapiaEspacio"));
const CelulasCuerpoPage = lazyConMetodo(() => import("./app/espacio/CelulasCuerpoPage"));
import { ExitIntentSubscribeModal } from "./components/global/ExitIntentSubscribeModal";
import { MiniDiario } from "./components/global/MiniDiario";
const RecuperarPassword = lazy(() => import("./app/auth/RecuperarPassword"));
const AvisoLegal = lazy(() => import("./app/legal/AvisoLegal"));
const Privacidad = lazy(() => import("./app/legal/Privacidad"));
const Cookies = lazy(() => import("./app/legal/Cookies"));
const Terminos = lazy(() => import("./app/legal/Terminos"));
import AvisoCookies from "./components/global/AvisoCookies";
// Solo se pinta si la admin ha «entrado como» otra persona (api/suplantar.ts).
import BarraSuplantacion from "./components/global/BarraSuplantacion";
import { MigaDelMapa } from "./components/global/VolverAlMapa";
import { GuardiaPagoRecorrido } from "./components/global/GuardiaPagoRecorrido";
import { RegistroActividad } from "./components/global/RegistroActividad";
// Pantalla de espera mientras se descarga el trozo de código de cada página.
// Va EAGER a propósito: es justo lo que hay que poder pintar antes de que llegue
// lo demás.
import { LifeLoading } from "./components/global/LifeLoading";
import { aplicarConsentimientoGuardado } from "./components/global/cookies";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

// Consentimiento de salud (art. 9 RGPD) para quien entra al recorrido sin haber
// pasado por la casilla del pago. Lazy: no tiene que viajar en el paquete de entrada.
const PuertaConsentimientoSalud = lazy(() => import("./components/global/PuertaConsentimientoSalud"));

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const userId = localStorage.getItem("userId");
  if (!userId) return <Navigate to="/welcome" replace />;
  return (
    <>
      {children}
      {pathname.startsWith("/metodo") && (
        <Suspense fallback={null}>
          <PuertaConsentimientoSalud />
        </Suspense>
      )}
    </>
  );
}

// Todo el panel de administración se ve un 20% más grande. Vive AQUÍ, en el
// envoltorio de las rutas /admin, para que no pueda escaparse al resto de la web.
const ADMIN_ZOOM = 1.2;

/** Envoltorio de TODAS las páginas de /admin: exige sesión (PrivateRoute) y las
 *  agranda.
 *
 *  Se usa `zoom` y no `transform: scale()` porque zoom RECALCULA el layout: los
 *  anchos siguen siendo los reales y no aparece scroll lateral. Con `scale` la
 *  página ocuparía su hueco original y se saldría por los lados.
 *
 *  Dos detalles del zoom:
 *   · `100vh` NO se ajusta con él, así que la altura mínima de la página se
 *     dividiría mal y saldría scroll vertical de sobra aunque no haga falta.
 *     Se compensa en el hijo directo (la raíz de cada página admin).
 *   · Los modales de Chakra se pintan en un portal colgado de <body>, o sea
 *     FUERA de este contenedor, así que esos no se agrandan. */
function AdminRoute({ children }: { children: React.ReactNode }) {
  return (
    <PrivateRoute>
      <Box
        sx={{
          zoom: ADMIN_ZOOM,
          // La raíz de cada página admin lleva `minH="100vh"`. Los `vh` se miden
          // contra la pantalla SIN escalar, así que con el zoom esa altura se
          // vuelve un 20% mayor que la ventana y aparece scroll aunque la página
          // esté vacía. Aquí se le devuelve la altura que le toca; el resto de su
          // maquetación (flex column, footer abajo) no se toca.
          "& > *": { minHeight: `calc(100vh / ${ADMIN_ZOOM})` },
        }}
      >
        {children}
      </Box>
    </PrivateRoute>
  );
}

export default function App()
{
  // Si en una visita anterior se aceptaron las cookies analíticas, se cargan
  // ahora. Si no, no se carga nada hasta que se pulse «Aceptar» en el aviso.
  useEffect(() => { aplicarConsentimientoGuardado(); }, []);

  return (
    <>
    <ScrollToTop />
    {/* Apunta por dónde va el usuario dentro del Mapa, para que los cursos y
        los materiales puedan devolverle exactamente a ese paso. */}
    <MigaDelMapa />
    {/* Sin pagar no se entra en una disciplina: vuelve a /home y sale su pago. */}
    <GuardiaPagoRecorrido />
    {/* Apunta qué recursos gratuitos abre quien tiene cuenta (para los emails). */}
    <RegistroActividad />
    <ExitIntentSubscribeModal />
    <MiniDiario />
    <AvisoCookies />
    <BarraSuplantacion />
    {/* Suspense: cada pagina viaja en su propio fichero y se descarga solo
        cuando se entra en ella. Mientras llega, se ve la pantalla de carga de la
        casa. Antes todo iba en un unico bundle de 6 MB que habia que bajar
        entero para ver la portada. */}
    <Suspense fallback={<LifeLoading />}>
    <Routes>
      {/* ── LA PORTADA ──
          Por ahora la casa enseña UN SOLO proyecto: «/» es la portada de Life
          as a Privilege (Welcome), como antes. `/welcome` se mantiene para que
          no se rompa ningún enlace antiguo: lleva a la misma página.

          La landing de DOS proyectos (elegir entre «Life as a Privilege» y
          «Nace una madre») está hecha y esperando en `app/web/Landing.tsx`,
          con sus textos en `i18n/textos/{es,en}/landing.ts` y sus datos en
          `data/landingProyectos.ts`. El día que «Nace una madre» exista, esto
          es todo lo que hay que hacer: descomentar el import de arriba y las
          dos líneas de aquí abajo, y quitar el `<Welcome />` de «/». */}
      {/* <Route path="/" element={<Landing />} /> */}
      <Route path="/" element={<Welcome />} />
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/logIn" element={<LogIn />} />
      <Route path="/signIn" element={<SignIn />} />
      <Route path="/recuperar" element={<RecuperarPassword />} />
      <Route path="/auth/google/callback" element={<GoogleAuthCallback />} />

      {/* ── Páginas legales (públicas, enlazadas desde el footer) ── */}
      <Route path="/aviso-legal" element={<AvisoLegal />} />
      <Route path="/privacidad" element={<Privacidad />} />
      <Route path="/cookies" element={<Cookies />} />
      <Route path="/terminos" element={<Terminos />} />
      <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
      {/* El diario de sus sesiones: lo escribe la admin en /admin/diario/:userId. */}
      <Route path="/diario" element={<PrivateRoute><Diario /></PrivateRoute>} />
      <Route path="/quienSoy" element={<QuienSoy />} />

      <Route path="/productos" element={<Productos />} />

      <Route path="/libros" element={<LibrosPage />} />
      <Route path="/libros/descargar" element={<DescargarLibroPage />} />
      <Route path="/contacto" element={<Contacto />} />
      {/* El botón del correo de cumpleaños. Sin PrivateRoute: la página misma
          manda a /logIn con ?next= para volver aquí con el enlace. */}
      <Route path="/cumple" element={<CumpleRegalo />} />
      {/* El formulario, en su propia página: se llega desde la tarjeta «Escríbeme». */}
      <Route path="/contacto/escribir" element={<ContactoFormulario />} />
      <Route path="/opiniones" element={<Opiniones />} />
      <Route path="/elMetodo" element={<ElMetodo />} />
      <Route path="/materiales" element={<MaterialesGratuitos />} />
      {/* Programas: aparcado, como «Vídeos». Las tres rutas y la caja de
          Materiales quedan comentadas; las páginas siguen en el repositorio. */}
      {/* <Route path="/programas" element={<ProgramasPage />} /> */}
      {/* <Route path="/programas/:slug" element={<ProgramaPage />} /> */}
      {/* <Route path="/programas/:slug/podcast" element={<ProgramaPodcastPage />} /> */}
      <Route path="/ilustraciones" element={<Ilustraciones />} />
      {/* La misma galería, filtrada por disciplina (puerta izquierda de su portada). */}
      <Route path="/ilustraciones/:disciplina" element={<Ilustraciones />} />
      {/* Portada COMÚN de una disciplina: Ilustraciones · Cursos · El Recorrido.
          Es a donde lleva pulsar una disciplina en la página de bienvenida. */}
      <Route path="/disciplina/:disciplina" element={<DisciplinaPortada />} />
      {/* Vídeos: shorts de YouTube, con su portada y su disciplina (los gestiona
          /admin/videos). Apartado aparcado: la ruta pública queda comentada. */}
      {/* <Route path="/videos" element={<VideosPage />} /> */}
      {/* Presentación pública de una disciplina — destino del QR de los carteles.
          Ruta corta porque va impresa: /d/cabala, /d/nutricion, … */}
      <Route path="/d/:disciplina" element={<PresentacionDisciplina />} />
      <Route path="/checkoutMetodo" element={<CheckoutMetodo />} />
      <Route path="/metodo/astrologia" element={<PrivateRoute><MetodoAstrologia /></PrivateRoute>} />
      <Route path="/metodo/astrologia/solascendenteluna" element={<PrivateRoute><MetodoAstrologiaSolAscLuna /></PrivateRoute>} />
      <Route path="/metodo/astrologia/cartaAstral" element={<PrivateRoute><MetodoAstrologiaCartaAstral /></PrivateRoute>} />
      <Route path="/metodo/astrologia/lectura" element={<PrivateRoute><MetodoAstrologiaLectura /></PrivateRoute>} />
      <Route path="/metodo/astrologia/planetas" element={<PrivateRoute><MetodoAstrologiaPlanetas /></PrivateRoute>} />
      <Route path="/metodo/astrologia/casas" element={<PrivateRoute><MetodoAstrologiaCasas /></PrivateRoute>} />
      <Route path="/metodo/astrologia/aspectos" element={<PrivateRoute><MetodoAstrologiaAspectos /></PrivateRoute>} />
      <Route path="/metodo/astrologia/pdf" element={<PrivateRoute><MetodoAstrologiaPdf /></PrivateRoute>} />
      <Route path="/metodo/astrologia/llamada" element={<PrivateRoute><MetodoAstrologiaLlamada /></PrivateRoute>} />
      <Route path="/metodo/astrologia/cursos" element={<PrivateRoute><MetodoAstrologiaCursos /></PrivateRoute>} />
      <Route path="/metodo/astrologia/:planetaKey/:campo" element={<PrivateRoute><MetodoAstrologiaProfundizar /></PrivateRoute>} />
      <Route path="/admin/login" element={<AdminRoute><AdminLogin /></AdminRoute>} />
      <Route path="/admin" element={<AdminRoute><AdminHome /></AdminRoute>} />
      <Route path="/admin/cursos" element={<AdminRoute><AdminCursos /></AdminRoute>} />
      <Route path="/admin/cursos/:id" element={<AdminRoute><AdminCursoEditor /></AdminRoute>} />
      <Route path="/admin/astrologia-textos" element={<AdminRoute><AdminAstrologiaTextos /></AdminRoute>} />
      {/* antes de /admin/:disciplina, que si no se traga «accesos» como slug */}
      <Route path="/admin/accesos" element={<AdminRoute><AdminAccesos /></AdminRoute>} />
      {/* Ojo al orden: «usuarios» tiene que ir ANTES de /admin/:disciplina o la
          ruta de disciplina se lo tragaría como si fuera una novena. */}
      <Route path="/admin/usuarios" element={<AdminRoute><AdminTodosUsuarios /></AdminRoute>} />
      {/* El panel del estudio, aparcado con el resto del estudio. */}
      {/* <Route path="/admin/estudio" element={<AdminRoute><AdminEstudio /></AdminRoute>} /> */}
      <Route path="/admin/videos" element={<AdminRoute><AdminVideos /></AdminRoute>} />
      {/* Antes de /admin/:disciplina, que si no se lo tragaría como disciplina. */}
      <Route path="/admin/suscriptores" element={<AdminRoute><AdminSuscriptores /></AdminRoute>} />
      {/* Antes de /admin/:disciplina/:userId, que si no se tragaria «diario» como disciplina. */}
      <Route path="/admin/diario/:userId" element={<AdminRoute><AdminDiario /></AdminRoute>} />
      <Route path="/admin/actividad/:userId" element={<AdminRoute><AdminActividad /></AdminRoute>} />
      <Route path="/admin/astrologia/:userId" element={<AdminRoute><AdminAstrologiaEditor /></AdminRoute>} />
      <Route path="/admin/psicologia/:userId" element={<AdminRoute><AdminPsicologiaLectura /></AdminRoute>} />
      <Route path="/admin/ayurveda/:userId" element={<AdminRoute><AdminAyurvedaLectura /></AdminRoute>} />
      <Route path="/admin/:disciplina/:userId" element={<AdminRoute><AdminEditorPlaceholder /></AdminRoute>} />
      <Route path="/admin/:disciplina" element={<AdminRoute><AdminUsuarios /></AdminRoute>} />
      <Route path="/metodo/psicologia" element={<PrivateRoute><MetodoPsicologia /></PrivateRoute>} />
      <Route path="/metodo/psicologia/:experienciaId/problema" element={<PrivateRoute><MetodoPsicologiaProblema /></PrivateRoute>} />
      <Route path="/metodo/psicologia/:experienciaId/necesidades" element={<PrivateRoute><MetodoPsicologiaNecesidades /></PrivateRoute>} />
      <Route path="/metodo/psicologia/:experienciaId/ace" element={<PrivateRoute><MetodoPsicologiaAce /></PrivateRoute>} />
      <Route path="/metodo/psicologia/:experienciaId/ace-resultado" element={<PrivateRoute><MetodoPsicologiaAceResultado /></PrivateRoute>} />
      <Route path="/metodo/psicologia/:experienciaId/des" element={<PrivateRoute><MetodoPsicologiaDes /></PrivateRoute>} />
      <Route path="/metodo/psicologia/:experienciaId/des-resultado" element={<PrivateRoute><MetodoPsicologiaDesResultado /></PrivateRoute>} />
      <Route path="/metodo/psicologia/:experienciaId/cerebro" element={<PrivateRoute><MetodoPsicologiaCerebro /></PrivateRoute>} />
      <Route path="/metodo/psicologia/:experienciaId/familia" element={<PrivateRoute><MetodoPsicologiaFamilia /></PrivateRoute>} />
      <Route path="/metodo/psicologia/:experienciaId/genograma" element={<PrivateRoute><MetodoPsicologiaGenograma /></PrivateRoute>} />
      <Route path="/metodo/psicologia/:experienciaId/huellas" element={<PrivateRoute><MetodoPsicologiaHuellas /></PrivateRoute>} />
      <Route path="/metodo/psicologia/:experienciaId/nudos" element={<PrivateRoute><MetodoPsicologiaNudos /></PrivateRoute>} />
      <Route path="/metodo/psicologia/:experienciaId/huellas-nudos" element={<PrivateRoute><MetodoPsicologiaHuellasNudos /></PrivateRoute>} />
      <Route path="/metodo/psicologia/:experienciaId/heridas-lista" element={<PrivateRoute><MetodoPsicologiaHeridasLista /></PrivateRoute>} />
      <Route path="/metodo/psicologia/:experienciaId/integracion" element={<PrivateRoute><MetodoPsicologiaIntegracion /></PrivateRoute>} />
      <Route path="/metodo/psicologia/:experienciaId/mapa" element={<PrivateRoute><MetodoPsicologiaMapa /></PrivateRoute>} />
      <Route path="/metodo/psicologia/:experienciaId/regulacion" element={<PrivateRoute><MetodoPsicologiaRegulacion /></PrivateRoute>} />
      <Route path="/metodo/psicologia/:experienciaId/dones" element={<PrivateRoute><MetodoPsicologiaDones /></PrivateRoute>} />
      <Route path="/metodo/psicologia/:experienciaId/dones-espejo" element={<PrivateRoute><MetodoPsicologiaDonesEspejo /></PrivateRoute>} />
      <Route path="/metodo/psicologia/:experienciaId/miedos" element={<PrivateRoute><MetodoPsicologiaMiedos /></PrivateRoute>} />
      <Route path="/metodo/psicologia/:experienciaId/miedos-preguntas" element={<PrivateRoute><MetodoPsicologiaMiedosPreguntas /></PrivateRoute>} />
      <Route path="/metodo/psicologia/:experienciaId/compromiso" element={<PrivateRoute><MetodoPsicologiaCompromiso /></PrivateRoute>} />
      <Route path="/metodo/psicologia/:experienciaId/brujula" element={<PrivateRoute><MetodoPsicologiaBrujula /></PrivateRoute>} />
      <Route path="/metodo/psicologia/:experienciaId/sintesis" element={<PrivateRoute><MetodoPsicologiaSintesis /></PrivateRoute>} />
      <Route path="/metodo/psicologia/:experienciaId/emociones" element={<PrivateRoute><MetodoPsicologiaEmociones /></PrivateRoute>} />
      <Route path="/metodo/psicologia/:experienciaId/cursos" element={<PrivateRoute><MetodoPsicologiaCursos /></PrivateRoute>} />
      <Route path="/metodo/psicologia/:experienciaId" element={<PrivateRoute><MetodoPsicologiaExperiencia /></PrivateRoute>} />
      <Route path="/metodo/ayurveda" element={<PrivateRoute><MetodoAyurveda /></PrivateRoute>} />
      <Route path="/metodo/ayurveda/test" element={<PrivateRoute><MetodoAyurvedaTest /></PrivateRoute>} />
      <Route path="/metodo/ayurveda/resultado" element={<PrivateRoute><MetodoAyurvedaResultado /></PrivateRoute>} />
      <Route path="/metodo/ayurveda/tarjetas" element={<PrivateRoute><MetodoAyurvedaTarjetas /></PrivateRoute>} />
      <Route path="/metodo/ayurveda/dosha/:dosha" element={<PrivateRoute><MetodoAyurvedaDoshaIntro /></PrivateRoute>} />
      <Route path="/metodo/ayurveda/dosha/:dosha/comenzar" element={<PrivateRoute><MetodoAyurvedaDoshaDescubre /></PrivateRoute>} />
      <Route path="/metodo/ayurveda/dosha/:dosha/cuerpo" element={<PrivateRoute><MetodoAyurvedaDoshaCuerpo /></PrivateRoute>} />
      <Route path="/metodo/ayurveda/dosha/:dosha/desequilibrio" element={<PrivateRoute><MetodoAyurvedaDoshaDesequilibrio /></PrivateRoute>} />
      <Route path="/metodo/ayurveda/dosha/:dosha/cuidarte" element={<PrivateRoute><MetodoAyurvedaDoshaCuidarte /></PrivateRoute>} />
      <Route path="/metodo/ayurveda/dosha/:dosha/estilo" element={<PrivateRoute><MetodoAyurvedaDoshaEstilo /></PrivateRoute>} />
      <Route path="/metodo/ayurveda/dosha/:dosha/dia" element={<PrivateRoute><MetodoAyurvedaDoshaDia /></PrivateRoute>} />
      <Route path="/metodo/ayurveda/dosha/:dosha/pranayama" element={<PrivateRoute><MetodoAyurvedaDoshaPranayama /></PrivateRoute>} />
      {/* Los chakras: la penúltima parada del mapa, justo antes de los Cursos.
          UNA sola página (el mapa); el texto de cada chakra se lee en su cómic,
          que se abre al pulsar su caja. No dependen del doṣha (son los mismos
          para los tres); la ruta cuelga de `/dosha/:dosha/` como Prāṇāyāma y
          Cursos, por herencia. */}
      <Route path="/metodo/ayurveda/dosha/:dosha/chakras" element={<PrivateRoute><MetodoAyurvedaChakras /></PrivateRoute>} />
      <Route path="/metodo/ayurveda/dosha/:dosha/cursos" element={<PrivateRoute><MetodoAyurvedaDoshaCursos /></PrivateRoute>} />
      <Route path="/metodo/ayurveda/dosha/:dosha/recorrido" element={<PrivateRoute><MetodoAyurvedaDoshaRecorrido /></PrivateRoute>} />
      <Route path="/ayurveda/miEspacio" element={<AyurvedaMiEspacio />} />

      {/* El Recorrido · Medicina China (4ª disciplina) */}
      <Route path="/metodo/tcm" element={<PrivateRoute><MetodoTcm /></PrivateRoute>} />
      <Route path="/metodo/tcm/elementos" element={<PrivateRoute><MetodoTcmElementos /></PrivateRoute>} />
      {/* "Tu equilibrio" se fusionó en el Diagnóstico: redirigimos los enlaces antiguos. */}
      <Route path="/metodo/tcm/perfil" element={<Navigate to="/metodo/tcm/diagnostico" replace />} />
      <Route path="/metodo/tcm/constitucion" element={<PrivateRoute><MetodoTcmConstitucion /></PrivateRoute>} />
      <Route path="/metodo/tcm/ciclos" element={<PrivateRoute><MetodoTcmCiclos /></PrivateRoute>} />
      <Route path="/metodo/tcm/diagnostico" element={<PrivateRoute><MetodoTcmDiagnostico /></PrivateRoute>} />
      <Route path="/metodo/tcm/lengua" element={<PrivateRoute><MetodoTcmLengua /></PrivateRoute>} />
      <Route path="/metodo/tcm/lengua/leer" element={<PrivateRoute><MetodoTcmLenguaLeer /></PrivateRoute>} />
      <Route path="/metodo/tcm/taoismo" element={<PrivateRoute><MetodoTcmTaoismo /></PrivateRoute>} />
      <Route path="/metodo/tcm/recetas" element={<PrivateRoute><MetodoTcmRecetas /></PrivateRoute>} />
      <Route path="/metodo/tcm/qigong" element={<PrivateRoute><MetodoTcmQigong /></PrivateRoute>} />
      <Route path="/metodo/tcm/cursos" element={<PrivateRoute><MetodoTcmCursos /></PrivateRoute>} />
      <Route path="/metodo/tcm/apuntes" element={<PrivateRoute><MetodoTcmApuntes /></PrivateRoute>} />
      <Route path="/metodo/fisiologia" element={<PrivateRoute><MetodoFisiologia /></PrivateRoute>} />
      <Route path="/metodo/fisiologia/niveles" element={<PrivateRoute><MetodoFisiologiaNiveles /></PrivateRoute>} />
      <Route path="/metodo/fisiologia/sonrisa" element={<PrivateRoute><MetodoFisiologiaSonrisa /></PrivateRoute>} />
      <Route path="/metodo/fisiologia/cursos" element={<PrivateRoute><MetodoFisiologiaCursos /></PrivateRoute>} />
      <Route path="/metodo/fisiologia/particulas" element={<PrivateRoute><MetodoFisiologiaParticulas /></PrivateRoute>} />
      <Route path="/metodo/fisiologia/atomos" element={<PrivateRoute><MetodoFisiologiaAtomos /></PrivateRoute>} />
      <Route path="/metodo/fisiologia/moleculas" element={<PrivateRoute><MetodoFisiologiaMoleculas /></PrivateRoute>} />
      <Route path="/metodo/fisiologia/macromoleculas" element={<PrivateRoute><MetodoFisiologiaMacromoleculas /></PrivateRoute>} />
      <Route path="/metodo/fisiologia/estructuras" element={<PrivateRoute><MetodoFisiologiaEstructuras /></PrivateRoute>} />
      <Route path="/metodo/fisiologia/celula" element={<PrivateRoute><MetodoFisiologiaCelula /></PrivateRoute>} />
      <Route path="/metodo/fisiologia/todas-tus-celulas" element={<PrivateRoute><MetodoFisiologiaTodasCelulas /></PrivateRoute>} />
      <Route path="/metodo/fisiologia/sistemas" element={<PrivateRoute><MetodoFisiologiaSistemas /></PrivateRoute>} />
      {/* El cerebro dejó de ser un paso del recorrido: ahora es un apartado de
          Profundiza. La ruta vieja sigue viva para no romper enlaces guardados. */}
      <Route path="/metodo/fisiologia/cerebro" element={<Navigate to="/metodo/fisiologia/profundiza/cerebro" replace />} />
      <Route path="/metodo/fisiologia/organismo" element={<PrivateRoute><MetodoFisiologiaOrganismo /></PrivateRoute>} />
      <Route path="/metodo/fisiologia/profundiza" element={<PrivateRoute><MetodoFisiologiaProfundiza /></PrivateRoute>} />
      <Route path="/metodo/fisiologia/profundiza/:temaKey" element={<PrivateRoute><MetodoFisiologiaTema /></PrivateRoute>} />

      {/* El Recorrido · Nutrición (6ª disciplina) */}
      <Route path="/metodo/nutricion" element={<PrivateRoute><MetodoNutricion /></PrivateRoute>} />
      <Route path="/metodo/nutricion/macronutrientes" element={<PrivateRoute><MetodoNutricionMacronutrientes /></PrivateRoute>} />
      <Route path="/metodo/nutricion/micronutrientes" element={<PrivateRoute><MetodoNutricionMicronutrientes /></PrivateRoute>} />
      {/* Los nutrientes se partieron en Macro y Micro: las rutas de antes siguen
          respondiendo para no romper enlaces guardados ni el historial. */}
      <Route path="/metodo/nutricion/nutrientes" element={<Navigate to="/metodo/nutricion/macronutrientes" replace />} />
      <Route path="/metodo/nutricion/nutrientes-secundarios" element={<Navigate to="/metodo/nutricion/micronutrientes" replace />} />
      <Route path="/metodo/nutricion/nutrientes/:key" element={<PrivateRoute><MetodoNutricionNutriente /></PrivateRoute>} />
      <Route path="/metodo/nutricion/microbiota" element={<PrivateRoute><MetodoNutricionMicrobiota /></PrivateRoute>} />
      <Route path="/metodo/nutricion/hambre" element={<PrivateRoute><MetodoNutricionHambre /></PrivateRoute>} />
      <Route path="/metodo/nutricion/plato" element={<PrivateRoute><MetodoNutricionPlato /></PrivateRoute>} />
      <Route path="/metodo/nutricion/calorias" element={<PrivateRoute><MetodoNutricionCalorias /></PrivateRoute>} />
      <Route path="/metodo/nutricion/prediabetes" element={<PrivateRoute><MetodoNutricionPrediabetes /></PrivateRoute>} />
      <Route path="/metodo/nutricion/dia" element={<PrivateRoute><MetodoNutricionDia /></PrivateRoute>} />
      <Route path="/metodo/nutricion/macros" element={<PrivateRoute><MetodoNutricionMacros /></PrivateRoute>} />
      <Route path="/metodo/nutricion/mitos" element={<PrivateRoute><MetodoNutricionMitos /></PrivateRoute>} />
      <Route path="/metodo/nutricion/ultraprocesados" element={<PrivateRoute><MetodoNutricionUltraprocesados /></PrivateRoute>} />
      <Route path="/metodo/nutricion/origen" element={<PrivateRoute><MetodoNutricionOrigen /></PrivateRoute>} />
      <Route path="/metodo/nutricion/alimentos" element={<PrivateRoute><MetodoNutricionAlimentos /></PrivateRoute>} />
      <Route path="/metodo/nutricion/alimentos/:key" element={<PrivateRoute><MetodoNutricionAlimento /></PrivateRoute>} />
      <Route path="/metodo/nutricion/cursos" element={<PrivateRoute><MetodoNutricionCursos /></PrivateRoute>} />

      <Route path="/metodo/cabala" element={<PrivateRoute><MetodoCabala /></PrivateRoute>} />
      <Route path="/metodo/cabala/arbol" element={<PrivateRoute><MetodoCabalaArbol /></PrivateRoute>} />
      <Route path="/metodo/cabala/sefira/:key" element={<PrivateRoute><MetodoCabalaSefira /></PrivateRoute>} />
      <Route path="/metodo/cabala/diagnostico" element={<PrivateRoute><MetodoCabalaDiagnostico /></PrivateRoute>} />
      <Route path="/metodo/cabala/senderos" element={<PrivateRoute><MetodoCabalaSenderos /></PrivateRoute>} />
      <Route path="/metodo/cabala/senderos/diagnostico" element={<PrivateRoute><MetodoCabalaSenderosDiagnostico /></PrivateRoute>} />
      <Route path="/metodo/cabala/final" element={<PrivateRoute><MetodoCabalaFinal /></PrivateRoute>} />
      {/* APARCADO · «10 días con tus dimensiones» (ver arriba). */}
      {/* <Route path="/metodo/cabala/dias" element={<PrivateRoute><MetodoCabalaDiezDias /></PrivateRoute>} /> */}
      <Route path="/metodo/cabala/cursos" element={<PrivateRoute><MetodoCabalaCursos /></PrivateRoute>} />
      <Route path="/metodo/cabala/sendero/:num" element={<PrivateRoute><MetodoCabalaSendero /></PrivateRoute>} />

      <Route path="/metodo/cultura" element={<PrivateRoute><MetodoCultura /></PrivateRoute>} />
      <Route path="/metodo/cultura/historias" element={<PrivateRoute><MetodoCulturaHistorias /></PrivateRoute>} />
      {/* «Tus apuntes»: sin clave se elige la Historia, con clave es su taller. */}
      <Route path="/metodo/cultura/apuntes" element={<PrivateRoute><MetodoCulturaApuntes /></PrivateRoute>} />
      <Route path="/metodo/cultura/apuntes/:historiaKey" element={<PrivateRoute><MetodoCulturaApuntes /></PrivateRoute>} />
      <Route path="/metodo/cultura/historia/:historiaKey" element={<PrivateRoute><MetodoCulturaHistoria /></PrivateRoute>} />
      <Route path="/metodo/cultura/historia/:historiaKey/:eraKey" element={<PrivateRoute><MetodoCulturaHistoriaEra /></PrivateRoute>} />

      <Route path="/tcm/test/1" element={<TCMTest1 />} />
      <Route path="/tcm/test/2" element={<TCMTest2 />} />
      <Route path="/tcm/test/3" element={<TCMTest3 />} />

      <Route path="/user/account" element={<PrivateRoute><UserAccount /></PrivateRoute>} />

      <Route path="/espacio/espacioHome" element={<PrivateRoute><EspacioHome /></PrivateRoute>} />
      <Route path="/espacio/fisiologia" element={<PrivateRoute><FisiologiaEspacio /></PrivateRoute>} />
      <Route path="/espacio/herbario" element={<PrivateRoute><FitoterapiaEspacio /></PrivateRoute>} />
      <Route path="/espacio/celulas-cuerpo" element={<CelulasCuerpoPage />} />
      <Route path="/espacio/questions/:themeId" element={<PrivateRoute><ExpandablePage /></PrivateRoute>} />

      <Route path="/aprendizaje/aprendizajeHome" element={<AprendizajeHome />} />
      {/* Página de «Vídeos» de Materiales comentada a petición (el box también). */}
      <Route path="/aprendizaje/cursos/:moduloId" element={<CursosModalidad />} />
      <Route path="/aprendizaje/herbario" element={<HerbarioPage />} />
      <Route path="/aprendizaje/herbario/favoritos" element={<PrivateRoute><HerbarioPage favoritesOnly /></PrivateRoute>} />
      <Route path="/aprendizaje/alimentos" element={<AlimentosPage />} />
      <Route path="/aprendizaje/alimentos/favoritos" element={<PrivateRoute><AlimentosPage favoritesOnly /></PrivateRoute>} />
      <Route path="/aprendizaje/calcular-necesidades" element={<CalcularNecesidadesPage />} />
      <Route path="/aprendizaje/test-doshas" element={<TestDoshasPage />} />
      <Route path="/aprendizaje/modulosPage/:modalidadId/:cursoId" element={<ModulosPage />} />
      <Route path="/aprendizaje/videoLessonPage/:moduloId/:submoduloId" element={<VideoLessonPage />} />
      <Route path="/aprendizaje/leccion/:modalidadId/:cursoId/:submoduloId" element={<TextLessonPage />} />

      <Route path="/recursos/:moduloId" element={<RecursosPage />} />

      {/* ── Estudio estadístico sobre astrología: APARCADO ──
          Se retira de la web por ahora (las preguntas de verdad nunca llegaron
          a escribirse). Las páginas, el panel de administración y la tabla
          `estudio_*` siguen intactos: descomentar aquí, en SiteHeader y en
          AdminHome lo devuelve entero, con sus participantes. */}
      {/* <Route path="/estudio" element={<EstudioHome />} /> */}
      {/* <Route path="/estudio/datos" element={<EstudioDatos />} /> */}
      {/* <Route path="/estudio/preguntas" element={<EstudioPreguntas />} /> */}
      {/* <Route path="/estudio/resultados" element={<EstudioResultados />} /> */}
      {/* <Route path="/estudio/estadisticas" element={<EstudioEstadisticas />} /> */}


      <Route path="*" element={<NoEncontrada />} />
    </Routes>
    </Suspense>
    </>
  );
}


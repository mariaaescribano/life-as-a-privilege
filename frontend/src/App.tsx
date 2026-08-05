import React, { lazy, Suspense, useEffect } from "react";
import { Box } from "@chakra-ui/react";
import Welcome from "./app/web/Welcome";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
const LogIn = lazy(() => import("./app/auth/LogIn"));
const SignIn = lazy(() => import("./app/auth/SignIn"));
const GoogleAuthCallback = lazy(() => import("./app/auth/GoogleAuthCallback"));
const Home = lazy(() => import("./app/home/Home"));
const AprendizajeHome = lazy(() => import("./app/aprendizaje/AprendizajeHome").then((m) => ({ default: m.AprendizajeHome })));
const ModulosPage = lazy(() => import("./app/aprendizaje/ModulosPage"));
const VideoLessonPage = lazy(() => import("./app/aprendizaje/VideoLessonPage"));
const CursosModalidad = lazy(() => import("./app/aprendizaje/CursosModalidad"));
const TextLessonPage = lazy(() => import("./app/aprendizaje/TextLessonPage"));
const HerbarioPage = lazy(() => import("./app/aprendizaje/HerbarioPage"));
const AlimentosPage = lazy(() => import("./app/aprendizaje/AlimentosPage"));
const CalcularNecesidadesPage = lazy(() => import("./app/aprendizaje/CalcularNecesidadesPage"));
const TestDoshasPage = lazy(() => import("./app/aprendizaje/TestDoshasPage"));
const EspacioHome = lazy(() => import("./app/espacio/main/EspacioHome"));
const ExpandablePage = lazy(() => import("./app/espacio/main/ThemePreguntas"));
const QuienSoy = lazy(() => import("./app/web/QuienSoy"));
const Productos = lazy(() => import("./app/web/Productos"));
const LibrosPage = lazy(() => import("./app/web/LibrosPage"));
const DescargarLibroPage = lazy(() => import("./app/web/DescargarLibroPage"));
const Contacto = lazy(() => import("./app/web/Contacto"));
const Opiniones = lazy(() => import("./app/web/Opiniones"));
const ElMetodo = lazy(() => import("./app/web/ElMetodo"));
const MaterialesGratuitos = lazy(() => import("./app/web/MaterialesGratuitos"));
const Ilustraciones = lazy(() => import("./app/web/Ilustraciones"));
const PresentacionDisciplina = lazy(() => import("./app/web/PresentacionDisciplina"));
const CheckoutMetodo = lazy(() => import("./app/web/CheckoutMetodo"));
const MetodoAstrologia = lazy(() => import("./app/metodo/MetodoAstrologia"));
const MetodoAstrologiaCartaAstral = lazy(() => import("./app/metodo/MetodoAstrologiaCartaAstral"));
const MetodoAstrologiaPlanetas = lazy(() => import("./app/metodo/MetodoAstrologiaPlanetas"));
const MetodoAstrologiaProfundizar = lazy(() => import("./app/metodo/MetodoAstrologiaProfundizar"));
const MetodoAstrologiaSolAscLuna = lazy(() => import("./app/metodo/MetodoAstrologiaSolAscLuna"));
const MetodoAstrologiaLectura = lazy(() => import("./app/metodo/MetodoAstrologiaLectura"));
const MetodoAstrologiaCasas = lazy(() => import("./app/metodo/MetodoAstrologiaCasas"));
const MetodoAstrologiaAspectos = lazy(() => import("./app/metodo/MetodoAstrologiaAspectos"));
const MetodoAstrologiaPdf = lazy(() => import("./app/metodo/MetodoAstrologiaPdf"));
const MetodoAstrologiaLlamada = lazy(() => import("./app/metodo/MetodoAstrologiaLlamada"));
const MetodoAstrologiaCursos = lazy(() => import("./app/metodo/MetodoAstrologiaCursos"));
const AdminHome = lazy(() => import("./app/admin/AdminHome"));
const AdminLogin = lazy(() => import("./app/admin/AdminLogin"));
const AdminUsuarios = lazy(() => import("./app/admin/AdminUsuarios"));
const AdminAstrologiaEditor = lazy(() => import("./app/admin/AdminAstrologiaEditor"));
const AdminPsicologiaLectura = lazy(() => import("./app/admin/AdminPsicologiaLectura"));
const AdminAyurvedaLectura = lazy(() => import("./app/admin/AdminAyurvedaLectura"));
const AdminEditorPlaceholder = lazy(() => import("./app/admin/AdminEditorPlaceholder"));
const AdminCursos = lazy(() => import("./app/admin/AdminCursos"));
const AdminCursoEditor = lazy(() => import("./app/admin/AdminCursoEditor"));
const AdminAstrologiaTextos = lazy(() => import("./app/admin/AdminAstrologiaTextos"));
const AdminAccesos = lazy(() => import("./app/admin/AdminAccesos"));
const AdminEstudio = lazy(() => import("./app/admin/AdminEstudio"));
const NoEncontrada = lazy(() => import("./app/web/NoEncontrada"));
const MetodoPsicologia = lazy(() => import("./app/metodo/MetodoPsicologia"));
const MetodoPsicologiaProblema = lazy(() => import("./app/metodo/MetodoPsicologiaProblema"));
const MetodoPsicologiaNecesidades = lazy(() => import("./app/metodo/MetodoPsicologiaNecesidades"));
const MetodoPsicologiaAce = lazy(() => import("./app/metodo/MetodoPsicologiaAce"));
const MetodoPsicologiaAceResultado = lazy(() => import("./app/metodo/MetodoPsicologiaAceResultado"));
const MetodoPsicologiaExperiencia = lazy(() => import("./app/metodo/MetodoPsicologiaExperiencia"));
const MetodoPsicologiaFamilia = lazy(() => import("./app/metodo/MetodoPsicologiaFamilia"));
const MetodoPsicologiaGenograma = lazy(() => import("./app/metodo/MetodoPsicologiaGenograma"));
const MetodoPsicologiaHuellas = lazy(() => import("./app/metodo/MetodoPsicologiaHuellas"));
const MetodoPsicologiaNudos = lazy(() => import("./app/metodo/MetodoPsicologiaNudos"));
const MetodoPsicologiaHuellasNudos = lazy(() => import("./app/metodo/MetodoPsicologiaHuellasNudos"));
const MetodoPsicologiaHeridasLista = lazy(() => import("./app/metodo/MetodoPsicologiaHeridasLista"));
const MetodoPsicologiaIntegracion = lazy(() => import("./app/metodo/MetodoPsicologiaIntegracion"));
const MetodoPsicologiaMapa = lazy(() => import("./app/metodo/MetodoPsicologiaMapa"));
const MetodoPsicologiaRegulacion = lazy(() => import("./app/metodo/MetodoPsicologiaRegulacion"));
const MetodoPsicologiaDones = lazy(() => import("./app/metodo/MetodoPsicologiaDones"));
const MetodoPsicologiaDonesEspejo = lazy(() => import("./app/metodo/MetodoPsicologiaDonesEspejo"));
const MetodoPsicologiaMiedos = lazy(() => import("./app/metodo/MetodoPsicologiaMiedos"));
const MetodoPsicologiaMiedosPreguntas = lazy(() => import("./app/metodo/MetodoPsicologiaMiedosPreguntas"));
const MetodoPsicologiaCompromiso = lazy(() => import("./app/metodo/MetodoPsicologiaCompromiso"));
const MetodoPsicologiaBrujula = lazy(() => import("./app/metodo/MetodoPsicologiaBrujula"));
const MetodoPsicologiaSintesis = lazy(() => import("./app/metodo/MetodoPsicologiaSintesis"));
const MetodoPsicologiaCursos = lazy(() => import("./app/metodo/MetodoPsicologiaCursos"));
const MetodoAyurveda = lazy(() => import("./app/metodo/MetodoAyurveda"));
const MetodoAyurvedaTest = lazy(() => import("./app/metodo/MetodoAyurvedaTest"));
const MetodoAyurvedaResultado = lazy(() => import("./app/metodo/MetodoAyurvedaResultado"));
const MetodoAyurvedaTarjetas = lazy(() => import("./app/metodo/MetodoAyurvedaTarjetas"));
const MetodoAyurvedaDoshaIntro = lazy(() => import("./app/metodo/MetodoAyurvedaDoshaIntro"));
const MetodoAyurvedaDoshaDescubre = lazy(() => import("./app/metodo/MetodoAyurvedaDoshaDescubre"));
const MetodoAyurvedaDoshaCuerpo = lazy(() => import("./app/metodo/MetodoAyurvedaDoshaCuerpo"));
const MetodoAyurvedaDoshaDesequilibrio = lazy(() => import("./app/metodo/MetodoAyurvedaDoshaDesequilibrio"));
const MetodoAyurvedaDoshaCuidarte = lazy(() => import("./app/metodo/MetodoAyurvedaDoshaCuidarte"));
const MetodoAyurvedaDoshaEstilo = lazy(() => import("./app/metodo/MetodoAyurvedaDoshaEstilo"));
const MetodoAyurvedaDoshaDia = lazy(() => import("./app/metodo/MetodoAyurvedaDoshaDia"));
const MetodoAyurvedaDoshaCursos = lazy(() => import("./app/metodo/MetodoAyurvedaDoshaCursos"));
const MetodoAyurvedaDoshaRecorrido = lazy(() => import("./app/metodo/MetodoAyurvedaDoshaRecorrido"));
const MetodoTcm = lazy(() => import("./app/metodo/MetodoTcm"));
const MetodoTcmElementos = lazy(() => import("./app/metodo/MetodoTcmElementos"));
const MetodoTcmCiclos = lazy(() => import("./app/metodo/MetodoTcmCiclos"));
const MetodoTcmDiagnostico = lazy(() => import("./app/metodo/MetodoTcmDiagnostico"));
const MetodoTcmLengua = lazy(() => import("./app/metodo/MetodoTcmLengua"));
const MetodoTcmLenguaLeer = lazy(() => import("./app/metodo/MetodoTcmLenguaLeer"));
const MetodoTcmTaoismo = lazy(() => import("./app/metodo/MetodoTcmTaoismo"));
const MetodoTcmRecetas = lazy(() => import("./app/metodo/MetodoTcmRecetas"));
const MetodoTcmCursos = lazy(() => import("./app/metodo/MetodoTcmCursos"));
const MetodoFisiologia = lazy(() => import("./app/metodo/MetodoFisiologia"));
const MetodoFisiologiaNiveles = lazy(() => import("./app/metodo/MetodoFisiologiaNiveles"));
const MetodoFisiologiaSonrisa = lazy(() => import("./app/metodo/MetodoFisiologiaSonrisa"));
const MetodoFisiologiaCursos = lazy(() => import("./app/metodo/MetodoFisiologiaCursos"));
const MetodoFisiologiaParticulas = lazy(() => import("./app/metodo/MetodoFisiologiaParticulas"));
const MetodoFisiologiaAtomos = lazy(() => import("./app/metodo/MetodoFisiologiaAtomos"));
const MetodoFisiologiaMoleculas = lazy(() => import("./app/metodo/MetodoFisiologiaMoleculas"));
const MetodoFisiologiaMacromoleculas = lazy(() => import("./app/metodo/MetodoFisiologiaMacromoleculas"));
const MetodoFisiologiaEstructuras = lazy(() => import("./app/metodo/MetodoFisiologiaEstructuras"));
const MetodoFisiologiaCelula = lazy(() => import("./app/metodo/MetodoFisiologiaCelula"));
const MetodoFisiologiaTodasCelulas = lazy(() => import("./app/metodo/MetodoFisiologiaTodasCelulas"));
const MetodoFisiologiaSistemas = lazy(() => import("./app/metodo/MetodoFisiologiaSistemas"));
const MetodoFisiologiaOrganismo = lazy(() => import("./app/metodo/MetodoFisiologiaOrganismo"));
const MetodoFisiologiaAnalitica = lazy(() => import("./app/metodo/MetodoFisiologiaAnalitica"));
const MetodoFisiologiaProfundiza = lazy(() => import("./app/metodo/MetodoFisiologiaProfundiza"));
const MetodoFisiologiaTema = lazy(() => import("./app/metodo/MetodoFisiologiaTema"));
const MetodoNutricion = lazy(() => import("./app/metodo/MetodoNutricion"));
const MetodoNutricionNutrientes = lazy(() => import("./app/metodo/MetodoNutricionNutrientes"));
const MetodoNutricionNutrientesSecundarios = lazy(() => import("./app/metodo/MetodoNutricionNutrientesSecundarios"));
const MetodoNutricionPlato = lazy(() => import("./app/metodo/MetodoNutricionPlato"));
const MetodoNutricionCalorias = lazy(() => import("./app/metodo/MetodoNutricionCalorias"));
const MetodoNutricionPrediabetes = lazy(() => import("./app/metodo/MetodoNutricionPrediabetes"));
const MetodoNutricionDia = lazy(() => import("./app/metodo/MetodoNutricionDia"));
const MetodoNutricionMitos = lazy(() => import("./app/metodo/MetodoNutricionMitos"));
const MetodoNutricionNutriente = lazy(() => import("./app/metodo/MetodoNutricionNutriente"));
const MetodoNutricionMicrobiota = lazy(() => import("./app/metodo/MetodoNutricionMicrobiota"));
const MetodoNutricionHambre = lazy(() => import("./app/metodo/MetodoNutricionHambre"));
const MetodoNutricionAlimentos = lazy(() => import("./app/metodo/MetodoNutricionAlimentos"));
const MetodoNutricionAlimento = lazy(() => import("./app/metodo/MetodoNutricionAlimento"));
const MetodoNutricionCursos = lazy(() => import("./app/metodo/MetodoNutricionCursos"));
const MetodoCabala = lazy(() => import("./app/metodo/MetodoCabala"));
const MetodoCabalaArbol = lazy(() => import("./app/metodo/MetodoCabalaArbol"));
const MetodoCabalaSefira = lazy(() => import("./app/metodo/MetodoCabalaSefira"));
const MetodoCabalaDiagnostico = lazy(() => import("./app/metodo/MetodoCabalaDiagnostico"));
const MetodoCabalaSenderos = lazy(() => import("./app/metodo/MetodoCabalaSenderos"));
const MetodoCabalaSendero = lazy(() => import("./app/metodo/MetodoCabalaSendero"));
const MetodoCabalaSenderosDiagnostico = lazy(() => import("./app/metodo/MetodoCabalaSenderosDiagnostico"));
const MetodoCabalaFinal = lazy(() => import("./app/metodo/MetodoCabalaFinal"));
const MetodoCabalaDiezDias = lazy(() => import("./app/metodo/MetodoCabalaDiezDias"));
const MetodoCabalaCursos = lazy(() => import("./app/metodo/MetodoCabalaCursos"));
const MetodoCultura = lazy(() => import("./app/metodo/MetodoCultura"));
const MetodoCulturaHistorias = lazy(() => import("./app/metodo/MetodoCulturaHistorias"));
const MetodoCulturaHistoria = lazy(() => import("./app/metodo/MetodoCulturaHistoria"));
const MetodoCulturaHistoriaEra = lazy(() => import("./app/metodo/MetodoCulturaHistoriaEra"));
const AyurvedaMiEspacio = lazy(() => import("./app/web/AyurvedaMiEspacio"));
const RecursosPage = lazy(() => import("./app/recursos/RecursosPage"));
// Estudio estadístico sobre astrología (público: no hace falta cuenta)
const EstudioHome = lazy(() => import("./app/estudio/EstudioHome"));
const EstudioDatos = lazy(() => import("./app/estudio/EstudioDatos"));
const EstudioPreguntas = lazy(() => import("./app/estudio/EstudioPreguntas"));
const EstudioResultados = lazy(() => import("./app/estudio/EstudioResultados"));
const EstudioEstadisticas = lazy(() => import("./app/estudio/EstudioEstadisticas"));
const UserAccount = lazy(() => import("./app/user/UserAccount"));
const TCMTest1 = lazy(() => import("./components/espacio/components/TCMTest1"));
const TCMTest2 = lazy(() => import("./components/espacio/components/TCMTest2"));
const TCMTest3 = lazy(() => import("./components/espacio/components/TCMTest3"));
const FisiologiaEspacio = lazy(() => import("./components/espacio/pages/FisiologiaEspacio"));
const FitoterapiaEspacio = lazy(() => import("./components/espacio/pages/FitoterapiaEspacio"));
const CelulasCuerpoPage = lazy(() => import("./app/espacio/CelulasCuerpoPage"));
import { ExitIntentSubscribeModal } from "./components/global/ExitIntentSubscribeModal";
import { MiniDiario } from "./components/global/MiniDiario";
const RecuperarPassword = lazy(() => import("./app/auth/RecuperarPassword"));
const AvisoLegal = lazy(() => import("./app/legal/AvisoLegal"));
const Privacidad = lazy(() => import("./app/legal/Privacidad"));
const Cookies = lazy(() => import("./app/legal/Cookies"));
const Terminos = lazy(() => import("./app/legal/Terminos"));
import AvisoCookies from "./components/global/AvisoCookies";
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

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const userId = localStorage.getItem("userId");
  if (!userId) return <Navigate to="/welcome" replace />;
  return <>{children}</>;
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
    <ExitIntentSubscribeModal />
    <MiniDiario />
    <AvisoCookies />
    {/* Suspense: cada pagina viaja en su propio fichero y se descarga solo
        cuando se entra en ella. Mientras llega, se ve la pantalla de carga de la
        casa. Antes todo iba en un unico bundle de 6 MB que habia que bajar
        entero para ver la portada. */}
    <Suspense fallback={<LifeLoading />}>
    <Routes>
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
      <Route path="/quienSoy" element={<QuienSoy />} />

      <Route path="/productos" element={<Productos />} />

      <Route path="/libros" element={<LibrosPage />} />
      <Route path="/libros/descargar" element={<DescargarLibroPage />} />
      <Route path="/contacto" element={<Contacto />} />
      <Route path="/opiniones" element={<Opiniones />} />
      <Route path="/elMetodo" element={<ElMetodo />} />
      <Route path="/materiales" element={<MaterialesGratuitos />} />
      <Route path="/ilustraciones" element={<Ilustraciones />} />
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
      {/* Antes de /admin/:disciplina, que si no se lo tragaría como disciplina. */}
      <Route path="/admin/estudio" element={<AdminRoute><AdminEstudio /></AdminRoute>} />
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
      <Route path="/metodo/ayurveda/dosha/:dosha/cursos" element={<PrivateRoute><MetodoAyurvedaDoshaCursos /></PrivateRoute>} />
      <Route path="/metodo/ayurveda/dosha/:dosha/recorrido" element={<PrivateRoute><MetodoAyurvedaDoshaRecorrido /></PrivateRoute>} />
      <Route path="/ayurveda/miEspacio" element={<AyurvedaMiEspacio />} />

      {/* El Recorrido · Medicina China (4ª disciplina) */}
      <Route path="/metodo/tcm" element={<PrivateRoute><MetodoTcm /></PrivateRoute>} />
      <Route path="/metodo/tcm/elementos" element={<PrivateRoute><MetodoTcmElementos /></PrivateRoute>} />
      {/* "Tu equilibrio" se fusionó en el Diagnóstico: redirigimos los enlaces antiguos. */}
      <Route path="/metodo/tcm/perfil" element={<Navigate to="/metodo/tcm/diagnostico" replace />} />
      <Route path="/metodo/tcm/ciclos" element={<PrivateRoute><MetodoTcmCiclos /></PrivateRoute>} />
      <Route path="/metodo/tcm/diagnostico" element={<PrivateRoute><MetodoTcmDiagnostico /></PrivateRoute>} />
      <Route path="/metodo/tcm/lengua" element={<PrivateRoute><MetodoTcmLengua /></PrivateRoute>} />
      <Route path="/metodo/tcm/lengua/leer" element={<PrivateRoute><MetodoTcmLenguaLeer /></PrivateRoute>} />
      <Route path="/metodo/tcm/taoismo" element={<PrivateRoute><MetodoTcmTaoismo /></PrivateRoute>} />
      <Route path="/metodo/tcm/recetas" element={<PrivateRoute><MetodoTcmRecetas /></PrivateRoute>} />
      <Route path="/metodo/tcm/cursos" element={<PrivateRoute><MetodoTcmCursos /></PrivateRoute>} />
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
      <Route path="/metodo/fisiologia/organismo" element={<PrivateRoute><MetodoFisiologiaOrganismo /></PrivateRoute>} />
      <Route path="/metodo/fisiologia/analitica" element={<PrivateRoute><MetodoFisiologiaAnalitica /></PrivateRoute>} />
      <Route path="/metodo/fisiologia/profundiza" element={<PrivateRoute><MetodoFisiologiaProfundiza /></PrivateRoute>} />
      <Route path="/metodo/fisiologia/profundiza/:temaKey" element={<PrivateRoute><MetodoFisiologiaTema /></PrivateRoute>} />

      {/* El Recorrido · Nutrición (6ª disciplina) */}
      <Route path="/metodo/nutricion" element={<PrivateRoute><MetodoNutricion /></PrivateRoute>} />
      <Route path="/metodo/nutricion/nutrientes" element={<PrivateRoute><MetodoNutricionNutrientes /></PrivateRoute>} />
      <Route path="/metodo/nutricion/nutrientes-secundarios" element={<PrivateRoute><MetodoNutricionNutrientesSecundarios /></PrivateRoute>} />
      <Route path="/metodo/nutricion/nutrientes/:key" element={<PrivateRoute><MetodoNutricionNutriente /></PrivateRoute>} />
      <Route path="/metodo/nutricion/microbiota" element={<PrivateRoute><MetodoNutricionMicrobiota /></PrivateRoute>} />
      <Route path="/metodo/nutricion/hambre" element={<PrivateRoute><MetodoNutricionHambre /></PrivateRoute>} />
      <Route path="/metodo/nutricion/plato" element={<PrivateRoute><MetodoNutricionPlato /></PrivateRoute>} />
      <Route path="/metodo/nutricion/calorias" element={<PrivateRoute><MetodoNutricionCalorias /></PrivateRoute>} />
      <Route path="/metodo/nutricion/prediabetes" element={<PrivateRoute><MetodoNutricionPrediabetes /></PrivateRoute>} />
      <Route path="/metodo/nutricion/dia" element={<PrivateRoute><MetodoNutricionDia /></PrivateRoute>} />
      <Route path="/metodo/nutricion/mitos" element={<PrivateRoute><MetodoNutricionMitos /></PrivateRoute>} />
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
      <Route path="/metodo/cabala/dias" element={<PrivateRoute><MetodoCabalaDiezDias /></PrivateRoute>} />
      <Route path="/metodo/cabala/cursos" element={<PrivateRoute><MetodoCabalaCursos /></PrivateRoute>} />
      <Route path="/metodo/cabala/sendero/:num" element={<PrivateRoute><MetodoCabalaSendero /></PrivateRoute>} />

      <Route path="/metodo/cultura" element={<PrivateRoute><MetodoCultura /></PrivateRoute>} />
      <Route path="/metodo/cultura/historias" element={<PrivateRoute><MetodoCulturaHistorias /></PrivateRoute>} />
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

      {/* ── Estudio estadístico sobre astrología ──
          Públicas a propósito: participar no exige cuenta, solo un email. */}
      <Route path="/estudio" element={<EstudioHome />} />
      <Route path="/estudio/datos" element={<EstudioDatos />} />
      <Route path="/estudio/preguntas" element={<EstudioPreguntas />} />
      <Route path="/estudio/resultados" element={<EstudioResultados />} />
      {/* Los totales del estudio: medias de grupo, sin nadie dentro. */}
      <Route path="/estudio/estadisticas" element={<EstudioEstadisticas />} />


      <Route path="*" element={<NoEncontrada />} />
    </Routes>
    </Suspense>
    </>
  );
}


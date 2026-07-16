import React, { useEffect } from "react";
import Welcome from "./app/web/Welcome";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import LogIn from "./app/auth/LogIn";
import SignIn from "./app/auth/SignIn";
import GoogleAuthCallback from "./app/auth/GoogleAuthCallback";
import Home from "./app/home/Home";
import { AprendizajeHome } from "./app/aprendizaje/AprendizajeHome";
import ModulosPage from "./app/aprendizaje/ModulosPage";
import VideoLessonPage from "./app/aprendizaje/VideoLessonPage";
import CursosModalidad from "./app/aprendizaje/CursosModalidad";
import TextLessonPage from "./app/aprendizaje/TextLessonPage";
import HerbarioPage from "./app/aprendizaje/HerbarioPage";
import AlimentosPage from "./app/aprendizaje/AlimentosPage";
import CalcularNecesidadesPage from "./app/aprendizaje/CalcularNecesidadesPage";
import TestDoshasPage from "./app/aprendizaje/TestDoshasPage";
import EspacioHome from "./app/espacio/main/EspacioHome";
import ExpandablePage from "./app/espacio/main/ThemePreguntas";
import QuienSoy from "./app/web/QuienSoy";
import Productos from "./app/web/Productos";
import ReelsPage from "./app/web/Reels";
import VideosPage from "./app/web/VideosPage";
import VideoPage from "./app/web/VideoPage";
import LibrosPage from "./app/web/LibrosPage";
import DescargarLibroPage from "./app/web/DescargarLibroPage";
import Contacto from "./app/web/Contacto";
import Opiniones from "./app/web/Opiniones";
import ElMetodo from "./app/web/ElMetodo";
import MaterialesGratuitos from "./app/web/MaterialesGratuitos";
import Ilustraciones from "./app/web/Ilustraciones";
import CheckoutMetodo from "./app/web/CheckoutMetodo";
import MetodoAstrologia from "./app/metodo/MetodoAstrologia";
import MetodoAstrologiaCartaAstral from "./app/metodo/MetodoAstrologiaCartaAstral";
import MetodoAstrologiaPlanetas from "./app/metodo/MetodoAstrologiaPlanetas";
import MetodoAstrologiaProfundizar from "./app/metodo/MetodoAstrologiaProfundizar";
import MetodoAstrologiaSolAscLuna from "./app/metodo/MetodoAstrologiaSolAscLuna";
import MetodoAstrologiaLectura from "./app/metodo/MetodoAstrologiaLectura";
import MetodoAstrologiaCasas from "./app/metodo/MetodoAstrologiaCasas";
import MetodoAstrologiaAspectos from "./app/metodo/MetodoAstrologiaAspectos";
import MetodoAstrologiaLlamada from "./app/metodo/MetodoAstrologiaLlamada";
import MetodoAstrologiaCursos from "./app/metodo/MetodoAstrologiaCursos";
import AdminHome from "./app/admin/AdminHome";
import AdminUsuarios from "./app/admin/AdminUsuarios";
import AdminAstrologiaEditor from "./app/admin/AdminAstrologiaEditor";
import AdminPsicologiaLectura from "./app/admin/AdminPsicologiaLectura";
import AdminAyurvedaLectura from "./app/admin/AdminAyurvedaLectura";
import AdminEditorPlaceholder from "./app/admin/AdminEditorPlaceholder";
import AdminCursos from "./app/admin/AdminCursos";
import AdminCursoEditor from "./app/admin/AdminCursoEditor";
import AdminAstrologiaTextos from "./app/admin/AdminAstrologiaTextos";
import MetodoPsicologia from "./app/metodo/MetodoPsicologia";
import MetodoPsicologiaProblema from "./app/metodo/MetodoPsicologiaProblema";
import MetodoPsicologiaNecesidades from "./app/metodo/MetodoPsicologiaNecesidades";
import MetodoPsicologiaAce from "./app/metodo/MetodoPsicologiaAce";
import MetodoPsicologiaAceResultado from "./app/metodo/MetodoPsicologiaAceResultado";
import MetodoPsicologiaExperiencia from "./app/metodo/MetodoPsicologiaExperiencia";
import MetodoPsicologiaHuellas from "./app/metodo/MetodoPsicologiaHuellas";
import MetodoPsicologiaNudos from "./app/metodo/MetodoPsicologiaNudos";
import MetodoPsicologiaHuellasNudos from "./app/metodo/MetodoPsicologiaHuellasNudos";
import MetodoPsicologiaHeridasLista from "./app/metodo/MetodoPsicologiaHeridasLista";
import MetodoPsicologiaIntegracion from "./app/metodo/MetodoPsicologiaIntegracion";
import MetodoPsicologiaMapa from "./app/metodo/MetodoPsicologiaMapa";
import MetodoPsicologiaRegulacion from "./app/metodo/MetodoPsicologiaRegulacion";
import MetodoPsicologiaDones from "./app/metodo/MetodoPsicologiaDones";
import MetodoPsicologiaDonesEspejo from "./app/metodo/MetodoPsicologiaDonesEspejo";
import MetodoPsicologiaMiedos from "./app/metodo/MetodoPsicologiaMiedos";
import MetodoPsicologiaMiedosPreguntas from "./app/metodo/MetodoPsicologiaMiedosPreguntas";
import MetodoPsicologiaCompromiso from "./app/metodo/MetodoPsicologiaCompromiso";
import MetodoPsicologiaBrujula from "./app/metodo/MetodoPsicologiaBrujula";
import MetodoPsicologiaSintesis from "./app/metodo/MetodoPsicologiaSintesis";
import MetodoAyurveda from "./app/metodo/MetodoAyurveda";
import MetodoAyurvedaTest from "./app/metodo/MetodoAyurvedaTest";
import MetodoAyurvedaResultado from "./app/metodo/MetodoAyurvedaResultado";
import MetodoAyurvedaTarjetas from "./app/metodo/MetodoAyurvedaTarjetas";
import MetodoAyurvedaDoshaIntro from "./app/metodo/MetodoAyurvedaDoshaIntro";
import MetodoAyurvedaDoshaDescubre from "./app/metodo/MetodoAyurvedaDoshaDescubre";
import MetodoAyurvedaDoshaCuerpo from "./app/metodo/MetodoAyurvedaDoshaCuerpo";
import MetodoAyurvedaDoshaDesequilibrio from "./app/metodo/MetodoAyurvedaDoshaDesequilibrio";
import MetodoAyurvedaDoshaCuidarte from "./app/metodo/MetodoAyurvedaDoshaCuidarte";
import MetodoAyurvedaDoshaEstilo from "./app/metodo/MetodoAyurvedaDoshaEstilo";
import MetodoAyurvedaDoshaDia from "./app/metodo/MetodoAyurvedaDoshaDia";
import MetodoAyurvedaDoshaCursos from "./app/metodo/MetodoAyurvedaDoshaCursos";
import MetodoAyurvedaDoshaRecorrido from "./app/metodo/MetodoAyurvedaDoshaRecorrido";
import MetodoTcm from "./app/metodo/MetodoTcm";
import MetodoTcmElementos from "./app/metodo/MetodoTcmElementos";
import MetodoTcmElemento from "./app/metodo/MetodoTcmElemento";
import MetodoTcmPerfil from "./app/metodo/MetodoTcmPerfil";
import MetodoTcmCiclos from "./app/metodo/MetodoTcmCiclos";
import MetodoTcmDiagnostico from "./app/metodo/MetodoTcmDiagnostico";
import MetodoTcmLengua from "./app/metodo/MetodoTcmLengua";
import MetodoTcmLenguaLeer from "./app/metodo/MetodoTcmLenguaLeer";
import MetodoTcmCursos from "./app/metodo/MetodoTcmCursos";
import MetodoFisiologia from "./app/metodo/MetodoFisiologia";
import MetodoFisiologiaNiveles from "./app/metodo/MetodoFisiologiaNiveles";
import MetodoFisiologiaCursos from "./app/metodo/MetodoFisiologiaCursos";
import MetodoFisiologiaParticulas from "./app/metodo/MetodoFisiologiaParticulas";
import MetodoFisiologiaAtomos from "./app/metodo/MetodoFisiologiaAtomos";
import MetodoFisiologiaMoleculas from "./app/metodo/MetodoFisiologiaMoleculas";
import MetodoFisiologiaMacromoleculas from "./app/metodo/MetodoFisiologiaMacromoleculas";
import MetodoFisiologiaEstructuras from "./app/metodo/MetodoFisiologiaEstructuras";
import MetodoFisiologiaCelula from "./app/metodo/MetodoFisiologiaCelula";
import MetodoFisiologiaTodasCelulas from "./app/metodo/MetodoFisiologiaTodasCelulas";
import MetodoFisiologiaTejidos from "./app/metodo/MetodoFisiologiaTejidos";
import MetodoFisiologiaOrganos from "./app/metodo/MetodoFisiologiaOrganos";
import MetodoFisiologiaSistemas from "./app/metodo/MetodoFisiologiaSistemas";
import MetodoFisiologiaOrganismo from "./app/metodo/MetodoFisiologiaOrganismo";
import MetodoFisiologiaAnalitica from "./app/metodo/MetodoFisiologiaAnalitica";
import MetodoFisiologiaProfundiza from "./app/metodo/MetodoFisiologiaProfundiza";
import MetodoFisiologiaTema from "./app/metodo/MetodoFisiologiaTema";
import MetodoNutricion from "./app/metodo/MetodoNutricion";
import MetodoNutricionNutrientes from "./app/metodo/MetodoNutricionNutrientes";
import MetodoNutricionNutrientesSecundarios from "./app/metodo/MetodoNutricionNutrientesSecundarios";
import MetodoNutricionPlato from "./app/metodo/MetodoNutricionPlato";
import MetodoNutricionMitos from "./app/metodo/MetodoNutricionMitos";
import MetodoNutricionNutriente from "./app/metodo/MetodoNutricionNutriente";
import MetodoNutricionMicrobiota from "./app/metodo/MetodoNutricionMicrobiota";
import MetodoNutricionAlimentos from "./app/metodo/MetodoNutricionAlimentos";
import MetodoNutricionAlimento from "./app/metodo/MetodoNutricionAlimento";
import MetodoNutricionCursos from "./app/metodo/MetodoNutricionCursos";
import MetodoCabala from "./app/metodo/MetodoCabala";
import MetodoCabalaArbol from "./app/metodo/MetodoCabalaArbol";
import MetodoCabalaSefira from "./app/metodo/MetodoCabalaSefira";
import AyurvedaMiEspacio from "./app/web/AyurvedaMiEspacio";
import RecursosPage from "./app/recursos/RecursosPage";
import NuevosCursosPage from "./app/aprendizaje/NuevosCursosPage";
import UserAccount from "./app/user/UserAccount";
import TCMTest1 from "./components/espacio/components/TCMTest1";
import TCMTest2 from "./components/espacio/components/TCMTest2";
import TCMTest3 from "./components/espacio/components/TCMTest3";
import FisiologiaEspacio from "./components/espacio/pages/FisiologiaEspacio";
import FitoterapiaEspacio from "./components/espacio/pages/FitoterapiaEspacio";
import CelulasCuerpoPage from "./app/espacio/CelulasCuerpoPage";
import { ExitIntentSubscribeModal } from "./components/global/ExitIntentSubscribeModal";
import { MiniDiario } from "./components/global/MiniDiario";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const userId = sessionStorage.getItem("userId");
  if (!userId) return <Navigate to="/welcome" replace />;
  return <>{children}</>;
}

export default function App()
{
  return (
    <>
    <ScrollToTop />
    <ExitIntentSubscribeModal />
    <MiniDiario />
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/logIn" element={<LogIn />} />
      <Route path="/signIn" element={<SignIn />} />
      <Route path="/auth/google/callback" element={<GoogleAuthCallback />} />
      <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
      <Route path="/quienSoy" element={<QuienSoy />} />

      <Route path="/productos" element={<Productos />} />

      <Route path="/reels" element={<ReelsPage />} />
      <Route path="/videos" element={<VideosPage />} />
      <Route path="/videos/:videoId" element={<VideoPage />} />
      <Route path="/libros" element={<LibrosPage />} />
      <Route path="/libros/descargar" element={<DescargarLibroPage />} />
      <Route path="/contacto" element={<Contacto />} />
      <Route path="/opiniones" element={<Opiniones />} />
      <Route path="/elMetodo" element={<ElMetodo />} />
      <Route path="/materiales" element={<MaterialesGratuitos />} />
      <Route path="/ilustraciones" element={<Ilustraciones />} />
      <Route path="/checkoutMetodo" element={<CheckoutMetodo />} />
      <Route path="/metodo/astrologia" element={<PrivateRoute><MetodoAstrologia /></PrivateRoute>} />
      <Route path="/metodo/astrologia/solascendenteluna" element={<PrivateRoute><MetodoAstrologiaSolAscLuna /></PrivateRoute>} />
      <Route path="/metodo/astrologia/cartaAstral" element={<PrivateRoute><MetodoAstrologiaCartaAstral /></PrivateRoute>} />
      <Route path="/metodo/astrologia/lectura" element={<PrivateRoute><MetodoAstrologiaLectura /></PrivateRoute>} />
      <Route path="/metodo/astrologia/planetas" element={<PrivateRoute><MetodoAstrologiaPlanetas /></PrivateRoute>} />
      <Route path="/metodo/astrologia/casas" element={<PrivateRoute><MetodoAstrologiaCasas /></PrivateRoute>} />
      <Route path="/metodo/astrologia/aspectos" element={<PrivateRoute><MetodoAstrologiaAspectos /></PrivateRoute>} />
      <Route path="/metodo/astrologia/llamada" element={<PrivateRoute><MetodoAstrologiaLlamada /></PrivateRoute>} />
      <Route path="/metodo/astrologia/cursos" element={<PrivateRoute><MetodoAstrologiaCursos /></PrivateRoute>} />
      <Route path="/metodo/astrologia/:planetaKey/:campo" element={<PrivateRoute><MetodoAstrologiaProfundizar /></PrivateRoute>} />
      <Route path="/admin" element={<PrivateRoute><AdminHome /></PrivateRoute>} />
      <Route path="/admin/cursos" element={<PrivateRoute><AdminCursos /></PrivateRoute>} />
      <Route path="/admin/cursos/:id" element={<PrivateRoute><AdminCursoEditor /></PrivateRoute>} />
      <Route path="/admin/astrologia-textos" element={<PrivateRoute><AdminAstrologiaTextos /></PrivateRoute>} />
      <Route path="/admin/astrologia/:userId" element={<PrivateRoute><AdminAstrologiaEditor /></PrivateRoute>} />
      <Route path="/admin/psicologia/:userId" element={<PrivateRoute><AdminPsicologiaLectura /></PrivateRoute>} />
      <Route path="/admin/ayurveda/:userId" element={<PrivateRoute><AdminAyurvedaLectura /></PrivateRoute>} />
      <Route path="/admin/:disciplina/:userId" element={<PrivateRoute><AdminEditorPlaceholder /></PrivateRoute>} />
      <Route path="/admin/:disciplina" element={<PrivateRoute><AdminUsuarios /></PrivateRoute>} />
      <Route path="/metodo/psicologia" element={<PrivateRoute><MetodoPsicologia /></PrivateRoute>} />
      <Route path="/metodo/psicologia/:experienciaId/problema" element={<PrivateRoute><MetodoPsicologiaProblema /></PrivateRoute>} />
      <Route path="/metodo/psicologia/:experienciaId/necesidades" element={<PrivateRoute><MetodoPsicologiaNecesidades /></PrivateRoute>} />
      <Route path="/metodo/psicologia/:experienciaId/ace" element={<PrivateRoute><MetodoPsicologiaAce /></PrivateRoute>} />
      <Route path="/metodo/psicologia/:experienciaId/ace-resultado" element={<PrivateRoute><MetodoPsicologiaAceResultado /></PrivateRoute>} />
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
      <Route path="/metodo/tcm/elemento/:elemento" element={<PrivateRoute><MetodoTcmElemento /></PrivateRoute>} />
      <Route path="/metodo/tcm/perfil" element={<PrivateRoute><MetodoTcmPerfil /></PrivateRoute>} />
      <Route path="/metodo/tcm/ciclos" element={<PrivateRoute><MetodoTcmCiclos /></PrivateRoute>} />
      <Route path="/metodo/tcm/diagnostico" element={<PrivateRoute><MetodoTcmDiagnostico /></PrivateRoute>} />
      <Route path="/metodo/tcm/lengua" element={<PrivateRoute><MetodoTcmLengua /></PrivateRoute>} />
      <Route path="/metodo/tcm/lengua/leer" element={<PrivateRoute><MetodoTcmLenguaLeer /></PrivateRoute>} />
      <Route path="/metodo/tcm/cursos" element={<PrivateRoute><MetodoTcmCursos /></PrivateRoute>} />
      <Route path="/metodo/fisiologia" element={<PrivateRoute><MetodoFisiologia /></PrivateRoute>} />
      <Route path="/metodo/fisiologia/niveles" element={<PrivateRoute><MetodoFisiologiaNiveles /></PrivateRoute>} />
      <Route path="/metodo/fisiologia/cursos" element={<PrivateRoute><MetodoFisiologiaCursos /></PrivateRoute>} />
      <Route path="/metodo/fisiologia/particulas" element={<PrivateRoute><MetodoFisiologiaParticulas /></PrivateRoute>} />
      <Route path="/metodo/fisiologia/atomos" element={<PrivateRoute><MetodoFisiologiaAtomos /></PrivateRoute>} />
      <Route path="/metodo/fisiologia/moleculas" element={<PrivateRoute><MetodoFisiologiaMoleculas /></PrivateRoute>} />
      <Route path="/metodo/fisiologia/macromoleculas" element={<PrivateRoute><MetodoFisiologiaMacromoleculas /></PrivateRoute>} />
      <Route path="/metodo/fisiologia/estructuras" element={<PrivateRoute><MetodoFisiologiaEstructuras /></PrivateRoute>} />
      <Route path="/metodo/fisiologia/celula" element={<PrivateRoute><MetodoFisiologiaCelula /></PrivateRoute>} />
      <Route path="/metodo/fisiologia/todas-tus-celulas" element={<PrivateRoute><MetodoFisiologiaTodasCelulas /></PrivateRoute>} />
      <Route path="/metodo/fisiologia/tejidos" element={<PrivateRoute><MetodoFisiologiaTejidos /></PrivateRoute>} />
      <Route path="/metodo/fisiologia/organos" element={<PrivateRoute><MetodoFisiologiaOrganos /></PrivateRoute>} />
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
      <Route path="/metodo/nutricion/plato" element={<PrivateRoute><MetodoNutricionPlato /></PrivateRoute>} />
      <Route path="/metodo/nutricion/mitos" element={<PrivateRoute><MetodoNutricionMitos /></PrivateRoute>} />
      <Route path="/metodo/nutricion/alimentos" element={<PrivateRoute><MetodoNutricionAlimentos /></PrivateRoute>} />
      <Route path="/metodo/nutricion/alimentos/:key" element={<PrivateRoute><MetodoNutricionAlimento /></PrivateRoute>} />
      <Route path="/metodo/nutricion/cursos" element={<PrivateRoute><MetodoNutricionCursos /></PrivateRoute>} />

      <Route path="/metodo/cabala" element={<PrivateRoute><MetodoCabala /></PrivateRoute>} />
      <Route path="/metodo/cabala/arbol" element={<PrivateRoute><MetodoCabalaArbol /></PrivateRoute>} />
      <Route path="/metodo/cabala/sefira/:key" element={<PrivateRoute><MetodoCabalaSefira /></PrivateRoute>} />

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
      <Route path="/aprendizaje/todosVideos" element={<NuevosCursosPage />} />
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


      <Route path="*" element={<Welcome />} />
    </Routes>
    </>
  );
}


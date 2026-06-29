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
import AdminEditorPlaceholder from "./app/admin/AdminEditorPlaceholder";
import AdminCursos from "./app/admin/AdminCursos";
import AdminCursoEditor from "./app/admin/AdminCursoEditor";
import MetodoPsicologia from "./app/metodo/MetodoPsicologia";
import MetodoPsicologiaProblema from "./app/metodo/MetodoPsicologiaProblema";
import MetodoPsicologiaNecesidades from "./app/metodo/MetodoPsicologiaNecesidades";
import MetodoPsicologiaExperiencia from "./app/metodo/MetodoPsicologiaExperiencia";
import MetodoPsicologiaHuellas from "./app/metodo/MetodoPsicologiaHuellas";
import MetodoPsicologiaNudos from "./app/metodo/MetodoPsicologiaNudos";
import MetodoPsicologiaHuellasNudos from "./app/metodo/MetodoPsicologiaHuellasNudos";
import MetodoPsicologiaIntegracion from "./app/metodo/MetodoPsicologiaIntegracion";
import MetodoPsicologiaMapa from "./app/metodo/MetodoPsicologiaMapa";
import MetodoPsicologiaCompromiso from "./app/metodo/MetodoPsicologiaCompromiso";
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
      <Route path="/admin/astrologia/:userId" element={<PrivateRoute><AdminAstrologiaEditor /></PrivateRoute>} />
      <Route path="/admin/:disciplina/:userId" element={<PrivateRoute><AdminEditorPlaceholder /></PrivateRoute>} />
      <Route path="/admin/:disciplina" element={<PrivateRoute><AdminUsuarios /></PrivateRoute>} />
      <Route path="/metodo/psicologia" element={<PrivateRoute><MetodoPsicologia /></PrivateRoute>} />
      <Route path="/metodo/psicologia/:experienciaId/problema" element={<PrivateRoute><MetodoPsicologiaProblema /></PrivateRoute>} />
      <Route path="/metodo/psicologia/:experienciaId/necesidades" element={<PrivateRoute><MetodoPsicologiaNecesidades /></PrivateRoute>} />
      <Route path="/metodo/psicologia/:experienciaId/huellas" element={<PrivateRoute><MetodoPsicologiaHuellas /></PrivateRoute>} />
      <Route path="/metodo/psicologia/:experienciaId/nudos" element={<PrivateRoute><MetodoPsicologiaNudos /></PrivateRoute>} />
      <Route path="/metodo/psicologia/:experienciaId/huellas-nudos" element={<PrivateRoute><MetodoPsicologiaHuellasNudos /></PrivateRoute>} />
      <Route path="/metodo/psicologia/:experienciaId/integracion" element={<PrivateRoute><MetodoPsicologiaIntegracion /></PrivateRoute>} />
      <Route path="/metodo/psicologia/:experienciaId/mapa" element={<PrivateRoute><MetodoPsicologiaMapa /></PrivateRoute>} />
      <Route path="/metodo/psicologia/:experienciaId/compromiso" element={<PrivateRoute><MetodoPsicologiaCompromiso /></PrivateRoute>} />
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


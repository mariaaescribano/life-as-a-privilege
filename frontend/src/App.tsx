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
import HerbarioPage from "./app/aprendizaje/HerbarioPage";
import AlimentosPage from "./app/aprendizaje/AlimentosPage";
import CalcularNecesidadesPage from "./app/aprendizaje/CalcularNecesidadesPage";
import TestDoshasPage from "./app/aprendizaje/TestDoshasPage";
import EspacioHome from "./app/espacio/main/EspacioHome";
import ExpandablePage from "./app/espacio/main/ThemePreguntas";
import QuienSoy from "./app/web/QuienSoy";
import Productos from "./app/web/Productos";
// import ProductoDetalle from "./app/web/ProductoDetalle";
import ReelsPage from "./app/web/Reels";
import VideosPage from "./app/web/VideosPage";
import VideoPage from "./app/web/VideoPage";
import LibrosPage from "./app/web/LibrosPage";
import Contacto from "./app/web/Contacto";
import Opiniones from "./app/web/Opiniones";
import ElMetodo from "./app/web/ElMetodo";
import CheckoutMetodo from "./app/web/CheckoutMetodo";
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
      {/* <Route path="/productos/:id" element={<ProductoDetalle />} /> */}

      <Route path="/reels" element={<ReelsPage />} />
      <Route path="/videos" element={<VideosPage />} />
      <Route path="/videos/:videoId" element={<VideoPage />} />
      <Route path="/libros" element={<LibrosPage />} />
      <Route path="/contacto" element={<Contacto />} />
      <Route path="/opiniones" element={<Opiniones />} />
      <Route path="/elMetodo" element={<ElMetodo />} />
      <Route path="/checkoutMetodo" element={<CheckoutMetodo />} />
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
      <Route path="/aprendizaje/nuevosCursos" element={<NuevosCursosPage />} />
      <Route path="/aprendizaje/cursosModalidad/:moduloId" element={<CursosModalidad />} />
      <Route path="/aprendizaje/herbario" element={<HerbarioPage />} />
      <Route path="/aprendizaje/herbario/favoritos" element={<PrivateRoute><HerbarioPage favoritesOnly /></PrivateRoute>} />
      <Route path="/aprendizaje/alimentos" element={<AlimentosPage />} />
      <Route path="/aprendizaje/alimentos/favoritos" element={<PrivateRoute><AlimentosPage favoritesOnly /></PrivateRoute>} />
      <Route path="/aprendizaje/calcular-necesidades" element={<CalcularNecesidadesPage />} />
      <Route path="/aprendizaje/test-doshas" element={<TestDoshasPage />} />
      <Route path="/aprendizaje/modulosPage/:modalidadId/:cursoId" element={<ModulosPage />} />
      <Route path="/aprendizaje/videoLessonPage/:moduloId/:submoduloId" element={<VideoLessonPage />} />

      <Route path="/recursos/:moduloId" element={<RecursosPage />} />


      <Route path="*" element={<Welcome />} />
    </Routes>
    </>
  );
}


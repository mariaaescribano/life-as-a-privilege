import React, { useEffect } from "react";
import Welcome from "./app/web/Welcome";
import { Route, Routes, useLocation } from "react-router-dom";
import LogIn from "./app/auth/LogIn";
import SignIn from "./app/auth/SignIn";
import Home from "./app/home/Home";
import { AprendizajeHome } from "./app/aprendizaje/AprendizajeHome";
import ModulosPage from "./app/aprendizaje/ModulosPage";
import VideoLessonPage from "./app/aprendizaje/VideoLessonPage";
import EspacioHome from "./app/espacio/main/EspacioHome";
import ExpandablePage from "./app/espacio/main/ThemePreguntas";
import QuienSoy from "./app/web/QuienSoy";
import Productos from "./app/web/Productos";
import ProductoDetalle from "./app/web/ProductoDetalle";
import ReelsPage from "./app/web/Reels";
import RecursosPage from "./app/recursos/RecursosPage";
import TCMTest1 from "./components/espacio/components/TCMTest1";
import TCMTest2 from "./components/espacio/components/TCMTest2";
import TCMTest3 from "./components/espacio/components/TCMTest3";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App()
{
  return (
    <>
    <ScrollToTop />
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/logIn" element={<LogIn />} />
      <Route path="/signIn" element={<SignIn />} />
      <Route path="/home" element={<Home />} />
      <Route path="/quienSoy" element={<QuienSoy />} />

      <Route path="/productos" element={<Productos />} />
      <Route path="/productos/:id" element={<ProductoDetalle />} />

      <Route path="/reels" element={<ReelsPage />} />

      <Route path="/tcm/test/1" element={<TCMTest1 />} />
      <Route path="/tcm/test/2" element={<TCMTest2 />} />
      <Route path="/tcm/test/3" element={<TCMTest3 />} />
      
      <Route path="/espacio/espacioHome" element={<EspacioHome />} />
      <Route path="/espacio/questions/:themeId" element={<ExpandablePage />} />
      
      <Route path="/aprendizaje/aprendizajeHome" element={<AprendizajeHome />} />
      <Route path="/aprendizaje/modulosPage/:moduloId" element={<ModulosPage />} />
      <Route path="/aprendizaje/videoLessonPage/:moduloId/:submoduloId" element={<VideoLessonPage />} />

      <Route path="/recursos/:moduloId" element={<RecursosPage />} />
      
      
      <Route path="*" element={<Welcome />} />
    </Routes>
    </>
  );
}


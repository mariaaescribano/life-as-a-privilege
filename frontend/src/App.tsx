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
import FitoterapiaPage from "./app/web/Fitoterapia";
import TCMTests from "./app/web/TCMTests";
import TCMTest1 from "./app/web/TCMTest1";
import RecursosPage from "./app/recursos/RecursosPage";

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


      <Route path="/fitoterapia" element={<FitoterapiaPage />} />
      <Route path="/tcm/tests" element={<TCMTests />} />
      <Route path="/tcm/test/1" element={<TCMTest1 />} />
      
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


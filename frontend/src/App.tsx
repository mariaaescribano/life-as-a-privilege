import React from "react";
import Welcome from "./app/web/Welcome";
import { Route, Routes } from "react-router-dom";
import LogIn from "./app/auth/LogIn";
import SignIn from "./app/auth/SignIn";
import Home from "./app/home/Home";
import { AprendizajeHome } from "./app/aprendizaje/AprendizajeHome";
import ModulosPage from "./app/aprendizaje/ModulosPage";
import VideoLessonPage from "./app/aprendizaje/VideoLessonPage";
import Mandala from "./app/espacio/Mandala";
import ExpandablePage from "./app/espacio/ThemePreguntas";

export default function App() 
{
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/logIn" element={<LogIn />} />
      <Route path="/signIn" element={<SignIn />} />
      <Route path="/home" element={<Home />} />
      
      <Route path="/espacio/espacioHome" element={<Mandala />} />
      <Route path="/espacio/questions/:themeId" element={<ExpandablePage />} />
      
      <Route path="/aprendizaje/aprendizajeHome" element={<AprendizajeHome />} />
      <Route path="/aprendizaje/modulosPage/:moduloId" element={<ModulosPage />} />
      <Route path="/aprendizaje/videoLessonPage/:moduloId/:submoduloId" element={<VideoLessonPage />} />
      
      
      <Route path="*" element={<Welcome />} />
    </Routes>
  );
}


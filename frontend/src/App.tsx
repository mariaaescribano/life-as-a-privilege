import React, { useEffect, useState } from "react";
import Welcome from "./app/web/Welcome";
import { Route, Routes } from "react-router-dom";
import LogIn from "./app/auth/LogIn";
import SignIn from "./app/auth/SignIn";
import Home from "./app/home/Home";

export default function App() 
{
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/logIn" element={<LogIn />} />
      <Route path="/signIn" element={<SignIn />} />
      <Route path="/home" element={<Home />} />
      <Route path="*" element={<Welcome />} />
    </Routes>
  );
}


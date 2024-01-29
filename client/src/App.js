import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Auth from "./pages/Auth";
import Chats from "./pages/Chats";
const App = () => {
  return (
    <div className="h-screen overflow-hidden relative w-screen bg-opacity-50 bg-slate-50">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/chats" element={<Chats />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;

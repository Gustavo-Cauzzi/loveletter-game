import { Rooms } from "../pages/Rooms";
import { BrowserRouter, Route, Routes } from "react-router";
import { Authentication } from "./Authentication";
import { Lobby } from "../pages/Lobby";
import { Game } from "../pages/Game";

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Authentication>
        <Routes>
          <Route path="/" element={<Rooms />} />
          <Route path="/room/:id" element={<Lobby />} />
          <Route path="/game" element={<Game />} />
        </Routes>
      </Authentication>
    </BrowserRouter>
  );
};

import { Rooms } from "../pages/Rooms";
import { BrowserRouter, Route, Routes } from "react-router";
import { Authentication } from "./Authentication";
import { Lobby } from "../pages/Lobby";

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Authentication>
        <Routes>
          <Route path="/" element={<Rooms />} />
          <Route path="/room/:id" element={<Lobby />} />
        </Routes>
      </Authentication>
    </BrowserRouter>
  );
};

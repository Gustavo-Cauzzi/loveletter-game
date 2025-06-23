import { Rooms } from "../pages/Rooms";
import { BrowserRouter, Route, Routes } from "react-router";
import { Authentication } from "./Authentication";

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Authentication>
        <Routes>
          <Route path="/" element={<Rooms />} />
        </Routes>
      </Authentication>
    </BrowserRouter>
  );
};

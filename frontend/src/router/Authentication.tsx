import { Route, Routes } from "react-router";
import { useAuth } from "../hooks/auth";
import { Login } from "../pages/Login";
import { CircularProgress } from "@mui/material";

export const Authentication = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="*" element={<Login />} />
      </Routes>
    );
  }

  return <>{children}</>;
};

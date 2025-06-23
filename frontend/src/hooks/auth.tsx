import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { User } from "../types/User.types";
import { useFakeLogin } from "../api/login";
import { api } from "../services/api";
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  fakeLoginAs: (username: string) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

interface DecodedToken {
  username: string;
  id: string;
  isFakeUser: boolean;
  expirationDate: string;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const { mutateAsync: fakeLogin, isPending } = useFakeLogin();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode<DecodedToken>(token);
      setUser({
        id: decoded.id,
        username: decoded.username,
      });
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
    }

    return () => {
      localStorage.removeItem("token");
    };
  }, []);

  const fakeLoginAs = async (username: string) => {
    const { token, id } = await fakeLogin(username);
    localStorage.setItem("token", token);
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    setUser({
      id,
      username,
    });
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    fakeLoginAs,
    isLoading: isPending,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

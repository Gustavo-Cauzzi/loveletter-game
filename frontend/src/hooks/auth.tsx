import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  type ReactNode,
} from "react";
import type { User } from "../types/User.types";
import { useFakeLogin } from "../api/login";
import { api } from "../services/api";
import { jwtDecode } from "jwt-decode";
import { socketService } from "../services/socket-io";

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
  const hasInitialized = useRef(false);

  const authenticate = (token: string) => {
    localStorage.setItem("token", token);
    const decoded = jwtDecode<DecodedToken>(token);
    setUser({
      id: decoded.id,
      username: decoded.username,
    });
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    socketService.connect(token);
  };

  useEffect(() => {
    // Prevent double initialization (React dev problem)
    if (hasInitialized.current) return;

    const token = localStorage.getItem("token");
    if (token) {
      authenticate(token);
    }

    hasInitialized.current = true;
  }, []);

  const fakeLoginAs = async (username: string) => {
    const { token } = await fakeLogin(username);
    authenticate(token);
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

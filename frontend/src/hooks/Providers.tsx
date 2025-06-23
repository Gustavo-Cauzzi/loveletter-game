import { AuthProvider } from "./auth";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return <AuthProvider>{children}</AuthProvider>;
};

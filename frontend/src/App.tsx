import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppRouter } from "./router/AppRouter";
import { Providers } from "./hooks/Providers";
import { Toaster } from "react-hot-toast";

export function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Providers>
        <Toaster position="bottom-left" />
        <AppRouter />
      </Providers>
    </QueryClientProvider>
  );
}

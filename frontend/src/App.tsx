import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppRouter } from "./router/AppRouter";
import { Providers } from "./hooks/Providers";

export function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Providers>
        <AppRouter />
      </Providers>
    </QueryClientProvider>
  );
}

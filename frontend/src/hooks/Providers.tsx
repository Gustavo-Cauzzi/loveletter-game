import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import { AuthProvider } from "./auth";
import { useMemo } from "react";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  // Detect system preference for dark mode
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const baseTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? "dark" : "light",

          primary: {
            main: prefersDarkMode ? "#a88d77" : "#3f2917",
          },
          secondary: {
            main: "#f5f5f5",
          },
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: "none",
              },
            },
          },
        },
      }),
    [prefersDarkMode]
  );

  return (
    <ThemeProvider theme={baseTheme}>
      <AuthProvider>{children}</AuthProvider>
    </ThemeProvider>
  );
};

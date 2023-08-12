"use client";

import {
  StyledEngineProvider,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import "./globals.css";
import PriceProvider from "@/context/PriceContext";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface layout {
  children: React.ReactNode;
}

export default function RootLayout({ children }: layout) {
  const theme = createTheme({
    palette: {
      primary: {
        main: "#253993",
      },
      secondary: {
        main: "#1a3045",
      },
    },
  });

  return (
    <html lang="en">
      <head>
        <title>Truck Rental</title>
      </head>
      <body>
        <PriceProvider>
          <ThemeProvider theme={theme}>
            <StyledEngineProvider injectFirst={true}>
              <ToastContainer
                progressStyle={{ background: "#253993" }}
                autoClose={1000}
                position="bottom-right"
              />

              {children}
            </StyledEngineProvider>
          </ThemeProvider>
        </PriceProvider>
      </body>
    </html>
  );
}

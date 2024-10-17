import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "./contexts/authContext.tsx";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import Router from "./routes.tsx";
import "./global.css";
import { Toaster } from "./components/ui/toaster.tsx";
import { queryClient } from "./lib/query.ts";
import { ThemeProvider } from "./providers/theme-provider.tsx";

// biome-ignore lint/style/noNonNullAssertion: It's okay to use non-null assertion here because we know that the element with the ID "root" exists.
createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <ThemeProvider defaultTheme="dark" storageKey="@meusrecibos:theme">
                    <AuthProvider>
                        <Router />
                        <Toaster />
                    </AuthProvider>
                </ThemeProvider>
            </BrowserRouter>
        </QueryClientProvider>
    </StrictMode>,
);

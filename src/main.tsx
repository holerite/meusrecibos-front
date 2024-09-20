import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "./hooks/use-auth.tsx";
import { BrowserRouter } from "react-router-dom";
import {
	QueryClient,
	QueryClientProvider,
} from '@tanstack/react-query'
import Router from "./routes.tsx";
import "./global.css";

const queryClient = new QueryClient()

// biome-ignore lint/style/noNonNullAssertion: It's okay to use non-null assertion here because we know that the element with the ID "root" exists.
createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<BrowserRouter>
			<AuthProvider>
				<QueryClientProvider client={queryClient}>
					<Router />
				</QueryClientProvider>
			</AuthProvider>
		</BrowserRouter>
	</StrictMode>,
);

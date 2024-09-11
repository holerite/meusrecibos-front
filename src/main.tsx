import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./global.css";
import Router from "./routes.tsx";
import { AuthProvider } from "./hooks/use-auth.tsx";
import { BrowserRouter } from "react-router-dom";

// biome-ignore lint/style/noNonNullAssertion: It's okay to use non-null assertion here because we know that the element with the ID "root" exists.
createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<BrowserRouter>
			<AuthProvider>
				<Router />
			</AuthProvider>
		</BrowserRouter>
	</StrictMode>,
);

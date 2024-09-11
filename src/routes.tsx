import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { Login, NotFound, Settings, Token, Workspace } from "@/pages";
import { Layout } from "./components/layout";
import { AuthContext } from "./hooks/use-auth";
import { useContext } from "react";


export default function Router() {
	const { user, routes } = useContext(AuthContext);
	return (
		<Routes>
			{user?.id === undefined ? (
				<>
					<Route path="/" element={<Login />} />
					<Route path="/verify" element={<Token />} />
					<Route path="/workspace" element={<Workspace />} />
					<Route path="*" element={<Navigate to="/" replace={true} />} />

				</>
			) : (
				<>
					<Route
						element={
							<Layout>
								<Outlet />
							</Layout>
						}
					>
						{routes.map((route) => {
							return (
								<>
									<Route key={`${route.href}`} path={route.href} element={
										<>
											<div className="mx-auto grid w-full  max-w-7xl gap-2">
												<h1 className="text-3xl font-semibold">{route.title}</h1>
											</div>
											{route.element}
										</>} />
								</>
							)
						})}
						<Route path="/404" element={<NotFound />} />
						<Route path="*" element={<Navigate to="/404" replace={true} />} />
					</Route>
				</>
			)}
		</Routes>
	);
}

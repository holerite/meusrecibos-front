import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { Login, Token, Workspace } from "@/pages";
import { Layout } from "./components/layout";
import { AuthContext } from "./hooks/use-auth";
import React, { useContext } from "react";


export default function Router() {
	const { user, routes, loading } = useContext(AuthContext);
    
	return (
		<>
			{loading === false && (
				<Routes>
					{user === null ? (
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
								{routes?.map((route) => {
                                    console.log(route);
                                    
									return (
										<React.Fragment key={route.name}>
											<Route key={`${route.route}`} path={route.route} element={
												<>
													<div className="mx-auto grid w-full  gap-2">
														<h1 className="text-3xl font-semibold">{route.name}</h1>
													</div>
													{route.element}
												</>} />
										</React.Fragment>
									)
								})}
								{/* <Route path="/404" element={<NotFound />} />
						<Route path="*" element={<Navigate to="/404" replace={true} />} /> */}
							</Route>
						</>
					)}
				</Routes>
			)}

		</>

	);
}

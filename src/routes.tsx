import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { Login, NotFound, Token, Workspace } from "@/pages";
import { Layout } from "./components/layout";
import React from "react";
import { EmployeesLogin } from "./pages/employeesAuth/employees.login";
import { EmployeesToken } from "./pages/employeesAuth/employees.token";
import { EmployeesWorkspace } from "./pages/employeesAuth/employees.workspace";
import { useAuth } from "./hooks/use-auth";


export default function Router() {
	const { user, routes, loading } = useAuth();
    
	return (
		<>
			{loading === false && (
				<Routes>
					{user === null ? (
						<>
                            {/* Admin */}
							<Route path="/" element={<Login />} />
							<Route path="/verify" element={<Token />} />
							<Route path="/workspace" element={<Workspace />} />
							<Route path="*" element={<Navigate to="/" replace={true} />} />

                            {/* Colaborador */}
							<Route path="/employees/" element={<EmployeesLogin />} />
							<Route path="/employees/verify" element={<EmployeesToken />} />
							<Route path="/employees/workspace" element={<EmployeesWorkspace />} />

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
									return (
										<React.Fragment key={route.name}>
											<Route key={`${route.route}`} path={route.route} element={route.element} />
										</React.Fragment>
									)
								})}
								<Route path="/404" element={<NotFound />} />
						            <Route path="*" element={<Navigate to="/404" replace={true} />} />
							    </Route>
						</>
					)}
				</Routes>
			)}

		</>

	);
}

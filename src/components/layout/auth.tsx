import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardTitle } from "../ui/card";
import { DarkModeToggle } from "./dark-mode-toggle";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { useLocation, useNavigate } from "react-router-dom";

interface IAuthLayoutProps {
	children: ReactNode;
	title: string;
	description: string;
}

export function AuthLayout({ children, title, description }: IAuthLayoutProps) {
	const { pathname } = useLocation();
	const navigate = useNavigate();

	return (
		<div className="w-screen h-screen flex items-center justify-center relative">
			<div className="flex flex-col gap-4 max-w-sm w-full px-4">
				{(pathname === "/" || pathname === "/employees") && (
					<Tabs
						defaultValue={pathname}
						onValueChange={(tab) => {
							navigate(tab);
						}}
						className="w-full"
					>
						<TabsList className="w-full">
							<TabsTrigger className="w-full" value="/">
								Gestor
							</TabsTrigger>
							<TabsTrigger className="w-full" value="/employees">
								Colaborador
							</TabsTrigger>
						</TabsList>
					</Tabs>
				)}
				<Card className="shadow-none border-none max-w-sm w-full bg-none">
					<CardTitle className="text-xl">{title}</CardTitle>
					<CardDescription>{description}</CardDescription>
					<CardContent className="p-0 mt-4">{children}</CardContent>
				</Card>
			</div>
			<div className="absolute top-4 right-4">
				<DarkModeToggle />
			</div>
		</div>
	);
}

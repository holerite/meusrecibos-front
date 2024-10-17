import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardTitle } from "../ui/card";
import { DarkModeToggle } from "./dark-mode-toggle";

interface IAuthLayoutProps {
    children: ReactNode;
    title: string;
    description: string;
}

export function AuthLayout({ children, title, description }: IAuthLayoutProps) {
    return (
        <div className="w-screen h-screen flex items-center justify-center relative">
            <Card className="shadow-none border-none max-w-sm w-full bg-none mx-4">
                <CardTitle className="text-xl">{title}</CardTitle>
                <CardDescription>
                    {description}
                </CardDescription>
                <CardContent className="p-0 mt-4">
                    {children}
                </CardContent>
            </Card>
            <div className="absolute top-4 right-4">
                <DarkModeToggle />
            </div>
        </div>
    );
}
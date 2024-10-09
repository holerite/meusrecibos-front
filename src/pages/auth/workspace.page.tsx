import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AuthContext } from "@/hooks/use-auth";
import { useContext, useEffect, useState } from "react";
import { Loader2Icon } from "lucide-react";

interface ICompany {
    id: number;
    name: string;
    role?: string;
}

export function Workspace() {
    const { signIn, loading } = useContext(AuthContext);
    const [companies, setCompanies] = useState<ICompany[]>([]);

    function selectWorkspace(id: number) {
        signIn(id);
    }

    useEffect(() => {
        const companies = JSON.parse(localStorage.getItem("meusrecibos:companies") || "[]") as ICompany[];
        setCompanies(companies);
    }, []);

    return (
        <div className="w-screen h-screen flex items-center justify-center">
            <Card className="shadow-none border-none max-w-sm w-full bg-none">
                <CardTitle className="text-xl">Entre na empresa</CardTitle>
                <CardDescription>
                    Se você não vê sua empresa aqui, solicite um convite
                </CardDescription>
                {!loading ? (
                    <CardContent className="mt-4 px-0">
                        <div className="w-full flex flex-col gap-4 max-h-48 overflow-y-auto">
                            {companies.map(company => {
                                return (
                                    <button
                                        type="button"
                                        onClick={
                                            () => {
                                                selectWorkspace(company.id);
                                            }
                                        }
                                        key={company.id}
                                        className="flex gap-4 items-center border border-gray-400 p-4 w-full rounded-lg"
                                    >
                                        <Avatar className="rounded-md">
                                            <AvatarImage className="rounded-md" src="https://gisthub.com/shadcn.png" />
                                            <AvatarFallback className="rounded-md">{company.name.slice(0, 2)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <h1>{company.name}</h1>
                                            <p className="text-sm text-stone-400">{company?.role || ""}</p>
                                        </div>
                                    </button>
                                )
                            })}
                        </div>
                    </CardContent>
                ) : (
                    <CardContent className="mt-4 px-0 flex items-center justify-center">
                        <Loader2Icon className="animate-spin w-8 h-8 text-primary" />
                    </CardContent>
                 )}
            </Card>
        </div>
    );
}

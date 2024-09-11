import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AuthContext } from "@/hooks/use-auth";
import { useContext } from "react";


export function Workspace() {
    const { signIn } = useContext(AuthContext);

    // 2. Define a submit handler.
    function selectWorkspace() {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        signIn()
    }

    return (
        <div className="w-screen h-screen flex items-center justify-center">
            <Card className="shadow-none border-none max-w-sm w-full bg-none">
                <CardTitle className="text-xl">Entre na empresa</CardTitle>
                <CardDescription>
                    Conectado como <strong>email</strong>. <br />Se você não vê sua empresa aqui, solicite um convite para a conectar
                </CardDescription>
                <CardContent className="mt-4 px-0">
                    <div className="w-full flex flex-col gap-4 max-h-48 overflow-scroll">
                        {new Array(4).fill(0).map((_, index) => {
                            return (
                                <button type="button" onClick={selectWorkspace} key={index} className="flex gap-7 items-center border border-gray-400 p-4 w-full rounded-lg">
                                    <Avatar className="rounded-md">
                                        <AvatarImage className="rounded-md" src="https://gisthub.com/shadcn.png" />
                                        <AvatarFallback className="rounded-md">CN</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <h1>Empresa</h1>
                                        <p className="text-sm text-stone-400">Admin</p>
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

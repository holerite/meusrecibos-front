import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function NotFound() {
    return (
        <div
            className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm" x-chunk="dashboard-02-chunk-1"
        >
            <div className="flex flex-col items-center gap-1 text-center">
                <h3 className="text-2xl font-bold tracking-tight">
                    Página não encontrada
                </h3>
                <p className="text-sm text-muted-foreground">
                    Caso a página que você procura exista, verifique se o endereço está correto ou entre em contato com o <Link to={"#"} className="font-semibold underline">suporte</Link>.
                </p>
                <Button className="mt-4">Voltar para o início</Button>
            </div>
        </div>
    )
}
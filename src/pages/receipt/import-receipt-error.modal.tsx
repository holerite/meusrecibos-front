import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Table, TableCell, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { IImportReceiptErrorDialogValues } from "./receipt.page";

interface IImportReceiptErrorDialogProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    errors: IImportReceiptErrorDialogValues[]
}

export function ImportReceiptErrorDialog({ isOpen, setIsOpen, errors }: IImportReceiptErrorDialogProps) {

    function handleCloseDialog() {
        setIsOpen(false);
    }

    const totalErrors = errors.reduce((acc, error) => acc + error.pages.length, 0);

    return (
        <>
            <Dialog
                open={isOpen}
                onOpenChange={setIsOpen}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Erro ao importar recibos</DialogTitle>
                    </DialogHeader>
                    <div>
                        <p>Algumas páginas não seguiram o padrão de estrutura do tipo de recibo selecionado. Por favor, verifique as páginas listadas abaixo.</p>
                        <Badge className="mt-2" variant={"destructive"}>
                            Número de páginas não importadas: {totalErrors}
                        </Badge>
                        <Table className="mt-2">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nome do arquivo</TableHead>
                                    <TableHead>Páginas</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {errors.map((error) => (
                                    <TableRow key={error.name}>
                                        <TableCell>{error.name}</TableCell>
                                        <TableCell>{error.pages.join(", ")}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    <DialogFooter>
                        <Button variant={"outline"} onClick={handleCloseDialog}>Fechar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

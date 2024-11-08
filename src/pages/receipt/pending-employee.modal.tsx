import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { MoveRight } from "lucide-react";
import { Link } from "react-router-dom";

interface IPendingEmployeeDialogProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function PendingEmployeeDialog({ isOpen, setIsOpen }: IPendingEmployeeDialogProps) {

    function handleCloseDialog() {
        setIsOpen(false);
    }

    return (
        <>
            <Dialog
                open={isOpen}
                onOpenChange={setIsOpen}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Cadastros pendentes</DialogTitle>
                    </DialogHeader>
                    <div>
                        <p>Existem colaboradores pendentes de cadastro no sistema. Deseja realizar o cadastro agora?</p>
                        <p>Se preferir, você pode realizar o cadastro posteriormente em:</p>
                        <Badge className="mt-2" variant={"secondary"}>
                            Configurações <MoveRight className="mx-2 w-4 h-4" /> Cadastros pendentes
                        </Badge>
                    </div>
                    <DialogFooter>
                        <Button variant={"outline"} onClick={handleCloseDialog}>Fechar</Button>
                        <Link to="/settings?tab=pending-employees">
                            <Button>
                                Cadastrar agora
                            </Button>
                        </Link>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface IDeleteEmployeeAlertProps {
    handleDelete: () => void;
    open: boolean;
    loading: boolean;
    setOpen: (open: boolean) => void;
}

export function DeleteEmployeeAlert({
    handleDelete,
    loading,
    open,
    setOpen,
}: IDeleteEmployeeAlertProps) {

    return (
        <AlertDialog
            open={open}
            onOpenChange={setOpen}
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Deseja realmente realizar essa operação?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Você está prestes a deletar um colaborador. Essa ação não pode ser desfeita.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <Button
                        isLoading={loading}
                        onClick={handleDelete}
                        variant={"destructive"}
                    >
                        Confirmar
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface IDeleteReceiptTypeAlertProps {
    handleDelete: () => void;
    open: boolean;
    loading: boolean;
    setOpen: (open: boolean) => void;
}

export function DeleteReceiptTypeAlert({
    handleDelete,
    loading,
    open,
    setOpen,
}: IDeleteReceiptTypeAlertProps) {

    return (
        <AlertDialog
            open={open}
            onOpenChange={setOpen}
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Deseja realmente realizar essa operação?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Essa ação não pode ser desfeita.
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
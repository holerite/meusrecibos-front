import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { queryClient } from "@/lib/query";
import { receiptTypeSchema, receiptTypeDefaultValues } from "@/utils/forms/receipt-type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ReceiptTypeForm } from "./receipt-type.form";

interface IEditReceiptTypeDialogProps {
    id: number;
    name: string;
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

async function editReceiptType(data: z.infer<typeof receiptTypeSchema>, id: number) {
    return (await api.put('/receipt/type', {
        ...data,
        id
    }));
}

export function EditReceiptTypeDialog({ id, name, isOpen, setIsOpen }: IEditReceiptTypeDialogProps) {
    const { mutate, isPending } = useMutation({
        mutationKey: ['receiptTypeEdit'],
        mutationFn: (values:  z.infer<typeof receiptTypeSchema>) => editReceiptType(values, id),
        onSuccess: () => {
            toast({
                title: "Configuração de recibo editado com sucesso",
            })
            setIsOpen(false);
            form.reset();
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['receiptTypeList'] }),
        onError: (error) => {
            toast({
                variant: "destructive",
                title: "Erro ao editar configuração de recibo",
                description: error?.message || "Erro desconhecido",
            })
        }
    })

    const form = useForm<z.infer<typeof receiptTypeSchema>>({
        resolver: zodResolver(receiptTypeSchema),
        defaultValues: receiptTypeDefaultValues
    });

    function onSubmit(values: z.infer<typeof receiptTypeSchema>) {
        mutate(values);
    }

    useEffect(() => {
        if(!isOpen) return;
        form.setValue('name', name);
    }, [isOpen]);

    return (
        <Dialog
            open={isOpen}
            onOpenChange={setIsOpen}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Editar descrição de recibos</DialogTitle>
                </DialogHeader>
                <ReceiptTypeForm form={form} onSubmit={onSubmit} isPending={isPending} />
            </DialogContent>
        </Dialog>
    )
}
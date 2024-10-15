import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { queryClient } from "@/lib/query";
import { receiptTypeDefaultValues, receiptTypeSchema } from "@/utils/forms/receipt-type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ReceiptTypeForm } from "./receipt-type.form";



async function createReceiptType(data: z.infer<typeof receiptTypeSchema>) {
    return (await api.post('/receipt/type', data));
}

export function CreateReceiptTypeDialog() {
    const [isOpen, setIsOpen] = useState(false);
    const { mutate, isPending } = useMutation({ 
        mutationKey: ['receiptTypeCreate'], 
        mutationFn: createReceiptType, 
        onSuccess: () => {
            toast({
                title: "Configuração de recibo cadastrado com sucesso",
            })
            setIsOpen(false);
            form.reset();
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['receiptTypeList'] }),
        onError: (error) => {
            toast({
                variant: "destructive",
                title: "Erro ao cadastrar configuração de recibo",
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

    return (
        <Dialog
            open={isOpen}
            onOpenChange={setIsOpen}
        >
            <DialogTrigger asChild>
                <Button>Cadastrar descrição</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Cadastrar descrição de recibos</DialogTitle>
                </DialogHeader>
                <ReceiptTypeForm form={form} onSubmit={onSubmit} isPending={isPending} />
            </DialogContent>
        </Dialog>
    )
}
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { queryClient } from "@/lib/query";
import { cn } from "@/lib/utils";
import { receiptsCreateDefaultValues, receiptsCreateSchema } from "@/utils/forms/receipt";
import { fileToBase64 } from "@/utils/masks";
import { IReceiptType } from "@/utils/types/receipt-type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface IImportReceiptDialogProps {
    receiptTypes: IReceiptType[]
}

async function importReceipt(data: z.infer<typeof receiptsCreateSchema>) {
    return (await api.post('/receipt', {
        ...data,
        type: Number(data.type),
    }));
}

export function ImportReceiptDialog({ receiptTypes }: IImportReceiptDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { mutate, isPending } = useMutation({
        mutationKey: ['importReceipt'],
        mutationFn: importReceipt,
        onSuccess: () => {
            toast({
                title: "Colaborador cadastrado com sucesso",
            })
            setIsOpen(false);
            form.reset();
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['receipts'] }),
        onError: (error) => {
            toast({
                variant: "destructive",
                title: "Erro ao cadastrar colaborador",
                description: error?.message || "Erro desconhecido",
            })
        }
    })

    const form = useForm<z.infer<typeof receiptsCreateSchema>>({
        resolver: zodResolver(receiptsCreateSchema),
        defaultValues: receiptsCreateDefaultValues
    });

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            const base64 = await fileToBase64(file);
            form.setValue('file', base64);
        } catch (error) {
            let errorMessage = "Erro desconhecido";
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            toast({
                variant: "destructive",
                title: "Erro ao carregar arquivo",
                description: errorMessage,
            })
            form.setValue('file', '');
        }
    }

    function onSubmit(values: z.infer<typeof receiptsCreateSchema>) {
        mutate(values);
    }

    return (
        <>
            <Dialog
                open={isOpen}
                onOpenChange={setIsOpen}
            >
                <DialogTrigger asChild>
                    <Button>Importar</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Importar recibos</DialogTitle>
                    </DialogHeader>
                    <div>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                                <FormField
                                    control={form.control}
                                    name="type"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Descrição</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={String(field.value)}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {receiptTypes.map((type) => {
                                                        return (
                                                            <SelectItem value={String(type.id)} key={String(type.id)}>
                                                                {type.name}
                                                            </SelectItem>
                                                        );
                                                    })}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="grid grid-cols-2 gap-2.5">
                                    <FormField
                                        control={form.control}
                                        name="validity"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Data de vigência</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Nome do colaborador"
                                                        type="month"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="payday"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Data de pagamento</FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant={"outline"}
                                                                className={cn(
                                                                    "w-full pl-3 text-left font-normal",
                                                                    !field.value && "text-muted-foreground",
                                                                )}
                                                            >
                                                                {field.value ? (
                                                                    format(field.value, "dd LLL y", {
                                                                        locale: ptBR
                                                                    })
                                                                ) : (
                                                                    <span>Selecione uma data</span>
                                                                )}
                                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent
                                                        className="w-auto p-0"
                                                        align="start"
                                                    >
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value}
                                                            onSelect={field.onChange}
                                                            initialFocus
                                                            locale={ptBR}
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="file"
                                    render={(field) => {
                                        return (
                                            <FormItem>
                                                <FormLabel>Recibos</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="file"
                                                        onChange={handleFileChange}
                                                        // accept=".pdf"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        );
                                    }}
                                />
                                <DialogFooter>
                                    <Button
                                        type="submit"
                                        isLoading={isPending}
                                    >
                                        Confirmar
                                    </Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </div>

                </DialogContent>
            </Dialog>
        </>
    );
}

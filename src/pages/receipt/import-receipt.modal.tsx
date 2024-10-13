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
import { Select, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { queryClient } from "@/lib/query";
import { cn } from "@/lib/utils";
import { receiptsCreateDefaultValues, receiptsCreateSchema } from "@/utils/forms/receipt";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

async function importReceipt(data: z.infer<typeof receiptsCreateSchema>) {
    return (await api.post('/receipt', data));
}

export function ImportReceiptDialog() {
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
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['employees'] }),
        onError: (error) => {
            toast({
                title: "Erro ao cadastrar colaborador",
                description: error?.message || "Erro desconhecido",
            })
        }
    })

    const form = useForm<z.infer<typeof receiptsCreateSchema>>({
        resolver: zodResolver(receiptsCreateSchema),
        defaultValues: receiptsCreateDefaultValues
    });

    const fileRef = form.register("receipt");

    function onSubmit(values: z.infer<typeof receiptsCreateSchema>) {
        console.log(values);

        // mutate({
        //     ...values
        // });
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
                                                defaultValue={String(field.value)}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Todos" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {/* {TypeOptions.map((option) => {
                                                                return (
                                                                    <SelectItem value={String(option.type)} key={option.type}>
                                                                        {option.label}
                                                                    </SelectItem>
                                                                );
                                                            })} */}
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
                                    name="receipt"
                                    render={() => {
                                        return (
                                            <FormItem>
                                                <FormLabel>Recibos</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="file"
                                                        {...fileRef}
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

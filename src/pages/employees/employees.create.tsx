import { Button } from "@/components/ui/button";
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
import { toast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { queryClient } from "@/main";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cpfMask, removeMask } from "@/utils/masks";

const schema = z.object({
    name: z.string({
        message: "O nome é obrigatório"
    }),
    email: z.string({
        message: "O email é obrigatório"
    }).email(
        "Email inválido"
    ),
    enrolment: z.string({
        message: "A matrícula é obrigatória"
    }),
    cpf: z.string({
        message: "O CPF é obrigatório"
    }),
});

async function createEmployees(data: z.infer<typeof schema>) {
    return (await api.post('/employees', data));
}

export function CreateEmployeesDialog() {
    const [isOpen, setIsOpen] = useState(false);
    const { mutate, isPending } = useMutation({
        mutationKey: ['createEmployees'],
        mutationFn: createEmployees,
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

    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
    });

    function onSubmit(values: z.infer<typeof schema>) {
        mutate({
            ...values,
            cpf: removeMask(values.cpf)
        });
    }

    return (
        <Dialog
            open={isOpen}
            onOpenChange={setIsOpen}
        >
            <DialogTrigger asChild>
                <Button>Cadastrar colaborador</Button>
            </DialogTrigger>
            <DialogContent aria-describedby="Cadastrar colaborador">
                <DialogHeader>
                    <DialogTitle>Cadastrar colaborador</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>E-mail</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="cpf"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>CPF</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            onChange={(e) => {
                                                form.setValue('cpf', cpfMask(e.target.value))
                                            }}
                                            value={field.value}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="enrolment"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Matrícula</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        <DialogFooter className="mt-4">
                            <Button
                                type="submit"
                                isLoading={isPending}
                            >
                                Confirmar
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
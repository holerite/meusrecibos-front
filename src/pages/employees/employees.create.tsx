import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cpfMask, removeMask } from "@/utils/masks";
import { queryClient } from "@/lib/query";
import { employeesCreateSchema, employeesCreateFormDefaultValues } from "@/utils/forms/employees";
import { PendingEmployeeDto } from "../settings/pending-employees/pending-employee.columns";


async function createEmployees(data: z.infer<typeof employeesCreateSchema>) {
    return (await api.post('/employees', data));
}

interface ICreateEmployeesDialogProps {
    employee?: PendingEmployeeDto
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
}

export function CreateEmployeesDialog({ employee, isOpen, setIsOpen }: ICreateEmployeesDialogProps) {
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
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['employees'] })
            queryClient.invalidateQueries({ queryKey: ['pendingEmployeeList'] })
        },
        onError: (error) => {
            toast({
                variant: "destructive",
                title: "Erro ao cadastrar colaborador",
                description: error?.message || "Erro desconhecido",
            })
        }
    })

    const form = useForm<z.infer<typeof employeesCreateSchema>>({
        resolver: zodResolver(employeesCreateSchema),
        defaultValues: employeesCreateFormDefaultValues
    });

    function onSubmit(values: z.infer<typeof employeesCreateSchema>) {
        mutate({
            ...values,
            enrolmentId: employee?.enrolment.id,
            cpf: removeMask(values.cpf)
        });
    }

    useEffect(() => {
        if (employee) {
            form.setValue('name', employee.name)
            form.setValue('enrolment', employee.enrolment.enrolment)
        }
    }, [employee])

    return (
        <Dialog
            open={isOpen}
            onOpenChange={setIsOpen}
        >
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
                                        <Input 
                                            {...field}
                                            disabled={!!employee}
                                        />
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
                                        <Input 
                                            {...field}
                                            disabled={!!employee}
                                        />
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
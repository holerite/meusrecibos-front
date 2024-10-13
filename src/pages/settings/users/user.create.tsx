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
import { queryClient } from "@/lib/query";
import { userDefaultValues, userSchema } from "@/utils/forms/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";



async function inviteUser(data: z.infer<typeof userSchema>) {
    return (await api.post('/user', data));
}

export function CreateUserDialog() {
    const [isOpen, setIsOpen] = useState(false);
    const { mutate, isPending } = useMutation({ 
        mutationKey: ['inviteUser'], 
        mutationFn: inviteUser, 
        onSuccess: () => {
            toast({
                title: "Usuário vinculado com sucesso",
            })
            setIsOpen(false);
            form.reset();
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['userConfig'] }),
        onError: (error) => {
            toast({
                title: "Erro ao vincular usuário",
                description: error?.message || "Erro desconhecido",
            })
        }
    })

    const form = useForm<z.infer<typeof userSchema>>({
        resolver: zodResolver(userSchema),
        defaultValues: userDefaultValues
    });

    function onSubmit(values: z.infer<typeof userSchema>) {
        mutate(values);
    }

    return (
        <Dialog
            open={isOpen}
            onOpenChange={setIsOpen}
        >
            <DialogTrigger asChild>
                <Button>Vincular usuário</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Víncular usuário</DialogTitle>
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
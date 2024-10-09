import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { Loader2Icon } from "lucide-react";

const formSchema = z.object({
    email: z.string().email("Endereço de email inválido."),
});

export function Login() {
    const navigate = useNavigate();
    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    });

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const { data } = await api.post("/auth/login", values);
            api.defaults.headers.Authorization = `Bearer ${data.token}`;
            toast({
                title: "Código de verificação enviado",
                description: "Enviamos um email com um código de verificação. Por favor verifique sua caixa de entrada.",
            })
            navigate("/verify");
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Erro ao enviar código de verificação",
                description: error.response?.data?.message || "Tente novamente mais tarde",
            })
        }
    }

    return (
        <div className="w-screen h-screen flex items-center justify-center">
            <Card className="shadow-none border-none max-w-sm w-full bg-none">
                <CardTitle className="text-xl">Meus Recibos</CardTitle>
                <CardDescription>
                    Bem vindo. Faça login para continuar.
                </CardDescription>
                <CardContent className="mt-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Endereço de email" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={form.formState.isSubmitting}
                            >
                                {form.formState.isSubmitting ? <Loader2Icon className="animate-spin" size={18} /> : "Continuar"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}

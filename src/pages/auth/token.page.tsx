import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { useNavigate } from "react-router-dom";
import { Loader2Icon } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
	pin: z.string().min(6, {
		message: "O código de verificação deve ter 6 dígitos.",
	}),
});

export function Token() {
	const navigate = useNavigate();
    const { toast } = useToast();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			pin: "",
		},
	});

	// 2. Define a submit handler.
	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
            const { data } = await api.post("/auth/signIn", values);
            toast({
                title: "Login efetuado com sucesso",
            });
            localStorage.setItem("meusrecibos:companies", JSON.stringify(data.companies));
            navigate("/workspace");
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Erro ao realizar login",
                description: error.response?.data?.message || "Tente novamente mais tarde",
            })
        }
	}

	return (
		<div className="w-screen h-screen flex items-center justify-center">
			<Card className="shadow-none border-none max-w-sm w-full bg-none">
				<CardTitle className="text-xl">Verifique seu email</CardTitle>
				<CardDescription>
					Enviamos um email para <strong>email</strong> com um código de login. Por favor verifique sua caixa de entrada e insira o código abaixo.
				</CardDescription>
				<CardContent className="mt-4">
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
							<FormField
								control={form.control}
								name="pin"
								render={({ field }) => (
									<FormItem className="w-full flex items-center flex-col">
										<FormLabel>Código de verificação</FormLabel>
										<FormControl>
											<InputOTP maxLength={6} {...field} >
												<InputOTPGroup>
													<InputOTPSlot index={0} />
													<InputOTPSlot index={1} />
													<InputOTPSlot index={2} />
												</InputOTPGroup>
												<InputOTPSeparator />
												<InputOTPGroup>
													<InputOTPSlot index={3} />
													<InputOTPSlot index={4} />
													<InputOTPSlot index={5} />
												</InputOTPGroup>
											</InputOTP>
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
                                {form.formState.isSubmitting ? <Loader2Icon className="animate-spin" size={18} /> : "Entrar"}
                            </Button>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}

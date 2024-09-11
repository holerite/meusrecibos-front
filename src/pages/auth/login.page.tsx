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

const formSchema = z.object({
	email: z.string().email(),
});

export function Login() {
	const navigate = useNavigate();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
		},
	});

	// 2. Define a submit handler.
	function onSubmit(values: z.infer<typeof formSchema>) {
		// Do something with the form values.
		// ✅ This will be type-safe and validated.
		console.log(values);
		navigate("/verify");
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
							<Button type="submit" className="w-full">
								Continuar
							</Button>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}

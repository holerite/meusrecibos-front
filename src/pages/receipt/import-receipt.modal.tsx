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
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
	month: z.string({
        description: "O ano e mês de vigência é obrigatório"
    }),
	payday: z.date(),
	file:
		typeof window === "undefined" ? z.any() : z.instanceof(FileList),
});

export function ImportReceipt() {
	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
	});

	const fileRef = form.register("file");

	function onSubmit(values: any) {
		console.log(values);
	}

	return (
		<>
			<Dialog>
				<DialogTrigger>
					<Button>Importar</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Importar recibos</DialogTitle>
						<div>
							<Form {...form}>
								<form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
									<div className="flex items-end gap-4">
										<FormField
											control={form.control}
											name="month"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Mês-Ano</FormLabel>
													<FormControl>
														<Input {...field} placeholder="mm-aaaa" />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="payday"
											render={({ field }) => (
												<FormItem className="flex flex-col">
													<FormLabel>Data de pagamento</FormLabel>
													<Popover>
														<PopoverTrigger asChild>
															<FormControl>
																<Button
																	variant={"outline"}
																	className={cn(
																		"w-[240px] pl-3 text-left font-normal",
																		!field.value && "text-muted-foreground",
																	)}
																>
																	{field.value ? (
																		format(field.value, "PPP")
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
										render={() => {
											return (
												<FormItem>
													<FormLabel>Recibos</FormLabel>
													<FormControl>
														<Input
															type="file"
															placeholder="shadcn"
															{...fileRef}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											);
										}}
									/>
								<DialogFooter>
									<Button type="submit">Confirmar</Button>
								</DialogFooter>
								</form>
							</Form>
						</div>
					</DialogHeader>
				</DialogContent>
			</Dialog>
		</>
	);
}

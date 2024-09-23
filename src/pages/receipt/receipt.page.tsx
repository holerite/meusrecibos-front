import { DataTable } from "@/components/ui/data-table";
import { columns, type Payment } from "./receipt.columns";
import { useQuery } from "@tanstack/react-query";

import { faker } from "@faker-js/faker";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, subDays } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";

async function getData(): Promise<Payment[]> {
	await new Promise((resolve) =>
		setTimeout(resolve, faker.helpers.arrayElement([100, 300])),
	);

	const response = new Array(100).fill(null).map(() => ({
		id: faker.string.uuid(),
		employee: faker.person.firstName(),
		opened: faker.datatype.boolean(),
		payday: faker.date.recent(),
		type: faker.helpers.arrayElement([
			"pending",
			"processing",
			"success",
			"failed",
		]),
		validity: faker.date.recent(),
	})) as Payment[];

	return response;
}

const filterSchema = z.object({
	employee: z.string(),
	type: z.string(),
	payday: z.object({
		from: z.date(),
		to: z.date(),
	}),
	validity: z.string(),
	opened: z.boolean(),
});

export function Receipt() {
	const { data, isLoading } = useQuery({
		queryKey: ["todos"],
		queryFn: getData,
	});

	const form = useForm<z.infer<typeof filterSchema>>({
		resolver: zodResolver(filterSchema),
		defaultValues: {
			employee: "",
			type: "",
			payday: {
				from: new Date(),
				to: subDays(new Date(), 30),
			},
			validity: "",
			opened: false,
		},
	});

	function onSubmit(values: any) {
		console.log(values);
	}

	return (
		<>
			<div>
				<h1>Filtro</h1>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<FormField
							control={form.control}
							name="employee"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Colaborador</FormLabel>
									<FormControl>
										<Input placeholder="Nome do colaborador..." {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="type"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select a verified email to display" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="m@example.com">
												m@example.com
											</SelectItem>
											<SelectItem value="m@google.com">m@google.com</SelectItem>
											<SelectItem value="m@support.com">
												m@support.com
											</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="payday"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel>Date of birth</FormLabel>
									<div className={cn("grid gap-2")}>
										<Popover>
											<PopoverTrigger asChild>
												<Button
													id="date"
													variant={"outline"}
													className={cn(
														"w-[300px] justify-start text-left font-normal",
														!field.value && "text-muted-foreground",
													)}
												>
													<CalendarIcon className="mr-2 h-4 w-4" />
													{field.value.from ? (
														field.value.to ? (
															<>
																{format(field.value.from, "LLL dd, y")} -{" "}
																{format(field.value.to, "LLL dd, y")}
															</>
														) : (
															format(field.value.from, "LLL dd, y")
														)
													) : (
														<span>Selecione uma data</span>
													)}
												</Button>
											</PopoverTrigger>
											<PopoverContent className="w-auto p-0" align="start">
												<Calendar
													initialFocus
													mode="range"
													selected={field.value}
													onSelect={field.onChange}
													numberOfMonths={2}
												/>
											</PopoverContent>
										</Popover>
									</div>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type="submit" className="w-full">
							Continuar
						</Button>
					</form>
				</Form>
			</div>
			<DataTable columns={columns} loading={isLoading} data={data || []} />
		</>
	);
}

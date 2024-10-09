import { DataTable } from "@/components/ui/data-table";
import { columns, type EmployeesDto } from "./employees.columns";
import { useQuery } from "@tanstack/react-query";
import { faker } from "@faker-js/faker";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

async function getData(): Promise<EmployeesDto[]> {
	await new Promise((resolve) =>
		setTimeout(resolve, faker.helpers.arrayElement([100, 300])),
	);

	const response = new Array(100).fill(null).map(() => ({
		id: faker.string.uuid(),
		email: faker.internet.email(),
		name: faker.person.firstName(),
		registration: faker.number.int({
			min: 100,
			max: 999,
		}),
		receipts: faker.number.int({
			min: 100,
			max: 999,
		}),
	})) as EmployeesDto[];

	return response;
}

const filterSchema = z.object({
	enrolment: z.string(),
	name: z.string(),
	email: z.string().email(),
});

export function Employees() {
	const { data, isLoading } = useQuery({
		queryKey: ["employees"],
		queryFn: getData,
	});

    const form = useForm<z.infer<typeof filterSchema>>({
		resolver: zodResolver(filterSchema),
		defaultValues: {
			enrolment: "",
			name: "",
			email: ""
		},
	});

    function onSubmit(values: any) {
		console.log(values);
	}

	return (
		<>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className=" flex items-center gap-4 border p-4 rounded-md"
				>
					<div className="flex h-full w-full gap-4 items-end">
						<FormField
							control={form.control}
							name="enrolment"
							render={({ field }) => (
								<FormItem className="w-[240px]">
									<FormLabel>Matrícula</FormLabel>
									<FormControl>
										<Input placeholder="Matricula do colaborador" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="employee"
							render={({ field }) => (
								<FormItem className="w-[240px]">
									<FormLabel>Nome</FormLabel>
									<FormControl>
										<Input placeholder="Nome do colaborador" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
                        <FormField
							control={form.control}
							name="employee"
							render={({ field }) => (
								<FormItem className="w-[240px]">
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input placeholder="Email do colaborador" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					
					</div>
					<Button type="submit" className="w-40">
						Filtrar
					</Button>
				</form>
			</Form>
			<DataTable columns={columns} loading={isLoading} data={data || []} />
		</>
	);
}

import { DataTable } from "./employees.table";
import { columns, type EmployeesDto } from "./employees.columns";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { IDataPagination, ITablePagination } from "@/utils/types/table";
import { CreateEmployeesDialog } from "./employees.create";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cpfMask } from "@/utils/masks";

interface IEmployeesData {
    employees: EmployeesDto[]
    pagination: IDataPagination
}

async function getData(data: z.infer<typeof filterSchema>, pagination: ITablePagination) {
    return (await api.get<IEmployeesData>("/employees", {
        params: {
            ...data,
            page: pagination.pageIndex,
            take: pagination.pageSize,
        },
    })).data;
}

const filterSchema = z.object({
    matricula: z.string().optional(),
    nome: z.string().optional(),
    email: z.string().optional(),
    cpf: z.string().optional(),
});

export function Employees() {
    const [pagination, setPagination] = useState<ITablePagination>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [filterValues, setFilterValues] = useState<z.infer<typeof filterSchema>>({
        matricula: "",
        cpf: "",
        nome: "",
        email: "",
    });

    const form = useForm<z.infer<typeof filterSchema>>({
        resolver: zodResolver(filterSchema),
        defaultValues: filterValues,
    });

    const { data, isLoading } = useQuery({
        queryKey: ["employees", filterValues, pagination],
        queryFn: () => getData(filterValues, pagination),
    });

    function onSubmit(values: z.infer<typeof filterSchema>) {
        setFilterValues(values);
    }

    return (
        <>
            <div className="text-end space-x-3">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline">Filtros</Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-96">
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                            >
                                <div className="flex flex-col h-full w-full gap-3">
                                    <div className="grid grid-cols-2 gap-2.5">
                                        <FormField
                                            control={form.control}
                                            name="matricula"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Matrícula</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Matricula" {...field} />
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
                                                            placeholder="CPF"
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

                                    </div>
                                    <FormField
                                        control={form.control}
                                        name="nome"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Nome</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Nome" {...field} />
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
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Email" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="text-end space-x-3">
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                form.reset();
                                                setFilterValues({
                                                    matricula: "",
                                                    cpf: "",
                                                    nome: "",
                                                    email: "",
                                                });
                                            }}
                                        >
                                            Limpar
                                        </Button>
                                        <Button
                                            type="submit"
                                            isLoading={isLoading}
                                        >
                                            Filtrar
                                        </Button>
                                    </div>
                                </div>

                            </form>
                        </Form>
                    </PopoverContent>
                </Popover>
                <CreateEmployeesDialog />
            </div>
            <DataTable
                columns={columns}
                data={data?.employees || []}
                isLoading={isLoading}
                pagination={pagination}
                setPagination={setPagination}
                pageCount={data?.pagination.total_pages || 0}
                totalRecords={data?.pagination.total_records || 0}
            />
        </>
    );
}

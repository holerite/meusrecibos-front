import { DataTable } from "./employees.table";
import { columns, type EmployeesDto } from "./employees.columns";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { IDataPagination, ITablePagination } from "@/utils/types/table";
import { CreateEmployeesDialog } from "./employees.create";
import { EmployeesFilter } from "./employees.filter";
import { employeesFilterDefaultValues, employeesFilterSchema } from "@/utils/forms/employees";
import { Button } from "@/components/ui/button";


interface IEmployeesData {
    employees: EmployeesDto[]
    pagination: IDataPagination
}

async function getData(data: z.infer<typeof employeesFilterSchema>, pagination: ITablePagination) {
    return (await api.get<IEmployeesData>("/employees", {
        params: {
            ...data,
            page: pagination.pageIndex,
            take: pagination.pageSize,
        },
    })).data;
}


export function Employees() {
    const [pagination, setPagination] = useState<ITablePagination>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [filterValues, setFilterValues] = useState<z.infer<typeof employeesFilterSchema>>(employeesFilterDefaultValues);
    const [addEmployeeIsOpen, setAddEmployeeIsOpen] = useState(false)
    const filterForm = useForm<z.infer<typeof employeesFilterSchema>>({
        resolver: zodResolver(employeesFilterSchema),
        defaultValues: employeesFilterDefaultValues,
    });

    const { data, isLoading } = useQuery({
        queryKey: ["employees", filterValues, pagination],
        queryFn: () => getData(filterValues, pagination),
    });

    function onSubmit(values: z.infer<typeof employeesFilterSchema>) {
        setFilterValues(values);
    }

    function handleAddEmployee() {
        setAddEmployeeIsOpen(true)
    }

    return (
        <>
            <div className="flex md:flex-row flex-col items-center justify-between gap-3">
                <h1 className="text-3xl font-semibold">Colaboradores</h1>
                <div className="space-x-3">
                    <EmployeesFilter
                        form={filterForm}
                        onSubmit={onSubmit}
                        setFilterValues={setFilterValues}
                        isLoading={isLoading}
                    />
                    <Button onClick={handleAddEmployee}>
                        Cadastrar colaborador
                    </Button>
                </div>
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
            <CreateEmployeesDialog
                employee={undefined}
                isOpen={addEmployeeIsOpen}
                setIsOpen={setAddEmployeeIsOpen}
            />
        </>
    );
}

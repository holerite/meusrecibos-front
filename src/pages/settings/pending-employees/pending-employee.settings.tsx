import { columns, PendingEmployeeDto } from "./pending-employee.columns";
import { DataTable } from "./pending-employee.table";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useState } from "react";
import { CreateEmployeesDialog } from "@/pages/employees/employees.create";

async function getData() {
    return (await api.get<PendingEmployeeDto[]>('/receipt/errors')).data;
}

export function PendingEmployeeSettings() {
    const { data, isLoading } = useQuery({ queryKey: ['pendingEmployeeList'], queryFn: getData })
    const [selectedEmployee, setSelectedEmployee] = useState<PendingEmployeeDto>()
    const [addEmployeeIsOpen, setAddEmployeeIsOpen] = useState(false)

    function handleAddEmployee(id: number) {
        const employee = data?.find(employee => employee.id === id)
        setSelectedEmployee(employee)
        if (employee) {
            setAddEmployeeIsOpen(true)
        }
    }

    return (
        <>
            <div className="flex flex-col gap-4 lg:gap-6">
                <div className="flex md:flex-row flex-col items-center justify-between gap-3">
                    <h1 className="text-3xl font-semibold">Cadastros pendentes</h1>
                </div>
                <DataTable
                    columns={columns}
                    data={data}
                    isLoading={isLoading}
                    onAddEmployee={handleAddEmployee}
                />
            </div>
            <CreateEmployeesDialog
                employee={selectedEmployee}
                isOpen={addEmployeeIsOpen}
                setIsOpen={setAddEmployeeIsOpen}
            />
        </>
    )
}
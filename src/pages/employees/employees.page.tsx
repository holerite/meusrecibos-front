import { DataTable } from "@/components/ui/data-table";
import { columns, type EmployeesDto } from "./employees.columns";
import { useQuery } from "@tanstack/react-query";
import { faker } from "@faker-js/faker";

async function getData(): Promise<EmployeesDto[]> {

    await new Promise((resolve) => setTimeout(resolve, faker.helpers.arrayElement([100, 300,])))

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
    })) as EmployeesDto[]

    return response
}


export function Employees() {
    const { data, isLoading } = useQuery({ queryKey: ['employees'], queryFn: getData })

    return (
        <DataTable columns={columns} loading={isLoading} data={data || []} />
    )
}
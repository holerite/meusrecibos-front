import { DataTable } from "@/components/ui/data-table";
import { columns, type Payment } from "./receipt.columns";
import { useQuery } from "@tanstack/react-query";

import { faker } from '@faker-js/faker';



async function getData(): Promise<Payment[]> {

    await new Promise((resolve) => setTimeout(resolve, faker.helpers.arrayElement([100, 300,])))

    const response = new Array(100).fill(null).map(() => ({
        id: faker.string.uuid(),
        employee: faker.person.firstName(),
        opened: faker.datatype.boolean(),
        payday: faker.date.recent(),
        type: faker.helpers.arrayElement(["pending", "processing", "success", "failed"]),
        validity: faker.date.recent(),
    })) as Payment[]

    return response
}



export function Receipt() {
    const { data, isLoading } = useQuery({ queryKey: ['todos'], queryFn: getData })

    return (
        <>
            <DataTable columns={columns} loading={isLoading} data={data || []} />
        </>
    )
}
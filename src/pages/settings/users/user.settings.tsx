import { faker } from "@faker-js/faker";
import { columns, UsersDto } from "./users.columns";
import { DataTable } from "./users.table";
import { useQuery } from "@tanstack/react-query";


async function getData(): Promise<UsersDto[]> {

    await new Promise((resolve) => setTimeout(resolve, faker.helpers.arrayElement([100, 300,])))

    const response = new Array(100).fill(null).map(() => ({
        id: faker.string.uuid(),
        email: faker.internet.email(),
        lastAccess: faker.date.recent(),
        name: faker.person.fullName()
    })) as UsersDto[]

    return response
}

export function UserSettings() {
    const { data, isLoading } = useQuery({ queryKey: ['users'], queryFn: getData })

    return (
        <div>
            <DataTable columns={columns} data={data}/>
        </div>
    )
}
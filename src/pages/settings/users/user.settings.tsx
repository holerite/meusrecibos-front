import { columns, UsersDto } from "./users.columns";
import { DataTable } from "./users.table";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";


async function getData(): Promise<UsersDto[]> {
    console.log('eba');
    
    return await api.get('/user')
}

export function UserSettings() {
    const { data, isLoading } = useQuery({ queryKey: ['userConfig'], queryFn: getData })

    console.log(data);
    

    return (
        <div>
            <DataTable columns={columns} data={data}/>
        </div>
    )
}
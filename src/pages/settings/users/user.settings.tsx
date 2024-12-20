import { columns, UsersDto } from "./users.columns";
import { DataTable } from "./users.table";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { DeleteUserAlert } from "./user.delete";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { CreateUserDialog } from "./user.create";
import { queryClient } from "@/lib/query";

async function getData() {
    return (await api.get<UsersDto[]>('/user')).data;
}

async function deleteData(id: string) {
    return await api.delete(`/user/${id}`)
}


export function UserSettings() {
    const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
    const [deleteId, setDeleteId] = useState("");

    const { data, isLoading } = useQuery({ queryKey: ['userConfig'], queryFn: getData })


    const deleteMutation = useMutation({
        mutationKey: ['deleteUser'],
        mutationFn: (id: string) => deleteData(id),
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['userConfig'] }),
        onSuccess: () => {
            setDeleteAlertOpen(false);
            toast({
                title: "Usuário deletado com sucesso",
            })
        },
    })

    function handleDelete(id: string) {
        setDeleteId(id);
        setDeleteAlertOpen(true);
    }

    return (
        <>
            <div className="flex flex-col gap-4 lg:gap-6">
                <div className="flex md:flex-row flex-col items-center justify-between gap-3">
                    <h1 className="text-3xl font-semibold">Usuários</h1>
                    <CreateUserDialog />
                </div>
                <DataTable
                    columns={columns}
                    data={data}
                    isLoading={isLoading}
                    handleDelete={handleDelete}
                />
            </div>
            <DeleteUserAlert
                open={deleteAlertOpen}
                setOpen={setDeleteAlertOpen}
                loading={deleteMutation.isPending}
                handleDelete={() => deleteMutation.mutate(deleteId)}
            />
        </>
    )
}
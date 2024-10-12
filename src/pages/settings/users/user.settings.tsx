import { columns, UsersDto } from "./users.columns";
import { DataTable } from "./users.table";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { queryClient } from "@/main";
import { DeleteUserAlert } from "./user.delete";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

async function getData() {
    return (await api.get<UsersDto[]>('/user')).data;
}

async function inviteUser() {
    return await api.post('/user/invite')
}

async function deleteData(id: string) {
    return await api.delete(`/user/${id}`)
}


export function UserSettings() {
    const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
    const [deleteId, setDeleteId] = useState("");

    const { data, isLoading } = useQuery({ queryKey: ['userConfig'], queryFn: getData })
    const inviteMutation = useMutation({ mutationKey: ['inviteUser'], mutationFn: inviteUser })

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
            <div>
                <div className="text-end mb-3">
                    <Button
                        onClick={() => inviteMutation.mutate()}
                    >
                        Convidar usuário
                    </Button>
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
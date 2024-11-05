import { columns, ReceiptTypeDto } from "./receipt-type.columns";
import { DataTable } from "./receipt-type.table";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/query";
import { useState } from "react";


async function getData() {
    return (await api.get<ReceiptTypeDto[]>('/receipt/type?all=true')).data;
}

async function editReceiptType(values: { id: number, status: boolean }) {
    return await api.put(`/receipt/type`, {
        id: values.id,
        active: values.status
    });
}

export function ReceiptTypeSettings() {
    const { data, isLoading } = useQuery({ queryKey: ['receiptTypeList'], queryFn: getData })
    const [changeStatusId, setChangeStatusId] = useState<number>()

    const { mutate, isPending } = useMutation({
        mutationKey: ['receiptTypeEdit'],
        mutationFn: editReceiptType,
        onSuccess: () => {
            toast({
                title: "Configuração de recibo editado com sucesso",
            })
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['receiptTypeList'] }),
        onError: (error) => {
            toast({
                variant: "destructive",
                title: "Erro ao editar configuração de recibo",
                description: error?.message || "Erro desconhecido",
            })
        }
    })

    const handleChangeStatus = (id: number, status: boolean) => {
        setChangeStatusId(id)
        mutate({ id, status })
    }

    return (
        <>
            <div className="flex flex-col gap-4 lg:gap-6">
                <div className="flex md:flex-row flex-col items-center justify-between gap-3">
                    <h1 className="text-3xl font-semibold">Descrições de Recibos</h1>
                </div>
                <DataTable
                    columns={columns}
                    data={data}
                    isLoading={isLoading}
                    handleChangeStatus={handleChangeStatus}
                    loadingIdentifier={{
                        isLoading: isPending,
                        id: changeStatusId
                    }}
                />
            </div>
        </>
    )
}
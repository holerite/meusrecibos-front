import { columns, ReceiptTypeDto } from "./receipt-type.columns";
import { DataTable } from "./receipt-type.table";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { CreateReceiptTypeDialog } from "./receipt-type.create";
import { EditReceiptTypeDialog } from "./receipt-type.edit";
import { useState } from "react";
import { queryClient } from "@/lib/query";
import { toast } from "@/hooks/use-toast";
import { DeleteReceiptTypeAlert } from "./receipt-type.delete";

async function getData() {
    return (await api.get<ReceiptTypeDto[]>('/receipt/type')).data;
}

async function deleteData(id: number) {
    return await api.delete(`/receipt/type/${id}`)
}

export function ReceiptTypeSettings() {
    const { data, isLoading } = useQuery({ queryKey: ['receiptTypeList'], queryFn: getData })
    const [receiptType, setReceiptType] = useState<ReceiptTypeDto>({
        id: 0,
        name: '',
    })
    const [editReceiptTypeDialogOpen, setEditReceiptTypeDialogOpen] = useState(false)
    const [deleteAlertOpen, setDeleteAlertOpen] = useState(false)
    const [deleteId, setDeleteId] = useState(0)

    function handleEdit(id: number, name: string) {
        setReceiptType({
            id,
            name,
        })
        setEditReceiptTypeDialogOpen(true)
    }

    const deleteMutation = useMutation({
        mutationKey: ['deleteReceiptType'],
        mutationFn: (id: number) => deleteData(id),
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['receiptTypeList'] }),
        onSuccess: () => {
            setDeleteAlertOpen(false);
            toast({
                title: "Descrição de recibo deletada com sucesso",
            })
        },
    })

    function handleDelete(id: number) {
        setDeleteId(id);
        setDeleteAlertOpen(true);
    }

    return (
        <>
            <div className="flex flex-col gap-4 lg:gap-6">
                <div className="flex md:flex-row flex-col items-center justify-between gap-3">
                    <h1 className="text-3xl font-semibold">Descrições de Recibos</h1>
                    <CreateReceiptTypeDialog />
                </div>
                <DataTable
                    columns={columns}
                    data={data}
                    isLoading={isLoading}
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                />
            </div>
            <EditReceiptTypeDialog 
                id={receiptType.id}
                name={receiptType.name}
                isOpen={editReceiptTypeDialogOpen}
                setIsOpen={setEditReceiptTypeDialogOpen}
            />
            <DeleteReceiptTypeAlert
                open={deleteAlertOpen}
                setOpen={setDeleteAlertOpen}
                loading={deleteMutation.isPending}
                handleDelete={() => deleteMutation.mutate(deleteId)}
            />
        </>
    )
}
import { columns, ReceiptTypeDto } from "./receipt-type.columns";
import { DataTable } from "./receipt-type.table";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { CreateReceiptTypeDialog } from "./receipt-type.create";
import { EditReceiptTypeDialog } from "./receipt-type.edit";
import { useState } from "react";

async function getData() {
    return (await api.get<ReceiptTypeDto[]>('/receipt/type')).data;
}

export function ReceiptTypeSettings() {
    const { data, isLoading } = useQuery({ queryKey: ['receiptTypeList'], queryFn: getData })
    const [receiptType, setReceiptType] = useState<ReceiptTypeDto>({
        id: 0,
        name: '',
    })
    const [editReceiptTypeDialogOpen, setEditReceiptTypeDialogOpen] = useState(false)

    function handleEdit(id: number, name: string) {
        setReceiptType({
            id,
            name,
        })
        setEditReceiptTypeDialogOpen(true)
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
                />
            </div>
            <EditReceiptTypeDialog 
                id={receiptType.id}
                name={receiptType.name}
                isOpen={editReceiptTypeDialogOpen}
                setIsOpen={setEditReceiptTypeDialogOpen}
            />
        </>
    )
}
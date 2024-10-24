import { Button } from "@/components/ui/button"
import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Edit2Icon, Trash2Icon } from "lucide-react"

export type ReceiptTypeDto = {
    id: number
    name: string
}


export const columns: ColumnDef<ReceiptTypeDto>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="px-0"
                >
                    Nome
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        id: "actions",
        header: "Ações",
        enableHiding: false,
        enableResizing: false,
        cell: ({ table, row }) => {
            const handleEdit = () => {
                (table.options.meta as any)?.onEdit(Number(row.original.id) || 0, row.original.name || "")
            }

            const handleDelete = () => {
                (table.options.meta as any)?.onDelete(Number(row.original.id) || 0)
            }

            return (
                <div className="flex gap-2">
                    <Button
                        size={"icon"}
                        variant={"default"}
                        onClick={handleEdit}
                    >
                        <Edit2Icon
                            className="h-4 w-4"
                        />
                    </Button>
                    <Button
                        size={"icon"}
                        variant={"destructive"}
                        onClick={handleDelete}
                    >
                        <Trash2Icon
                            className="w-4 h-4"
                        />
                    </Button>
                </div>

            )
        },
    }


]

import { Button } from "@/components/ui/button"
import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, PlusIcon } from "lucide-react"

export type PendingEmployeeDto = {
    id: number
    name: string
    enrolment: {
        enrolment: string
        id: number
    }
}

export const columns: ColumnDef<PendingEmployeeDto>[] = [
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
        accessorKey: "enrolment",
        header: "Matrícula",
        cell: ({ row }) => {
            return row.original.enrolment.enrolment
        }
    },
    {
        id: "actions",
        header: "Ações",
        enableHiding: false,
        enableResizing: false,
        cell: ({ table, row }) => {
            const handleAddEmployee = () => {
                (table.options.meta as any)?.onAddEmployee(row.original.id)
            }

            return (
                <Button
                    onClick={handleAddEmployee}
                    size={"icon"}
                >
                    <PlusIcon />
                </Button>
            )
        },
    }


]

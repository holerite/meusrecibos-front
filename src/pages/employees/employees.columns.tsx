import { Button } from "@/components/ui/button"
import { cpfMask } from "@/utils/masks"
import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Trash2Icon, } from "lucide-react"
import { Link } from "react-router-dom"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type EmployeesDto = {
    id: string
    enrolment: number
    name: string
    email: string
    receipts: number
}

export const columns: ColumnDef<EmployeesDto>[] = [
    {
        accessorKey: "enrolment",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="px-0"
                >
                    Matrícula
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "cpf",
        header: "CPF",
        cell: ({ cell }) => {
            return cpfMask(cell.getValue() as string)
        }
    },
    {
        accessorKey: "name",
        header: "Nome",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "receipts",
        header: "Ver recibos",
        cell: ({cell, row}) => {
            return <Link to={`/receipt?employee=${row.getValue("name")}`}>
                <Button size="sm" variant="outline">
                    {cell.getValue() as number || 0}
                </Button>
            </Link>
        }
    },
    {
        id: "actions",
        header: "Ações",
        enableHiding: false,
        cell: ({ table, row }) => {
            const handleDelete = () => {
                (table.options.meta as any)?.onDelete(row.original.id)
            }

            return (
                <Button
                    size={"icon"}
                    variant={"destructive"}
                    onClick={handleDelete}
                >
                    <Trash2Icon
                        className="w-4 h-4"
                    />
                </Button>
            )
        },
    }
]

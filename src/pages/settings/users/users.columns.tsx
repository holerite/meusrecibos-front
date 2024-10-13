import { Button } from "@/components/ui/button"
import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Trash2Icon } from "lucide-react"
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type UsersDto = {
    id: string
    name: string
    email: string
}


export const columns: ColumnDef<UsersDto>[] = [
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
        accessorKey: "email",
        header: "Email",
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

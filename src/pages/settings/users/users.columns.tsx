import { Button } from "@/components/ui/button"
import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Trash2, } from "lucide-react"

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
        enableHiding: false,
        cell: ({ row }) => {
            return (
                <Button size={"icon"} variant={"destructive"}>
                    <Trash2 className="w-4 h-4" />
                </Button>
            )
        }
    }


]

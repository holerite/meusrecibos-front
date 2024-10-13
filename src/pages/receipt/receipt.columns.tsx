import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import type { ColumnDef } from "@tanstack/react-table"
import { format } from 'date-fns'
import { Eye, MailIcon, MailOpenIcon } from "lucide-react"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type PaymentDTO = {
    id: string
    employee: string
    type: "pending" | "processing" | "success" | "failed"
    payday: Date
    validity: Date
    opened: boolean
}

export const columns: ColumnDef<PaymentDTO>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "employee",
        header: "Colaborador",
    },
    {
        accessorKey: "type",
        header: "Descrição",
    },
    {
        accessorKey: "payday",
        header: "Data de pagamento",
        cell: ({ row }) => (
            <>
                {format(new Date(row.original.validity), 'dd/MM/yyyy')}
            </>
        ),
    },
    {
        accessorKey: "validity",
        header: "Data de vigência",
        cell: ({ row }) => (
            <Button size={"sm"} >
                {new Date(row.original.validity).getMonth() + 1} - {new Date(row.original.validity).getFullYear()}
            </Button>
        ),

    },
    {
        accessorKey: "opened",
        header: () => (
            <Eye className="w-5 h-5" />
        ),
        cell: ({ table, row }) => {
            const handlePrint = () => {
                (table.options.meta as any)?.onPrint([row.original.id])
            }

            return (
                <button onClick={handlePrint} type="button">
                    {row.original.opened ? <MailOpenIcon className="w-5 h-5  text-gray-400" /> : <MailIcon className="w-5 h-5" />}
                </button>
            )
        },
        enableSorting: false,
        enableHiding: false,
        
    },
]


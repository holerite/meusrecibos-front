import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { ColumnDef } from "@tanstack/react-table"
import { format, formatDate } from 'date-fns'
import { MoreVerticalIcon } from "lucide-react"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type PaymentDTO = {
    id: string
    name: string
    ReceiptsTypes: {
        name: string
    }
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
        cell: ({ row }) => (
            <>
                {row.original?.name || "Sem colaborador"}
            </>
        ),
    },
    {
        accessorKey: "ReceiptsTypes",
        header: "Descrição",
        cell: ({ row }) => (
            <>
                {row.original?.ReceiptsTypes?.name || "Sem descrição"}
            </>
        ),
    },
    {
        accessorKey: "payday",
        header: "Data de pagamento",
        cell: ({ row }) => format(new Date(row.original.payday), 'dd/MM/yyyy'),
    },
    {
        accessorKey: "validity",
        header: "Data de vigência",
        cell: ({ row }) => formatDate(new Date(row.original.validity), 'MM/yyyy'),
    },
    {
        accessorKey: "opened",
        header: "Ações",
        cell: ({ table, row }) => {
            const handleShowReceipt = () => {
                (table.options.meta as any)?.onShowReceipt(row.original.id)
            }

            const handlePrint = () => {
                (table.options.meta as any)?.onPrint([row.original.id])
            }

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreVerticalIcon className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={handleShowReceipt}
                        >
                            Visualizar recibo
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={handlePrint}
                        >
                            Imprimir comprovante
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
        enableSorting: false,
        enableHiding: false,

    },
]


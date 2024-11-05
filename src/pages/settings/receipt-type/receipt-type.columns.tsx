import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
export type ReceiptTypeDto = {
    id: number
    name: string
    active: boolean
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
            const handleChangeStatus = (status: boolean) => {
                (table.options.meta as any)?.onChangeStatus(Number(row.original.id) || 0, status || false)
            }

            return (
                <div className="flex gap-2">
                    {(table.options.meta as any)?.loadingIdentifier.id === row.original.id && (table.options.meta as any)?.loadingIdentifier.isLoading ? (
                        <Skeleton className="h-6 w-11" />
                    ) : (
                        <Switch
                            onCheckedChange={handleChangeStatus}
                            checked={row.original.active || false}
                        />
                    )}
                </div>

            )
        },
    }


]

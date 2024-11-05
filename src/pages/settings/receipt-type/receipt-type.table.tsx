
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Loader2Icon } from "lucide-react"
import { ReceiptTypeDto } from "./receipt-type.columns"


interface DataTableProps<TData, TValue> {
    isLoading: boolean
    columns: ColumnDef<TData, TValue>[]
    data?: TData[]
    loadingIdentifier: {
        isLoading: boolean
        id: number | undefined
    }
    handleChangeStatus: (id: number, status: boolean) => void
}

export function DataTable<TValue>({
    columns,
    data,
    isLoading,
    handleChangeStatus,
    loadingIdentifier
}: DataTableProps<ReceiptTypeDto, TValue>) {
    const table = useReactTable({
        data: data || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        meta: {
            onChangeStatus: handleChangeStatus,
            loadingIdentifier
        }
    })

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id} className="text-nowrap">
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => {
                            console.log(row);

                            return (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="truncate max-w-40">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            )
                        })
                    ) : (
                        <>
                            {isLoading ? (<>
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 ">
                                        <Loader2Icon size={24} className="animate-spin mx-auto" />
                                    </TableCell>
                                </TableRow>
                            </>) : (
                                <>
                                    <TableRow>
                                        <TableCell colSpan={columns.length} className="h-24 text-center">
                                            Sem resultados.
                                        </TableCell>
                                    </TableRow>
                                </>
                            )}
                        </>)}
                </TableBody>
            </Table>
        </div>
    )
}

import {
    type ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getSortedRowModel,
    getPaginationRowModel,
    type SortingState,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Payment } from "./receipt.columns"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    loading?: boolean
}

export function DataTable<TValue>({
    columns,
    data,
    loading = false,
}: DataTableProps<Payment, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [printOpenDialog, setOpenPrintDialog] = useState(false);
    const [rowSelection, setRowSelection] = useState({})

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onRowSelectionChange: setRowSelection,
        getRowId: row => row.id,
        state: {
            sorting,
            rowSelection,
        },
        meta: {
            onPrint: onPrint
        }
    })

    function onPrint(data: string[]) {
        console.log(data);
        setOpenPrintDialog(true);
    }

    return (
        <>
            <div>
                <div className="flex items-center justify-end mb-3">
                    <Button
                        size="sm"
                        onClick={() => onPrint(Object.keys(rowSelection))}
                        disabled={!table.getFilteredSelectedRowModel().rows.length}
                    >
                        Imprimir ({table.getFilteredSelectedRowModel().rows.length})
                    </Button>
                </div>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id}>
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
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <>
                                    {loading ? (<>
                                        <TableRow>
                                            <TableCell colSpan={columns.length} className="h-24 ">
                                                <Loader2 size={24} className="animate-spin mx-auto" />
                                            </TableCell>
                                        </TableRow>
                                    </>) : (
                                        <>
                                            <TableRow>
                                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                                    Nenhum dado encontrado
                                                </TableCell>
                                            </TableRow>
                                        </>
                                    )}
                                </>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <div className="flex items-center justify-end space-x-2 py-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Anterior
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Próximo
                    </Button>
                </div>
            </div>
            <Dialog
                open={printOpenDialog}
                onOpenChange={(open) => setOpenPrintDialog(open)}
            >
                <DialogContent className="max-w-[80%] h-[90%] overflow-y-auto flex flex-col" >
                    <DialogHeader className='mb-4'>
                        <DialogTitle>
                            Recibo
                        </DialogTitle>
                    </DialogHeader>
                    <iframe
                        src={''}
                        className="w-full h-full"
                    />
                </DialogContent>
            </Dialog>
        </>
    )
}

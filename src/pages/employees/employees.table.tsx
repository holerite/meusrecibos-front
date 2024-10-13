import React from "react"
import {
    type ColumnDef,
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
import { DataTablePagination } from "@/components/layout/data-table-pagination"
import { ITablePagination } from "@/utils/types/table"



interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data?: TData[]
    isLoading: boolean
    pagination: ITablePagination
    setPagination: React.Dispatch<React.SetStateAction<ITablePagination>>
    pageCount: number
    totalRecords: number
}



export function DataTable<TData, TValue>({
    columns,
    isLoading,
    data,
    pagination,
    setPagination,
    pageCount,
    totalRecords
}: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data: data || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        onPaginationChange: setPagination,
        pageCount: pageCount,
        state: {
            pagination,
        }
    })

    return (
        <div className="space-y-4">
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
                            </>
                        )}
                    </TableBody>
                </Table>
            </div>
            <DataTablePagination
                table={table}
                showSelectedCount={false}
                totalRecords={totalRecords}
            />
        </div>
    )
}

import {
    type ColumnDef,
    flexRender,
    Table as TableType,
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import type { PaymentDTO } from "./receipt.columns";
import { DataTablePagination } from "@/components/layout/data-table-pagination";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data?: TData[]
    isLoading: boolean
    table: TableType<PaymentDTO>
    totalRecords: number

}

export function DataTable<TValue>({
    columns,
    isLoading,
    table,
    totalRecords
}: DataTableProps<PaymentDTO, TValue>) {

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
                                                    header.getContext(),
                                                )}
                                        </TableHead>
                                    );
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
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <>
                                {isLoading ? (
                                    <>
                                        <TableRow>
                                            <TableCell colSpan={columns.length} className="h-24 ">
                                                <Loader2 size={24} className="animate-spin mx-auto" />
                                            </TableCell>
                                        </TableRow>
                                    </>
                                ) : (
                                    <>
                                        <TableRow>
                                            <TableCell
                                                colSpan={columns.length}
                                                className="h-24 text-center"
                                            >
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
            <DataTablePagination
                table={table}
                showSelectedCount={false}
                totalRecords={totalRecords}
            />
        </div>
    )
}

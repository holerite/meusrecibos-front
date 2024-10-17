import { DataTable } from "./recepit.table.data-table";
import { columns, PaymentDTO } from "./receipt.columns";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "react-router-dom";
import { IDataPagination, ITablePagination } from "@/utils/types/table";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";
import { ReceiptFilter } from "./receipt.filter";
import {
    getCoreRowModel,
    useReactTable,
    getSortedRowModel,
    getPaginationRowModel,
    SortingState,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ImportReceiptDialog } from "./import-receipt.modal";
import { receiptsFilterDefaultValues, receiptsFilterFormDefaultValues, receiptsFilterSchema } from "@/utils/forms/receipt";
import { formatISO } from "date-fns";
import { toIsoDate } from "@/utils/masks";
import { IReceiptType } from "@/utils/types/receipt-type";
import { useAuth } from "@/hooks/use-auth";


interface IPaymentData {
    receipts: PaymentDTO[]
    pagination: IDataPagination
}

export interface IReceiptsFilterValues {
    employee: string
    type: string
    paydayFrom?: string
    paydayTo?: string
    validity: string
    opened?: string
}

async function getData(data: IReceiptsFilterValues, pagination: ITablePagination) {
    return (await api.get<IPaymentData>("/receipt", {
        params: {
            ...data,
            page: pagination.pageIndex,
            take: pagination.pageSize,
        },
    })).data;
}

async function getReceiptTypes() {
    return (await api.get<IReceiptType[]>("/receipt/type")).data;
}

export function Receipt() {
    const { user } = useAuth()
    const [searchParams] = useSearchParams()
    const [sorting, setSorting] = useState<SortingState>([]);
    const [rowSelection, setRowSelection] = useState({});
    const [printOpenDialog, setOpenPrintDialog] = useState(false);
    const [pagination, setPagination] = useState<ITablePagination>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [filterValues, setFilterValues] = useState<IReceiptsFilterValues>({
        ...receiptsFilterDefaultValues,
        employee: searchParams.get("employee") || "",
        type: searchParams.get("type") || "",
    });

    const form = useForm<z.infer<typeof receiptsFilterSchema>>({
        resolver: zodResolver(receiptsFilterSchema),
        defaultValues: receiptsFilterFormDefaultValues,
    });

    const { data, isLoading } = useQuery({
        queryKey: ["receipts", filterValues, pagination],
        queryFn: () => getData(filterValues, pagination),
    });

    const receiptQuery = useQuery({
        queryKey: ["receiptTypes"],
        queryFn: getReceiptTypes,
    });

    const table = useReactTable({
        data: data?.receipts || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onRowSelectionChange: setRowSelection,
        manualPagination: true,
        onPaginationChange: setPagination,
        pageCount: data?.pagination?.total_pages || 1,
        getRowId: (row) => row.id,
        state: {
            sorting,
            rowSelection,
            pagination,
        },
        meta: {
            onPrint: onPrint,
        },
    });

    function onPrint(data: string[]) {
        console.log(data);
        setOpenPrintDialog(true);
    }

    function onSubmit(values: z.infer<typeof receiptsFilterSchema>) {
        setPagination({
            ...pagination,
            pageIndex: 0
        });
        setFilterValues({
            employee: values?.employee || "",
            type: values?.type === "null" ? "" : values?.type || "",
            paydayFrom: values?.payday?.from ? formatISO(values?.payday?.from) : undefined,
            paydayTo: values?.payday?.to ? formatISO(values?.payday?.to) : undefined,
            validity: toIsoDate(values.validity),
            opened: values?.opened,
        });
    }

    useEffect(() => {
        form.setValue("employee", searchParams.get("employee") || "");
        form.setValue("type", searchParams.get("type") || "null");
    }, [])

    return (
        <>
            <div className="flex md:flex-row flex-col items-center justify-between gap-3">
                <h1 className="text-3xl font-semibold">Recibos</h1>
                <div className="space-x-3">
                    <ReceiptFilter
                        form={form}
                        onSubmit={onSubmit}
                        filterValues={filterValues}
                        setFilterValues={setFilterValues}
                        isLoading={isLoading}
                        receiptTypes={receiptQuery.data || []}
                    />
                    <Button
                        onClick={() => onPrint(Object.keys(rowSelection))}
                        disabled={!table.getFilteredSelectedRowModel().rows.length}
                    >
                        Imprimir ({table.getFilteredSelectedRowModel().rows.length})
                    </Button>
                    {user?.isAdmin && (
                        <ImportReceiptDialog
                            receiptTypes={receiptQuery.data || []}
                        />
                    )}
                </div>
            </div>
            <DataTable
                columns={columns}
                data={data?.receipts || []}
                isLoading={isLoading}
                table={table}
                totalRecords={data?.pagination.total_records || 0}
            />
            <Dialog
                open={printOpenDialog}
                onOpenChange={(open) => setOpenPrintDialog(open)}
            >
                <DialogContent className="max-w-[80%] h-[90%] overflow-y-auto flex flex-col">
                    <DialogHeader className="mb-4">
                        <DialogTitle>Recibo</DialogTitle>
                    </DialogHeader>
                    <iframe src={""} className="w-full h-full" />
                </DialogContent>
            </Dialog>
        </>
    );
}

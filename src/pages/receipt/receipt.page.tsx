import { DataTable } from "./recepit.table.data-table";
import { columns, PaymentDTO } from "./receipt.columns";
import { useMutation, useQuery } from "@tanstack/react-query";
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
import { toast } from "@/hooks/use-toast";
import { Loader2Icon } from "lucide-react";
import { PendingEmployeeDialog } from "./pending-employee.modal";
import { ImportReceiptErrorDialog } from "./import-receipt-error.modal";


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

export interface IImportReceiptErrorDialogValues {
    name: string
    pages: number[]
}


async function getData(data: IReceiptsFilterValues, pagination: ITablePagination) {
    return (await api.get<IPaymentData>("/receipt", {
        params: {
            ...data,
            opened: data.opened === "undefined" ? undefined : data.opened,
            page: pagination.pageIndex,
            take: pagination.pageSize,
        },
    })).data;
}

async function getReceiptTypes() {
    return (await api.get<IReceiptType[]>("/receipt/type")).data;
}

async function getReceiptById(id: number) {
    return (await api.get<string>(`/receipt/file?receiptId=${id}`)).data;
}

async function openReceipt(id: number) {
    await api.post(`/receipt/view`, {
        receiptId: id,
    });
}

export function Receipt() {
    const { user } = useAuth()
    const [searchParams] = useSearchParams()
    const [sorting, setSorting] = useState<SortingState>([]);
    const [rowSelection, setRowSelection] = useState({});

    const [printOpenDialog, setOpenPrintDialog] = useState(false);
    const [pendingEmployeeDialogOpen, setPendingEmployeeDialogOpen] = useState(false);

    const [importReceiptErrorDialogOpen, setImportReceiptErrorDialogOpen] = useState(false);
    const [importReceiptErrorDialogErrors, setImportReceiptErrorDialogErrors] = useState<IImportReceiptErrorDialogValues[]>([]);

    const [showReceiptDialogOpen, setShowReceiptDialogOpen] = useState(false);
    const [showReceiptSrc, setShowReceiptSrc] = useState<string>("");

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

    const receiptMutation = useMutation({
        mutationKey: ['showReceipt'],
        mutationFn: getReceiptById,
        onSuccess: (data) => {
            setShowReceiptSrc(data);
        },
        onError: (error) => {
            toast({
                variant: "destructive",
                title: "Erro ao buscar recibo",
                description: error?.message || "Erro desconhecido",
            })
        }
    });

    const openReceiptMutation = useMutation({
        mutationKey: ['openReceipt'],
        mutationFn: openReceipt,
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
        getRowId: (row) => String(row.id),
        state: {
            sorting,
            rowSelection,
            pagination,
        },
        meta: {
            onPrint: onPrint,
            onShowReceipt: onShowReceipt,
        },
    });

    function onPrint(data: string[]) {
        console.log(data);
        // setOpenPrintDialog(true);
    }

    function onShowReceipt(id: number) {
        const receipt = data?.receipts.find(receipt => receipt.id === id);
        if(!user?.isAdmin && !receipt?.opened) {
            openReceiptMutation.mutate(id);
        }
        setShowReceiptDialogOpen(true);
        receiptMutation.mutate(id)
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
                            setPendingEmployeeDialogOpen={setPendingEmployeeDialogOpen}
                            setImportReceiptErrorDialogOpen={setImportReceiptErrorDialogOpen}
                            setImportReceiptErrorDialogErrors={setImportReceiptErrorDialogErrors}
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

            {/* Dialog to show receipt */}
            <Dialog
                open={showReceiptDialogOpen}
                onOpenChange={(open) => setShowReceiptDialogOpen(open)}
            >
                <DialogContent className="max-w-[80%] h-[90%] overflow-y-auto flex flex-col">
                    <DialogHeader className="mb-4">
                        <DialogTitle>Recibo</DialogTitle>
                    </DialogHeader>
                    {receiptMutation.isPending ? (
                        <div className="flex justify-center items-center h-full">
                            <Loader2Icon className="w-10 h-10 animate-spin" />
                        </div>
                    ) : (
                        <iframe src={showReceiptSrc} className="w-full h-full" />
                    )}
                </DialogContent>
            </Dialog>

            {/* Dialog to print */}
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

            <PendingEmployeeDialog 
                isOpen={pendingEmployeeDialogOpen}
                setIsOpen={setPendingEmployeeDialogOpen}
            />

            <ImportReceiptErrorDialog
                isOpen={importReceiptErrorDialogOpen}
                setIsOpen={setImportReceiptErrorDialogOpen}
                errors={importReceiptErrorDialogErrors}
            />
        </>

    );
}

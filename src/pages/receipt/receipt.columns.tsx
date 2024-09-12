"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import type { ColumnDef } from "@tanstack/react-table"
import { format } from 'date-fns'
import { Eye, Mail, MailIcon, MailOpen, MailOpenIcon } from "lucide-react"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
    id: string
    employee: string
    type: "pending" | "processing" | "success" | "failed"
    payday: Date
    validity: Date
    opened: boolean
}

export const columns: ColumnDef<Payment>[] = [
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
        header: "Data de pagamendo",
        cell: ({ row }) => (
            <>
                {format(new Date(row.original.validity), 'dd/MM/yyyy')}
            </>
        ),
    },
    {
        accessorKey: "validity",
        header: "Mês-ano",
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
        cell: ({ row }) => (
            <>
                {row.original.opened ? <MailOpenIcon className="w-5 h-5  text-gray-400" /> : <MailIcon className="w-5 h-5" />}
            </>
        ),
        enableSorting: false,
        enableHiding: false,
    },
]

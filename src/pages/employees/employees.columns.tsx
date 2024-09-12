"use client"

import { Button } from "@/components/ui/button"
import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, } from "lucide-react"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type EmployeesDto = {
    id: string
    registration: number
    name: string
    email: string
    receipts: number
}

export const columns: ColumnDef<EmployeesDto>[] = [
    {
        accessorKey: "registration",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Matrícula
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "name",
        header: "Nome",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "receipts",
        header: "Recibos",
    },


]

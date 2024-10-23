import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { ICompany } from "@/pages/auth/workspace.page";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Loader2Icon } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn } from "@/lib/utils";

interface IChangeCompanyDialogProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}



export function ChangeCompanyDialog({ open, setOpen }: IChangeCompanyDialogProps) {
    const { user, changeCompany } = useAuth()
    const { data, isLoading } = useQuery({
        queryKey: ["companies", open],
        queryFn: getCompanies,
        enabled: open,
    });
    const [submitting, setSubmitting] = useState(false);

    async function getCompanies() {
        const url = user?.isAdmin ? "/auth/company" : "/employees/company";
        return (await api.get<ICompany[]>(url)).data;
    }

    function handleChangeCompany(id: number) {
        setSubmitting(true);
        changeCompany(id);
        setSubmitting(false);
        setOpen(false);
    }

    return (
        <Dialog
            open={open}
            onOpenChange={setOpen}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Alterar empresa</DialogTitle>
                </DialogHeader>
                {!isLoading || submitting ? (
                    <div className="flex flex-col gap-4">
                        {data?.map(company => {
                            return (
                                <button
                                    type="button"
                                    onClick={() => handleChangeCompany(company.id)}
                                    disabled={company.id === user?.companyId}
                                    key={company.id}
                                    className={cn("flex gap-4 items-center border p-4 w-full rounded-lg", company.id === user?.companyId ? "border-gray-200 bg-gray-200 text-gray-500 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-400" : " border-gray-400")}
                                >
                                    <Avatar className="rounded-md">
                                        <AvatarImage className="rounded-md" src="https://gisthub.com/shadcn.png" />
                                        <AvatarFallback className="rounded-md">{company.name.slice(0, 2)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <h1>{company.name}</h1>
                                        <p className="text-sm text-stone-400">{company?.role || ""}</p>
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                ) : (
                    <div className="flex justify-center items-center h-full">
                        <Loader2Icon className="w-10 h-10 animate-spin" />
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
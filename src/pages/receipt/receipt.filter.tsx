import { z } from "zod";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ptBR } from "date-fns/locale";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { receiptsFilterDefaultValues, receiptsFilterSchema } from "@/utils/forms/receipt";
import { UseFormReturn } from "react-hook-form";
import { IReceiptsFilterValues } from "./receipt.page";
import { IReceiptType } from "@/utils/types/receipt-type";
interface IEmployeeFilterProps {
    form: UseFormReturn<z.infer<typeof receiptsFilterSchema>>
    onSubmit: (values: z.infer<typeof receiptsFilterSchema>) => void
    filterValues: IReceiptsFilterValues
    setFilterValues: React.Dispatch<React.SetStateAction<IReceiptsFilterValues>>
    isLoading: boolean
    receiptTypes: IReceiptType[]
}

export function ReceiptFilter({ form, onSubmit, filterValues, setFilterValues, isLoading, receiptTypes }: IEmployeeFilterProps) {

    function numberOfFiltersApplied() {
        return Object.values(filterValues).filter((value) => value).length;
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline">
                    Filtros
                    {numberOfFiltersApplied() > 0 && <> ({numberOfFiltersApplied()})</>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <div className="flex flex-col h-full w-full gap-3">
                            <FormField
                                control={form.control}
                                name="employee"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Colaborador</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nome do colaborador" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Descrição</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={String(field.value)}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Todos" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="null">Todos</SelectItem>
                                                {receiptTypes.map((type) => {
                                                    return (
                                                        <SelectItem value={String(type.id)} key={String(type.id)}>
                                                            {type.name}
                                                        </SelectItem>
                                                    );
                                                })}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="grid grid-cols-2 gap-2.5">
                                <FormField
                                    control={form.control}
                                    name="validity"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Data de vigência</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Nome do colaborador"
                                                    type="month"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="opened"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Status</FormLabel>
                                            <Select
                                                onValueChange={(value) => {
                                                    if (value === "undefined") field.onChange(undefined)
                                                    else field.onChange(value)
                                                }}
                                                defaultValue={String(field.value)}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Todos" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="undefined">Todos</SelectItem>
                                                    <SelectItem value="true">Abertos</SelectItem>
                                                    <SelectItem value="false">Fechados</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="flex gap-2.5">
                                <FormField
                                    control={form.control}
                                    name="payday"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col flex-1">
                                            <FormLabel>Data de pagamento</FormLabel>
                                            <div className={cn("grid gap-2")}>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            id="date"
                                                            variant={"outline"}
                                                            className={cn(
                                                                "justify-start text-left font-normal",
                                                                !field.value && "text-muted-foreground",
                                                            )}
                                                        >
                                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                                            {field?.value?.from ? (
                                                                field?.value.to ? (
                                                                    <>
                                                                        {format(field.value.from, "dd LLL y", {
                                                                            locale: ptBR
                                                                        })} -{" "}
                                                                        {format(field.value.to, "dd LLL y", {
                                                                            locale: ptBR
                                                                        })}
                                                                    </>
                                                                ) : (
                                                                    format(field.value.from, "dd LLL y", {
                                                                        locale: ptBR
                                                                    })
                                                                )
                                                            ) : (
                                                                <span>Selecione uma data</span>
                                                            )}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar
                                                            initialFocus
                                                            mode="range"
                                                            selected={{
                                                                from: field.value?.from || undefined,
                                                                to: field.value?.to || undefined,
                                                            }}
                                                            onSelect={field.onChange}
                                                            numberOfMonths={2}
                                                            locale={ptBR}
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="text-end space-x-3">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        form.reset();
                                        setFilterValues(receiptsFilterDefaultValues);
                                    }}
                                >
                                    Limpar
                                </Button>
                                <Button
                                    type="submit"
                                    isLoading={isLoading}
                                >
                                    Filtrar
                                </Button>
                            </div>
                        </div>

                    </form>
                </Form>
            </PopoverContent>
        </Popover >
    )

}
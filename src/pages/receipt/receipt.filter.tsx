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
import { Switch } from "@/components/ui/switch";
import { IReceiptsFilterValues } from "./receipt.page";

const TypeOptions = [
    {
        label: "13° Integral",
        type: 1,
    },
    {
        label: "13° Adiantado",
        type: 2,
    },
    {
        label: "Cartão de Ponto",
        type: 3,
    },
    {
        label: "Energia / Office",
        type: 4,
    },
    {
        label: "Férias",
        type: 5,
    },
];
interface IEmployeeFilterProps {
    form: UseFormReturn<z.infer<typeof receiptsFilterSchema>>
    onSubmit: (values: z.infer<typeof receiptsFilterSchema>) => void
    setFilterValues: React.Dispatch<React.SetStateAction<IReceiptsFilterValues>>
    isLoading: boolean
}

export function ReceiptFilter({ form, onSubmit, setFilterValues, isLoading }: IEmployeeFilterProps) {

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline">Filtros</Button>
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

                            <div className="grid grid-cols-2 gap-2.5">
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
                                                    {TypeOptions.map((option) => {
                                                        return (
                                                            <SelectItem value={String(option.type)} key={option.type}>
                                                                {option.label}
                                                            </SelectItem>
                                                        );
                                                    })}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
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
                                                            selected={field.value}
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
                                <FormField
                                    control={form.control}
                                    name="opened"
                                    render={({ field }) => (
                                        <FormItem className="min-w-16">
                                            <FormLabel>Aberto</FormLabel>
                                            <FormControl>
                                                <div>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </div>
                                            </FormControl>
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
import { z } from "zod";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cpfMask } from "@/utils/masks";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { employeesFilterDefaultValues, employeesFilterSchema } from "@/utils/forms/employees";

interface IEmployeeFilterProps {
    form: UseFormReturn<z.infer<typeof employeesFilterSchema>>
    onSubmit: (values: z.infer<typeof employeesFilterSchema>) => void
    setFilterValues: React.Dispatch<React.SetStateAction<z.infer<typeof employeesFilterSchema>>>
    isLoading: boolean
}

export function EmployeesFilter({ form, onSubmit, setFilterValues, isLoading }: IEmployeeFilterProps) {

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
                            <div className="grid grid-cols-2 gap-2.5">
                                <FormField
                                    control={form.control}
                                    name="matricula"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Matrícula</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Matricula" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="cpf"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>CPF</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="CPF"
                                                    {...field}
                                                    onChange={(e) => {
                                                        form.setValue('cpf', cpfMask(e.target.value))
                                                    }}
                                                    value={field.value}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                            </div>
                            <FormField
                                control={form.control}
                                name="nome"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nome</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nome" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Email" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="text-end space-x-3">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        form.reset();
                                        setFilterValues(employeesFilterDefaultValues);
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
        </Popover>
    )

}
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { receiptTypeSchema } from "@/utils/forms/receipt-type";
import {  UseFormReturn } from "react-hook-form";
import { z } from "zod";


interface IReceiptTypeFormProps {
    form: UseFormReturn<z.infer<typeof receiptTypeSchema>>;
    onSubmit: (values: z.infer<typeof receiptTypeSchema>) => void;
    isPending: boolean;
}
export function ReceiptTypeForm({ form, onSubmit, isPending }: IReceiptTypeFormProps) {
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nome</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <DialogFooter className="mt-4">
                    <Button
                        type="submit"
                        isLoading={isPending}
                    >
                        Confirmar
                    </Button>
                </DialogFooter>
            </form>
        </Form>
    )
}
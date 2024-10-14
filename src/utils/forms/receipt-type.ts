import { z } from "zod";

export const receiptTypeDefaultValues = {
    name: "",
};

export const receiptTypeSchema = z.object({
    name: z.string().min(1, {
        message: "O nome é obrigatório",
    }),
});

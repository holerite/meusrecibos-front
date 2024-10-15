import { z } from "zod";

//usado no state que vai ser enviado para a API
export const receiptsFilterDefaultValues = {
    employee: "",
    type: "",
    paydayFrom: undefined,
    paydayTo: undefined,
    validity: "",
    opened: undefined,
};

//usado no form
export const receiptsFilterFormDefaultValues = {
    employee: "",
    type: "",
    payday: {
        from: undefined,
        to: undefined,
    },
    validity: "",
    opened: undefined,
};

export const receiptsFilterSchema = z.object({
    employee: z.string().optional(),
    type: z.string().optional(),
    payday: z
        .object({
            from: z.date().or(z.undefined()),
            to: z.date().or(z.undefined()),
        })
        .optional(),
    validity: z.string(),
    opened: z.string().or(z.undefined()),
});

export const receiptsCreateDefaultValues = {
    type: "",
    payday: new Date(),
    validity: "",
    file: "",
};

export const receiptsCreateSchema = z.object({
    type: z.string().min(1, {
        message: "O tipo é obrigatório",
    }),
    payday: z.date({
        message: "A data de pagamento é obrigatória",
    }),
    validity: z.string().min(1, {
        message: "A validade é obrigatória",
    }),
    file: z.string().min(1, {
        message: "O arquivo é obrigatório",
    }),
});

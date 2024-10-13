import { formatISO, subDays } from 'date-fns';
import { z } from 'zod';

//usado no state que vai ser enviado para a API
export const receiptsFilterDefaultValues = {
    employee: "",
    type: "",
    paydayFrom: formatISO(subDays(new Date(), 30)),
    paydayTo: formatISO(new Date()),
    validity: "",
    opened: false,
}

//usado no form
export const receiptsFilterFormDefaultValues = {
    employee: "",
    type: "",
    payday: {
        from: subDays(new Date(), 30),
        to: new Date(),
    },
    validity: "",
    opened: false,
}

export const receiptsFilterSchema = z.object({
    employee: z.string().optional(),
    type: z.string().optional(),
    payday: z.object({
        from: z.date(),
        to: z.date(),
    }).optional(),
    validity: z.string(),
    opened: z.boolean(),
});

export const receiptsCreateDefaultValues = {
    employeeId: "",
    type: "",
    payday: new Date(),
    validity: "",
    receipt: "",
}

export const receiptsCreateSchema = z.object({
    employeeId: z.string({
        message: "O colaborador é obrigatório"
    }),
    type: z.string({
        message: "O tipo é obrigatório"
    }),
    payday: z.date({
        message: "A data de pagamento é obrigatória"
    }),
    validity: z.string({
        message: "A data de vigência é obrigatória"
    }),
    receipt: z.string({
        message: "O recibo é obrigatório"
    }),
});
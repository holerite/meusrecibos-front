import { subDays } from 'date-fns';
import { z } from 'zod';

export const receiptsFilterDefaultValues = {
    employee: "",
    type: 1,
    payday: {
        from: subDays(new Date(), 30),
        to: new Date(),
    },
    validity: new Date(),
    opened: false,
}

export const receiptsFilterSchema = z.object({
    employee: z.string().optional(),
    type: z.number().optional(),
    payday: z.object({
        from: z.date(),
        to: z.date(),
    }).optional(),
    validity: z.date(),
    opened: z.boolean(),
});
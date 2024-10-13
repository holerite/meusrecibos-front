import { z } from "zod";


export const employeesFilterDefaultValues = {
    matricula: "",
    nome: "",
    email: "",
    cpf: "",
};

export const employeesFilterSchema = z.object({
    matricula: z.string().optional(),
    nome: z.string().optional(),
    email: z.string().optional(),
    cpf: z.string().optional(),
});

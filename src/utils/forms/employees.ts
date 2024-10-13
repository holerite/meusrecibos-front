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

export const employeesCreateFormDefaultValues = {
    matricula: "",
    nome: "",
    email: "",
    cpf: "",
};

export const employeesCreateSchema = z.object({
    name: z.string({
        message: "O nome é obrigatório"
    }),
    email: z.string({
        message: "O email é obrigatório"
    }).email(
        "Email inválido"
    ),
    enrolment: z.string({
        message: "A matrícula é obrigatória"
    }),
    cpf: z.string({
        message: "O CPF é obrigatório"
    }),
});


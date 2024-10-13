import { z } from "zod";

export const userDefaultValues = {
    name: "",
    email: "",
}

export const userSchema = z.object({
    name: z.string({
        message: "O nome é obrigatório"
    }),
    email: z.string({
        message: "O email é obrigatório"
    }).email(
        "Email inválido"
    ),
});
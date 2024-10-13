import { add, formatISO } from "date-fns"

//remove all masks
export const removeMask = (value: string) => {
    return value.replace(/\D/g, '')
}

//cpf mask
export const cpfMask = (value: string) => {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1')
}

export const toIsoDate = (date: string | Date) => {
    if(date == '' || date == null) return ''
    const formattedDate = add(new Date(date), { hours: 3 })
    return formatISO(formattedDate);
}
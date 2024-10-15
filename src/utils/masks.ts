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

export const fileToBase64 = (file: File) => {
    const convertedFile = new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            resolve(reader.result as string);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
    
    if(file.size > 1000000000) throw new Error('O arquivo deve ter no máximo 1GB');
    if(file.type !== 'application/pdf') throw new Error('O arquivo deve ser um PDF');
    return convertedFile;

}
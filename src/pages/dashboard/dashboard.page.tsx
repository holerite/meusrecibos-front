import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const RECIBOS = [
    {
        label: "13° Integral",
        type: "1",
        amount: 1000,
    },
    {
        label: "13° Adiantado",
        type: "2",
        amount: 1000,
    },
    {
        label: "Cartão de Ponto",
        type: "3",
        amount: 1000,
    },
    {
        label: "Energia / Office",
        type: "4",
        amount: 1000,
    },
    {
        label: "Férias",
        type: "5",
        amount: 1000,
    }
]

export function Dashboard() {
    return (
        <div className="flex flex-col w-full gap-4">
            <h1 className="text-xl">Recibos</h1>
            <div className="grid grid-cols-5 w-full gap-4 h-min">
                {RECIBOS.map(({ amount, label, type }) => {
                    return (
                        <Card key={type} >
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {label}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {amount}
                                </div>
                            </CardContent>
                        </Card>
                    )
                }
                )}

            </div>
        </div>
    )
}
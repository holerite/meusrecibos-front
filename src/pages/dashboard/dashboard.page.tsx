import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

interface IDashboardData {
    receipts: {
        id: number
        name: string
        _count: {
            Receipts: number
        }
    }[]
}

async function getData() {
    return (await api.get<IDashboardData>("/dashboard")).data;
}

export function Dashboard() {

    const { data, isLoading } = useQuery({
        queryKey: ["receipts"],
        queryFn: getData,
    });

    return (
        <>
            {!isLoading ? (
                <div className="flex flex-col w-full gap-4">
                    <h1 className="text-3xl font-semibold">Recibos</h1>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xxl:grid-cols-5 w-full gap-4 h-min">
                        {data?.receipts.map(receipt => {
                            return (
                                <Link to={`/receipt?type=${receipt.id}`} key={String(receipt.id)} >
                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">{receipt.name}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">{receipt?._count?.Receipts}</div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xxl:grid-cols-5 w-full gap-4 h-min">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <Skeleton key={index} className="h-[110px] w-full rounded-xl" />
                    ))}
                </div>
            )}

        </>
    );
}

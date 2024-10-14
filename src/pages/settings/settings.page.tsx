
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { UserSettings } from "./users/user.settings";
import { useSearchParams } from "react-router-dom";
import { ReceiptTypeSettings } from "./receipt-type/receipt-type.settings";

export function Settings() {
    const [params, setSearchParams] = useSearchParams()

    function handleTabChange(tab: string) {
        setSearchParams({ tab })
    }

    return (
        <>

            <Tabs defaultValue={params.get("tab") || "users"} onValueChange={(e) => handleTabChange(e)}>
                <TabsList  >
                    <TabsTrigger value="users">Usuários</TabsTrigger>
                    <TabsTrigger value="receipt-types">Descrições de recibos</TabsTrigger>
                </TabsList>
                <TabsContent value="users">
                    <UserSettings />
                </TabsContent>
                <TabsContent value="receipt-types">
                    <ReceiptTypeSettings />
                </TabsContent>
            </Tabs>
        </>
    )
}
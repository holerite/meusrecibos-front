
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { UserSettings } from "./users/user.settings";
import { PermissionsSettings } from "./permissions.settings";
import { LogsSettings } from "./logs.settings";
import { ProfileSettings } from "./profile.settings";
import { useSearchParams } from "react-router-dom";
import { CompanySettings } from "./company.settings";

export function Settings() {
    const [params, setSearchParams] = useSearchParams()

    function handleTabChange(tab: string) {
        setSearchParams({ tab })
    }

    return (
        <>

            <Tabs defaultValue={params.get("tab") || "company"} onValueChange={(e) => handleTabChange(e)}>
                <TabsList  >
                    <TabsTrigger value="company">Empresa</TabsTrigger>
                    <TabsTrigger value="users">Usuários</TabsTrigger>
                    {/* <TabsTrigger value="permissions">Permissões</TabsTrigger> */}
                    {/* <TabsTrigger value="logs">Registros</TabsTrigger> */}
                    <TabsTrigger value="profile">Perfil</TabsTrigger>
                </TabsList>
                <TabsContent value="company" >
                    <CompanySettings />
                </TabsContent>
                <TabsContent value="users">
                    <UserSettings />
                </TabsContent>
                <TabsContent value="permissions">
                    <PermissionsSettings />
                </TabsContent>
                <TabsContent value="logs">
                    <LogsSettings />
                </TabsContent>
                <TabsContent value="profile">
                    <ProfileSettings />
                </TabsContent>
            </Tabs>
        </>
    )
}
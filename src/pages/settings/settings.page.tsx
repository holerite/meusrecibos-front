
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export function Settings() {

    return (
        <>

            <Tabs defaultValue="account" >
                <TabsList >
                    <TabsTrigger value="company">Empresa</TabsTrigger>
                    <TabsTrigger value="users">Usuários</TabsTrigger>
                    <TabsTrigger value="permissions">Permissões</TabsTrigger>
                    <TabsTrigger value="logs">Registros</TabsTrigger>
                    <TabsTrigger value="profile">Perfil</TabsTrigger>
                </TabsList>
                <TabsContent value="company" >

                </TabsContent>
                <TabsContent value="users">

                </TabsContent>
            </Tabs>
        </>
    )
}
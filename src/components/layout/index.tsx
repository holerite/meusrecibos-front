import { Link } from "react-router-dom"
import {
    Menu,
    Package2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { NavItem } from "./navItem"
import { AuthContext } from "@/hooks/use-auth"
import { useContext, useState } from "react"

type LayoutProps = {
    children: React.ReactNode
}


export function Layout({ children }: LayoutProps) {
    const { routes, signOut, user } = useContext(AuthContext)
    const [open, setOpen] = useState(false);

    return (
        <div className="grid min-h-screen w-screen lg:grid-cols-[250px_1fr]">
            <div className="hidden border-r bg-muted/40 lg:block">
                <div className="flex h-full max-h-screen flex-col gap-2">
                    <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                        <Link to="/" className="flex items-center gap-2 font-semibold">
                            <Package2 className="h-6 w-6" />
                            <span className="">meusrecibos Inc</span>
                        </Link>
                    </div>
                    <div className="flex-1">
                        <nav className="grid items-start gap-2  px-2  font-medium lg:px-4">
                            {routes.map((item) => <NavItem setOpen={setOpen} key={item.route} {...item} />)}
                        </nav>
                    </div>
                </div>
            </div>
            <div className="flex flex-col">
                <header className="flex h-14 items-center gap-4 border-b bg-white px-4 lg:h-[60px] lg:px-6 fixed w-screen lg:w-[calc(100vw-250px)] z-20">
                    <Sheet
                        open={open}
                        onOpenChange={setOpen}
                    >
                        <SheetTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                className="shrink-0 lg:hidden"
                            >
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Abrir menu lateral</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="flex flex-col w-screen p-8">
                            <nav className="grid gap-2 text-lg font-medium">
                                {routes.map((item) => <NavItem key={item.route} setOpen={setOpen} {...item} />)}
                            </nav>
                        </SheetContent>
                    </Sheet>
                    <div className="w-full flex-1 items-end flex justify-end gap-4">
                        <div className="flex flex-col">
                            <h1 className="text-primary text-sm font-medium">{user?.name || "Não informado"}</h1>
                            <p className="text-secondary-foreground text-xs">{user?.companyName || ""}</p>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="secondary" size="icon" className="rounded-full">
                                    <Avatar>
                                        <AvatarFallback className="text-secondary bg-secondary-foreground">
                                            {user?.name[0] || "N"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="sr-only">Toggle user menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                    <Link to="/settings">Configurações</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>Alterar empresa</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={signOut}>Sair</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>
                <main className="overflow-x-hidden w-screen lg:w-full pt-14 lg:pt-[60px]">
                    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}

import { api } from "@/lib/api";
import { Dashboard, Employees, Settings, Receipt } from "@/pages";
import { Clipboard, File, Settings2, Users } from "lucide-react";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../hooks/use-toast";


const systemRoutes = [
    {
        name: "Relatório",
        Icon: () => <Clipboard className="w-4 h-4" />,
        element: <Dashboard />,
        route: "/",
    },
    {
        name: "Recibos",
        Icon: () => <File className="w-4 h-4" />,
        element: <Receipt />,
        route: "/receipt",
    },
    {
        name: "Colaboradores",
        Icon: () => <Users className="w-4 h-4" />,
        element: <Employees />,
        route: "/employees",
    },

    {
        name: "Configurações",
        Icon: () => <Settings2 className="w-4 h-4" />,
        element: <Settings />,
        route: "/settings",
    }
]

type User = {
    id: number;
    name: string;
    email: string;
    companyId: number;
    companyName: string;
    isAdmin: boolean;
    routes: { 
        id: number;
        name: string;
        route: string;
        active: boolean;
    }[];
};

type Routes = {
    name: string;
    Icon: () => JSX.Element;
    element: JSX.Element;
    route: string;
}

type IAuthContextData = {
    signOut: () => void;
    signIn: (id: number, isEmployee?: boolean) => void;
    user?: User | null;
    routes: Routes[];
    loading: boolean
}

export const AuthContext = createContext({} as IAuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { toast } = useToast()
    const [user, setUser] = useState<User | null>();
    const [routes, setRoutes] = useState<Routes[]>([]);
    const [loading, setLoading] = useState(true)

    const navigate = useNavigate()

    function handleRoutes(userData: User) {
        const userRoutes = userData.routes.map((route) => {
            const routeElement = systemRoutes.find((systemRoute) => systemRoute.route === route.route);
            if (routeElement) {
                return routeElement;
            }
            return null;
        }) as Routes[];

        setRoutes(userRoutes);
    }


    async function signOut() {
        const url = user?.isAdmin ? "/" : "/employees";
        setUser(null);
        setRoutes([]);
        localStorage.removeItem('@meusrecibos:user');
        localStorage.removeItem('@meusrecibos:accessToken');
        localStorage.removeItem('@meusrecibos:refreshToken');
        await api.post("/auth/logout");
        navigate(url);
    }

    async function signIn(id: number, isEmployee = false) {
        setLoading(true)
        try {
            const url = isEmployee ? "/employees/company" : "/auth/company";
            const { data } = await api.post(url, {
                companyId: Number(id)
            });
            toast({
                title: "Login efetuado com sucesso"
            })
            handleRoutes(data.user)
            setUser(data.user);
            api.defaults.headers.Authorization = `Bearer ${data.accessToken}`;
            localStorage.setItem('@meusrecibos:user', JSON.stringify(data.user));
            localStorage.setItem('@meusrecibos:accessToken', JSON.stringify(data.accessToken));
            localStorage.setItem('@meusrecibos:refreshToken', JSON.stringify(data.refreshToken));
            navigate(isEmployee ? '/receipt' : '/')
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Erro ao realizar login",
                description: error.response?.data?.message || "Tente novamente mais tarde",
            })
        } finally {
            setLoading(false)
        }

    }

    useEffect(() => {
        const user = localStorage.getItem('@meusrecibos:user');
        const accessToken = localStorage.getItem('@meusrecibos:accessToken');

        if (user && accessToken) {
            setUser(JSON.parse(user));
            handleRoutes(JSON.parse(user));
            return
        }
        setUser(null)
    }, [])

    useEffect(() => {
        setLoading(false)
    }, [user])

    return (
        <AuthContext.Provider value={{
            signIn, signOut, user, routes, loading
        }}>
            {children}
        </AuthContext.Provider>
    );

}
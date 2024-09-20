
import { Dashboard, Employees, Settings, Receipt } from "@/pages";
import { Clipboard, File, Settings2, Users } from "lucide-react";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


const systemRoutes = [
	{
		title: "Relatório",
		Icon: () => <Clipboard className="w-4 h-4" />,
		element: <Dashboard />,
		href: "/",
	},
	{
		title: "Recibos",
		Icon: () => <File className="w-4 h-4" />,
		element: <Receipt />,
		href: "/receipt",
	},
	{
		title: "Colaboradores",
		Icon: () => <Users className="w-4 h-4" />,
		element: <Employees />,
		href: "/employees",
	},

	{
		title: "Configurações",
		Icon: () => <Settings2 className="w-4 h-4" />,
		element: <Settings />,
		href: "/settings",
	}
]

const teste = {
	id: "18923718923789",
	name: "John Doe",
	role: "admin",
	permissions: ["1"],
	routes: [
		{
			href: "/",
		},
		{
			href: "/receipt",
		},
		{
			href: "/employees",
		},
		{
			href: "/settings",
		},
	],
}


type User = {
	id: string;
	name: string;
	role: string;
	permissions: string[];
	routes: { href: string }[];
};

type Routes = {
	title: string;
	Icon: () => JSX.Element;
	element: JSX.Element;
	href: string;
	sub?: { title: string, href: string }[];
}

type IAuthContextData = {
	signOut: () => void;
	signIn: () => void;
	user?: User | null;
	routes: Routes[];
	loading: boolean
}

export const AuthContext = createContext({} as IAuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>();
	const [routes, setRoutes] = useState<Routes[]>([]);
	const [loading, setLoading] = useState(true)

	const navigate = useNavigate()

	function handleRoutes(userData: User) {
		const userRoutes = userData.routes.map((route) => {
			const routeElement = systemRoutes.find((systemRoute) => systemRoute.href === route.href);
			if (routeElement) {
				return routeElement;
			}
			return null;
		}) as Routes[];
		setRoutes(userRoutes);
	}


	async function signOut() {
		setUser(null);
		setRoutes([]);
		localStorage.removeItem('@acme:user');
		localStorage.removeItem('@acme:token');
		console.log('signOut');
	}

	async function signIn() {
		await new Promise((resolve) => setTimeout(resolve, 1000));
		handleRoutes(teste)
		setUser(teste);
		localStorage.setItem('@acme:user', JSON.stringify(teste));
		localStorage.setItem('@acme:token', 'token');
		navigate('/')
		console.log('signIn');
	}

	useEffect(() => {
		const user = localStorage.getItem('@acme:user');
		const token = localStorage.getItem('@acme:token');

		if (user && token) {
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
			<>
				{children}
			</>
		</AuthContext.Provider>
	);

}
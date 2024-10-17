import { AuthContext } from "@/contexts/authContext";
import { useContext } from "react";

export function useAuth() {
    const { ...values } = useContext(AuthContext);

    return { ...values };
}
import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("auth_token");
            if (!token) {
                setUser(null);
                setLoading(false);
                return;
            }

            try {
                const { data } = await api.get("/user"); // ✅ Obtiene usuario con el token
                setUser(data);
            } catch (error) {
                console.error("❌ Error verificando sesión:", error);

                if (error.response?.status === 401) {
                    localStorage.removeItem("auth_token");
                    setUser(null);
                    navigate("/login", { replace: true });
                }
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = async (credentials) => {
        try {
            const { data } = await api.post("/login", credentials);
            console.log("✅ Respuesta del backend:", data);

            localStorage.setItem("auth_token", data.token);
            setUser(data.user);  // ✅ Fuerza la actualización inmediata
            //window.location.href = "/admin";
            //navigate("/admin", { replace: true });
            window.location.href = "/admin";
        } catch (error) {
            console.error("❌ Error al iniciar sesión", error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await api.post("/logout");
        } catch (error) {
            console.error("❌ Error al cerrar sesión", error);
        } finally {
            localStorage.removeItem("auth_token");
            setUser(null);
            navigate("/login", { replace: true });
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

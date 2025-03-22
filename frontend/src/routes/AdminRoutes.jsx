import { Routes, Route, Navigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import PrivateLayout from "../layouts/PrivateLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";

const AdminRoutes = () => {
    const { user, loading } = useContext(AuthContext);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("auth_token");
        setIsAuthenticated(!!token);
    }, [user]); // ✅ Detecta cambios en `user`

    if (loading) {
        return <LoadingSpinner message="Verificando credenciales..." />;
    };

    return isAuthenticated ? (
        <PrivateLayout>
            <Routes>
                <Route path="/" element={<AdminDashboard />} />
                <Route path="/informacion-carrera" element={<h1>Información de Carrera</h1>} />
                <Route path="/eventos" element={<h1>Eventos</h1>} />
            </Routes>
        </PrivateLayout>
    ) : (
        <Navigate to="/login" replace />
    );
};

export default AdminRoutes;

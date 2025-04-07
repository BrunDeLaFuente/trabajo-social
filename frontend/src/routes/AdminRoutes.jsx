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
                <Route path="/usuarios" element={<h1>Usuarios</h1>} />
                <Route path="/cambiar-contrasena" element={<h1>Cambiar Contraseña</h1>} />
                <Route path="/informacion-carrera" element={<h1>Información de Carrera</h1>} />
                <Route path="/malla-curricular" element={<h1>Malla Curricular</h1>} />
                <Route path="/redes-sociales" element={<h1>Redes Sociales</h1>} />
                <Route path="/docentes" element={<h1>Docentes</h1>} />
                <Route path="/administrativos" element={<h1>Administrativos</h1>} />
                <Route path="/autoridades" element={<h1>Autoridades</h1>} />
                <Route path="/publicaciones" element={<h1>Publicaciones</h1>} />
                <Route path="/comunicados" element={<h1>Comunicados</h1>} />
                <Route path="/eventos" element={<h1>Eventos</h1>} />
                <Route path="/eventos-sin-costo" element={<h1>Eventos Sin Costo</h1>} />
                <Route path="/eventos-con-costo" element={<h1>Eventos Con Costo</h1>} />
                <Route path="/eventos-dashboard" element={<h1>Dashboard de Eventos</h1>} />
            </Routes>
        </PrivateLayout>
    ) : (
        <Navigate to="/login" replace />
    );
};

export default AdminRoutes;

import { Routes, Route, Navigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import PrivateLayout from "../layouts/PrivateLayout";

import NoAutorizado from "../pages/admin/NoAutorizado";
import AdminOnlyRoute from "../routes/AdminOnlyRoute";

import AdminDashboard from "../pages/admin/AdminDashboard";
import Informacion from "../pages/admin/Carrera/Informacion";
import RedesSociales from "../pages/admin/Carrera/RedesSociales";
import TramitesAdmin from "../pages/admin/Carrera/TramitesAdmin";
import AutoridadesAdmin from "../pages/admin/Personal/AutoridadesAdmin";
import AdministrativosAdmin from "../pages/admin/Personal/AdministrativosAdmin";
import DocentesAdmin from "../pages/admin/Personal/DocentesAdmin";
import AsignaturasAdmin from "../pages/admin/Personal/AsignaturasAdmin";
import MallaAdmin from "../pages/admin/Carrera/MallaAdmin";
import NoticiasAdmin from "../pages/admin/Noticias/NoticiasAdmin";
import NoticiaCrear from "../pages/admin/Noticias/NoticiaCrear";
import NoticiaEditar from "../pages/admin/Noticias/NoticiaEditar";
import EventosAdmin from "../pages/admin/Eventos/EventosAdmin";

import UsuariosAdmin from "../pages/admin/Usuarios/UsuariosAdmin";
import CambiarPassword from "../pages/admin/Usuarios/CambiarPassword";
import EventoCrear from "../pages/admin/Eventos/EventoCrear";
import EventoEditar from "../pages/admin/Eventos/EventoEditar";
import AsistentesAdmin from "../pages/admin/Eventos/AsistentesAdmin";
import NotificarAdmin from "../pages/admin/Eventos/NotificarAdmin";
import DashboardEstadisticas from "../pages/admin/Eventos/DashboardEstadisticas";

const AdminRoutes = () => {
  const { user, loading } = useContext(AuthContext);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    setIsAuthenticated(!!token);
  }, [user]); // ✅ Detecta cambios en `user`

  if (loading) {
    return <LoadingSpinner message="Verificando credenciales..." />;
  }

  return isAuthenticated ? (
    <PrivateLayout>
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route
          path="/usuarios"
          element={
            <AdminOnlyRoute>
              <UsuariosAdmin />
            </AdminOnlyRoute>
          }
        />
        <Route path="/no-autorizado" element={<NoAutorizado />} />
        <Route path="/cambiar-contrasena" element={<CambiarPassword />} />
        <Route path="/informacion-carrera" element={<Informacion />} />
        <Route path="/malla-curricular" element={<MallaAdmin />} />
        <Route path="/redes-sociales" element={<RedesSociales />} />
        <Route path="/tramites" element={<TramitesAdmin />} />
        <Route path="/docentes" element={<DocentesAdmin />} />
        <Route path="/docentes/asignaturas" element={<AsignaturasAdmin />} />
        <Route path="/administrativos" element={<AdministrativosAdmin />} />
        <Route path="/autoridades" element={<AutoridadesAdmin />} />
        <Route path="/noticias" element={<NoticiasAdmin />} />
        <Route path="/noticias/agregar" element={<NoticiaCrear />} />
        <Route path="/noticias/editar/:id" element={<NoticiaEditar />} />

        <Route path="/eventos" element={<EventosAdmin />} />
        <Route path="/eventos/agregar" element={<EventoCrear />} />
        <Route path="/eventos/editar/:id" element={<EventoEditar />} />
        <Route path="/eventos/inscritos/:id" element={<AsistentesAdmin />} />
        <Route path="eventos/notificar/:id" element={<NotificarAdmin />} />

        <Route path="/eventos-sin-costo" element={<h1>Eventos Sin Costo</h1>} />
        <Route path="/eventos-con-costo" element={<h1>Eventos Con Costo</h1>} />
        <Route path="/eventos-dashboard" element={<DashboardEstadisticas />} />
      </Routes>
    </PrivateLayout>
  ) : (
    <Navigate to="/login" replace />
  );
};

export default AdminRoutes;

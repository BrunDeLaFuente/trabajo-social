import { Routes, Route } from "react-router-dom";
import PublicRoutes from "./routes/PublicRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import Login from "./pages/auth/Login";

function App() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/*" element={<PublicRoutes />} />
      
      {/* Ruta de login */}
      <Route path="/login" element={<Login />} />

      {/* 🔐 Rutas protegidas del administrador */}
      <Route path="/admin/*" element={<AdminRoutes />} />
    </Routes>
  );
}

export default App;

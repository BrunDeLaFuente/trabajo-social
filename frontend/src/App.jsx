import PublicRoutes from "./routes/PublicRoutes";
import { Routes, Route } from "react-router-dom";


function App() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/*" element={<PublicRoutes />} />

    </Routes>
  );
}

export default App;

import { Routes, Route } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import ScrollToTop from "../components/utils/ScrollToTop";
import HomePage from "../pages/public/HomePage";
import NuestraCarrera from "../pages/public/Generalidades/NuestraCarrera";
import Autoridades from "../pages/public/Generalidades/Autoridades";
import PersonalAdministrativo from "../pages/public/Generalidades/PersonalAdministrativo";
import PersonalDocente from "../pages/public/Generalidades/PersonalDocente";
import ModalidadesIngreso from "../pages/public/Pregrado/ModalidadesIngreso";
import MallaCurricular from "../pages/public/Pregrado/MallaCurricular";
import ModalidadesTitulacion from "../pages/public/Pregrado/ModalidadesTitulacion";
import Tramites from "../pages/public/Pregrado/Tramites";
import Noticias from "../pages/public/Noticias/Noticias";
import Talleres from "../pages/public/Noticias/Talleres";
import Contacto from "../pages/public/Contacto";
import NoticiaDetalle from "../components/public/NoticiaDetalle";
import Tesis from "../pages/public/Pregrado/Titulaciones/Tesis";
import Excelencia from "../pages/public/Pregrado/Titulaciones/Excelencia";
import Trabajo from "../pages/public/Pregrado/Titulaciones/Trabajo";
import Adscripcion from "../pages/public/Pregrado/Titulaciones/Adscripcion";
import Examen from "../pages/public/Pregrado/Titulaciones/Examen";
import Proyecto from "../pages/public/Pregrado/Titulaciones/Proyecto";
import FormularioEvento from "../components/public/FormularioEvento";

const PublicRoutes = () => {
  return (
    <PublicLayout>
      <ScrollToTop />
      <Routes>
        {/* Rutas Principales */}
        <Route path="/" element={<HomePage />} />
        <Route path="/nuestra-carrera" element={<NuestraCarrera />} />
        <Route path="/autoridades" element={<Autoridades />} />
        <Route
          path="/personal-administrativo"
          element={<PersonalAdministrativo />}
        />
        <Route path="/personal-docente" element={<PersonalDocente />} />

        {/* Rutas de Pregrado */}
        <Route
          path="/pregrado/modalidades-ingreso"
          element={<ModalidadesIngreso />}
        />
        <Route
          path="/pregrado/malla-curricular"
          element={<MallaCurricular />}
        />
        <Route
          path="/pregrado/modalidades-titulacion"
          element={<ModalidadesTitulacion />}
        />
        <Route path="/pregrado/tramites" element={<Tramites />} />

        {/* Rutas de Modalidades de titulacion */}
        <Route
          path="/pregrado/modalidades-titulacion/tesis"
          element={<Tesis />}
        />
        <Route
          path="/pregrado/modalidades-titulacion/excelencia"
          element={<Excelencia />}
        />
        <Route
          path="/pregrado/modalidades-titulacion/trabajo-dirigido"
          element={<Trabajo />}
        />
        <Route
          path="/pregrado/modalidades-titulacion/adscripcion"
          element={<Adscripcion />}
        />
        <Route
          path="/pregrado/modalidades-titulacion/examen"
          element={<Examen />}
        />
        <Route
          path="/pregrado/modalidades-titulacion/proyecto"
          element={<Proyecto />}
        />

        {/* Rutas de Noticias */}
        <Route path="/noticias/anuncios" element={<Noticias />} />
        <Route path="/noticias/anuncios/:slug" element={<NoticiaDetalle />} />

        {/* Rutas de Eventos */}
        <Route path="/noticias/eventos" element={<Talleres />} />
        <Route path="/noticias/eventos/:slug" element={<FormularioEvento />} />

        {/* Ruta de Contacto */}
        <Route path="/contacto" element={<Contacto />} />
      </Routes>
    </PublicLayout>
  );
};

export default PublicRoutes;

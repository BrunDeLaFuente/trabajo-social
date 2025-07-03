import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { FaChartBar, FaPercentage, FaRegChartBar } from "react-icons/fa";
import api from "../../../utils/api";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";

const DashboardEstadisticas = () => {
  const [datosEvento, setDatosEvento] = useState([]);
  const [datosModalidad, setDatosModalidad] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await api.get("/estadisticas/dashboard");
        setDatosEvento(res.data.eventos);
        setDatosModalidad(res.data.modalidad);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Cargando dashboard..." />;
  }

  return (
    <Container>
      <Titulo>📊 Dashboard de Eventos</Titulo>

      <GridGraficos>
        <Seccion>
          <TituloSeccion>
            <FaChartBar /> Inscripciones por Evento
          </TituloSeccion>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={datosEvento}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="titulo_evento" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="total_inscripciones"
                fill="#4c51bf"
                name="Inscripciones"
              />
            </BarChart>
          </ResponsiveContainer>
        </Seccion>

        <Seccion>
          <TituloSeccion>
            <FaPercentage /> % Participación por Evento
          </TituloSeccion>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={datosEvento}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="titulo_evento" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="porcentaje_certificados"
                fill="#38a169"
                name="% Participantes"
              />
            </BarChart>
          </ResponsiveContainer>
        </Seccion>

        <Seccion>
          <TituloSeccion>
            <FaChartBar /> Inscripciones por Modalidad
          </TituloSeccion>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={datosModalidad}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="modalidad" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="total_inscripciones"
                fill="#3182ce"
                name="Inscripciones"
              />
            </BarChart>
          </ResponsiveContainer>
        </Seccion>

        <Seccion>
          <TituloSeccion>
            <FaRegChartBar /> % Participación por Modalidad
          </TituloSeccion>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={datosModalidad}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="modalidad" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="porcentaje_participacion"
                fill="#d69e2e"
                name="% Participantes"
              />
            </BarChart>
          </ResponsiveContainer>
        </Seccion>
      </GridGraficos>
    </Container>
  );
};

export default DashboardEstadisticas;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  min-height: 100vh;
  padding: 2rem 1rem;
  animation: ${fadeIn} 0.6s ease-out;

  @media (max-width: 768px) {
    padding: 1rem 0.5rem;
  }
`;

const Titulo = styled.h2`
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const Seccion = styled.div`
  margin-bottom: 3rem;
`;

const TituloSeccion = styled.h3`
  display: flex;
  align-items: center;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;

  svg {
    margin-right: 0.5rem;
    color: #4a5568;
  }
`;

const GridGraficos = styled.div`
  display: grid;
  gap: 2rem;
  grid-template-columns: 1fr;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

import { useState, useEffect } from "react";
import styled, { keyframes, createGlobalStyle } from "styled-components";
import {
  Calendar,
  FileText,
  Users,
  UserCheck,
  Briefcase,
  BookOpen,
  Share2,
  Download,
  Eye,
  GraduationCap,
} from "lucide-react";
import api from "../../utils/api";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import manualUsuario from "../../assets/doc/manual-usuario.pdf";
import manualTecnico from "../../assets/doc/manual-tecnico.pdf";

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get("/inicio");
        setData(response.data);
      } catch (err) {
        setError("Error al cargar los datos del dashboard");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDownloadPDF = (pdfUrl, filename) => {
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleViewPDF = (pdfUrl) => {
    window.open(pdfUrl, "_blank");
  };

  if (loading) {
    return (
      <Container>
        <LoadingContainer>
          <LoadingSpinner />
        </LoadingContainer>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Content>
          <ErrorMessage>{error}</ErrorMessage>
        </Content>
      </Container>
    );
  }

  return (
    <>
      <GlobalStyle />
      <Container>
        <Content>
          <Header>
            <Title>Bienvenido a la Página Administrativa</Title>
            <Subtitle>Carrera de Trabajo Social</Subtitle>
          </Header>

          <StatsSection>
            {/* Eventos */}
            <StatsCard delay="0s">
              <CardHeader>
                <IconWrapper color="#4299e1">
                  <Calendar size={24} />
                </IconWrapper>
                <CardTitle>Eventos</CardTitle>
              </CardHeader>
              <StatItem>
                <StatLabel>Total de Eventos</StatLabel>
                <StatValue>{data?.eventos?.total || 0}</StatValue>
              </StatItem>
              <StatItem>
                <StatLabel>Eventos de Pago</StatLabel>
                <StatValue>{data?.eventos?.pago || 0}</StatValue>
              </StatItem>
              <StatItem>
                <StatLabel>Eventos Gratuitos</StatLabel>
                <StatValue>{data?.eventos?.gratis || 0}</StatValue>
              </StatItem>
            </StatsCard>

            {/* Noticias */}
            <StatsCard delay="0.1s">
              <CardHeader>
                <IconWrapper color="#48bb78">
                  <FileText size={24} />
                </IconWrapper>
                <CardTitle>Noticias</CardTitle>
              </CardHeader>
              <StatItem>
                <StatLabel>Total de Noticias</StatLabel>
                <StatValue>{data?.noticias?.total || 0}</StatValue>
              </StatItem>
              <StatItem>
                <StatLabel>Artículos</StatLabel>
                <StatValue>
                  {data?.noticias?.por_categoria?.Articulo || 0}
                </StatValue>
              </StatItem>
              <StatItem>
                <StatLabel>Comunicados</StatLabel>
                <StatValue>
                  {data?.noticias?.por_categoria?.Comunicado || 0}
                </StatValue>
              </StatItem>
            </StatsCard>

            {/* Usuarios */}
            <StatsCard delay="0.2s">
              <CardHeader>
                <IconWrapper color="#ed8936">
                  <Users size={24} />
                </IconWrapper>
                <CardTitle>Usuarios del Sistema</CardTitle>
              </CardHeader>
              <StatItem>
                <StatLabel>Usuarios No Admin</StatLabel>
                <StatValue>{data?.usuarios_no_admin || 0}</StatValue>
              </StatItem>
            </StatsCard>

            {/* Personas */}
            <StatsCard delay="0.3s">
              <CardHeader>
                <IconWrapper color="#9f7aea">
                  <UserCheck size={24} />
                </IconWrapper>
                <CardTitle>Personal</CardTitle>
              </CardHeader>
              <StatItem>
                <StatLabel>Autoridades</StatLabel>
                <StatValue>{data?.personas?.Autoridad || 0}</StatValue>
              </StatItem>
              <StatItem>
                <StatLabel>Administrativos</StatLabel>
                <StatValue>{data?.personas?.Administrativo || 0}</StatValue>
              </StatItem>
              <StatItem>
                <StatLabel>Docentes</StatLabel>
                <StatValue>{data?.personas?.Docente || 0}</StatValue>
              </StatItem>
            </StatsCard>

            {/* Trámites */}
            <StatsCard delay="0.4s">
              <CardHeader>
                <IconWrapper color="#38b2ac">
                  <Briefcase size={24} />
                </IconWrapper>
                <CardTitle>Trámites</CardTitle>
              </CardHeader>
              <StatItem>
                <StatLabel>Total de Trámites</StatLabel>
                <StatValue>{data?.tramites || 0}</StatValue>
              </StatItem>
            </StatsCard>

            {/* Malla Curricular */}
            <StatsCard delay="0.5s">
              <CardHeader>
                <IconWrapper color="#f56565">
                  <BookOpen size={24} />
                </IconWrapper>
                <CardTitle>Malla Curricular</CardTitle>
              </CardHeader>
              <StatItem>
                <StatLabel>Total Semestres</StatLabel>
                <StatValue>{data?.malla?.total_semestres || 0}</StatValue>
              </StatItem>
              <StatItem>
                <StatLabel>Total Materias</StatLabel>
                <StatValue>{data?.malla?.total_materias || 0}</StatValue>
              </StatItem>
            </StatsCard>

            {/* Redes Sociales */}
            <StatsCard delay="0.6s">
              <CardHeader>
                <IconWrapper color="#667eea">
                  <Share2 size={24} />
                </IconWrapper>
                <CardTitle>Redes Sociales</CardTitle>
              </CardHeader>
              <StatItem>
                <StatLabel>Total de Redes</StatLabel>
                <StatValue>{data?.redes_publicas?.total || 0}</StatValue>
              </StatItem>
              <div style={{ marginTop: "1rem" }}>
                <StatLabel style={{ marginBottom: "0.5rem", display: "block" }}>
                  Plataformas:
                </StatLabel>
                <NetworkList>
                  {data?.redes_publicas?.nombres?.map((red, index) => (
                    <NetworkTag key={index}>{red}</NetworkTag>
                  ))}
                </NetworkList>
              </div>
            </StatsCard>
          </StatsSection>

          <ManualsSection>
            <SectionTitle>Documentación del Sistema</SectionTitle>
            <ManualsGrid>
              <ManualCard>
                <ManualIcon>
                  <Users size={30} />
                </ManualIcon>
                <ManualTitle>Manual de Usuario</ManualTitle>
                <ManualDescription>
                  Guía completa para el uso del sistema administrativo
                </ManualDescription>
                <ManualActions>
                  <ActionButton
                    primary
                    onClick={() => handleViewPDF(manualUsuario)}
                  >
                    <Eye size={16} />
                    Ver
                  </ActionButton>
                  <ActionButton
                    onClick={() =>
                      handleDownloadPDF(manualUsuario, "manual-usuario.pdf")
                    }
                  >
                    <Download size={16} />
                    Descargar
                  </ActionButton>
                </ManualActions>
              </ManualCard>

              <ManualCard>
                <ManualIcon>
                  <GraduationCap size={30} />
                </ManualIcon>
                <ManualTitle>Manual Técnico</ManualTitle>
                <ManualDescription>
                  Documentación técnica del sistema y arquitectura
                </ManualDescription>
                <ManualActions>
                  <ActionButton
                    primary
                    onClick={() => handleViewPDF(manualTecnico)}
                  >
                    <Eye size={16} />
                    Ver
                  </ActionButton>
                  <ActionButton
                    onClick={() =>
                      handleDownloadPDF(manualTecnico, "manual-tecnico.pdf")
                    }
                  >
                    <Download size={16} />
                    Descargar
                  </ActionButton>
                </ManualActions>
              </ManualCard>
            </ManualsGrid>
          </ManualsSection>
        </Content>
      </Container>
    </>
  );
};

export default AdminDashboard;

// Agregar después de los imports y antes de las animaciones
const GlobalStyle = createGlobalStyle`
  html, body {
    overflow-x: hidden !important;
    max-width: 100vw !important;
  }
  
  * {
    box-sizing: border-box !important;
  }
`;

// Animaciones
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
`;

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  padding: 1.5rem;
  box-sizing: border-box;
  position: relative;
  max-width: 100vw;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 1rem;
  }

  @media (max-width: 480px) {
    padding: 0.5rem;
  }
`;

const Content = styled.div`
  max-width: min(1400px, calc(100vw - 3rem));
  margin: 0 auto;
  animation: ${fadeInUp} 0.8s ease-out;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    max-width: calc(100vw - 2rem);
  }

  @media (max-width: 480px) {
    max-width: calc(100vw - 1rem);
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  color: #2d3748;

  @media (max-width: 768px) {
    margin-bottom: 2rem;
  }
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #2d3748;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }

  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 400;
  color: #4a5568;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    font-size: 1.3rem;
  }

  @media (max-width: 480px) {
    font-size: 1.1rem;
  }
`;

const StatsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(300px, 100%), 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(min(280px, 100%), 1fr));
    gap: 1.5rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const StatsCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  width: 100%;
  box-sizing: border-box;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 480px) {
    padding: 1.5rem;
    border-radius: 15px;
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const IconWrapper = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  background: ${(props) => props.color || "#667eea"};
  color: white;
  transition: all 0.3s ease;
  flex-shrink: 0;

  &:hover {
    transform: scale(1.1);
  }
`;

const CardTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
  word-wrap: break-word;
`;

const StatItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e2e8f0;

  &:last-child {
    border-bottom: none;
  }
`;

const StatLabel = styled.span`
  color: #4a5568;
  font-weight: 500;
  word-wrap: break-word;
  flex: 1;
`;

const StatValue = styled.span`
  color: #2d3748;
  font-weight: 700;
  font-size: 1.1rem;
  flex-shrink: 0;
  margin-left: 1rem;
`;

const NetworkList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  width: 100%;
`;

const NetworkTag = styled.span`
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  white-space: nowrap;
`;

const ManualsSection = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  animation: ${fadeInUp} 0.8s ease-out 0.4s both;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 480px) {
    padding: 1.5rem;
    border-radius: 15px;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.8rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1.5rem;
  text-align: center;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    bottom: -0.5rem;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    border-radius: 2px;
  }
`;

const ManualsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const ManualCard = styled.div`
  border: 2px solid #e2e8f0;
  border-radius: 15px;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
  width: 100%;
  box-sizing: border-box;

  &:hover {
    border-color: #667eea;
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(102, 126, 234, 0.15);
  }
`;

const ManualIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  color: white;
  animation: ${pulse} 2s ease-in-out infinite;
`;

const ManualTitle = styled.h4`
  font-size: 1.2rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.5rem;
`;

const ManualDescription = styled.p`
  color: #4a5568;
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const ManualActions = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${(props) =>
    props.primary ? "linear-gradient(135deg, #667eea, #764ba2)" : "#f7fafc"};
  color: ${(props) => (props.primary ? "white" : "#4a5568")};
  white-space: nowrap;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
  width: 100%;
`;

const ErrorMessage = styled.div`
  background: #fed7d7;
  color: #c53030;
  padding: 1rem;
  border-radius: 10px;
  text-align: center;
  margin: 2rem 0;
  width: 100%;
  box-sizing: border-box;
`;

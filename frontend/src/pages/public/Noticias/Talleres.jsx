import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import {
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Star,
  ArrowRight,
  Wifi,
} from "lucide-react";
import api from "../../../utils/api";
import HeroSection from "../../../components/public/HeroSection";

const Eventos = () => {
  const [eventos, setEventos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEventos();
  }, []);

  const fetchEventos = async () => {
    try {
      const response = await api.get("/eventos/publicos");
      setEventos(response.data);
    } catch (error) {
      console.error("Error al cargar eventos:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleRegister = (slug) => {
    navigate(`/noticias/eventos/${slug}`);
  };

  const eventosGratuitos = eventos.filter((evento) => evento.es_pago === 0);
  const eventosPagados = eventos.filter((evento) => evento.es_pago === 1);

  const renderEventCard = (evento, index, isPaid = false) => (
    <EventCard
      key={evento.id_evento}
      delay={index * 0.1}
      className={isPaid ? "paid" : ""}
    >
      <ImageContainer>
        {evento.imagen_evento_url ? (
          <EventImage
            src={evento.imagen_evento_url || "/placeholder.svg"}
            alt={evento.titulo_evento}
          />
        ) : (
          <PlaceholderImage>
            <Calendar />
          </PlaceholderImage>
        )}
        <PriceTag free={!isPaid}>
          {isPaid ? `$${evento.costo}` : "GRATIS"}
        </PriceTag>
      </ImageContainer>

      <CardContent>
        <EventTitle>{evento.titulo_evento}</EventTitle>

        <EventInfo>
          <InfoItem>
            <Calendar />
            <span>{formatDate(evento.fecha_evento)}</span>
          </InfoItem>

          {evento.modalidad === "Presencial" ? (
            <InfoItem>
              <MapPin />
              <span>{evento.ubicacion}</span>
            </InfoItem>
          ) : (
            <>
              {evento.enlaces && evento.enlaces.length > 0 && (
                <>
                  {evento.enlaces.map((enlace, index) => (
                    <InfoItem key={enlace.id_enlace}>
                      <Wifi />
                      <div>
                        <div style={{ fontWeight: "600", color: "#374151" }}>
                          {enlace.plataforma}:
                          <a
                            href={enlace.url_enlace}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              color: "#f97316",
                              textDecoration: "none",
                              marginLeft: "0.25rem",
                              fontWeight: "500",
                            }}
                            onMouseOver={(e) =>
                              (e.target.style.textDecoration = "underline")
                            }
                            onMouseOut={(e) =>
                              (e.target.style.textDecoration = "none")
                            }
                          >
                            Unirse
                          </a>
                        </div>
                        {enlace.password_enlace && (
                          <div
                            style={{
                              fontSize: "0.75rem",
                              color: "#6b7280",
                              marginTop: "0.25rem",
                            }}
                          >
                            Contraseña:{" "}
                            <span style={{ fontWeight: "600" }}>
                              {enlace.password_enlace}
                            </span>
                          </div>
                        )}
                      </div>
                    </InfoItem>
                  ))}
                </>
              )}
            </>
          )}

          {isPaid && (
            <InfoItem>
              <DollarSign />
              <span>Costo: Bs.{evento.costo}</span>
            </InfoItem>
          )}
        </EventInfo>

        {evento.expositores && evento.expositores.length > 0 && (
          <ExpositorsContainer>
            <ExpositorsTitle>
              <Users />
              Expositores:
            </ExpositorsTitle>
            <ExpositorsList>
              {evento.expositores.map((expositor) => (
                <ExpositorTag key={expositor.id_expositor}>
                  {expositor.nombre_expositor}
                </ExpositorTag>
              ))}
            </ExpositorsList>
          </ExpositorsContainer>
        )}

        {evento.formulario === 1 && (
          <RegisterButton
            className={isPaid ? "paid" : "free"}
            onClick={() => handleRegister(evento.slug)}
          >
            INSCRIBIRSE
            <ArrowRight />
          </RegisterButton>
        )}
      </CardContent>
    </EventCard>
  );

  return (
    <Container>
      {/* Eventos Gratuitos */}
      <HeroSection title="Eventos" />
      <Section className="free-events">
        <SectionTitle>
          <Title>EVENTOS GRATUITOS</Title>
          <TitleLine />
        </SectionTitle>
        <SectionContainer>
          {eventosGratuitos.length > 0 ? (
            <EventsGrid>
              {eventosGratuitos.map((evento, index) =>
                renderEventCard(evento, index, false)
              )}
            </EventsGrid>
          ) : (
            <EmptyState>
              <Star />
              <h3>No hay eventos gratuitos disponibles</h3>
              <p>Mantente atento a nuestras próximas actividades</p>
            </EmptyState>
          )}
        </SectionContainer>
      </Section>

      {/* Eventos con Costo */}
      <Section className="paid-events">
        <SectionTitle>
          <Title>EVENTOS CON COSTO</Title>
          <TitleLine />
        </SectionTitle>
        <SectionContainer>
          {eventosPagados.length > 0 ? (
            <EventsGrid>
              {eventosPagados.map((evento, index) =>
                renderEventCard(evento, index, true)
              )}
            </EventsGrid>
          ) : (
            <EmptyState>
              <DollarSign />
              <h3>No hay eventos con costo disponibles</h3>
              <p>Revisa nuestros eventos gratuitos mientras tanto</p>
            </EmptyState>
          )}
        </SectionContainer>
      </Section>
    </Container>
  );
};

export default Eventos;

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
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
`;

const Section = styled.section`
  padding: 4rem 0;

  &.free-events {
    background: #ffffff;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }

  &.paid-events {
    background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  }

  @media (max-width: 768px) {
    padding: 2rem 0;
  }
`;

const SectionContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;

  @media (max-width: 640px) {
    padding: 0.5rem;
  }
`;

const SectionTitle = styled.div`
  text-align: left;
  padding-left: 5%;
  margin-bottom: 40px;
`;

const Title = styled.h2`
  font-size: 1.8rem;
  color: #003366;
  font-weight: bold;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const TitleLine = styled.div`
  width: 130px;
  height: 3px;
  background-color: #ff6600;
  margin-top: 5px;

  @media (max-width: 768px) {
    width: 80px;
  }
`;

const EventsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(350px, 400px));
  gap: 2rem;
  justify-content: start;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, minmax(350px, 400px));
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(300px, 350px));
    gap: 1.5rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const EventCard = styled.div`
  background: #ffffff;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
  animation: ${fadeInUp} 0.6s ease-out;
  animation-delay: ${(props) => props.delay || 0}s;
  position: relative;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  }

  &.paid {
    border: 2px solid #f59e0b;

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #f59e0b, #d97706);
    }
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: linear-gradient(135deg, #e2e8f0, #cbd5e1);

  @media (max-width: 480px) {
    height: 180px;
  }
`;

const EventImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;

  ${EventCard}:hover & {
    transform: scale(1.1);
  }
`;

const PlaceholderImage = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #e2e8f0, #cbd5e1);
  color: #64748b;
  font-size: 1.5rem;
  animation: ${pulse} 2s infinite;
`;

const PriceTag = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: ${(props) =>
    props.free
      ? "linear-gradient(135deg, #10b981, #059669)"
      : "linear-gradient(135deg, #f59e0b, #d97706)"};
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 700;
  font-size: 0.875rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  animation: ${float} 3s ease-in-out infinite;
`;

const CardContent = styled.div`
  padding: 1.5rem;

  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

const EventTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1rem;
  line-height: 1.3;

  @media (max-width: 480px) {
    font-size: 1.25rem;
  }
`;

const EventInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #64748b;
  font-size: 0.875rem;

  svg {
    width: 16px;
    height: 16px;
    color: #f97316;
    transition: transform 0.2s ease;
  }

  &:hover svg {
    transform: scale(1.2);
  }
`;

const ExpositorsContainer = styled.div`
  margin-bottom: 1.5rem;
`;

const ExpositorsTitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ExpositorsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const ExpositorTag = styled.span`
  background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
  color: #475569;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;

  &:hover {
    background: linear-gradient(135deg, #e2e8f0, #cbd5e1);
    transform: translateY(-1px);
  }
`;

const RegisterButton = styled.button`
  width: 100%;
  padding: 1rem 1.5rem;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  position: relative;
  overflow: hidden;

  &.free {
    background: linear-gradient(135deg, #10b981, #059669);
    color: white;

    &:hover {
      background: linear-gradient(135deg, #059669, #047857);
      transform: translateY(-2px);
      box-shadow: 0 10px 25px -5px rgba(16, 185, 129, 0.4);
    }
  }

  &.paid {
    background: linear-gradient(135deg, #f59e0b, #d97706);
    color: white;

    &:hover {
      background: linear-gradient(135deg, #d97706, #b45309);
      transform: translateY(-2px);
      box-shadow: 0 10px 25px -5px rgba(245, 158, 11, 0.4);
    }
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: left 0.5s ease;
  }

  &:hover::before {
    left: 100%;
  }

  svg {
    transition: transform 0.2s ease;
  }

  &:hover svg {
    transform: translateX(4px);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #64748b;

  svg {
    width: 64px;
    height: 64px;
    margin-bottom: 1rem;
    color: #cbd5e1;
  }

  h3 {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #374151;
  }

  p {
    font-size: 1rem;
  }
`;

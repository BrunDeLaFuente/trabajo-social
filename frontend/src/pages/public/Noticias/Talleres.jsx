import styled from "styled-components"
import { Card, CardContent, CardMedia, Typography, Button, Chip, Box, Link } from "@mui/material"
import {
  LocationOn,
  CalendarToday,
  Person,
  MonetizationOn,
  MoneyOff,
  Videocam,
  MeetingRoom,
  Link as LinkIcon,
} from "@mui/icons-material"
import HeroSection from "../../../components/public/HeroSection";
import tallerGratisImg from "../../../assets/img/taller-gratis.png";
import tallerVirtualImg from "../../../assets/img/taller-virtual.webp";
import tallerPagoImg from "../../../assets/img/taller-pago.png";

const talleresData = [
  {
    id: 1,
    titulo: "Taller de FODA para plan de mejoras",
    fecha: "15/01/2025",
    ubicacion: "Auditorio Principal",
    modalidad: "presencial",
    es_pago: false,
    costo: null,
    imagen: tallerGratisImg,
    expositores: ["Juan Pérez", "Maria Ritaz"],
  },
  {
    id: 2,
    titulo: "Taller de estrategias de implementación de mejora",
    fecha: "20/01/2025",
    ubicacion: "Sala de Capacitación",
    modalidad: "virtual",
    es_pago: false,
    costo: null,
    imagen: tallerVirtualImg,
    expositores: ["Marcelo"],
    enlaces: [
      { plataforma: "Google Meet", url: "https://meet.google.com/example", password: "" },
      { plataforma: "Zoom", url: "https://zoom.us/example", password: "123f" },
    ],
  },
  {
    id: 3,
    titulo: "Taller básico de análisis de datos cualitativos",
    fecha: "25/01/2025",
    ubicacion: "Aula 3, Edificio B",
    modalidad: "presencial",
    es_pago: true,
    costo: "50 Bs.",
    imagen: tallerPagoImg,
    expositores: ["Luis Fernández"],
  },
]

const talleresGratis = talleresData.filter((taller) => !taller.es_pago)
const talleresPago = talleresData.filter((taller) => taller.es_pago)

const Talleres = () => {

  const renderTallerCard = (taller) => (
    <StyledCard key={taller.id}>
      <CardMedia component="img" height="300" image={taller.imagen} alt={taller.titulo} />
      <CardContentStyled>
        <Typography gutterBottom variant="h5" component="div" fontWeight="bold">
          {taller.titulo}
        </Typography>

        <InfoContainer>
          <CalendarToday fontSize="small" color="primary" />
          <Typography variant="body2" color="text.secondary">
            {taller.fecha}
          </Typography>
        </InfoContainer>

        <InfoContainer>
          <LocationOn fontSize="small" color="primary" />
          <Typography variant="body2" color="text.secondary">
            {taller.ubicacion}
          </Typography>
        </InfoContainer>

        <InfoContainer>
          {taller.modalidad === "virtual" ? (
            <Videocam fontSize="small" color="primary" />
          ) : (
            <MeetingRoom fontSize="small" color="primary" />
          )}
          <Chip
            label={taller.modalidad === "virtual" ? "Virtual" : "Presencial"}
            size="small"
            color={taller.modalidad === "virtual" ? "info" : "success"}
          />
        </InfoContainer>

        <InfoContainer>
          {taller.es_pago ? (
            <MonetizationOn fontSize="small" color="primary" />
          ) : (
            <MoneyOff fontSize="small" color="primary" />
          )}
          <Chip
            label={taller.es_pago ? `Costo: ${taller.costo}` : "Gratuito"}
            size="small"
            color={taller.es_pago ? "warning" : "success"}
          />
        </InfoContainer>

        <ExpositorContainer>
          <Person fontSize="small" color="primary" style={{ marginRight: "8px" }} />
          <Typography variant="body2" color="text.secondary">
            Expositores: {taller.expositores.join(", ")}
          </Typography>
        </ExpositorContainer>

        {taller.modalidad === "virtual" && taller.enlaces && (
          <VirtualLinksContainer>
            <Typography variant="body2" fontWeight="bold">
              Enlaces:
            </Typography>
            {taller.enlaces.map((enlace, index) => (
              <InfoContainer key={index}>
                <LinkIcon fontSize="small" color="primary" />
                <Link href={enlace.url} target="_blank" rel="noopener">
                  {enlace.plataforma}
                </Link>
                {enlace.password && (
                  <Typography variant="caption" color="text.secondary">
                    (Contraseña: {enlace.password})
                  </Typography>
                )}
              </InfoContainer>
            ))}
          </VirtualLinksContainer>
        )}

        {taller.es_pago && (
          <ButtonContainer>
            <Button variant="contained" color="primary" fullWidth startIcon={<MonetizationOn />}>
              Inscribirse
            </Button>
          </ButtonContainer>
        )}
      </CardContentStyled>
    </StyledCard>
  )

  return (
    <Box sx={{
      minHeight: "100vh",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      padding: 0,
      margin: 0,
      overflow: "auto",
    }}>
      <HeroSection title="Eventos" />

      <FreeWorkshopsSection>
        <TitleContainer>
          <SectionTitle>EVENTOS GRATUITOS</SectionTitle>
          <Underline />
        </TitleContainer>
        <Box sx={{ padding: "0 16px", width: "100%", maxWidth: "1400px", margin: "0 auto" }}>
          <GridContainer>{talleresGratis.map(renderTallerCard)}</GridContainer>
        </Box>
      </FreeWorkshopsSection>

      <PaidWorkshopsSection>
        <TitleContainer>
          <SectionTitle>EVENTOS CON COSTO</SectionTitle>
          <Underline />
        </TitleContainer>
        <Box sx={{ padding: "0 16px", width: "100%", maxWidth: "1400px", margin: "0 auto" }}>
          <GridContainer>{talleresPago.map(renderTallerCard)}</GridContainer>
        </Box>
      </PaidWorkshopsSection>
    </Box>
  )
};

export default Talleres;

const TitleContainer = styled.div`
  text-align: left;
  padding-left: 5%;
  margin-bottom: 40px;
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  color: #003366;
  font-weight: bold;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const Underline = styled.div`
  width: 130px;
  height: 3px;
  background-color: #ff6600;
  margin-top: 5px;

  @media (max-width: 768px) {
    width: 80px;
  }
`;

const SectionContainer = styled.div`
  padding: 2rem 0;
  width: 100%;
  flex: 1;
`

const FreeWorkshopsSection = styled(SectionContainer)`
  background-color:rgb(255, 255, 255);
`

const PaidWorkshopsSection = styled(SectionContainer)`
  background-color: #f5f7fa;
`

const StyledCard = styled(Card)`
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
`

const CardContentStyled = styled(CardContent)`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`

const ExpositorContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 0.5rem;
  flex-wrap: wrap;
`

const InfoContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 0.5rem 0;
  gap: 0.5rem;
`

const ButtonContainer = styled.div`
  margin-top: auto;
  padding-top: 1rem;
`

const VirtualLinksContainer = styled.div`
  margin-top: 1rem;
`

const GridContainer = styled(Box)`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 24px;
  
  @media (min-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 900px) {
    grid-template-columns: repeat(3, 1fr);
  }
`
import { useState } from "react";
import styled, { keyframes } from "styled-components";
import HeroSection from "../../../components/public/HeroSection";
import { FaFileAlt, FaChevronDown, FaUniversity } from "react-icons/fa";
import tramiteImg from "../../../assets/img/tramite-universitario.jpg";

const tramitesData = [
  {
    titulo: "Requisitos para Aprobación del Perfil",
    descripcion:
      "Carta de solicitud dirigida al director de Carrera, aprobación de perfil con mención, modalidad de titulación y título del trabajo.",
    planilla_url: tramiteImg,
  },
  {
    titulo: "Requisitos para solicitud de Designación de Tribunales",
    descripcion:
      "Carta de solicitud dirigida al director de Carrera, indicando disponibilidad de tribunales y tutores.",
    planilla: null,
  },
  {
    titulo: "Requisitos para solicitud de Pre Defensa",
    descripcion:
      "Carta de solicitud de pre defensa con aprobación de borradores, tabla de disponibilidad de tribunales, carátula y kardex actualizado.",
    planilla: null,
  },
  {
    titulo: "Requisitos para solicitud de Defensa Pública",
    descripcion:
      "Carta de solicitud de defensa pública con fotocopia de carnet, formulario de solvencia y acta de pre defensa.",
    planilla_url: tramiteImg,
  },
];

const Tramites = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <PageContainer>
      <HeroSection title="Trámites" />
      <SectionTitle>TRÁMITES DE LA CARRERA</SectionTitle>
      <CardsContainer>
        {tramitesData.map((tramite, index) => (
          <Card key={index}>
            <IconContainer>
              <FaFileAlt />
            </IconContainer>
            <Title>{tramite.titulo}</Title>
            <Divider />
            <MoreInfo onClick={() => toggleExpand(index)}>
              Ver trámite{" "}
              <FaChevronDown
                className={expandedIndex === index ? "rotated" : ""}
              />
            </MoreInfo>
            {expandedIndex === index && (
              <Description>
                <p>{tramite.descripcion}</p>
                {tramite.planilla_url && (
                  <PlanillaButton href={tramite.planilla_url} download>
                    Descargar Planilla
                  </PlanillaButton>
                )}
              </Description>
            )}
          </Card>
        ))}
      </CardsContainer>

      <UniversitySection>
        <UniversityTitle>TRÁMITES UNIVERSITARIOS</UniversityTitle>
        <UniversityContentWrapper>
          <UniversityImage src={tramiteImg} alt="Trámites Universitarios" />
          <UniversityContent>
            <FaUniversity size={40} color="#002f6c" />
            <p>
              En este apartado encontrará un resumen y acceso a las páginas
              oficiales de las unidades en las que se realizan los diversos
              tipos de trámites que contribuyen al buen funcionamiento de la
              Universidad Mayor de San Simón.
            </p>
            <UniversityButton href="https://www.umss.edu.bo/tramites/">
              Ver más trámites
            </UniversityButton>
          </UniversityContent>
        </UniversityContentWrapper>
      </UniversitySection>
    </PageContainer>
  );
};

export default Tramites;

// Animaciones
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const PageContainer = styled.div`
  width: 100%;
  background-color: #ffffff;
  overflow-x: hidden;
`;

const SectionTitle = styled.h2`
  text-align: left;
  font-size: 1.8rem;
  font-weight: bold;
  margin: 30px 5px 80px 5%;
  position: relative;
  color: #003366;
  &:after {
    content: "";
    display: block;
    width: 130px;
    height: 3px;
    background: #ff6600;
    margin-top: 5px;
  }

  @media (max-width: 768px) {
    font-size: 1.5rem;
    &:after {
      width: 80px;
    }
  }
`;

const CardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px 5%;
  justify-items: center;

  @media (min-width: 1024px) {
    grid-template-columns: repeat(auto-fit, minmax(550px, 1fr));
  }
`;

const Card = styled.div`
  background: white;
  padding: 20px;
  width: 100%;
  max-width: 550px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: all 0.3s ease;
  animation: ${fadeIn} 0.6s ease-out;
  cursor: pointer;

  &:hover {
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
  }
`;

const IconContainer = styled.div`
  font-size: 2rem;
  color: #002f6c;
  margin-bottom: 10px;
`;

const Title = styled.h3`
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
`;

const Divider = styled.div`
  height: 2px;
  background-color: #002f6c;
  margin: 10px 0;
`;

const MoreInfo = styled.div`
  font-size: 1rem;
  color: #002f6c;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  transition: color 0.3s ease;

  &:hover {
    color: #0047a3;
  }

  .rotated {
    transform: rotate(180deg);
    transition: transform 0.3s ease;
  }
`;

const Description = styled.div`
  font-size: 0.95rem;
  color: #444;
  margin-top: 10px;
  text-align: left;
  padding: 0 15px;
`;

const PlanillaButton = styled.a`
  display: inline-block;
  background: #ffcc00;
  color: black;
  font-weight: bold;
  padding: 8px 12px;
  margin-top: 10px;
  border-radius: 4px;
  text-decoration: none;
  &:hover {
    background: #e6b800;
  }
`;

const UniversitySection = styled.div`
  padding: 50px 5%;
  background: #f5f7fa;
  text-align: center;
`;

const UniversityTitle = styled(SectionTitle)`
  color: #003366;
  text-align: left;
`;

const UniversityContentWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;
  max-width: 1100px;
  margin: auto;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const UniversityImage = styled.img`
  max-width: 400px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const UniversityContent = styled.div`
  max-width: 500px;
  text-align: left;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px; /* Agregamos separación entre los elementos */
  background: rgb(255, 253, 246);

  p {
    text-align: center;
    line-height: 1.6; /* Mejora la legibilidad del texto */
  }

  svg {
    margin-bottom: 10px; /* Separa el icono del texto */
  }

  @media (max-width: 768px) {
    text-align: center;
  }
`;

const UniversityButton = styled.a`
  display: inline-block;
  background: #002f6c;
  color: white;
  padding: 10px 15px;
  font-weight: bold;
  border-radius: 5px;
  text-decoration: none;
  margin-top: 10px;
  &:hover {
    background: #0047a3;
  }
`;

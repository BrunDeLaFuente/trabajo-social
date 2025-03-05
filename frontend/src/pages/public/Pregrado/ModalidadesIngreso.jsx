import { useState } from "react";
import styled, { keyframes } from "styled-components";
import HeroSection from "../../../components/public/HeroSection";
import { FaFileAlt, FaGraduationCap, FaGlobe, FaUserGraduate, FaChevronDown } from "react-icons/fa";

const modalidadesData = [
  {
    titulo: "Exámen de Ingreso",
    icono: <FaFileAlt />,
    descripcion: "Se realiza una Prueba de Suficiencia Académica (PSA) donde se evalúa los conocimientos de Álgebra, Trigonometría, Física, Química y Biología.",
  },
  {
    titulo: "Admisión Especial",
    icono: <FaGraduationCap />,
    descripcion: "Dirigido a Profesionales titulados del Sistema Universitario, maestros normalistas con título en provisión nacional a nivel licenciatura...",
  },
  {
    titulo: "Admisión Directa",
    icono: <FaGlobe />,
    descripcion: "Dirigida a los dos bachilleres graduados con el mayor promedio académico de su Unidad Educativa...",
  },
  {
    titulo: "Programas de Becas Individuales (PBI)",
    icono: <FaUserGraduate />,
    descripcion: "En cumplimiento de la Ley No. 2563, se contribuye a la profesionalización académica de bachilleres de bajos ingresos económicos...",
  },
];

const ModalidadesIngreso = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <PageContainer>
      <HeroSection title="Modalidades de ingreso" />

      <CardsContainer>
        {modalidadesData.map((modalidad, index) => (
          <Card key={index}>
            <IconContainer>{modalidad.icono}</IconContainer>
            <Title>{modalidad.titulo}</Title>
            <Divider />
            <MoreInfo onClick={() => toggleExpand(index)}>
              Más Información <FaChevronDown className={expandedIndex === index ? "rotated" : ""} />
            </MoreInfo>
            {expandedIndex === index && <Description>{modalidad.descripcion}</Description>}
          </Card>
        ))}
      </CardsContainer>

      <ConvocatoriaButton href="https://www.umss.edu.bo/admision/">
        <FaFileAlt /> Convocatorias
      </ConvocatoriaButton>
    </PageContainer>
  );
};

export default ModalidadesIngreso;

// Animaciones
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const PageContainer = styled.div`
  width: 100%;
  background-color: #ffffff;
  overflow-x: hidden;
  
`;

const CardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  padding: 40px 5%;
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
  position: relative;
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

const Description = styled.p`
  font-size: 1rem;
  color: #444;
  margin-top: 10px;
  text-align: left;
  padding: 0 15px;
`;

const ConvocatoriaButton = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background-color: #002f6c;
  color: white;
  font-weight: bold;
  text-decoration: none;
  padding: 12px 20px;
  border-radius: 5px;
  margin: 30px auto;
  width: fit-content;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0047a3;
  }
`;

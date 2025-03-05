import { useState } from "react";
import styled, { keyframes } from "styled-components";
import HeroSection from "../../../components/public/HeroSection";
import { FaGraduationCap, FaBook, FaBuilding, FaUniversity, FaFileAlt, FaListUl, FaChevronDown } from "react-icons/fa";

// 📌 Datos de las modalidades de titulación
const modalidadesData = [
  {
    titulo: "Excelencia Académica",
    icono: <FaGraduationCap />,
    descripcion:
      "Tipo de graduación que se rige en el aprovechamiento académico obtenido por el estudiante durante su permanencia en la Carrera, expresados en indicadores cuantitativos (promedios y mediana) e indicadores cualitativos (tiempo de duración de estudios, aprobación en primera instancia, no abandonos).",
  },
  {
    titulo: "Tesis de Grado",
    icono: <FaBook />,
    descripcion:
      "Disertación escrita presentada públicamente, para obtener un grado académico universitario, producto del estudio teórico de un tema original, pudiendo ajustarse a cualquier modelo de investigación, y que realiza con rigor metodológico, debe contener en sus conclusiones, aspectos propositivos.",
  },
  {
    titulo: "Trabajo Dirigido",
    icono: <FaBuilding />,
    descripcion:
      "Es la ejecución y evaluación del diseño de un proyecto en diferentes instituciones fuera de la Universidad respaldados por un convenio interinstitucional.",
  },
  {
    titulo: "Proyecto de Grado",
    icono: <FaFileAlt />,
    descripcion:
      "Es una modalidad de graduación por el cual, a través de un proyecto concreto y aplicable, el postulante integra las múltiples disciplinas y conocimientos adquiridos durante la carrera.",
  },
  {
    titulo: "Trabajo de Adscripción",
    icono: <FaUniversity />,
    descripcion:
      "Es la incorporación de los estudiantes, que tengan aprobados la totalidad de los contenidos del Plan de Estudios, a la realización de trabajos en diferentes secciones de los ámbitos académico, de investigación y de gestión universitaria de la U.M.S.S.",
  },
  {
    titulo: "Diplomado (Doble Titulación)",
    icono: <FaListUl />,
    descripcion:
      "Tipo de graduación que permite a los estudiantes graduados realizar un diplomado en función a la mención adquirida. Donde al final del Diplomado realizar una tesina.",
  },
];

const ModalidadesTitulacion = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <PageContainer>
      <HeroSection title="Modalidades de Titulación" />

      <CardsContainer>
        {modalidadesData.map((modalidad, index) => (
          <Card key={index}>
            <IconContainer>{modalidad.icono}</IconContainer>
            <Title>{modalidad.titulo}</Title>
            <Divider />
            <MoreInfo onClick={() => toggleExpand(index)}>
              Detalles <FaChevronDown className={expandedIndex === index ? "rotated" : ""} />
            </MoreInfo>
            {expandedIndex === index && <Description>{modalidad.descripcion}</Description>}
          </Card>
        ))}
      </CardsContainer>
    </PageContainer>
  );
};

export default ModalidadesTitulacion;

// 🔹 Animación de aparición
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const PageContainer = styled.div`
  width: 100%;
  background-color: #ffffff;
  overflow-x: hidden;
  padding-bottom: 40px;
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

import { useRef } from "react";
import styled, { keyframes } from "styled-components";
import HeroSection from "../../../components/public/HeroSection";
import { FaBullseye, FaUsers, FaScroll, FaGraduationCap, FaFlag } from "react-icons/fa";
import perfilImg from "../../../assets/img/tramite-universitario.jpg";
import campoLaboralImg from "../../../assets/img/tramite-universitario.jpg";

const NuestraCarrera = () => {
  const resenaRef = useRef(null);
  const misionRef = useRef(null);
  const valoresRef = useRef(null);
  const objetivosRef = useRef(null);
  const perfilRef = useRef(null);

  const scrollToSection = (ref) => {
    ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <PageContainer>
      <HeroSection title="Acerca de la Carrera" />

      <ButtonContainer>
        <NavButton onClick={() => scrollToSection(resenaRef)}>
          <FaScroll /> Reseña
        </NavButton>
        <NavButton onClick={() => scrollToSection(misionRef)}>
          <FaFlag /> Misión
        </NavButton>
        <NavButton onClick={() => scrollToSection(valoresRef)}>
          <FaUsers /> Valores
        </NavButton>
        <NavButton onClick={() => scrollToSection(objetivosRef)}>
          <FaBullseye /> Objetivos
        </NavButton>
        <NavButton onClick={() => scrollToSection(perfilRef)}>
          <FaGraduationCap /> Perfil
        </NavButton>
      </ButtonContainer>

      <Section ref={resenaRef}>
        <h2>HISTORIA</h2>
        <p>La carrera de Ingeniería Civil fue creada el 2 de agosto de 1985...</p>
      </Section>

      <Section ref={misionRef} grayBackground>
        <MissionVisionContainer>
          <TextBlock>
            <h3><i>Misión</i></h3>
            <p>Formar profesionales de calidad en Ingeniería Civil...</p>
          </TextBlock>
          <TextBlock>
            <h3><i>Visión</i></h3>
            <p>Ser en el 2025 una comunidad académica líder en la educación superior...</p>
          </TextBlock>
        </MissionVisionContainer>
      </Section>

      <Section ref={valoresRef}>
        <ValoresContainer>
          <TextBlock>
            <h3><i>Valores de la Carrera</i></h3>
            <p>La carrera de Ingeniería Civil promueve valores éticos y sociales...</p>
          </TextBlock>
          <ImageBlock src={campoLaboralImg} alt="Valores de la carrera" />
        </ValoresContainer>
      </Section>

      <Section ref={objetivosRef} grayBackground>
        <h2>Objetivos de la Carrera</h2>
        <ObjetivosGrid>
          <ObjetivoItem>Profesionalización de Pregrado</ObjetivoItem>
          <ObjetivoItem>Formación Integral</ObjetivoItem>
          <ObjetivoItem>Investigación</ObjetivoItem>
          <ObjetivoItem>Interacción y Extensión</ObjetivoItem>
          <ObjetivoItem>Cualificación de Postgrado</ObjetivoItem>
          <ObjetivoItem>Gestión de Apoyo</ObjetivoItem>
        </ObjetivosGrid>
      </Section>

      <Section ref={perfilRef}>
        <PerfilContainer>
          <ImageBlock src={perfilImg} alt="Perfil de Egreso" />
          <TextBlock>
            <h2>PERFIL DE EGRESO</h2>
            <p>El egresado de la carrera de Ingeniería Civil cuenta con conocimientos y habilidades para...</p>
            <ul>
              <li>Diseñar obras de infraestructura con enfoque ambiental.</li>
              <li>Resolver problemas de transporte y servicios básicos.</li>
              <li>Adaptarse a los cambios tecnológicos y científicos.</li>
            </ul>
          </TextBlock>
        </PerfilContainer>

        <CampoLaboralContainer>
          <TextBlock>
            <h2>CAMPO LABORAL</h2>
            <p>El Ingeniero Civil es requerido en:</p>
            <h4><b>Empresas Públicas:</b></h4>
            <p>Prefecturas, alcaldías, Servicio Nacional de Caminos, universidades públicas, etc.</p>
            <h4><b>Empresas Privadas:</b></h4>
            <p>Empresas constructoras, consultoras, organismos internacionales y ONG’s.</p>
          </TextBlock>
          <ImageBlock src={campoLaboralImg} alt="Campo Laboral" />
        </CampoLaboralContainer>
      </Section>
    </PageContainer>
  );
};

export default NuestraCarrera;

// Animaciones
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Contenedor principal
const PageContainer = styled.div`
  width: 100%;
  background-color: #ffffff;

  @media (max-width: 768px) {
    overflow-x: hidden;
  } 
`;

// Botones de navegación
const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  margin: 20px 0;
  flex-wrap: wrap;
  
`;

const NavButton = styled.button`
  background-color: #002f6c;
  color: white;
  font-weight: bold;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: background 0.3s ease;
  font-size: 0.9rem;
  overflow-x: hidden;

  &:hover {
    background-color: #0047a3;
  }

  @media (max-width: 768px) {
    font-size: 0.8rem;
    padding: 8px 12px;
  }
`;

// Secciones generales
const Section = styled.section`
  padding: 50px 5%;
  text-align: left;
  background-color: ${(props) => (props.grayBackground ? "#f5f7fa" : "white")};
  animation: ${fadeIn} 0.6s ease-out;
`;

// Contenedores de información
const MissionVisionContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
  justify-content: space-between;
`;

const ValoresContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
  justify-content: space-between;
`;

const PerfilContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 40px;
`;

const CampoLaboralContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 40px;
  margin-top: 40px;
`;

const TextBlock = styled.div`
  flex: 1;
  min-width: 300px;
  font-size: 1.1rem;
`;

const ImageBlock = styled.img`
  max-width: 400px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

// Objetivos
const ObjetivosGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  padding-top: 20px;
`;

const ObjetivoItem = styled.div`
  background: #f8f9fa;
  padding: 15px;
  border-radius: 5px;
  text-align: center;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s ease;

  &:hover {
    background: #e0e0e0;
  }
`;

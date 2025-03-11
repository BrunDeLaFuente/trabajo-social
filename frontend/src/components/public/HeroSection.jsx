import styled from "styled-components";
import backgroundImage from "../../assets/img/portada.png"; // Ruta de la imagen

const HeroSection = ({ title }) => {
  return (
    <HeroContainer>
      <Overlay />
      <HeroText>
        <Line />
        <Title>{title}</Title>
      </HeroText>
      <WaveSvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <path
          fill="#ffffff"
          fillOpacity="1"
          d="M0,224L80,218.7C160,213,320,203,480,208C640,213,800,235,960,234.7C1120,235,1280,213,1360,202.7L1440,192V320H0Z"
        ></path>
      </WaveSvg>
    </HeroContainer>
  );
};

export default HeroSection;

const HeroContainer = styled.div`
  position: relative;
  width: 100%;
  height: 320px; /* Altura en escritorio */
  background: url(${backgroundImage}) no-repeat center center/cover;
  display: flex;
  align-items: flex-start;
  padding-left: 5%;
  justify-content: flex-start;
  padding-top: 50px; /* Ajuste del texto */
  overflow: hidden;
  
   /* 📌 Elimina cualquier capa extra de fondo */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6); /* Opacidad uniforme */
  }

  /* 🔹 Asegura que no haya otro fondo afectando */
  * {
    background: transparent !important;
  }
  @media (max-width: 768px) {
    height: 200px; /* Reducir altura */
    padding-top: 30px; 
  }
`;

const Overlay = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
`;

const HeroText = styled.div`
  position: relative;
  color: white;
  z-index: 2;
  display: flex;
  align-items: center;

  /* 🔹 Línea vertical detrás del texto */
  &::before {
    content: "";
    position: absolute;
    left: -8px; /* Ajuste en escritorio */
    top: 0;
    height: 100%;
    width: 4px;
    background-color: white;

    /* 🔹 Línea más delgada y corta en pantallas pequeñas */
    @media (max-width: 768px) {
      left: -5px;
      width: 3px;
      height: 80%;
    }
  }
`;

const Line = styled.div`
  display: none; /* Eliminamos esta ya que la agregamos en HeroText */
`;

const Title = styled.h1`
  font-size: 2.5rem; /* Tamaño normal */
  margin-left: 10px;

  /* 🔹 Reducir tamaño en móviles */
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const WaveSvg = styled.svg`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  max-width: 100vw; /* ✅ Evita que el SVG se expanda más allá del viewport */
  overflow: hidden;
  bottom: -1px;
`;


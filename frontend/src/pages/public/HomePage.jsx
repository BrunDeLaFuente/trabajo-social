import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import backgroundImage1 from "../../assets/img/portada.png";
import backgroundImage2 from "../../assets/img/portada2.jpg";
import platformIcon from "../../assets/img/educacion-en-linea.png";
import moodleIcon from "../../assets/img/moodle.png";
import servicesIcon from "../../assets/img/elearning.png";
import websisIcon from "../../assets/img/education.png";
import CareerSection from "../../components/public/CareerSection";
import NoticiasSection from "../../components/public/NoticiasSection";

const HomePage = () => {
  const backgrounds = [backgroundImage1, backgroundImage2];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % backgrounds.length);
    }, 10000); // cambia cada 10 segundos

    return () => clearInterval(interval);
  }, []);

  const activeBg = backgrounds[index];
  const isFirstBg = activeBg === backgroundImage1;

  return (
    <Container>
      <HeroSection isFirst={isFirstBg} background={activeBg}>
        <Overlay />
        <TextOverlay>
          <Title>Carrera de Trabajo Social</Title>
          <Subtitle>FHyCE | UMSS</Subtitle>
        </TextOverlay>
        <WaveSvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path
            fill="#ffffff"
            fillOpacity="1"
            d="M0,224L80,218.7C160,213,320,203,480,208C640,213,800,235,960,234.7C1120,235,1280,213,1360,202.7L1440,192V320H0Z"
          ></path>
        </WaveSvg>
      </HeroSection>

      <LinksSection>
        <LinkCard
          href="https://www.umss.edu.bo/plataformas-educativas-estudiantes/"
          target="_blank"
        >
          <Icon src={platformIcon} alt="Plataformas Educativas" />
          <Text>Plataformas Educativas</Text>
        </LinkCard>
        <LinkCard
          href="https://moodle.hum.umss.edu.bo/login/index.php"
          target="_blank"
        >
          <Icon src={moodleIcon} alt="Moodle Facultativo" />
          <Text>Moodle Facultativo</Text>
        </LinkCard>
        <LinkCard href="https://www.hum.umss.edu.bo/" target="_blank">
          <Icon src={servicesIcon} alt="Servicios Facultativos" />
          <Text>Servicios Facultativos</Text>
        </LinkCard>
        <LinkCard
          href="https://websis.umss.edu.bo/presentacion.asp"
          target="_blank"
        >
          <Icon src={websisIcon} alt="WebSISS" />
          <Text>WebSISS</Text>
        </LinkCard>
      </LinksSection>

      <CareerSection />
      <NoticiasSection />
    </Container>
  );
};

export default HomePage;

// Animaciones
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const fadeBg = keyframes`
  from { opacity: 0.5; }
  to { opacity: 1; }
`;

const Container = styled.div`
  text-align: center;
`;

const HeroSection = styled.div`
  position: relative;
  width: 100%;
  height: 650px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-blend-mode: multiply;
  background-image: ${(props) =>
    props.isFirst
      ? `linear-gradient(1deg, rgba(34, 138, 230, 0.75) 0%, rgba(136, 196, 221, 0.72) 100%), url(${props.background})`
      : `url(${props.background})`};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  animation: ${fadeBg} 1.5s ease-in-out;

  @media (max-width: 768px) {
    height: 400px;
  }
`;

const Overlay = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
`;

const TextOverlay = styled.div`
  position: relative;
  color: white;
  text-align: center;
  animation: ${fadeIn} 2s ease-in-out;
  z-index: 2;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: bold;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.5rem;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const LinksSection = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 20px 20px;
  flex-wrap: wrap;
  position: relative;
  margin-bottom: 20px;
  z-index: 2;

  @media (min-width: 768px) {
    margin-top: -20px;
  }
`;

const WaveSvg = styled.svg`
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 100%;
  z-index: 1;
`;

const LinkCard = styled.a`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  border-radius: 10px;
  padding: 15px;
  text-decoration: none;
  color: black;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 180px;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: translateY(-5px);
  }
`;

const Icon = styled.img`
  width: 50px;
  height: 50px;
`;

const Text = styled.p`
  font-size: 1rem;
  margin-top: 10px;
  font-weight: bold;
`;

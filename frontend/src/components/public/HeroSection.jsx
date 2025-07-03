import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import backgroundImage1 from "../../assets/img/portada.png";
import backgroundImage2 from "../../assets/img/portada2.jpg";

const HeroSection = ({ title }) => {
  const backgrounds = [backgroundImage1, backgroundImage2];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % backgrounds.length);
    }, 10000); // cambia cada 10 segundos
    return () => clearInterval(interval);
  }, []);

  const activeBg = backgrounds[index];

  return (
    <HeroContainer style={{ backgroundImage: `url(${activeBg})` }}>
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
  height: 320px;
  background: no-repeat center center/cover;
  display: flex;
  align-items: flex-start;
  padding-left: 5%;
  justify-content: flex-start;
  padding-top: 50px;
  overflow: hidden;
  transition: background-image 1.5s ease-in-out;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
  }

  * {
    background: transparent !important;
  }

  @media (max-width: 768px) {
    height: 200px;
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

  &::before {
    content: "";
    position: absolute;
    left: -8px;
    top: 0;
    height: 100%;
    width: 4px;
    background-color: white;

    @media (max-width: 768px) {
      left: -5px;
      width: 3px;
      height: 80%;
    }
  }
`;

const Line = styled.div`
  display: none;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-left: 10px;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const WaveSvg = styled.svg`
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  max-width: 100vw;
  overflow: hidden;
  z-index: 3;
`;

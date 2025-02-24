import styled from "styled-components";
import { FaBookmark } from "react-icons/fa"; // Importamos el icono

const videoUrl = "https://www.youtube.com/embed/NupRtPrm3rU"; // ✅ Formato correcto para YouTube

const CareerSection = () => {
    return (
        <SectionContainer>
            <SectionTitleContainer>
                <SectionTitle>Carrera de Trabajo Social</SectionTitle>
                <Underline />
            </SectionTitleContainer>
            <ContentWrapper>
                <LeftContainer>
                    <VideoContainer>
                        <iframe
                            src={videoUrl}
                            width="100%"
                            height="100%"
                            style={{ border: "none", borderRadius: "10px" }}
                            allowFullScreen
                        ></iframe>
                    </VideoContainer>
                </LeftContainer>
                <RightContainer>
                    <DescriptionTitle>DESCRIPCIÓN</DescriptionTitle>
                    <DescriptionText>
                        <strong>Facultad:</strong> Humanidades y Ciencias de la Educación.{" "}
                        <VerMas href="https://www.hum.umss.edu.bo/" target="_blank">Ver más</VerMas>
                    </DescriptionText>
                    <DescriptionText>
                        <strong>Carrera:</strong> Trabajo Social.
                    </DescriptionText>
                    <DescriptionText>
                        <strong>Duración:</strong> 5 años.
                    </DescriptionText>
                    <DescriptionText>
                        <strong>Enseñanza:</strong> Presencial y Virtual.
                    </DescriptionText>
                    <DescriptionText>
                        <strong>Idiomas:</strong> Español.
                    </DescriptionText>
                    <DescriptionText>
                        <strong>Grado:</strong> Licenciatura en Trabajo Social.
                    </DescriptionText>
                    <CurriculumButton href="/pregrado/malla-curricular">
                        <FaBookmark style={{ marginRight: "8px" }} /> Malla Curricular
                    </CurriculumButton>
                </RightContainer>
            </ContentWrapper>
        </SectionContainer>
    );
};

export default CareerSection;

// 📌 Estilos

const SectionContainer = styled.section`
  width: 100%;
  max-width: 100%;
  background-color: #f5f5f5;
  padding: 60px 5% 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-x: hidden; /* 📌 Evita cualquier desbordamiento horizontal */
`;

const SectionTitleContainer = styled.div`
  text-align: center;
  margin-bottom: 20px;
  width: 100%;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  color: #003366;
  font-weight: bold;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

// 📌 Línea naranja más corta y centrada
const Underline = styled.div`
  width: 180px;
  height: 3px;
  background-color: #ff6600;
  margin: 5px auto 30px;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  max-width: 1200px;
  width: 100%;
  align-items: center;
  gap: 50px;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const LeftContainer = styled.div`
  flex: 1;
  min-width: 320px;
`;

const RightContainer = styled.div`
  flex: 1;
  min-width: 320px;
  text-align: left;
  display: flex;
  flex-direction: column;
  justify-content: center; /* 📌 Hace que el contenido empiece alineado con el video */
`;

const VideoContainer = styled.div`
  width: 100%;
  height: 400px;

  @media (max-width: 768px) {
    height: 220px;
  }
`;

const DescriptionTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: bold;
  color: #003366;
  margin-bottom: 15px;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const DescriptionText = styled.p`
  font-size: 1rem;
  margin-bottom: 20px; /* 📌 Más separación entre líneas */
`;

const VerMas = styled.a`
  color: #007bff;
  font-weight: bold;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const CurriculumButton = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  margin-top: 20px;
  background-color: #003366;
  color: white;
  padding: 8px 12px;
  border-radius: 5px;
  text-decoration: none;
  font-weight: bold;
  transition: background 0.3s;
  width: fit-content; /* 📌 Tamaño solo necesario */
  
  &:hover {
    background-color: #cc0000;
  }

  @media (max-width: 768px) {
    margin: 20px auto; /* 📌 Centrado en móvil */
  }
`;

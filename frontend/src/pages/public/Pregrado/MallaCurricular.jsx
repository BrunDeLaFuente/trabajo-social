import { useState } from "react";
import styled from "styled-components";
import HeroSection from "../../../components/public/HeroSection";
import { FaDownload, FaExternalLinkAlt, FaChevronDown } from "react-icons/fa";
import mallaImage from "../../../assets/img/imagen-malla.jpg";
import pdfFile from "../../../assets/img/Malla-Curricular.pdf";

const mallaData = {
  imagen: mallaImage,
  archivo: pdfFile,
  semestres: [
    {
      numero: "Primer semestre",
      materias: [
        {
          nombre: "Álgebra I",
          codigo: "TS101",
          contenido: ["Lógica y conjuntos.", "Relaciones y funciones.", "Geometría analítica en el plano."],
        },
        {
          nombre: "Dibujo Técnico",
          codigo: "TS102",
          contenido: [],
        },
        {
          nombre: "Cálculo I",
          codigo: "TS103",
          contenido: [],
        },
      ],
    },
    {
      numero: "Segundo semestre",
      materias: [
        {
          nombre: "Geometría Descriptiva",
          codigo: "TS201",
          contenido: [],
        },
        {
          nombre: "Álgebra II",
          codigo: "TS202",
          contenido: ["Álgebra Lineal", "Álgebra Matricial", "Teoría Matricial"],
        },
      ],
    },
  ],
};

const MallaCurricular = () => {
  const [expanded, setExpanded] = useState(null);

  return (
    <PageContainer>
      <HeroSection title="Malla Curricular" />

      <TopSection>
        <ImageContainer>
          <img src={mallaData.imagen} alt="Malla Curricular" />
        </ImageContainer>
        <ButtonBox>
          <h3>Ver Malla Curricular</h3>
          <ButtonContainer>
            <DownloadButton href={mallaData.archivo} download>
              Descargar en PDF <FaDownload />
            </DownloadButton>
            <ViewButton href="https://websis.umss.edu.bo/umss_carrerasDesc.asp?codSer=UMSS&idCat=&qual=108061">
              Ver en WebSiss <FaExternalLinkAlt />
            </ViewButton>
          </ButtonContainer>
        </ButtonBox>
      </TopSection>

      <ContentSection>
        <SectionTitle>Contenidos Mínimos</SectionTitle>
        <SemestersContainer>
          {mallaData.semestres.map((semestre, semIndex) => (
            <Semester key={semIndex}>
              <SemesterTitle>{semestre.numero}</SemesterTitle>
              {semestre.materias.map((materia, matIndex) => (
                <Materia key={matIndex} onClick={() => setExpanded(expanded === matIndex ? null : matIndex)}>
                  <MateriaHeader>
                    {materia.nombre}
                    <FaChevronDown className={expanded === matIndex ? "rotated" : ""} />
                  </MateriaHeader>
                  {expanded === matIndex && (
                    <MateriaContent>
                      {materia.contenido.length > 0 ? (
                        <ul>
                          {materia.contenido.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      ) : (
                        <p>No hay contenido registrado.</p>
                      )}
                    </MateriaContent>
                  )}
                </Materia>
              ))}
            </Semester>
          ))}
        </SemestersContainer>
      </ContentSection>
    </PageContainer>
  );
};

export default MallaCurricular;

const PageContainer = styled.div`
  width: 100%;
  background-color: #ffffff;
  overflow-x: hidden;
`;

const TopSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 5%;
  flex-wrap: wrap;
  gap: 40px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const ImageContainer = styled.div`
  flex: 1;
  max-width: 800px;
  img {
    width: 100%;
    border-radius: 10px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  }
`;

const ButtonBox = styled.div`
  flex: 1;
  max-width: 350px;
  text-align: center;
  background:rgb(224, 227, 230);
  padding: 20px;
  border-radius: 10px;

  @media (max-width: 768px) {
    max-width: 100%;
    margin-top: 20px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const DownloadButton = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  background-color: #002f6c;
  color: white;
  text-decoration: none;
  font-weight: bold;
  border-radius: 5px;
  transition: 0.3s;
  margin-top: 15px;
  &:hover {
    background-color: #0047a3;
  }
`;

const ViewButton = styled(DownloadButton)`
  background-color: white;
  color: black;
  border: 1px solid black;
  &:hover {
    background-color: #f0f0f0;
  }
`;

const ContentSection = styled.div`
  background-color:rgb(255, 255, 255);
  color: white;
  padding: 40px 5%;
  text-align: center;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 20px;
  padding: 10px 0;
  background-color: black;
  color: white;
`;

const SemestersContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
`;

const Semester = styled.div`
  background: #e3e3e3;
  padding: 15px;
  border-radius: 5px;
  color: black;
`;

const SemesterTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: bold;
`;

const Materia = styled.div`
  background: white;
  padding: 10px;
  margin-top: 10px;
  border-radius: 5px;
  cursor: pointer;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  transition: 0.3s;

  &:hover {
    background-color:rgb(255, 255, 255);
  }
`;

const MateriaHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;

  .rotated {
    transform: rotate(180deg);
  }
`;

const MateriaContent = styled.div`
  margin-top: 10px;
  text-align: left;
  ul {
    padding-left: 20px;
  }
`;


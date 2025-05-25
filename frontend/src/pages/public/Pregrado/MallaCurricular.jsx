import { useState, useEffect } from "react";
import styled from "styled-components";
import HeroSection from "../../../components/public/HeroSection";
import { FaDownload, FaExternalLinkAlt } from "react-icons/fa";
import { ChevronDown, ChevronUp } from "lucide-react";
import api from "../../../utils/api";

const MallaCurricular = () => {
  const [expandedSemesters, setExpandedSemesters] = useState([]);
  const [expandedMaterias, setExpandedMaterias] = useState([]);
  const [mallaData, setMallaData] = useState(null);

  useEffect(() => {
    const fetchMalla = async () => {
      try {
        const response = await api.get("/malla");
        setMallaData(response.data);
      } catch (error) {
        console.error("Error al obtener la malla curricular:", error);
      }
    };

    fetchMalla();
  }, []);

  const toggleSemester = (semesterId) => {
    setExpandedSemesters((prev) =>
      prev.includes(semesterId)
        ? prev.filter((id) => id !== semesterId)
        : [...prev, semesterId]
    );
  };

  const toggleMateria = (materiaId) => {
    setExpandedMaterias((prev) =>
      prev.includes(materiaId)
        ? prev.filter((id) => id !== materiaId)
        : [...prev, materiaId]
    );
  };

  return (
    <PageContainer>
      <HeroSection title="Malla Curricular" />
      {mallaData && (
        <TopSection>
          <ImageContainer>
            <img src={mallaData.imagen_url} alt="Malla Curricular" />
          </ImageContainer>
          <ButtonBox>
            <h3>Ver Malla Curricular</h3>
            <ButtonContainer>
              <DownloadButton href={mallaData.archivo_pdf_url} download>
                Descargar en PDF <FaDownload />
              </DownloadButton>

              <ViewButton href="https://websis.umss.edu.bo/umss_carrerasDesc.asp?codSer=UMSS&idCat=&qual=108061">
                Ver en WebSiss <FaExternalLinkAlt />
              </ViewButton>
            </ButtonContainer>
          </ButtonBox>
        </TopSection>
      )}
      <ContentSection>
        {mallaData && <SectionTitle>Contenidos Mínimos</SectionTitle>}
        {mallaData && (
          <Container>
            <SemestersGrid>
              {mallaData.semestres.map((semestre, sIndex) => (
                <SemesterCard key={sIndex}>
                  <SemesterHeader
                    $isExpanded={expandedSemesters.includes(`sem-${sIndex}`)}
                    onClick={() => toggleSemester(`sem-${sIndex}`)}
                  >
                    <SemesterTitle>{semestre.numero}</SemesterTitle>
                    <MateriasCount>
                      {semestre.materias.length} materias
                    </MateriasCount>
                    <ChevronIcon>
                      {expandedSemesters.includes(`sem-${sIndex}`) ? (
                        <ChevronUp size={18} />
                      ) : (
                        <ChevronDown size={18} />
                      )}
                    </ChevronIcon>
                  </SemesterHeader>
                  {expandedSemesters.includes(`sem-${sIndex}`) && (
                    <SemesterContent>
                      {semestre.materias.map((materia, mIndex) => {
                        const materiaId = `materia-${sIndex}-${mIndex}`;
                        const isExpanded = expandedMaterias.includes(materiaId);

                        return (
                          <MateriaItem key={mIndex}>
                            <MateriaHeader
                              onClick={() => toggleMateria(materiaId)}
                            >
                              <MateriaTitle>
                                {materia.nombre_materia}
                              </MateriaTitle>
                              <MateriaCode>
                                {materia.codigo_materia}
                              </MateriaCode>
                              <ChevronIcon>
                                {isExpanded ? (
                                  <ChevronUp size={16} />
                                ) : (
                                  <ChevronDown size={16} />
                                )}
                              </ChevronIcon>
                            </MateriaHeader>

                            {isExpanded && (
                              <MateriaContent>
                                {materia.contenidos &&
                                materia.contenidos.length > 0 ? (
                                  <ContentList>
                                    {materia.contenidos.map((item, cIndex) => (
                                      <ContentItem key={cIndex}>
                                        {item.descripcion}
                                      </ContentItem>
                                    ))}
                                  </ContentList>
                                ) : (
                                  <EmptyContent>
                                    No hay contenido disponible para esta
                                    materia.
                                  </EmptyContent>
                                )}
                              </MateriaContent>
                            )}
                          </MateriaItem>
                        );
                      })}
                    </SemesterContent>
                  )}
                </SemesterCard>
              ))}
            </SemestersGrid>
          </Container>
        )}
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
  background: rgb(224, 227, 230);
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
  padding: 40px 5%;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 20px;
  padding: 10px 0;
  background-color: black;
  color: white;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const SemestersGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const SemesterCard = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  background-color: white;
`;

const SemesterHeader = styled.div`
  padding: 1rem;
  background-color: #f8fafc;
  font-weight: 500;
  font-size: 1.125rem;
  display: flex;
  align-items: center;
  cursor: pointer;
  border-bottom: ${(props) =>
    props.$isExpanded ? "1px solid #e2e8f0" : "none"};

  &:hover {
    background-color: #f1f5f9;
  }
`;

const SemesterTitle = styled.div`
  flex: 1;
`;

const MateriasCount = styled.div`
  font-size: 0.875rem;
  color: #64748b;
`;

const SemesterContent = styled.div`
  padding: 1rem;
`;

const MateriaItem = styled.div`
  margin-bottom: 0.75rem;
  border-bottom: 1px solid #f1f5f9;

  &:last-child {
    margin-bottom: 0;
    border-bottom: none;
  }
`;

const MateriaHeader = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.75rem 0;
  cursor: pointer;

  @media (min-width: 640px) {
    flex-direction: row;
    align-items: center;
  }
`;

const MateriaTitle = styled.div`
  font-weight: 500;
`;

const MateriaCode = styled.span`
  display: inline-block;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  background-color: #f1f5f9;
  border: 1px solid #e2e8f0;
  margin-top: 0.25rem;

  @media (min-width: 640px) {
    margin-left: 0.5rem;
    margin-top: 0;
  }
`;

const MateriaContent = styled.div`
  padding: 0.75rem 0 1rem;
`;

const ContentList = styled.ul`
  list-style-type: disc;
  padding-left: 1.5rem;
  margin: 0;
`;

const ContentItem = styled.li`
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
`;

const EmptyContent = styled.p`
  font-size: 0.875rem;
  color: #64748b;
  font-style: italic;
`;

const ChevronIcon = styled.div`
  margin-left: 0.5rem;
  display: flex;
  align-items: center;
`;

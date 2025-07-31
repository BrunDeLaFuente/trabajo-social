import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import HeroSection from "../../../components/public/HeroSection";
import { FaUserTie } from "react-icons/fa";
import api from "../../../utils/api";

const PersonalDocente = () => {
  const [busqueda, setBusqueda] = useState("");
  const [docentes, setDocentes] = useState([]);

  useEffect(() => {
    const fetchDocentes = async () => {
      try {
        const response = await api.get("/docentes");
        setDocentes(response.data.docentes);
      } catch (error) {
        console.error("Error al obtener docentes:", error);
      }
    };

    fetchDocentes();
  }, []);

  const docentesFiltrados = docentes.filter((docente) =>
    [
      docente.nombre_persona,
      docente.cargo,
      ...docente.asignaturas.map((a) => a.nombre_asignatura),
    ]
      .join(" ")
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  return (
    <PageContainer>
      <HeroSection title="Personal Docente" />
      <ContentWrapper>
        <SearchInput
          type="text"
          placeholder="Buscar docentes..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <DocentesContainer>
          {docentesFiltrados.length > 0 ? (
            docentesFiltrados.map((docente, index) => (
              <DocenteCard key={docente.id_persona} $alternar={index % 2 === 0}>
                <IconContainer>
                  {docente.imagen_persona_url ? (
                    <Img
                      src={docente.imagen_persona_url}
                      alt={docente.nombre_persona}
                    />
                  ) : (
                    <IconPlaceholder />
                  )}
                </IconContainer>
                <DocenteInfo>
                  <Name>{docente.nombre_persona}</Name>
                  {docente.correos.length > 0 && (
                    <SmallCorreo>
                      {docente.correos[0].email_persona}
                    </SmallCorreo>
                  )}
                  <Profesion>{docente.cargo}</Profesion>
                  <AsignaturaBoton>Asignatura</AsignaturaBoton>
                  <AsignaturasList>
                    {docente.asignaturas.map((asig) => (
                      <li key={asig.id_asignatura}>{asig.nombre_asignatura}</li>
                    ))}
                  </AsignaturasList>
                </DocenteInfo>
              </DocenteCard>
            ))
          ) : (
            <NoResults>No se encontraron resultados</NoResults>
          )}
        </DocentesContainer>
      </ContentWrapper>
    </PageContainer>
  );
};

export default PersonalDocente;

// Animación de aparición
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const PageContainer = styled.div`
  width: 100%;
  overflow-x: hidden;
  background-color: #ffffff;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 30px 5%;
`;

// Estilos para el buscador
const SearchInput = styled.input`
  width: 40%;
  max-width: 400px;
  padding: 10px;
  border: 2px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease-in-out;

  &:focus {
    border-color: #ff6600;
  }

  @media (max-width: 768px) {
    width: 80%;
    font-size: 0.9rem;
  }
`;

const DocentesContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
  width: 100%;
`;

const DocenteCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${(props) => (props.$alternar ? "#f8f9fa" : "white")};
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 250px;
  text-align: center;
  animation: ${fadeIn} 0.6s ease-out;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
  }
`;

const IconContainer = styled.div`
  font-size: 50px;
  color: #0056b3;
  margin-bottom: 10px;
`;

const DocenteInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Name = styled.h3`
  font-size: 1.1rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
`;

const Profesion = styled.p`
  font-size: 0.95rem;
  color: #0056b3;
  font-weight: bold;
  margin-bottom: 10px;
`;

const AsignaturaBoton = styled.button`
  background-color: #002f6c;
  color: white;
  font-weight: bold;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 10px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0047a3;
  }
`;

const AsignaturasList = styled.ul`
  list-style: none;
  padding: 0;
  font-size: 0.9rem;
  color: #444;
  text-align: left;

  li {
    padding: 2px 0;
    border-left: 3px solid #0056b3;
    padding-left: 8px;
  }
`;

const NoResults = styled.p`
  font-size: 1.1rem;
  color: #999;
  text-align: center;
  font-style: italic;
`;

const Img = styled.img`
  width: 110px;
  height: 110px;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid #0056b3;
  transition: all 0.3s ease-in-out;

  @media (min-width: 1024px) {
    width: 130px;
    height: 130px;
  }
`;

const SmallCorreo = styled.small`
  font-size: 0.8rem;
  color: #555;
  margin-bottom: 5px;
`;

const IconPlaceholder = styled(FaUserTie)`
  font-size: 100px;
  color: #0056b3;
  margin-top: 20px;
`;

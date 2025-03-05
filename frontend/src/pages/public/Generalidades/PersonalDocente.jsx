import { useState } from "react";
import styled, { keyframes } from "styled-components";
import HeroSection from "../../../components/public/HeroSection";
import { FaUserTie } from "react-icons/fa";

// 📌 Datos estáticos de docentes
const docentesData = [
  {
    nombre: "Ing. Víctor H. Alvarez Iriarte",
    profesion: "Ingeniero",
    asignaturas: ["Ingeniería Económica"],
  },
  {
    nombre: "Ing. Marko J. Andrade Uzieda",
    profesion: "Ingeniero",
    asignaturas: ["Física I", "Física II", "Estructuras Hiperestáticas"],
  },
  {
    nombre: "Ing. Omar Antezana Roman",
    profesion: "Ingeniero",
    asignaturas: ["Dibujo Técnico", "Análisis Numérico", "Estructuras Hiperestáticas", "Hormigón Armado I"],
  },
  {
    nombre: "Lic. Ligia J. Aranibar La Fuente",
    profesion: "Licenciada",
    asignaturas: ["Economía Política"],
  },
  {
    nombre: "Ing. Jaime Ayllón Acosta",
    profesion: "Ingeniero Civil",
    asignaturas: ["Maquinaria y equipo de construcción", "Carreteras II", "Aeropuertos"],
  },
  {
    nombre: "Ing. Javier Caballero Flores",
    profesion: "Ingeniero Civil",
    asignaturas: ["Estructuras de madera y metálicas", "Taller de modalidades de graduación I"],
  },
  {
    nombre: "Ing. Marko J. Andrade Uzieda",
    profesion: "Ingeniero",
    asignaturas: ["Física I", "Física II", "Estructuras Hiperestáticas"],
  },
  {
    nombre: "Ing. Omar Antezana Roman",
    profesion: "Ingeniero",
    asignaturas: ["Dibujo Técnico", "Análisis Numérico", "Estructuras Hiperestáticas", "Hormigón Armado I"],
  },
  {
    nombre: "Lic. Ligia J. Aranibar La Fuente",
    profesion: "Licenciada",
    asignaturas: ["Economía Política"],
  },
  {
    nombre: "Ing. Jaime Ayllón Acosta",
    profesion: "Ingeniero Civil",
    asignaturas: ["Maquinaria y equipo de construcción", "Carreteras II", "Aeropuertos"],
  },
  {
    nombre: "Ing. Javier Caballero Flores",
    profesion: "Ingeniero Civil",
    asignaturas: ["Estructuras de madera y metálicas", "Taller de modalidades de graduación I"],
  },
];

const PersonalDocente = () => {
  const [busqueda, setBusqueda] = useState("");

  // Filtrar docentes según la búsqueda
  const docentesFiltrados = docentesData.filter((docente) =>
    [docente.nombre, docente.profesion, ...docente.asignaturas]
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
              <DocenteCard key={index} $alternar={index % 2 === 0}>
                <IconContainer>
                  <FaUserTie />
                </IconContainer>
                <DocenteInfo>
                  <Name>{docente.nombre}</Name>
                  <Profesion>{docente.profesion}</Profesion>
                  <AsignaturaBoton>Asignatura</AsignaturaBoton>
                  <AsignaturasList>
                    {docente.asignaturas.map((asignatura, idx) => (
                      <li key={idx}>{asignatura}</li>
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
  border: 2px solid #0056b3;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease-in-out;

  &:focus {
    border-color: #0047a3;
    box-shadow: 0 0 8px rgba(0, 86, 179, 0.3);
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


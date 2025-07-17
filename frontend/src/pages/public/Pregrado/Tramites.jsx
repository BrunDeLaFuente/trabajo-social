import { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import HeroSection from "../../../components/public/HeroSection";
import { FaFileAlt, FaChevronDown, FaUniversity } from "react-icons/fa";
import api from "../../../utils/api";
import tramiteImg from "../../../assets/img/tramite-universitario.jpg";

const Tramites = () => {
  const [tramites, setTramites] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  useEffect(() => {
    const fetchTramites = async () => {
      try {
        const response = await api.get("/tramites");
        setTramites(response.data);
      } catch (error) {
        console.error("Error al obtener los trámites:", error);
      }
    };

    fetchTramites();
  }, []);

  const handleDownload = async (item) => {
    try {
      const id = item.id_tramite;

      // Hacer la llamada API para obtener el archivo
      const response = await api.get(`/tramites/${id}/descargar`, {
        responseType: "blob", // Importante para manejar archivos binarios
      });

      // Crear un blob URL temporal para la descarga
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);

      // Crear el enlace de descarga
      const link = document.createElement("a");
      link.href = url;

      // Formatear el título: minúsculas y espacios por "_"
      const safeTitle = item.titulo_tramite
        .toLowerCase()
        .replace(/\s+/g, "_") // reemplazar espacios con "_"
        .replace(/[^a-z0-9_]/g, ""); // quitar caracteres raros

      // Obtener extensión del archivo original
      const filename = item.planilla_download_url.split("/").pop();
      const originalExtension = filename.split(".").pop().toLowerCase();

      // Nuevo nombre seguro
      const newFilename = `${safeTitle}.${originalExtension || "pdf"}`;

      link.download = newFilename;
      link.target = "_blank";

      // Ejecutar la descarga
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Limpiar el blob URL temporal
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al descargar la planilla:", error);
      alert("Error al descargar la planilla. Por favor, inténtalo de nuevo.");
    }
  };

  return (
    <PageContainer>
      <HeroSection title="Trámites" />
      <SectionTitle>TRÁMITES DE LA CARRERA</SectionTitle>
      <CardsContainer>
        {tramites.map((tramite, index) => (
          <Card key={tramite.id_tramite}>
            <IconContainer>
              <FaFileAlt />
            </IconContainer>
            <Title>{tramite.titulo_tramite}</Title>
            <Divider />
            <MoreInfo onClick={() => toggleExpand(index)}>
              Ver trámite{" "}
              <FaChevronDown
                className={expandedIndex === index ? "rotated" : ""}
              />
            </MoreInfo>
            {expandedIndex === index && (
              <Description>
                <p>{tramite.descripcion_tramite}</p>
                {tramite.planilla_download_url && (
                  <PlanillaButton onClick={() => handleDownload(tramite)}>
                    Descargar Planilla
                  </PlanillaButton>
                )}
              </Description>
            )}
          </Card>
        ))}
      </CardsContainer>

      <UniversitySection>
        <UniversityTitle>TRÁMITES UNIVERSITARIOS</UniversityTitle>
        <UniversityContentWrapper>
          <UniversityImage src={tramiteImg} alt="Trámites Universitarios" />
          <UniversityContent>
            <FaUniversity size={40} color="#002f6c" />
            <p>
              En este apartado encontrará un resumen y acceso a las páginas
              oficiales de las unidades en las que se realizan los diversos
              tipos de trámites que contribuyen al buen funcionamiento de la
              Universidad Mayor de San Simón.
            </p>
            <UniversityButton href="https://www.umss.edu.bo/tramites/">
              Ver más trámites
            </UniversityButton>
          </UniversityContent>
        </UniversityContentWrapper>
      </UniversitySection>
    </PageContainer>
  );
};

export default Tramites;

// Animaciones
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const PageContainer = styled.div`
  width: 100%;
  background-color: #ffffff;
  overflow-x: hidden;
`;

const SectionTitle = styled.h2`
  text-align: left;
  font-size: 1.8rem;
  font-weight: bold;
  margin: 30px 5px 80px 5%;
  position: relative;
  color: #003366;
  &:after {
    content: "";
    display: block;
    width: 130px;
    height: 3px;
    background: #ff6600;
    margin-top: 5px;
  }

  @media (max-width: 768px) {
    font-size: 1.5rem;
    &:after {
      width: 80px;
    }
  }
`;

const CardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px 5%;
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

const Description = styled.div`
  font-size: 0.95rem;
  color: #444;
  margin-top: 10px;
  text-align: left;
  padding: 0 15px;
`;

const PlanillaButton = styled.a`
  display: inline-block;
  background: #ffcc00;
  color: black;
  font-weight: bold;
  padding: 8px 12px;
  margin-top: 10px;
  border-radius: 4px;
  text-decoration: none;
  &:hover {
    background: #e6b800;
  }
`;

const UniversitySection = styled.div`
  padding: 50px 5%;
  background: #f5f7fa;
  text-align: center;
`;

const UniversityTitle = styled(SectionTitle)`
  color: #003366;
  text-align: left;
`;

const UniversityContentWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;
  max-width: 1100px;
  margin: auto;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const UniversityImage = styled.img`
  max-width: 400px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const UniversityContent = styled.div`
  max-width: 500px;
  text-align: left;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px; /* Agregamos separación entre los elementos */
  background: rgb(255, 253, 246);

  p {
    text-align: center;
    line-height: 1.6; /* Mejora la legibilidad del texto */
  }

  svg {
    margin-bottom: 10px; /* Separa el icono del texto */
  }

  @media (max-width: 768px) {
    text-align: center;
  }
`;

const UniversityButton = styled.a`
  display: inline-block;
  background: #002f6c;
  color: white;
  padding: 10px 15px;
  font-weight: bold;
  border-radius: 5px;
  text-decoration: none;
  margin-top: 10px;
  &:hover {
    background: #0047a3;
  }
`;

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import HeroSection from "../../../components/public/HeroSection";
import api from "../../../utils/api";

const Noticias = () => {
  const [noticias, setNoticias] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchNoticias = async () => {
      try {
        const noticiasPublicas = await api.get("/noticias");
        setNoticias(noticiasPublicas.data);
      } catch (error) {
        console.error("Error al cargar las noticias:", error);
      }
    };

    fetchNoticias();
  }, []);

  const noticiasFiltradas = noticias.filter((noticia) =>
    (noticia.titulo_noticia || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const formatearFecha = (fechaISO) => {
    const meses = [
      "Ene",
      "Feb",
      "Mar",
      "Abr",
      "May",
      "Jun",
      "Jul",
      "Ago",
      "Sep",
      "Oct",
      "Nov",
      "Dic",
    ];
    const fecha = new Date(fechaISO);
    return `${
      meses[fecha.getMonth()]
    } ${fecha.getDate()}, ${fecha.getFullYear()}`;
  };

  return (
    <PageContainer>
      <HeroSection title="Noticias" />
      <SectionContainer>
        <TitleContainer>
          <SearchInput
            type="text"
            placeholder="Buscar noticia..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </TitleContainer>

        <NoticiasGrid>
          {noticiasFiltradas.length > 0 ? (
            noticiasFiltradas.map((noticia, index) => (
              <NoticiaCard
                key={index}
                to={`/noticias/anuncios/${noticia.slug}`}
              >
                <Titulo>{noticia.titulo_noticia}</Titulo>
                <Descripcion>
                  {noticia.contenido
                    .replace(/<\/?[^>]+(>|$)/g, "")
                    .substring(0, 30)}
                  ...
                </Descripcion>
                <Fecha>
                  {formatearFecha(noticia.fecha_publicacion_noticia)} |{" "}
                  <Categoria categoria={noticia.categoria}>
                    {noticia.categoria}
                  </Categoria>
                </Fecha>
              </NoticiaCard>
            ))
          ) : (
            <NoResults>No se encontraron noticias.</NoResults>
          )}
        </NoticiasGrid>
      </SectionContainer>
    </PageContainer>
  );
};

export default Noticias;

// 📌 Animaciones y Estilos
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const PageContainer = styled.div`
  width: 100%;
  background-color: #ffffff;
  overflow-x: hidden;
`;

const SectionContainer = styled.section`
  max-width: 1200px;
  margin: 0px auto;
  padding: 30px 20px;
  background-color: #ffffff;
  text-align: center;
`;

const TitleContainer = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

const SearchInput = styled.input`
  width: 100%;
  max-width: 400px;
  padding: 10px;
  font-size: 1rem;
  border: 2px solid #ccc;
  border-radius: 5px;
  outline: none;
  transition: border 0.3s ease;

  &:focus {
    border-color: #ff6600;
  }

  @media (max-width: 768px) {
    width: 90%;
    font-size: 0.9rem;
  }
`;

const NoticiasGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  justify-content: center;
`;

const NoticiaCard = styled(Link)`
  display: block;
  background: #ffffff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.3s;
  text-decoration: none;
  color: inherit;
  animation: ${fadeIn} 0.6s ease-out;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
  }
`;

const Titulo = styled.h3`
  font-size: 1.1rem;
  color: #003366;
  font-weight: bold;
  margin-bottom: 8px;
`;

const Descripcion = styled.p`
  font-size: 0.9rem;
  color: #333;
  margin-bottom: 10px;
`;

const Fecha = styled.p`
  font-size: 0.8rem;
  color: #666;
`;

const Categoria = styled.span`
  font-weight: bold;
  color: ${(props) => (props.categoria === "Articulo" ? "#008f39" : "#ff6600")};
`;

const NoResults = styled.p`
  font-size: 1rem;
  color: #777;
  margin-top: 20px;
`;

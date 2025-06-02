import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import api from "../../utils/api";

const NoticiasSection = () => {
  const [noticias, setNoticias] = useState([]);

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
    <SectionContainer>
      <TitleContainer>
        <SectionTitle>Noticias</SectionTitle>
        <Underline />
      </TitleContainer>
      <NoticiasGrid>
        {noticias.map((noticia) => (
          <NoticiaCard
            key={noticia.id_noticia}
            to={`/noticias/anuncios/${noticia.slug}`}
          >
            <Titulo>{noticia.titulo_noticia}</Titulo>
            <Descripcion>
              {noticia.contenido
                .replace(/<\/?[^>]+(>|$)/g, "")
                .substring(0, 100)}
              ...
            </Descripcion>
            <Fecha>
              {formatearFecha(noticia.fecha_publicacion_noticia)} |{" "}
              <Categoria tipo={noticia.categoria}>
                {noticia.categoria}
              </Categoria>
            </Fecha>
          </NoticiaCard>
        ))}
      </NoticiasGrid>
    </SectionContainer>
  );
};

export default NoticiasSection;

// 📌 Estilos
const SectionContainer = styled.section`
  max-width: 1200px;
  margin: 50px auto;
  padding: 40px 20px;
  background-color: #ffffff;
  text-align: center;
`;

const TitleContainer = styled.div`
  text-align: center;
  margin-bottom: 30px;
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

const Underline = styled.div`
  width: 100px;
  height: 3px;
  background-color: #ff6600;
  margin: 5px auto 20px;

  @media (max-width: 768px) {
    width: 50px;
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
  transition: transform 0.2s;
  text-decoration: none;
  color: inherit;

  &:hover {
    transform: translateY(-5px);
  }
`;

const Titulo = styled.h3`
  font-size: 1rem;
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
  color: ${(props) => (props.tipo === "Articulo" ? "#008f39" : "#ff6600")};
`;

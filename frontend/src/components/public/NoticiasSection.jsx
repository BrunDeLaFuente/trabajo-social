import { Link } from "react-router-dom";
import styled from "styled-components";

const noticias = [
  {
    titulo: "FIRMA DEL ACUERDO DE COOPERACIÓN INTERINSTITUCIONAL",
    descripcion:
      "Licenciatura de Trabajo Social de la Facultad de Humanidades y Ciencias de la Educación de la UMSS y ProgettoMondo MLAL.",
    fecha: "Ago 16, 2023",
    categoria: "Noticias",
    slug: "firma-del-acuerdo-de-cooperacion",
  },
  {
    titulo:
      "TALLER DE SISTEMATIZACIÓN DE EXPERIENCIAS FORMATIVAS Y DE INTERVENCIÓN EN TRABAJO SOCIAL",
    descripcion: "Dirigido a estudiantes de Trabajo Social.",
    fecha: "Ago 2, 2023",
    categoria: "Eventos",
    slug: "taller-de-sistematizacion",
  },
];

const NoticiasSection = () => {
  return (
    <SectionContainer>
      <TitleContainer>
        <SectionTitle>Noticias</SectionTitle>
        <Underline />
      </TitleContainer>
      <NoticiasGrid>
        {noticias.map((noticia, index) => (
          <NoticiaCard key={index} to={`/noticias/${noticia.slug}`}>
            <Titulo>{noticia.titulo}</Titulo>
            {noticia.descripcion && <Descripcion>{noticia.descripcion}</Descripcion>}
            <Fecha>
              {noticia.fecha} | <Categoria>{noticia.categoria}</Categoria>
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
  color: #ff6600;
`;

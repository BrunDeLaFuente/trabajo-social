import { useParams } from "react-router-dom";
import styled from "styled-components";

const noticias = [
  {
    titulo: "FIRMA DEL ACUERDO DE COOPERACIÓN INTERINSTITUCIONAL",
    descripcion:
      "Detalles completos de la noticia con imágenes y contenido extendido.",
    fecha: "Ago 16, 2023",
    categoria: "Noticias",
    slug: "firma-del-acuerdo-de-cooperacion",
    imagen: "/ruta-a-la-imagen.jpg",
    contenido:
      "Aquí puedes agregar más información, imágenes, documentos adjuntos, etc.",
  },
  {
    titulo: "TALLER DE SISTEMATIZACIÓN DE EXPERIENCIAS FORMATIVAS",
    descripcion: "Detalles completos del taller.",
    fecha: "Ago 2, 2023",
    categoria: "Eventos",
    slug: "taller-de-sistematizacion",
    imagen: "/ruta-a-la-imagen2.jpg",
    contenido:
      "Más información sobre el taller, qué se discutió, fotos, materiales adicionales.",
  },
];

const NoticiaDetalle = () => {
  const { slug } = useParams();
  const noticia = noticias.find((noticia) => noticia.slug === slug);

  if (!noticia) {
    return <h2>Noticia no encontrada</h2>;
  }

  return (
    <Container>
      <Imagen src={noticia.imagen} alt={noticia.titulo} />
      <Titulo>{noticia.titulo}</Titulo>
      <Fecha>
        {noticia.fecha} | <Categoria>{noticia.categoria}</Categoria>
      </Fecha>
      <Contenido>{noticia.contenido}</Contenido>
    </Container>
  );
};

export default NoticiaDetalle;

// 📌 Estilos
const Container = styled.div`
  max-width: 800px;
  margin: 50px auto;
  padding: 20px;
  background: #ffffff;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
`;

const Imagen = styled.img`
  width: 100%;
  border-radius: 8px;
`;

const Titulo = styled.h1`
  font-size: 1.8rem;
  color: #003366;
  margin: 20px 0;
`;

const Fecha = styled.p`
  font-size: 0.9rem;
  color: #666;
`;

const Categoria = styled.span`
  font-weight: bold;
  color: #ff6600;
`;

const Contenido = styled.p`
  font-size: 1rem;
  color: #333;
  margin-top: 20px;
`;

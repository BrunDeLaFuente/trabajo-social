import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styled, { keyframes, css } from "styled-components";
import {
  Calendar,
  User,
  FileText,
  Download,
  ImageIcon,
  VideoIcon,
  File,
  AlertCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import api from "../../utils/api";

const NoticiaDetalle = () => {
  const { slug } = useParams();
  const [noticia, setNoticia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Agregar estos estados al inicio del componente, después de los estados existentes
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageHovered, setIsImageHovered] = useState(false);

  useEffect(() => {
    const fetchNoticia = async () => {
      try {
        setLoading(true);
        console.log("Slug recibido:", slug);

        const response = await api.get(`/noticias/${slug}`);
        console.log("Noticia cargada:", response.data);

        setNoticia(response.data);
      } catch (err) {
        console.error("Error al cargar noticia:", err);
        if (err.response && err.response.status === 404) {
          setError("Noticia no encontrada");
        } else {
          setError("Error al cargar la noticia");
        }
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchNoticia();
    }
  }, [slug]);

  // Agregar este useEffect después del useEffect existente para manejar el autoplay del carrusel
  useEffect(() => {
    if (
      !noticia ||
      !noticia.imagenes ||
      noticia.imagenes.length <= 1 ||
      noticia.categoria !== "Articulo"
    )
      return;

    const interval = setInterval(() => {
      if (!isImageHovered) {
        setCurrentImageIndex((prevIndex) =>
          prevIndex === noticia.imagenes.length - 1 ? 0 : prevIndex + 1
        );
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [noticia, isImageHovered]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDownload = async (item, filename, type, index = 1) => {
    try {
      // Determinar el ID según el tipo
      let id;
      switch (type) {
        case "imagen":
          id = item.id_noticia_imagen;
          break;
        case "video":
          id = item.id_noticia_video;
          break;
        case "archivo":
          id = item.id_noticia_archivo;
          break;
        default:
          console.error("Tipo de archivo no válido:", type);
          return;
      }

      // Hacer la llamada API para obtener el archivo
      const response = await api.get(`/noticias/${type}/${id}/descargar`, {
        responseType: "blob", // Importante para manejar archivos binarios
      });

      // Crear un blob URL temporal para la descarga
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);

      // Crear el enlace de descarga
      const link = document.createElement("a");
      link.href = url;

      // Obtener la extensión del archivo original
      const originalExtension = filename
        ? filename.split(".").pop().toLowerCase()
        : "";

      // Crear el nuevo nombre usando el slug de la noticia
      let newFilename;
      if (type === "imagen") {
        newFilename = `${noticia.slug}-imagen-${index}.${
          originalExtension || "jpg"
        }`;
      } else if (type === "video") {
        newFilename = `${noticia.slug}-video-${index}.${
          originalExtension || "mp4"
        }`;
      } else {
        newFilename = `${noticia.slug}-archivo-${index}.${
          originalExtension || "pdf"
        }`;
      }

      link.download = newFilename;
      link.target = "_blank";

      // Ejecutar la descarga
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Limpiar el blob URL temporal
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al descargar el archivo:", error);
      // Aquí podrías mostrar un mensaje de error al usuario
      alert("Error al descargar el archivo. Por favor, inténtalo de nuevo.");
    }
  };

  const getFileIcon = (filename) => {
    const extension = filename.split(".").pop().toLowerCase();
    switch (extension) {
      case "pdf":
        return <FileText style={{ color: "#dc2626" }} />;
      case "doc":
      case "docx":
        return <File style={{ color: "#2563eb" }} />;
      default:
        return <File style={{ color: "#6b7280" }} />;
    }
  };

  const getNameExtension = (filename) => {
    return `${noticia.slug}.${filename.split(".").pop().toLowerCase()}`;
  };

  const canPreviewFile = (filename) => {
    const extension = filename.split(".").pop().toLowerCase();
    return ["pdf"].includes(extension);
  };

  // Agregar estas funciones después de las funciones existentes
  const nextImage = () => {
    if (!noticia.imagenes) return;
    setCurrentImageIndex((prevIndex) =>
      prevIndex === noticia.imagenes.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    if (!noticia.imagenes) return;
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? noticia.imagenes.length - 1 : prevIndex - 1
    );
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  if (loading) {
    return (
      <LoadingContainer>
        <LoadingContent>
          <Spinner />
          <LoadingText>Cargando noticia...</LoadingText>
        </LoadingContent>
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <ErrorContainer>
        <ErrorContent>
          <AlertCircle
            size={64}
            color="#dc2626"
            style={{ margin: "0 auto 1rem" }}
          />
          <ErrorTitle>Noticia no encontrada</ErrorTitle>
          <ErrorText>
            La noticia que buscas no existe o ha sido eliminada.
          </ErrorText>
        </ErrorContent>
      </ErrorContainer>
    );
  }

  if (!noticia) return null;

  const isArticle = noticia.categoria === "Articulo";

  return (
    <Container>
      <MainContainer>
        {/* Header con información de la noticia */}
        <Header>
          <HeaderContent>
            <TitleContainer>
              <Title $isArticle={isArticle}>{noticia.titulo_noticia}</Title>
            </TitleContainer>

            {/* Información lateral */}
            <InfoSidebar>
              <InfoCard>
                <InfoItem>
                  <InfoIcon>
                    <Calendar style={{ color: "#2563eb" }} />
                  </InfoIcon>
                  <span>{formatDate(noticia.fecha_publicacion_noticia)}</span>
                </InfoItem>

                {isArticle && (
                  <InfoItem>
                    <InfoIcon>
                      <User style={{ color: "#059669" }} />
                    </InfoIcon>
                    <span>{noticia.autor}</span>
                  </InfoItem>
                )}

                <CategoryBadge>
                  <Badge $isArticle={isArticle}>{noticia.categoria}</Badge>
                </CategoryBadge>
              </InfoCard>
            </InfoSidebar>
          </HeaderContent>
        </Header>

        {/* Contenido principal */}
        <MainContent>
          <ContentContainer>
            {/* Contenido HTML */}
            <ContentHTML
              dangerouslySetInnerHTML={{ __html: noticia.contenido }}
            />

            {/* Renderizado según categoría */}
            {isArticle ? (
              // Layout para Artículos
              <div>
                {/* Imágenes en carrusel para artículos */}
                {noticia.imagenes && noticia.imagenes.length > 0 && (
                  <MediaSection>
                    <SectionTitle>
                      <ImageIcon style={{ color: "#2563eb" }} />
                      Imágenes ({noticia.imagenes.length})
                    </SectionTitle>

                    <CarouselContainer
                      onMouseEnter={() => setIsImageHovered(true)}
                      onMouseLeave={() => setIsImageHovered(false)}
                    >
                      <CarouselWrapper>
                        <CarouselTrack
                          style={{
                            transform: `translateX(-${
                              currentImageIndex * 100
                            }%)`,
                          }}
                        >
                          {noticia.imagenes.map((imagen, index) => (
                            <CarouselSlide key={imagen.id_noticia_imagen}>
                              <CarouselImage
                                src={imagen.url || "/placeholder.svg"}
                                alt={`Imagen ${index + 1} del artículo`}
                                onLoad={(e) => {
                                  // Ajustar altura del contenedor basado en la imagen
                                  const img = e.target;
                                  const container = img.closest(
                                    "[data-carousel-container]"
                                  );
                                  if (container) {
                                    container.style.height = `${Math.min(
                                      img.naturalHeight *
                                        (img.offsetWidth / img.naturalWidth),
                                      500
                                    )}px`;
                                  }
                                }}
                              />
                            </CarouselSlide>
                          ))}
                        </CarouselTrack>

                        {/* Controles de navegación */}
                        {noticia.imagenes.length > 1 && (
                          <>
                            <CarouselButton
                              $position="left"
                              onClick={prevImage}
                            >
                              <ChevronLeft size={24} />
                            </CarouselButton>
                            <CarouselButton
                              $position="right"
                              onClick={nextImage}
                            >
                              <ChevronRight size={24} />
                            </CarouselButton>
                          </>
                        )}

                        {/* Indicadores */}
                        {noticia.imagenes.length > 1 && (
                          <CarouselIndicators>
                            {noticia.imagenes.map((_, index) => (
                              <CarouselDot
                                key={index}
                                $active={index === currentImageIndex}
                                onClick={() => goToImage(index)}
                              />
                            ))}
                          </CarouselIndicators>
                        )}

                        {/* Contador de imágenes */}
                        {noticia.imagenes.length > 1 && (
                          <ImageCounter>
                            {currentImageIndex + 1} / {noticia.imagenes.length}
                          </ImageCounter>
                        )}
                      </CarouselWrapper>
                    </CarouselContainer>
                  </MediaSection>
                )}

                {/* Videos en grid de 3 columnas */}
                {noticia.videos && noticia.videos.length > 0 && (
                  <MediaSection>
                    <SectionTitle>
                      <VideoIcon style={{ color: "#dc2626" }} />
                      Videos
                    </SectionTitle>
                    <VideoGrid $isArticle={true}>
                      {noticia.videos.map((video, index) => (
                        <VideoContainer key={video.id_noticia_video}>
                          <StyledVideo
                            src={video.url}
                            controls
                            preload="metadata"
                            $isArticle={true}
                          >
                            Tu navegador no soporta el elemento de video.
                          </StyledVideo>
                        </VideoContainer>
                      ))}
                    </VideoGrid>
                  </MediaSection>
                )}
              </div>
            ) : (
              // Layout para Comunicados
              <div>
                {/* Archivos con vista previa */}
                {noticia.archivos && noticia.archivos.length > 0 && (
                  <FileSection>
                    <SectionTitle>
                      <FileText style={{ color: "#7c3aed" }} />
                      Documentos
                    </SectionTitle>
                    <FileList>
                      {noticia.archivos.map((archivo, index) => {
                        const filename = archivo.ruta_archivo.split("/").pop();
                        const canPreview = canPreviewFile(filename);

                        return (
                          <FileItem key={archivo.id_noticia_archivo}>
                            <FileHeader>
                              <FileInfo>
                                {getFileIcon(filename)}
                                <FileName>
                                  {getNameExtension(filename)}
                                </FileName>
                              </FileInfo>
                              <FileDownloadButton
                                onClick={() =>
                                  handleDownload(
                                    archivo,
                                    filename,
                                    "archivo",
                                    index + 1
                                  )
                                }
                              >
                                <Download />
                                Descargar
                              </FileDownloadButton>
                            </FileHeader>

                            {canPreview && (
                              <FilePreview>
                                <iframe
                                  src={archivo.url}
                                  title={`Documento ${index + 1}`}
                                />
                              </FilePreview>
                            )}
                          </FileItem>
                        );
                      })}
                    </FileList>
                  </FileSection>
                )}

                {/* Imágenes grandes, una debajo de otra */}
                {noticia.imagenes && noticia.imagenes.length > 0 && (
                  <MediaSection>
                    <SectionTitle>
                      <ImageIcon style={{ color: "#2563eb" }} />
                      Imágenes
                    </SectionTitle>
                    <ImageGrid $isArticle={false}>
                      {noticia.imagenes.map((imagen, index) => (
                        <ImageContainer
                          key={imagen.id_noticia_imagen}
                          $isArticle={false}
                        >
                          <Image
                            src={imagen.url || "/placeholder.svg"}
                            alt={`Imagen ${index + 1} del comunicado`}
                            $isArticle={false}
                          />
                          <DownloadButton
                            onClick={() =>
                              handleDownload(
                                imagen,
                                `imagen-${index + 1}.jpg`,
                                "imagen",
                                index + 1
                              )
                            }
                          >
                            <Download />
                          </DownloadButton>
                        </ImageContainer>
                      ))}
                    </ImageGrid>
                  </MediaSection>
                )}

                {/* Videos grandes, uno debajo de otro */}
                {noticia.videos && noticia.videos.length > 0 && (
                  <MediaSection>
                    <SectionTitle>
                      <VideoIcon style={{ color: "#dc2626" }} />
                      Videos
                    </SectionTitle>
                    <VideoGrid $isArticle={false}>
                      {noticia.videos.map((video, index) => (
                        <VideoContainer key={video.id_noticia_video}>
                          <StyledVideo
                            src={video.url}
                            controls
                            preload="metadata"
                            $isArticle={false}
                          >
                            Tu navegador no soporta el elemento de video.
                          </StyledVideo>
                          <DownloadButton
                            onClick={() =>
                              handleDownload(
                                video,
                                `video-${index + 1}.mp4`,
                                "video",
                                index + 1
                              )
                            }
                          >
                            <Download />
                          </DownloadButton>
                        </VideoContainer>
                      ))}
                    </VideoGrid>
                  </MediaSection>
                )}
              </div>
            )}
          </ContentContainer>
        </MainContent>

        {/* Footer con información adicional */}
        <Footer>
          <FooterContent>
            <Clock />
            Publicado el {formatDate(noticia.fecha_publicacion_noticia)}
          </FooterContent>
        </Footer>
      </MainContainer>
    </Container>
  );
};

export default NoticiaDetalle;

// Animaciones
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideDown = keyframes`
  from { 
    opacity: 0; 
    transform: translateY(-20px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
`;

const slideUp = keyframes`
  from { 
    opacity: 0; 
    transform: translateY(20px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
`;

// Styled Components
const Container = styled.div`
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
`;

const MainContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;

  @media (max-width: 768px) {
    padding: 1rem 0.5rem;
  }
`;

const LoadingContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LoadingContent = styled.div`
  text-align: center;
`;

const Spinner = styled.div`
  width: 4rem;
  height: 4rem;
  border: 2px solid transparent;
  border-bottom: 2px solid #2563eb;
  border-radius: 50%;
  margin: 0 auto 1rem;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.p`
  color: #6b7280;
  font-size: 1.125rem;
`;

const ErrorContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ErrorContent = styled.div`
  text-align: center;
  animation: ${fadeIn} 0.6s ease-out;
`;

const ErrorTitle = styled.h1`
  font-size: 1.875rem;
  font-weight: bold;
  color: #dc2626;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const ErrorText = styled.p`
  color: #6b7280;
`;

const Header = styled.div`
  margin-bottom: 2rem;
  animation: ${slideDown} 0.8s ease-out;
`;

const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;

  @media (min-width: 1024px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const TitleContainer = styled.div`
  flex: 1;
`;

const Title = styled.h1`
  font-weight: bold;
  color: #003366;
  margin-bottom: 1rem;
  line-height: 1.2;

  ${(props) =>
    props.$isArticle
      ? css`
          font-size: 2rem;
          text-align: center;

          @media (min-width: 1024px) {
            font-size: 2.5rem;
          }
        `
      : css`
          font-size: 1.5rem;

          @media (min-width: 1024px) {
            font-size: 1.875rem;
          }
        `}

  @media (max-width: 768px) {
    font-size: 1.25rem;
    text-align: center; /* Centrar título en dispositivos móviles */
  }
`;

const InfoSidebar = styled.div`
  margin-top: 1rem;

  @media (min-width: 1024px) {
    margin-left: 2rem;
    margin-top: 0;
    flex-shrink: 0;
  }
`;

const InfoCard = styled.div`
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  color: #6b7280;
  font-size: 0.875rem;
`;

const InfoIcon = styled.div`
  margin-right: 0.5rem;

  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`;

const CategoryBadge = styled.div`
  display: flex;
  align-items: center;
`;

const Badge = styled.div`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;

  ${(props) =>
    props.$isArticle
      ? css`
          background-color: rgb(167, 240, 185);
          color: #008f39;
        `
      : css`
          background-color: #fed7aa;
          color: #c2410c;
        `}
`;

const MainContent = styled.div`
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  animation: ${fadeIn} 0.6s ease-out;
`;

const ContentContainer = styled.div`
  padding: 1.5rem;

  @media (min-width: 1024px) {
    padding: 2rem;
  }
`;

const ContentHTML = styled.div`
  margin-bottom: 2rem;
  color: #374151;
  line-height: 1.75;
  font-size: 1.125rem;

  @media (max-width: 768px) {
    font-size: 1rem;
  }

  img {
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    max-width: 100%;
    height: auto;
  }

  p {
    margin-bottom: 1rem;
  }

  strong,
  b {
    font-weight: 600;
  }
`;

const MediaSection = styled.div`
  margin-bottom: 2rem;
  animation: ${slideUp} 0.6s ease-out;
`;

const SectionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;

  svg {
    width: 1.5rem;
    height: 1.5rem;
    margin-right: 0.5rem;
  }
`;

const ImageGrid = styled.div`
  display: grid;
  gap: 1rem;

  ${(props) =>
    props.$isArticle
      ? css`
          grid-template-columns: 1fr;

          @media (min-width: 768px) {
            grid-template-columns: repeat(2, 1fr);
          }

          @media (min-width: 1024px) {
            grid-template-columns: repeat(3, 1fr);
          }
        `
      : css`
          grid-template-columns: 1fr;
          gap: 1.5rem;
        `}
`;

const ImageContainer = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    transform: ${(props) => (props.$isArticle ? "scale(1.05)" : "scale(1.02)")};
  }

  /* Hacer que el contenedor de imágenes para comunicados sea más pequeño */
  ${(props) =>
    !props.$isArticle &&
    css`
      min-height: 250px; /* Cambiado de 400px a 250px para hacerlo más pequeño */
      display: flex;
      align-items: center;
      justify-content: center;
    `}
`;

const Image = styled.img`
  width: 100%;
  object-fit: ${(props) => (props.$isArticle ? "cover" : "contain")};
  height: ${(props) => (props.$isArticle ? "12rem" : "auto")};
  max-height: ${(props) =>
    props.$isArticle
      ? "12rem"
      : "none"}; /* Quitar límite de altura para comunicados */
  background-color: #f3f4f6;
  transition: transform 0.3s ease;

  ${ImageContainer}:hover & {
    transform: ${(props) => (props.$isArticle ? "scale(1.1)" : "none")};
  }
`;

const DownloadButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 0.5rem;
  border-radius: 50%;
  border: none;
  opacity: 0;
  transition: all 0.2s ease;
  cursor: pointer;

  ${ImageContainer}:hover & {
    opacity: 1;
  }

  &:hover {
    background: rgba(0, 0, 0, 0.7);
  }

  svg {
    width: 1rem;
    height: 1rem;
  }
`;

const VideoGrid = styled.div`
  display: grid;
  gap: 1rem;

  ${(props) =>
    props.$isArticle
      ? css`
          grid-template-columns: 1fr;

          @media (min-width: 768px) {
            grid-template-columns: repeat(2, 1fr);
          }

          @media (min-width: 1024px) {
            grid-template-columns: repeat(3, 1fr);
          }
        `
      : css`
          grid-template-columns: 1fr;
          gap: 1.5rem;
        `}
`;

const VideoContainer = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  }
`;

const StyledVideo = styled.video`
  width: 100%;
  height: ${(props) => (props.$isArticle ? "12rem" : "auto")};
  max-height: ${(props) => (props.$isArticle ? "12rem" : "24rem")};
  object-fit: contain;
  background-color: #f3f4f6;
  border-radius: 0.5rem;
`;

const FileSection = styled.div`
  margin-bottom: 2rem;
  animation: ${slideUp} 0.6s ease-out;
`;

const FileList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FileItem = styled.div`
  background-color: #f9fafb;
  border-radius: 0.5rem;
  padding: 1rem;
  border: 1px solid #e5e7eb;
`;

const FileHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const FileInfo = styled.div`
  display: flex;
  align-items: center;

  svg {
    width: 1.25rem;
    height: 1.25rem;
    margin-right: 0.5rem;
  }
`;

const FileName = styled.span`
  font-weight: 500;
  color: #374151;
  word-break: break-all;
`;

const FileDownloadButton = styled.button`
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: #2563eb;
  color: white;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-size: 0.875rem;

  &:hover {
    background-color: #1d4ed8;
  }

  svg {
    width: 1rem;
    height: 1rem;
    margin-right: 0.5rem;
  }
`;

const FilePreview = styled.div`
  width: 100%;
  height: 50rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  overflow: hidden;

  iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
`;

const Footer = styled.div`
  margin-top: 2rem;
  text-align: center;
  animation: ${fadeIn} 0.6s ease-out;
`;

const FooterContent = styled.div`
  display: inline-flex;
  align-items: center;
  color: #6b7280;
  font-size: 0.875rem;

  svg {
    width: 1rem;
    height: 1rem;
    margin-right: 0.5rem;
  }
`;

// Agregar estos styled components después de los existentes

const CarouselContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  background: #f8fafc;
`;

const CarouselWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 400px;

  @media (max-width: 768px) {
    height: 300px;
  }

  @media (max-width: 480px) {
    height: 250px;
  }
`;

const CarouselTrack = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
`;

const CarouselSlide = styled.div`
  flex: 0 0 100%;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CarouselImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
  border-radius: 0.5rem;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.02);
  }
`;

const CarouselButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${(props) => props.$position}: 1rem;

  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  border: none;
  border-radius: 50%;
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 2;

  color: #374151;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);

  &:hover {
    background: rgba(255, 255, 255, 1);
    transform: translateY(-50%) scale(1.1);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(-50%) scale(0.95);
  }

  @media (max-width: 768px) {
    width: 2.5rem;
    height: 2.5rem;
    ${(props) => props.$position}: 0.5rem;

    svg {
      width: 20px;
      height: 20px;
    }
  }
`;

const CarouselIndicators = styled.div`
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.5rem;
  z-index: 2;
`;

const CarouselDot = styled.button`
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;

  background: ${(props) =>
    props.$active ? "#2563eb" : "rgba(255, 255, 255, 0.6)"};
  transform: ${(props) => (props.$active ? "scale(1.2)" : "scale(1)")};

  &:hover {
    background: ${(props) =>
      props.$active ? "#1d4ed8" : "rgba(255, 255, 255, 0.8)"};
    transform: scale(1.2);
  }

  @media (max-width: 768px) {
    width: 0.625rem;
    height: 0.625rem;
  }
`;

const ImageCounter = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  backdrop-filter: blur(8px);
  z-index: 2;

  @media (max-width: 768px) {
    top: 0.5rem;
    right: 0.5rem;
    padding: 0.375rem 0.75rem;
    font-size: 0.75rem;
  }
`;

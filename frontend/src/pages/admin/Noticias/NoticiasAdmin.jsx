import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import {
  Search,
  Plus,
  Eye,
  Trash,
  X,
  Newspaper,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Calendar,
  Globe,
  GlobeLock,
  Tag,
} from "lucide-react";
import api from "../../../utils/api";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";
import CajaMensaje from "../../../components/utils/CajaMensaje";

export default function NoticiasAdmin() {
  const navigate = useNavigate();
  const [noticias, setNoticias] = useState([]);
  const [filteredNoticias, setFilteredNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedNoticia, setSelectedNoticia] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mensajes, setMensajes] = useState([]);
  const itemsPerPage = 10;

  // Función para agregar mensajes
  const agregarMensaje = (
    tipo,
    color,
    mensaje,
    duracion = 5000,
    backgroundColor = ""
  ) => {
    const id = Date.now();
    setMensajes((prev) => [
      ...prev,
      { id, tipo, color, mensaje, duracion, backgroundColor },
    ]);
  };

  // Función para eliminar mensajes
  const eliminarMensaje = (id) => {
    setMensajes((prev) => prev.filter((m) => m.id !== id));
  };

  // Cargar datos de noticias
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get("/noticiasAdmin");
        setNoticias(response.data);
        setFilteredNoticias(response.data);
        setTotalPages(Math.ceil(response.data.length / itemsPerPage));
      } catch (error) {
        console.error("Error al cargar los datos:", error);
        agregarMensaje("fail", "#D32F2F", "Error al cargar las noticias.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtrar noticias cuando cambian los filtros
  useEffect(() => {
    let filtered = [...noticias];

    // Filtrar por término de búsqueda (solo título)
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((noticia) =>
        noticia.titulo_noticia.toLowerCase().includes(term)
      );
    }

    // Filtrar por categoría
    if (categoryFilter) {
      filtered = filtered.filter(
        (noticia) => noticia.categoria === categoryFilter
      );
    }

    // Filtrar por fecha
    if (dateFilter) {
      filtered = filtered.filter((noticia) => {
        // Extraer solo la fecha (YYYY-MM-DD) sin considerar la hora ni zona horaria
        const fechaNoticia = noticia.fecha_publicacion_noticia.split(" ")[0]; // "2025-05-29"
        return fechaNoticia === dateFilter;
      });
    }

    setFilteredNoticias(filtered);
    setCurrentPage(1);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
  }, [searchTerm, categoryFilter, dateFilter, noticias]);

  // Obtener noticias para la página actual
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredNoticias.slice(startIndex, endIndex);
  };

  // Manejar cambio de página
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Abrir modal de eliminación
  const openDeleteModal = (noticia) => {
    setSelectedNoticia(noticia);
    setIsDeleteModalOpen(true);
  };

  // Cerrar modal de eliminación
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedNoticia(null);
  };

  // Eliminar noticia
  const handleDelete = async () => {
    if (!selectedNoticia) return;

    try {
      setIsSubmitting(true);
      await api.delete(`/noticiasEliminar/${selectedNoticia.id_noticia}`);

      // Actualizar lista de noticias
      setNoticias(
        noticias.filter((n) => n.id_noticia !== selectedNoticia.id_noticia)
      );
      agregarMensaje("success", "#2E7D32", "Noticia eliminada correctamente.");
      closeDeleteModal();
    } catch (error) {
      console.error("Error al eliminar:", error);
      agregarMensaje("fail", "#D32F2F", "Error al eliminar la noticia.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Navegar a agregar noticia
  const handleAddComunicado = () => {
    navigate("/admin/noticias/agregar");
  };

  // Navegar a ver detalles
  const handleViewDetails = (id) => {
    navigate(`/admin/noticias/editar/${id}`);
  };

  if (loading) {
    return <LoadingSpinner message="Cargando noticias..." />;
  }

  return (
    <Container>
      {/* Mensajes */}
      {mensajes.map((mensaje) => (
        <CajaMensaje
          key={mensaje.id}
          tipo={mensaje.tipo}
          color={mensaje.color}
          mensaje={mensaje.mensaje}
          duracion={mensaje.duracion}
          backgroundColor={mensaje.backgroundColor}
          onClose={() => eliminarMensaje(mensaje.id)}
        />
      ))}

      <Title>
        <Newspaper size={24} /> Noticias
      </Title>

      <TopControls>
        <FiltersContainer>
          <SearchContainer>
            <SearchInput
              type="text"
              placeholder="Buscar por título..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <SearchIcon>
              <Search size={16} />
            </SearchIcon>
          </SearchContainer>

          <CategoryFilter
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            <option value="Articulo">Artículo</option>
            <option value="Comunicado">Comunicado</option>
          </CategoryFilter>

          <DateFilter
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            title="Filtrar por fecha de publicación"
          />
        </FiltersContainer>

        <AddButton onClick={handleAddComunicado}>
          <Plus size={16} /> Agregar noticia
        </AddButton>
      </TopControls>

      {/* Vista de escritorio */}
      <DesktopView>
        <TableContainer>
          <Table>
            <TableHeader>
              <TableHeaderCell>
                <Newspaper size={16} /> Título
              </TableHeaderCell>
              <TableHeaderCell>
                <Calendar size={16} /> Fecha
              </TableHeaderCell>
              <TableHeaderCell>
                <Tag size={16} /> Categoría
              </TableHeaderCell>
              <TableHeaderCell>
                <Globe size={16} /> Estado
              </TableHeaderCell>
              <TableHeaderCell>Acciones</TableHeaderCell>
            </TableHeader>

            <TableBody>
              {getCurrentPageItems().length > 0 ? (
                getCurrentPageItems().map((noticia) => (
                  <TableRow key={noticia.id_noticia}>
                    <TitleCell>{noticia.titulo_noticia}</TitleCell>
                    <TableCell>
                      {formatDate(noticia.fecha_publicacion_noticia)}
                    </TableCell>
                    <TableCell>
                      <CategoryBadge categoria={noticia.categoria}>
                        {noticia.categoria}
                      </CategoryBadge>
                    </TableCell>
                    <TableCell>
                      <StatusBadge isPublic={noticia.es_publico === 1}>
                        {noticia.es_publico === 1 ? (
                          <Globe size={12} />
                        ) : (
                          <GlobeLock size={12} />
                        )}
                        {noticia.es_publico === 1 ? "Público" : "Privado"}
                      </StatusBadge>
                    </TableCell>
                    <TableCell>
                      <ActionButtons>
                        <ViewButton
                          onClick={() => handleViewDetails(noticia.id_noticia)}
                          title="Ver detalles"
                        >
                          <Eye size={16} />
                        </ViewButton>
                        <DeleteButton
                          onClick={() => openDeleteModal(noticia)}
                          title="Eliminar"
                        >
                          <Trash size={16} />
                        </DeleteButton>
                      </ActionButtons>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <NoResults>No se encontraron noticias</NoResults>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </DesktopView>

      {/* Vista móvil */}
      <MobileView>
        {getCurrentPageItems().length > 0 ? (
          getCurrentPageItems().map((noticia) => (
            <MobileCard key={noticia.id_noticia}>
              <MobileCardHeader>
                <MobileCardTitle>{noticia.titulo_noticia}</MobileCardTitle>
                <StatusBadge isPublic={noticia.es_publico === 1}>
                  {noticia.es_publico === 1 ? (
                    <Globe size={12} />
                  ) : (
                    <GlobeLock size={12} />
                  )}
                  {noticia.es_publico === 1 ? "Público" : "Privado"}
                </StatusBadge>
              </MobileCardHeader>
              <MobileCardContent>
                <MobileCardItem>
                  <Calendar size={16} />
                  {formatDate(noticia.fecha_publicacion_noticia)}
                </MobileCardItem>
                <MobileCardItem>
                  <Tag size={16} />
                  <CategoryBadge categoria={noticia.categoria}>
                    {noticia.categoria}
                  </CategoryBadge>
                </MobileCardItem>
              </MobileCardContent>
              <MobileCardActions>
                <ViewButton
                  onClick={() => handleViewDetails(noticia.id_noticia)}
                  title="Ver detalles"
                >
                  <Eye size={16} />
                </ViewButton>
                <DeleteButton
                  onClick={() => openDeleteModal(noticia)}
                  title="Eliminar"
                >
                  <Trash size={16} />
                </DeleteButton>
              </MobileCardActions>
            </MobileCard>
          ))
        ) : (
          <NoResults>No se encontraron noticias</NoResults>
        )}
      </MobileView>

      {/* Paginación */}
      {totalPages > 1 && (
        <Pagination>
          <PageButton
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={16} />
          </PageButton>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <PageButton
              key={page}
              active={page === currentPage}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </PageButton>
          ))}

          <PageButton
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight size={16} />
          </PageButton>
        </Pagination>
      )}

      {/* Modal de confirmación para eliminar */}
      {isDeleteModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Confirmar eliminación</ModalTitle>
              <ModalCloseButton onClick={closeDeleteModal}>
                <X size={20} />
              </ModalCloseButton>
            </ModalHeader>
            <ModalBody>
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle size={24} className="text-red-500" />
                <p>
                  ¿Está seguro que desea eliminar la noticia{" "}
                  <strong>{selectedNoticia?.titulo_noticia}</strong>?
                </p>
              </div>
              <p className="text-gray-500 text-sm">
                Esta acción no se puede deshacer y eliminará todas las imágenes,
                videos y archivos asociados.
              </p>
            </ModalBody>
            <ModalFooter>
              <CancelButton onClick={closeDeleteModal}>
                <X size={16} /> Cancelar
              </CancelButton>
              <ConfirmButton onClick={handleDelete} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <SpinIcon>⟳</SpinIcon> Eliminando...
                  </>
                ) : (
                  <>
                    <Trash size={16} /> Eliminar
                  </>
                )}
              </ConfirmButton>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
}

// Animaciones
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideUp = keyframes`
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

// Styled Components
const Container2 = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem 1rem;

  @media (max-width: 768px) {
    padding: 1rem 0.5rem;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  animation: ${fadeIn} 0.6s ease-out;
  overflow-x: hidden;

  @media (max-width: 768px) {
    padding: 1rem;
    width: 100%;
    border-radius: 0;
    box-shadow: none;
  }
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const TopControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 1rem;
  flex-wrap: wrap;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: 1rem;
  flex: 1;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.75rem;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  min-width: 200px;
  width: 100%;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.5rem 0.75rem 0.5rem 2.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.25);
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  pointer-events: none;
`;

const CategoryFilter = styled.select`
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.25);
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const DateFilter = styled.input`
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.25);
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  white-space: nowrap;

  &:hover {
    background-color: #2563eb;
  }

  svg {
    margin-right: 0.5rem;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  margin-bottom: 1rem;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;

  @media (max-width: 768px) {
    border-radius: 0.375rem;
    margin-left: 0;
    margin-right: 0;
    width: 100%;
    overflow-x: hidden;
  }
`;

const Table = styled.div`
  width: 100%;
  min-width: 800px;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  background-color: #f9fafb;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e5e7eb;
  font-weight: 600;
  color: #374151;
`;

const TableHeaderCell = styled.div`
  padding: 0.5rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const TableBody = styled.div`
  max-height: 600px;
  overflow-y: auto;
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e5e7eb;
  transition: background-color 0.2s;
  animation: ${slideUp} 0.3s ease-in-out;
  align-items: flex-start;
  min-height: fit-content;

  &:hover {
    background-color: #f9fafb;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.div`
  padding: 0.75rem 0.5rem;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-top: 0.75rem;
`;

const TitleCell = styled(TableCell)`
  white-space: normal;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  line-height: 1.4;
  font-weight: 500;
  color: #111827;
  min-height: fit-content;
  align-items: flex-start;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
`;

const CategoryBadge = styled.span`
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  white-space: nowrap;
  background-color: ${(props) =>
    props.categoria === "Articulo" ? "#dcfce7" : "#fed7aa"};
  color: ${(props) => (props.categoria === "Articulo" ? "#166534" : "#c2410c")};
`;

const StatusBadge = styled.span`
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  white-space: nowrap;
  background-color: ${(props) => (props.isPublic ? "#dcfce7" : "#fef2f2")};
  color: ${(props) => (props.isPublic ? "#166534" : "#dc2626")};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }

  &:focus {
    outline: none;
  }
`;

const ViewButton = styled(IconButton)`
  background-color: #3b82f6;
  color: white;

  &:hover {
    background-color: #2563eb;
  }
`;

const DeleteButton = styled(IconButton)`
  background-color: #ef4444;
  color: white;

  &:hover {
    background-color: #dc2626;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1.5rem;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const PageButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 0.375rem;
  border: 1px solid #d1d5db;
  background-color: ${(props) => (props.active ? "#3b82f6" : "white")};
  color: ${(props) => (props.active ? "white" : "#374151")};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${(props) => (props.active ? "#2563eb" : "#f9fafb")};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  animation: ${fadeIn} 0.2s ease-in-out;
  padding: 1rem;
  overflow-y: auto;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
  max-height: calc(100vh - 2rem);
  overflow-y: auto;
  animation: ${slideUp} 0.3s ease-in-out;
  display: flex;
  flex-direction: column;

  @media (max-width: 640px) {
    max-width: 100%;
    border-radius: 0.375rem;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
`;

const ModalTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
`;

const ModalCloseButton = styled.button`
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: #111827;
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
  overflow-y: auto;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid #e5e7eb;

  @media (max-width: 640px) {
    flex-direction: column-reverse;
  }
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  svg {
    margin-right: 0.5rem;
  }

  @media (max-width: 640px) {
    width: 100%;
  }
`;

const CancelButton = styled(Button)`
  background-color: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;

  &:hover:not(:disabled) {
    background-color: #e5e7eb;
  }
`;

const ConfirmButton = styled(Button)`
  background-color: #ef4444;
  color: white;
  border: none;

  &:hover:not(:disabled) {
    background-color: #dc2626;
  }
`;

const NoResults = styled.div`
  text-align: center;
  padding: 2rem;
  color: #6b7280;
  font-style: italic;
`;

const SpinIcon = styled.span`
  display: inline-block;
  animation: spin 1s linear infinite;
  margin-right: 0.5rem;

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

// Componente para pantallas móviles
const MobileCard = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1rem;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  animation: ${slideUp} 0.3s ease-in-out;
  width: 100%;
  box-sizing: border-box;
`;

const MobileCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
  gap: 0.5rem;
`;

const MobileCardTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  color: #111827;
  line-height: 1.3;
  word-break: break-word;
  flex: 1;
`;

const MobileCardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
`;

const MobileCardItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #4b5563;
`;

const MobileCardActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 0.75rem;
`;

const MobileView = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: block;
    width: 100%;
    overflow-x: hidden;
  }
`;

const DesktopView = styled.div`
  display: block;

  @media (max-width: 768px) {
    display: none;
  }
`;

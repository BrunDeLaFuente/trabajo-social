import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import {
  Calendar,
  Users,
  Edit3,
  Trash2,
  Plus,
  Search,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Monitor,
  Building,
  AlertTriangle,
} from "lucide-react";
import api from "../../../utils/api";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";
import CajaMensaje from "../../../components/utils/CajaMensaje";

const EventosAdmin = () => {
  const navigate = useNavigate();
  const [eventos, setEventos] = useState([]);
  const [filteredEventos, setFilteredEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEvento, setSelectedEvento] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mensajes, setMensajes] = useState([]);
  const itemsPerPage = 10;

  // Estados para filtros
  const [filters, setFilters] = useState({
    titulo: "",
    fecha: "",
    categoria: "",
    modalidad: "",
    estado: "",
  });

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

  useEffect(() => {
    fetchEventos();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [eventos, filters]);

  const fetchEventos = async () => {
    try {
      setLoading(true);
      const response = await api.get("/eventos");
      setEventos(response.data);
    } catch (error) {
      console.error("Error al cargar eventos:", error);
      agregarMensaje("fail", "#D32F2F", "Error al cargar los eventos.");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    const filtered = eventos.filter((evento) => {
      const matchTitulo = evento.titulo_evento
        .toLowerCase()
        .includes(filters.titulo.toLowerCase());
      const matchFecha =
        !filters.fecha || evento.fecha_evento.includes(filters.fecha);
      const matchCategoria =
        !filters.categoria ||
        (filters.categoria === "pago" && evento.es_pago === 1) ||
        (filters.categoria === "gratuito" && evento.es_pago === 0);
      const matchModalidad =
        !filters.modalidad ||
        evento.modalidad.toLowerCase() === filters.modalidad.toLowerCase();
      const matchEstado =
        !filters.estado ||
        (filters.estado === "publico" && evento.es_publico === 1) ||
        (filters.estado === "privado" && evento.es_publico === 0);

      return (
        matchTitulo &&
        matchFecha &&
        matchCategoria &&
        matchModalidad &&
        matchEstado
      );
    });

    setFilteredEventos(filtered);
    setCurrentPage(1);
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      titulo: "",
      fecha: "",
      categoria: "",
      modalidad: "",
      estado: "",
    });
  };

  const openDeleteModal = (evento) => {
    setSelectedEvento(evento);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedEvento(null);
  };

  const handleDelete = async () => {
    if (!selectedEvento) return;

    try {
      setIsSubmitting(true);
      await api.delete(`/eventosEliminar/${selectedEvento.id_evento}`);

      // Actualizar lista de eventos
      setEventos(
        eventos.filter((e) => e.id_evento !== selectedEvento.id_evento)
      );
      agregarMensaje("success", "#2E7D32", "Evento eliminado correctamente.");
      closeDeleteModal();
    } catch (error) {
      console.error("Error al eliminar evento:", error);
      agregarMensaje("fail", "#D32F2F", "Error al eliminar el evento.");
    } finally {
      setIsSubmitting(false);
    }
  };

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

  // Paginación
  const totalPages = Math.ceil(filteredEventos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEventos = filteredEventos.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return <LoadingSpinner message="Cargando eventos..." />;
  }

  return (
    <Container>
      <MaxWidthContainer>
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

        {/* Header */}
        <HeaderCard>
          <HeaderContent>
            <HeaderInfo>
              <Title>
                <Calendar size={28} />
                Gestión de Eventos
              </Title>
              <Subtitle>Administra todos los eventos de la carrera</Subtitle>
            </HeaderInfo>
            <CreateButton onClick={() => navigate("/admin/eventos/agregar")}>
              <Plus size={20} />
              Crear Evento
            </CreateButton>
          </HeaderContent>
        </HeaderCard>

        {/* Filtros */}
        <FiltersCard>
          <FiltersHeader>
            <FiltersTitle>
              <Filter size={20} />
              Filtros
            </FiltersTitle>
            <ToggleFiltersButton onClick={() => setShowFilters(!showFilters)}>
              <Filter size={16} />
              {showFilters ? "Ocultar" : "Mostrar"} Filtros
            </ToggleFiltersButton>
          </FiltersHeader>

          <FiltersGrid show={showFilters}>
            {/* Filtro por título */}
            <FilterInputContainer>
              <SearchIcon>
                <Search size={16} />
              </SearchIcon>
              <FilterInput
                type="text"
                placeholder="Buscar por título..."
                value={filters.titulo}
                onChange={(e) => handleFilterChange("titulo", e.target.value)}
                hasIcon
              />
            </FilterInputContainer>

            {/* Filtro por fecha */}
            <FilterInput
              type="date"
              value={filters.fecha}
              onChange={(e) => handleFilterChange("fecha", e.target.value)}
            />

            {/* Filtro por categoría */}
            <FilterSelect
              value={filters.categoria}
              onChange={(e) => handleFilterChange("categoria", e.target.value)}
            >
              <option value="">Todas las categorías</option>
              <option value="pago">De Pago</option>
              <option value="gratuito">Gratuito</option>
            </FilterSelect>

            {/* Filtro por modalidad */}
            <FilterSelect
              value={filters.modalidad}
              onChange={(e) => handleFilterChange("modalidad", e.target.value)}
            >
              <option value="">Todas las modalidades</option>
              <option value="virtual">Virtual</option>
              <option value="presencial">Presencial</option>
            </FilterSelect>

            {/* Filtro por estado */}
            <FilterSelect
              value={filters.estado}
              onChange={(e) => handleFilterChange("estado", e.target.value)}
            >
              <option value="">Todos los estados</option>
              <option value="publico">Público</option>
              <option value="privado">Privado</option>
            </FilterSelect>

            {/* Botón limpiar filtros */}
            <ClearButton onClick={clearFilters}>
              <X size={16} />
              Limpiar
            </ClearButton>
          </FiltersGrid>

          <ResultsCounter>
            Mostrando {filteredEventos.length} de {eventos.length} eventos
          </ResultsCounter>
        </FiltersCard>

        {/* Grid de eventos */}
        <EventsGrid>
          {currentEventos.map((evento) => (
            <EventCard key={evento.id_evento}>
              <EventImageContainer>
                {evento.imagen_evento_url ? (
                  <EventImage
                    src={evento.imagen_evento_url}
                    alt={evento.titulo_evento}
                  />
                ) : (
                  <EventImagePlaceholder>
                    <Calendar size={48} />
                  </EventImagePlaceholder>
                )}

                <BadgesContainer>
                  <Badge type={evento.es_pago === 1 ? "pago" : "gratuito"}>
                    {evento.es_pago === 1 ? "De Pago" : "Gratuito"}
                  </Badge>
                  <Badge type={evento.modalidad.toLowerCase()}>
                    {evento.modalidad}
                  </Badge>
                </BadgesContainer>

                <StatusBadge
                  type={evento.es_publico === 1 ? "publico" : "privado"}
                >
                  {evento.es_publico === 1 ? "Público" : "Privado"}
                </StatusBadge>
              </EventImageContainer>

              <EventContent>
                <EventTitle>{evento.titulo_evento}</EventTitle>

                <EventDetails>
                  <EventDetail>
                    <Calendar size={16} style={{ color: "#3b82f6" }} />
                    <span>{formatDate(evento.fecha_evento)}</span>
                  </EventDetail>

                  <EventDetail>
                    {evento.modalidad === "Virtual" ? (
                      <Monitor size={16} style={{ color: "#8b5cf6" }} />
                    ) : (
                      <Building size={16} style={{ color: "#f59e0b" }} />
                    )}
                    <span>{evento.ubicacion}</span>
                  </EventDetail>

                  {evento.es_pago === 1 && (
                    <EventDetail>
                      <CreditCard size={16} style={{ color: "#10b981" }} />
                      <span style={{ fontWeight: "600" }}>
                        Bs. {evento.costo}
                      </span>
                    </EventDetail>
                  )}
                </EventDetails>

                <EventActions>
                  <PrimaryButton
                    onClick={() =>
                      navigate(`/admin/eventos/inscritos/${evento.id_evento}`)
                    }
                  >
                    <Users size={16} />
                    Inscritos
                  </PrimaryButton>

                  <SecondaryActionsContainer>
                    <EditButton
                      onClick={() =>
                        navigate(`/admin/eventos/editar/${evento.id_evento}`)
                      }
                    >
                      <Edit3 size={16} />
                      Editar
                    </EditButton>

                    <DeleteButton onClick={() => openDeleteModal(evento)}>
                      <Trash2 size={16} />
                      Eliminar
                    </DeleteButton>
                  </SecondaryActionsContainer>
                </EventActions>
              </EventContent>
            </EventCard>
          ))}
        </EventsGrid>

        {/* Mensaje cuando no hay eventos */}
        {filteredEventos.length === 0 && (
          <NoResultsContainer>
            <NoResultsIcon>
              <Calendar size={64} />
            </NoResultsIcon>
            <NoResultsTitle>No se encontraron eventos</NoResultsTitle>
            <NoResultsText>
              {eventos.length === 0
                ? "Aún no hay eventos creados. ¡Crea el primero!"
                : "Intenta ajustar los filtros para encontrar lo que buscas."}
            </NoResultsText>
          </NoResultsContainer>
        )}

        {/* Paginación */}
        {totalPages > 1 && (
          <PaginationCard>
            <PaginationContainer>
              <PaginationInfo>
                Mostrando {startIndex + 1} -{" "}
                {Math.min(endIndex, filteredEventos.length)} de{" "}
                {filteredEventos.length} eventos
              </PaginationInfo>

              <PaginationControls>
                <PageButton
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft size={16} />
                </PageButton>

                <PageNumbers>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <PageButton
                        key={pageNum}
                        active={currentPage === pageNum}
                        onClick={() => goToPage(pageNum)}
                      >
                        {pageNum}
                      </PageButton>
                    );
                  })}
                </PageNumbers>

                <PageButton
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight size={16} />
                </PageButton>
              </PaginationControls>
            </PaginationContainer>
          </PaginationCard>
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
                <ModalAlert>
                  <AlertTriangle size={24} style={{ color: "#ef4444" }} />
                  <div>
                    <ModalText>
                      ¿Está seguro que desea eliminar el evento{" "}
                      <strong>{selectedEvento?.titulo_evento}</strong>?
                    </ModalText>
                    <ModalSubtext>
                      Esta acción no se puede deshacer y eliminará todos los
                      datos asociados al evento.
                    </ModalSubtext>
                  </div>
                </ModalAlert>
              </ModalBody>
              <ModalFooter>
                <CancelModalButton onClick={closeDeleteModal}>
                  <X size={16} />
                  Cancelar
                </CancelModalButton>
                <ConfirmModalButton
                  onClick={handleDelete}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <SpinIcon>⟳</SpinIcon>
                      Eliminando...
                    </>
                  ) : (
                    <>
                      <Trash2 size={16} />
                      Eliminar
                    </>
                  )}
                </ConfirmModalButton>
              </ModalFooter>
            </ModalContent>
          </ModalOverlay>
        )}
      </MaxWidthContainer>
    </Container>
  );
};

export default EventosAdmin;

// Animaciones
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const scaleIn = keyframes`
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
`;

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 1rem;
  animation: ${fadeIn} 0.3s ease-in-out;

  @media (min-width: 768px) {
    padding: 1.5rem;
  }
`;

const MaxWidthContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const HeaderCard = styled.div`
  background: white;
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 2rem;
  animation: ${slideUp} 0.3s ease-in-out;

  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const HeaderInfo = styled.div`
  flex: 1;
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  @media (min-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  color: #6b7280;
  font-size: 1rem;
`;

const CreateButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: #3b82f6;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

const FiltersCard = styled.div`
  background: white;
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 2rem;
  animation: ${slideUp} 0.3s ease-in-out 0.1s both;

  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const FiltersHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`;

const FiltersTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ToggleFiltersButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #f3f4f6;
  color: #374151;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #e5e7eb;
  }

  @media (min-width: 768px) {
    display: none;
  }
`;

const FiltersGrid = styled.div`
  display: ${(props) => (props.show ? "grid" : "none")};
  grid-template-columns: 1fr;
  gap: 1rem;

  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: 1280px) {
    grid-template-columns: repeat(6, 1fr);
  }
`;

const FilterInputContainer = styled.div`
  position: relative;
`;

const FilterInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  padding-left: ${(props) => (props.hasIcon ? "2.5rem" : "0.75rem")};
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const FilterSelect = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  pointer-events: none;
`;

const ClearButton = styled.button`
  width: 100%;
  background: #f3f4f6;
  color: #374151;
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 500;

  &:hover {
    background: #e5e7eb;
  }
`;

const ResultsCounter = styled.div`
  margin-top: 1rem;
  font-size: 0.875rem;
  color: #6b7280;
`;

const EventsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: 1280px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const EventCard = styled.div`
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  animation: ${scaleIn} 0.3s ease-in-out;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }
`;

const EventImageContainer = styled.div`
  position: relative;
  height: 12rem;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  overflow: hidden;
`;

const EventImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;

  ${EventCard}:hover & {
    transform: scale(1.05);
  }
`;

const EventImagePlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  opacity: 0.7;
`;

const BadgesContainer = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Badge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  backdrop-filter: blur(10px);
  background: ${(props) => {
    switch (props.type) {
      case "pago":
        return "rgba(34, 197, 94, 0.9)";
      case "gratuito":
        return "rgba(59, 130, 246, 0.9)";
      case "virtual":
        return "rgba(139, 92, 246, 0.9)";
      case "presencial":
        return "rgba(249, 115, 22, 0.9)";
      case "publico":
        return "rgba(34, 197, 94, 0.9)";
      case "privado":
        return "rgba(239, 68, 68, 0.9)";
      default:
        return "rgba(107, 114, 128, 0.9)";
    }
  }};
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const StatusBadge = styled(Badge)`
  position: absolute;
  top: 1rem;
  right: 1rem;
`;

const EventContent = styled.div`
  padding: 1.5rem;
`;

const EventTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const EventDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`;

const EventDetail = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #6b7280;
  font-size: 0.875rem;

  svg {
    flex-shrink: 0;
  }
`;

const EventActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;

  &:hover {
    transform: translateY(-1px);
  }
`;

const PrimaryButton = styled(ActionButton)`
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);

  &:hover {
    box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
  }
`;

const SecondaryActionsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const EditButton = styled(ActionButton)`
  flex: 1;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);

  &:hover {
    box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
  }
`;

const DeleteButton = styled(ActionButton)`
  flex: 1;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);

  &:hover {
    box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4);
  }
`;

const NoResultsContainer = styled.div`
  background: white;
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  padding: 3rem;
  text-align: center;
  animation: ${slideUp} 0.3s ease-in-out;
`;

const NoResultsIcon = styled.div`
  margin: 0 auto 1rem;
  color: #9ca3af;
`;

const NoResultsTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 0.5rem;
`;

const NoResultsText = styled.p`
  color: #9ca3af;
`;

const PaginationCard = styled.div`
  background: white;
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  animation: ${slideUp} 0.3s ease-in-out 0.2s both;
`;

const PaginationContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
  }
`;

const PaginationInfo = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
`;

const PaginationControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const PageButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  border: 1px solid #d1d5db;
  background: ${(props) => (props.active ? "#3b82f6" : "white")};
  color: ${(props) => (props.active ? "white" : "#374151")};
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;

  &:hover:not(:disabled) {
    background: ${(props) => (props.active ? "#2563eb" : "#f9fafb")};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const PageNumbers = styled.div`
  display: flex;
  gap: 0.25rem;
`;

// Modal Components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  animation: ${fadeIn} 0.2s ease-in-out;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 1rem;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  width: 100%;
  max-width: 500px;
  animation: ${slideUp} 0.3s ease-in-out;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
`;

const ModalTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
`;

const ModalCloseButton = styled.button`
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: #1f2937;
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
`;

const ModalAlert = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const ModalText = styled.p`
  color: #374151;
  line-height: 1.5;
`;

const ModalSubtext = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;

  @media (max-width: 640px) {
    flex-direction: column-reverse;
  }
`;

const ModalButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  @media (max-width: 640px) {
    width: 100%;
  }
`;

const CancelModalButton = styled(ModalButton)`
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;

  &:hover:not(:disabled) {
    background: #e5e7eb;
  }
`;

const ConfirmModalButton = styled(ModalButton)`
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  border: none;

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  }
`;

const SpinIcon = styled.span`
  display: inline-block;
  animation: spin 1s linear infinite;

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

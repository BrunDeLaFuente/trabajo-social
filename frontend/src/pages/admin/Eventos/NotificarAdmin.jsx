import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  ArrowLeft,
  Mail,
  Users,
  Filter,
  X,
  Send,
  Upload,
  FileText,
  AlertCircle,
  RefreshCw,
  Calendar,
  MapPin,
  User,
  Phone,
} from "lucide-react";
import api from "../../../utils/api";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";
import CajaMensaje from "../../../components/utils/CajaMensaje";

const NotificarAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Estados principales
  const [evento, setEvento] = useState(null);
  const [inscripciones, setInscripciones] = useState([]);
  const [inscripcionesFiltradas, setInscripcionesFiltradas] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);

  // Estados de filtros
  const [filtros, setFiltros] = useState({
    nombre: "",
    email: "",
    entrada: "",
    salida: "",
    certificado: "",
  });

  // Estados del formulario
  const [formData, setFormData] = useState({
    asunto: "",
    mensaje: "",
    conCertificado: false,
  });

  // Estados de archivos
  const [certificados, setCertificados] = useState({});
  const [errores, setErrores] = useState({});

  // Estados de mensajes
  const [mensaje, setMensaje] = useState({ tipo: "", color: "", texto: "" });

  // Cargar datos del evento
  useEffect(() => {
    cargarEvento();
  }, [id]);

  // Aplicar filtros
  useEffect(() => {
    aplicarFiltros();
  }, [filtros, inscripciones]);

  const cargarEvento = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/eventos/${id}/detalles`);
      setEvento(response.data.evento);
      setInscripciones(response.data.evento.inscripciones || []);
    } catch (error) {
      console.error("Error al cargar evento:", error);
      setMensaje({
        tipo: "fail",
        color: "D32F2F",
        texto: "Error al cargar los datos del evento",
      });
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltros = () => {
    const filtradas = inscripciones.filter((inscripcion) => {
      const nombre =
        inscripcion.asistente?.nombre_asistente?.toLowerCase() || "";
      const email = inscripcion.email_inscripcion?.toLowerCase() || "";

      return (
        nombre.includes(filtros.nombre.toLowerCase()) &&
        email.includes(filtros.email.toLowerCase()) &&
        (filtros.entrada === "" ||
          (filtros.entrada === "1" && inscripcion.entrada === 1) ||
          (filtros.entrada === "0" && inscripcion.entrada === 0)) &&
        (filtros.salida === "" ||
          (filtros.salida === "1" && inscripcion.salida === 1) ||
          (filtros.salida === "0" && inscripcion.salida === 0)) &&
        (filtros.certificado === "" ||
          (filtros.certificado === "1" &&
            inscripcion.certificado_entregado === 1) ||
          (filtros.certificado === "0" &&
            inscripcion.certificado_entregado === 0))
      );
    });

    setInscripcionesFiltradas(filtradas);
  };

  const limpiarFiltros = () => {
    setFiltros({
      nombre: "",
      email: "",
      entrada: "",
      salida: "",
      certificado: "",
    });
  };

  const toggleSeleccion = (inscripcion) => {
    const yaSeleccionado = seleccionados.find(
      (s) => s.id_inscripcion === inscripcion.id_inscripcion
    );

    if (yaSeleccionado) {
      setSeleccionados((prev) =>
        prev.filter((s) => s.id_inscripcion !== inscripcion.id_inscripcion)
      );
      // Limpiar certificado si existe
      setCertificados((prev) => {
        const nuevo = { ...prev };
        delete nuevo[inscripcion.id_inscripcion];
        return nuevo;
      });
    } else {
      setSeleccionados((prev) => [...prev, inscripcion]);
    }
  };

  const eliminarSeleccionado = (idInscripcion) => {
    setSeleccionados((prev) =>
      prev.filter((s) => s.id_inscripcion !== idInscripcion)
    );
    setCertificados((prev) => {
      const nuevo = { ...prev };
      delete nuevo[idInscripcion];
      return nuevo;
    });
  };

  const manejarArchivo = (idInscripcion, archivo) => {
    if (!archivo) return;

    // Validar tipo de archivo
    if (archivo.type !== "application/pdf") {
      setErrores((prev) => ({
        ...prev,
        [idInscripcion]: "Solo se permiten archivos PDF",
      }));
      return;
    }

    // Validar tamaño (5MB)
    if (archivo.size > 5 * 1024 * 1024) {
      setErrores((prev) => ({
        ...prev,
        [idInscripcion]: "El archivo no debe superar los 5MB",
      }));
      return;
    }

    setCertificados((prev) => ({
      ...prev,
      [idInscripcion]: archivo,
    }));

    setErrores((prev) => {
      const nuevo = { ...prev };
      delete nuevo[idInscripcion];
      return nuevo;
    });
  };

  const validarFormulario = () => {
    if (!formData.asunto.trim()) {
      setMensaje({
        tipo: "warning",
        color: "#ED6C02",
        texto: "El asunto es obligatorio",
      });
      return false;
    }

    if (!formData.mensaje.trim()) {
      setMensaje({
        tipo: "warning",
        color: "#ED6C02",
        texto: "El mensaje es obligatorio",
      });
      return false;
    }

    if (formData.asunto.length > 255) {
      setMensaje({
        tipo: "fail",
        color: "D32F2F",
        texto: "El asunto no debe superar los 255 caracteres",
      });
      return false;
    }

    if (seleccionados.length === 0) {
      setMensaje({
        tipo: "warning",
        color: "#ED6C02",
        texto: "Debe seleccionar al menos un destinatario",
      });
      return false;
    }

    // Si es con certificado, validar que todos tengan archivo
    if (formData.conCertificado) {
      const sinCertificado = seleccionados.find(
        (s) => !certificados[s.id_inscripcion]
      );
      if (sinCertificado) {
        setMensaje({
          tipo: "warning",
          color: "#ED6C02",
          texto: "Todos los destinatarios deben tener un certificado adjunto",
        });
        return false;
      }
    }

    return true;
  };

  const enviarNotificacion = async () => {
    if (!validarFormulario()) return;

    try {
      setEnviando(true);

      const formDataToSend = new FormData();
      formDataToSend.append("asunto", formData.asunto);
      formDataToSend.append("mensaje", formData.mensaje);
      formDataToSend.append(
        "con_certificado",
        formData.conCertificado ? "1" : "0"
      );

      seleccionados.forEach((inscripcion, index) => {
        formDataToSend.append(
          `destinatarios[${index}][id_inscripcion]`,
          inscripcion.id_inscripcion.toString()
        );

        if (
          formData.conCertificado &&
          certificados[inscripcion.id_inscripcion]
        ) {
          formDataToSend.append(
            `destinatarios[${index}][certificado]`,
            certificados[inscripcion.id_inscripcion]
          );
        }
      });

      await api.post(`/eventos/${id}/notificar-asistentes`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMensaje({
        tipo: "success",
        color: "#2E7D32",
        texto: "Notificaciones enviadas exitosamente",
      });

      // Limpiar formulario
      setFormData({
        asunto: "",
        mensaje: "",
        conCertificado: false,
      });
      setSeleccionados([]);
      setCertificados({});
    } catch (error) {
      console.error("Error al enviar notificaciones:", error);
      setMensaje({
        tipo: "fail",
        color: "#D32F2F",
        texto: "Error al enviar las notificaciones",
      });
    } finally {
      setEnviando(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!evento) {
    return (
      <Container>
        <EmptyState>
          <EmptyIcon>
            <AlertCircle size={48} />
          </EmptyIcon>
          <p>No se pudo cargar el evento</p>
        </EmptyState>
      </Container>
    );
  }

  return (
    <Container>
      <MainContent>
        {/* Mensaje */}
        {mensaje.texto && (
          <CajaMensaje
            tipo={mensaje.tipo}
            color={mensaje.color}
            mensaje={mensaje.texto}
            onClose={() => setMensaje({ tipo: "", texto: "" })}
          />
        )}

        {/* Header */}
        <Card>
          <Header>
            <HeaderLeft>
              <BackButton onClick={() => navigate(-1)}>
                <ArrowLeft size={20} />
              </BackButton>
              <div>
                <Title>
                  <Mail size={24} color="#2563eb" />
                  Notificar Asistentes
                </Title>
                <div style={{ marginTop: "0.5rem" }}>
                  <Subtitle>{evento.titulo_evento}</Subtitle>
                </div>
              </div>
            </HeaderLeft>

            <EventInfo>
              <InfoItem>
                <Calendar size={16} />
                {new Date(evento.fecha_evento).toLocaleDateString()}
              </InfoItem>
              <InfoItem>
                <MapPin size={16} />
                {evento.ubicacion}
              </InfoItem>
              <InfoItem>
                <Users size={16} />
                {inscripciones.length} inscritos
              </InfoItem>
            </EventInfo>
          </Header>
        </Card>

        <GridLayout>
          {/* Panel izquierdo - Tabla de inscripciones */}
          <LeftPanel>
            {/* Filtros */}
            <Card>
              <FiltersHeader>
                <FiltersTitle>
                  <Filter size={20} />
                  Filtros
                </FiltersTitle>
                <ClearButton onClick={limpiarFiltros}>
                  <RefreshCw size={16} />
                  Limpiar
                </ClearButton>
              </FiltersHeader>

              <FiltersGrid>
                <InputGroup>
                  <Label>Nombre</Label>
                  <Input
                    type="text"
                    value={filtros.nombre}
                    onChange={(e) =>
                      setFiltros((prev) => ({
                        ...prev,
                        nombre: e.target.value,
                      }))
                    }
                    placeholder="Buscar por nombre..."
                  />
                </InputGroup>

                <InputGroup>
                  <Label>Email</Label>
                  <Input
                    type="text"
                    value={filtros.email}
                    onChange={(e) =>
                      setFiltros((prev) => ({ ...prev, email: e.target.value }))
                    }
                    placeholder="Buscar por email..."
                  />
                </InputGroup>

                <InputGroup>
                  <Label>Entrada</Label>
                  <Select
                    value={filtros.entrada}
                    onChange={(e) =>
                      setFiltros((prev) => ({
                        ...prev,
                        entrada: e.target.value,
                      }))
                    }
                  >
                    <option value="">Todos</option>
                    <option value="1">Sí</option>
                    <option value="0">No</option>
                  </Select>
                </InputGroup>

                <InputGroup>
                  <Label>Salida</Label>
                  <Select
                    value={filtros.salida}
                    onChange={(e) =>
                      setFiltros((prev) => ({
                        ...prev,
                        salida: e.target.value,
                      }))
                    }
                  >
                    <option value="">Todos</option>
                    <option value="1">Sí</option>
                    <option value="0">No</option>
                  </Select>
                </InputGroup>

                <InputGroup>
                  <Label>Certificado</Label>
                  <Select
                    value={filtros.certificado}
                    onChange={(e) =>
                      setFiltros((prev) => ({
                        ...prev,
                        certificado: e.target.value,
                      }))
                    }
                  >
                    <option value="">Todos</option>
                    <option value="1">Entregado</option>
                    <option value="0">No entregado</option>
                  </Select>
                </InputGroup>
              </FiltersGrid>
            </Card>

            {/* Tabla de inscripciones */}
            <TableContainer>
              <TableHeader>
                <TableTitle>
                  Inscripciones ({inscripcionesFiltradas.length})
                </TableTitle>
              </TableHeader>

              {/* Vista móvil - Cards */}
              <MobileCards>
                {inscripcionesFiltradas.length === 0 ? (
                  <EmptyState>
                    <EmptyIcon>
                      <Users size={48} />
                    </EmptyIcon>
                    <p>No hay inscripciones que coincidan con los filtros</p>
                  </EmptyState>
                ) : (
                  <div>
                    {inscripcionesFiltradas.map((inscripcion) => {
                      const isSelected = seleccionados.find(
                        (s) => s.id_inscripcion === inscripcion.id_inscripcion
                      );
                      return (
                        <MobileCard key={inscripcion.id_inscripcion}>
                          <MobileCardHeader>
                            <MobileCardContent>
                              <MobileCardName>
                                <Checkbox
                                  type="checkbox"
                                  checked={!!isSelected}
                                  onChange={() => toggleSeleccion(inscripcion)}
                                />
                                <MobileCardTitle>
                                  {inscripcion.asistente?.nombre_asistente ||
                                    "Sin nombre"}
                                </MobileCardTitle>
                              </MobileCardName>

                              <MobileCardInfo>
                                <MobileCardInfoItem>
                                  <Mail size={12} />
                                  {inscripcion.email_inscripcion}
                                </MobileCardInfoItem>
                                {inscripcion.celular_inscripcion && (
                                  <MobileCardInfoItem>
                                    <Phone size={12} />
                                    {inscripcion.celular_inscripcion}
                                  </MobileCardInfoItem>
                                )}
                              </MobileCardInfo>

                              <MobileCardBadges>
                                <Badge
                                  variant={
                                    inscripcion.entrada === 1
                                      ? "success"
                                      : "default"
                                  }
                                >
                                  Entrada:{" "}
                                  {inscripcion.entrada === 1 ? "Sí" : "No"}
                                </Badge>
                                <Badge
                                  variant={
                                    inscripcion.salida === 1
                                      ? "success"
                                      : "default"
                                  }
                                >
                                  Salida:{" "}
                                  {inscripcion.salida === 1 ? "Sí" : "No"}
                                </Badge>
                                <Badge
                                  variant={
                                    inscripcion.certificado_entregado === 1
                                      ? "info"
                                      : "default"
                                  }
                                >
                                  Cert:{" "}
                                  {inscripcion.certificado_entregado === 1
                                    ? "Sí"
                                    : "No"}
                                </Badge>
                              </MobileCardBadges>
                            </MobileCardContent>
                          </MobileCardHeader>
                        </MobileCard>
                      );
                    })}
                  </div>
                )}
              </MobileCards>

              {/* Vista desktop - Tabla */}
              <DesktopTable>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableHeaderCell>
                        <Checkbox
                          type="checkbox"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSeleccionados(inscripcionesFiltradas);
                            } else {
                              setSeleccionados([]);
                            }
                          }}
                          checked={
                            inscripcionesFiltradas.length > 0 &&
                            seleccionados.length ===
                              inscripcionesFiltradas.length
                          }
                        />
                      </TableHeaderCell>
                      <TableHeaderCell>Nombre</TableHeaderCell>
                      <TableHeaderCell>Email</TableHeaderCell>
                      <TableHeaderCell center>Entrada</TableHeaderCell>
                      <TableHeaderCell center>Salida</TableHeaderCell>
                      <TableHeaderCell center>Certificado</TableHeaderCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {inscripcionesFiltradas.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan="6">
                          <EmptyState>
                            <EmptyIcon>
                              <Users size={48} />
                            </EmptyIcon>
                            <p>
                              No hay inscripciones que coincidan con los filtros
                            </p>
                          </EmptyState>
                        </TableCell>
                      </TableRow>
                    ) : (
                      inscripcionesFiltradas.map((inscripcion) => {
                        const isSelected = seleccionados.find(
                          (s) => s.id_inscripcion === inscripcion.id_inscripcion
                        );
                        return (
                          <TableRow
                            key={inscripcion.id_inscripcion}
                            selected={!!isSelected}
                          >
                            <TableCell>
                              <Checkbox
                                type="checkbox"
                                checked={!!isSelected}
                                onChange={() => toggleSeleccion(inscripcion)}
                              />
                            </TableCell>
                            <TableCell>
                              <CellContent>
                                <User size={16} color="#9ca3af" />
                                <CellText>
                                  {inscripcion.asistente?.nombre_asistente ||
                                    "Sin nombre"}
                                </CellText>
                              </CellContent>
                            </TableCell>
                            <TableCell>
                              <CellContent>
                                <Mail size={16} color="#9ca3af" />
                                <CellSubtext>
                                  {inscripcion.email_inscripcion}
                                </CellSubtext>
                              </CellContent>
                            </TableCell>
                            <TableCell center>
                              <Badge
                                variant={
                                  inscripcion.entrada === 1
                                    ? "success"
                                    : "default"
                                }
                              >
                                {inscripcion.entrada === 1 ? "Sí" : "No"}
                              </Badge>
                            </TableCell>
                            <TableCell center>
                              <Badge
                                variant={
                                  inscripcion.salida === 1
                                    ? "success"
                                    : "default"
                                }
                              >
                                {inscripcion.salida === 1 ? "Sí" : "No"}
                              </Badge>
                            </TableCell>
                            <TableCell center>
                              <Badge
                                variant={
                                  inscripcion.certificado_entregado === 1
                                    ? "info"
                                    : "default"
                                }
                              >
                                {inscripcion.certificado_entregado === 1
                                  ? "Sí"
                                  : "No"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </DesktopTable>
            </TableContainer>
          </LeftPanel>

          {/* Panel derecho - Formulario de notificación */}
          <RightPanel>
            {/* Destinatarios seleccionados */}
            <Card>
              <FiltersTitle>
                <Users size={20} />
                Destinatarios ({seleccionados.length})
              </FiltersTitle>

              {seleccionados.length === 0 ? (
                <EmptyState>
                  <EmptyIcon>
                    <Mail size={32} />
                  </EmptyIcon>
                  <p style={{ fontSize: "0.875rem" }}>
                    Selecciona destinatarios de la tabla
                  </p>
                </EmptyState>
              ) : (
                <DestinationsList>
                  {seleccionados.map((inscripcion) => (
                    <DestinationCard key={inscripcion.id_inscripcion}>
                      <DestinationHeader>
                        <DestinationInfo>
                          <DestinationName>
                            {inscripcion.asistente?.nombre_asistente ||
                              "Sin nombre"}
                          </DestinationName>
                          <DestinationEmail>
                            {inscripcion.email_inscripcion}
                          </DestinationEmail>
                        </DestinationInfo>
                        <RemoveButton
                          onClick={() =>
                            eliminarSeleccionado(inscripcion.id_inscripcion)
                          }
                        >
                          <X size={16} />
                        </RemoveButton>
                      </DestinationHeader>

                      {formData.conCertificado && (
                        <FileUploadContainer>
                          <FileUploadLabel>Certificado PDF</FileUploadLabel>
                          <FileUploadWrapper>
                            <HiddenFileInput
                              type="file"
                              accept=".pdf"
                              onChange={(e) =>
                                manejarArchivo(
                                  inscripcion.id_inscripcion,
                                  e.target.files[0]
                                )
                              }
                              id={`cert-${inscripcion.id_inscripcion}`}
                            />
                            <FileUploadButton
                              htmlFor={`cert-${inscripcion.id_inscripcion}`}
                            >
                              {certificados[inscripcion.id_inscripcion] ? (
                                <>
                                  <FileText size={16} color="#059669" />
                                  <FileUploadText success>
                                    {
                                      certificados[inscripcion.id_inscripcion]
                                        .name
                                    }
                                  </FileUploadText>
                                </>
                              ) : (
                                <>
                                  <Upload size={16} color="#9ca3af" />
                                  <FileUploadText>Subir PDF</FileUploadText>
                                </>
                              )}
                            </FileUploadButton>
                            {certificados[inscripcion.id_inscripcion] && (
                              <PreviewButton
                                onClick={() => {
                                  const file =
                                    certificados[inscripcion.id_inscripcion];
                                  const url = URL.createObjectURL(file);
                                  window.open(url, "_blank");
                                }}
                                title="Ver PDF"
                              >
                                <FileText size={16} color="#3b82f6" />
                              </PreviewButton>
                            )}
                          </FileUploadWrapper>
                          {errores[inscripcion.id_inscripcion] && (
                            <ErrorText>
                              {errores[inscripcion.id_inscripcion]}
                            </ErrorText>
                          )}
                        </FileUploadContainer>
                      )}
                    </DestinationCard>
                  ))}
                </DestinationsList>
              )}
            </Card>

            {/* Formulario de notificación */}
            <Card>
              <FiltersTitle>
                <Send size={20} />
                Mensaje
              </FiltersTitle>

              <div style={{ marginTop: "1.5rem" }}>
                <FormSection>
                  {/* Checkbox certificado */}
                  <CheckboxGroup>
                    <Checkbox
                      type="checkbox"
                      id="conCertificado"
                      checked={formData.conCertificado}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          conCertificado: e.target.checked,
                        }));
                        if (!e.target.checked) {
                          setCertificados({});
                        }
                      }}
                    />
                    <CheckboxLabel htmlFor="conCertificado">
                      Enviar con certificados individuales
                    </CheckboxLabel>
                  </CheckboxGroup>

                  {/* Asunto */}
                  <InputGroup>
                    <Label>
                      Asunto <span style={{ color: "#ef4444" }}>*</span>
                    </Label>
                    <Input
                      type="text"
                      value={formData.asunto}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          asunto: e.target.value,
                        }))
                      }
                      placeholder="Asunto del correo..."
                      maxLength={255}
                    />
                    <CharacterCount>
                      {formData.asunto.length}/255 caracteres
                    </CharacterCount>
                  </InputGroup>

                  {/* Mensaje */}
                  <InputGroup>
                    <Label>
                      Mensaje <span style={{ color: "#ef4444" }}>*</span>
                    </Label>
                    <TextArea
                      value={formData.mensaje}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          mensaje: e.target.value,
                        }))
                      }
                      placeholder="Escribe tu mensaje aquí..."
                      rows={6}
                    />
                  </InputGroup>

                  {/* Botón enviar */}
                  <SubmitButton
                    onClick={enviarNotificacion}
                    disabled={enviando || seleccionados.length === 0}
                  >
                    {enviando ? (
                      <>
                        <SpinIcon size={16} />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        Enviar Notificaciones ({seleccionados.length})
                      </>
                    )}
                  </SubmitButton>
                </FormSection>
              </div>
            </Card>
          </RightPanel>
        </GridLayout>
      </MainContent>
    </Container>
  );
};

export default NotificarAdmin;

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  padding: 0.5rem;

  @media (min-width: 640px) {
    padding: 1rem;
  }

  @media (min-width: 1024px) {
    padding: 1.5rem;
  }
`;

const MainContent = styled.div`
  max-width: 112rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (min-width: 640px) {
    gap: 1.5rem;
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  padding: 1rem;

  @media (min-width: 640px) {
    padding: 1.5rem;
  }
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (min-width: 640px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const BackButton = styled.button`
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  border: none;
  background: transparent;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &:hover {
    background-color: #f3f4f6;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.4),
      transparent
    );
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }
`;

const Title = styled.h1`
  font-size: 1.25rem;
  font-weight: bold;
  color: #111827;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;

  @media (min-width: 640px) {
    font-size: 1.5rem;
  }
`;

const Subtitle = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  margin: 10px;

  @media (min-width: 640px) {
    font-size: 1rem;
  }
`;

const EventInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;

  @media (min-width: 640px) {
    flex-direction: row;
  }
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const GridLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  @media (min-width: 1280px) {
    grid-template-columns: 2fr 1fr;
    gap: 1.5rem;
  }
`;

const LeftPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const RightPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FiltersHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const FiltersTitle = styled.h3`
  font-weight: 600;
  color: #111827;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0px;
`;

const ClearButton = styled.button`
  font-size: 0.875rem;
  color: #2563eb;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    color: #1d4ed8;
    background-color: #eff6ff;
    transform: translateY(-1px);
  }

  svg {
    transition: transform 0.3s ease;
  }

  &:hover svg {
    transform: rotate(180deg);
  }
`;

const FiltersGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.25rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    ring: 2px;
    ring-color: #3b82f6;
    border-color: transparent;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    ring: 2px;
    ring-color: #3b82f6;
    border-color: transparent;
  }
`;

const TableContainer = styled.div`
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
`;

const TableHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
`;

const TableTitle = styled.h3`
  font-weight: 600;
  color: #111827;
  margin: 0;
`;

const MobileCards = styled.div`
  display: block;

  @media (min-width: 640px) {
    display: none;
  }
`;

const DesktopTable = styled.div`
  display: none;
  overflow-x: auto;

  @media (min-width: 640px) {
    display: block;
  }
`;

const MobileCard = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;

  &:last-child {
    border-bottom: none;
  }
`;

const MobileCardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

const MobileCardContent = styled.div`
  flex: 1;
`;

const MobileCardName = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const MobileCardTitle = styled.h4`
  font-weight: 500;
  color: #111827;
  margin: 0;
`;

const MobileCardInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
`;

const MobileCardInfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const MobileCardBadges = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const Badge = styled.span`
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: default;

  ${(props) => {
    if (props.variant === "success") {
      return `
        background-color: #dcfce7;
        color: #166534;
        border: 1px solid #bbf7d0;
        
        &:hover {
          background-color: #bbf7d0;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(22, 101, 52, 0.15);
        }
      `;
    } else if (props.variant === "info") {
      return `
        background-color: #dbeafe;
        color: #1e40af;
        border: 1px solid #bfdbfe;
        
        &:hover {
          background-color: #bfdbfe;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(30, 64, 175, 0.15);
        }
      `;
    } else {
      return `
        background-color: #f3f4f6;
        color: #374151;
        border: 1px solid #e5e7eb;
        
        &:hover {
          background-color: #e5e7eb;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(55, 65, 81, 0.1);
        }
      `;
    }
  }}
`;

const Table = styled.table`
  width: 100%;
`;

const TableHead = styled.thead`
  background-color: #f9fafb;
`;

const TableRow = styled.tr`
  &:hover {
    background-color: #f9fafb;
  }

  ${(props) =>
    props.selected &&
    `
    background-color: #eff6ff;
  `}
`;

const TableHeaderCell = styled.th`
  padding: 0.75rem 1rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 500;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  ${(props) =>
    props.center &&
    `
    text-align: center;
  `}
`;

const TableCell = styled.td`
  padding: 1rem;

  ${(props) =>
    props.center &&
    `
    text-align: center;
  `}
`;

const TableBody = styled.tbody`
  background: white;

  tr {
    border-bottom: 1px solid #e5e7eb;
  }
`;

const CellContent = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CellText = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: #111827;
`;

const CellSubtext = styled.span`
  font-size: 0.875rem;
  color: #111827;
`;

const Checkbox = styled.input`
  width: 1rem;
  height: 1rem;
  color: #2563eb;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  transition: all 0.3s ease;
  cursor: pointer;

  &:focus {
    ring: 2px;
    ring-color: #3b82f6;
    transform: scale(1.05);
  }

  &:hover {
    border-color: #3b82f6;
    transform: scale(1.05);
  }

  &:checked {
    background-color: #2563eb;
    border-color: #2563eb;
    transform: scale(1.1);
  }
`;

const EmptyState = styled.div`
  padding: 2rem;
  text-align: center;
  color: #6b7280;
`;

const EmptyIcon = styled.div`
  width: 3rem;
  height: 3rem;
  margin: 0 auto 1rem;
  color: #d1d5db;
`;

const DestinationCard = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 0.75rem;
`;

const DestinationHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

const DestinationInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const DestinationName = styled.p`
  font-size: 0.875rem;
  font-weight: 500;
  color: #111827;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const DestinationEmail = styled.p`
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const RemoveButton = styled.button`
  margin-left: 0.5rem;
  padding: 0.25rem;
  color: #9ca3af;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 0.25rem;

  &:hover {
    color: #ef4444;
    background-color: #fef2f2;
    transform: scale(1.1);
  }

  svg {
    transition: transform 0.2s ease;
  }

  &:hover svg {
    transform: rotate(90deg);
  }
`;

const FileUploadContainer = styled.div`
  margin-top: 0.5rem;
`;

const FileUploadLabel = styled.label`
  display: block;
  font-size: 0.75rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.25rem;
`;

const FileUploadWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const FileUploadButton = styled.label`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.875rem;
  position: relative;
  overflow: hidden;

  &:hover {
    background-color: #f9fafb;
    border-color: #3b82f6;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
  }

  svg {
    transition: all 0.3s ease;
  }

  &:hover svg {
    transform: scale(1.1);
    color: #3b82f6;
  }
`;

const FileUploadText = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  ${(props) =>
    props.success &&
    `
    color: #059669;
  `}

  ${(props) =>
    !props.success &&
    `
    color: #6b7280;
  `}
`;

const PreviewButton = styled.button`
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #f3f4f6;
    border-color: #9ca3af;
    transform: translateY(-1px);
  }
`;

const ErrorText = styled.p`
  font-size: 0.75rem;
  color: #dc2626;
  margin: 0.25rem 0 0 0;
`;

const DestinationsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 15rem;
  overflow-y: auto;
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CheckboxLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  resize: none;
  transition: all 0.2s;

  &:focus {
    outline: none;
    ring: 2px;
    ring-color: #3b82f6;
    border-color: transparent;
  }
`;

const CharacterCount = styled.p`
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0.25rem 0 0 0;
`;

const SubmitButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: none;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  position: relative;
  overflow: hidden;

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(37, 99, 235, 0.3);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  svg {
    transition: transform 0.3s ease;
  }

  &:hover:not(:disabled) svg {
    transform: scale(1.1);
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: left 0.6s;
  }

  &:hover:not(:disabled)::before {
    left: 100%;
  }
`;

const SpinIcon = styled(RefreshCw)`
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

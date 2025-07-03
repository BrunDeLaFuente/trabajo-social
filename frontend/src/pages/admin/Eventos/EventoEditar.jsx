import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import {
  Calendar,
  MapPin,
  DollarSign,
  Users,
  Link,
  ImageIcon,
  QrCode,
  Plus,
  X,
  Search,
  Save,
  ArrowLeft,
  Clock,
  Globe,
  Lock,
  FileText,
  Video,
  User,
  Trash2,
  RefreshCw,
} from "lucide-react";
import api from "../../../utils/api";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";
import CajaMensaje from "../../../components/utils/CajaMensaje";

const EventoEditar = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [mensajes, setMensajes] = useState([]);
  const [eventosExistentes, setEventosExistentes] = useState([]);
  const [expositores, setExpositores] = useState([]);
  const [expositoresFiltrados, setExpositoresFiltrados] = useState([]);
  const [busquedaExpositor, setBusquedaExpositor] = useState("");
  const [mostrarExpositores, setMostrarExpositores] = useState(false);

  // Estados para datos originales (para cancelar)
  const [datosOriginales, setDatosOriginales] = useState(null);

  // Estado del formulario
  const [formData, setFormData] = useState({
    titulo_evento: "",
    fecha_evento: "",
    ubicacion: "",
    modalidad: "Presencial",
    es_pago: false,
    costo: "",
    es_publico: true,
    formulario: true,
    imagen_evento: null,
    qr_pago: null,
  });

  // Estados para manejo de imágenes
  const [imagenActual, setImagenActual] = useState(null);
  const [qrActual, setQrActual] = useState(null);
  const [accionImagen, setAccionImagen] = useState("mantener"); // mantener, cambiar, quitar
  const [accionQr, setAccionQr] = useState("mantener"); // mantener, cambiar, quitar

  const [expositoresSeleccionados, setExpositoresSeleccionados] = useState([]);
  const [enlaces, setEnlaces] = useState([]);

  // Agregar/eliminar mensajes
  const agregarMensaje = (tipo, color, texto, duracion) => {
    const nuevoMensaje = {
      id: Date.now(),
      tipo,
      color,
      texto,
      duracion,
    };
    setMensajes((prev) => [...prev, nuevoMensaje]);
    setTimeout(() => {
      eliminarMensaje(nuevoMensaje.id);
    }, duracion);
  };

  const eliminarMensaje = (id) => {
    setMensajes((prev) => prev.filter((msg) => msg.id !== id));
  };

  // Cargar datos iniciales
  useEffect(() => {
    cargarDatos();
  }, [id]);

  const cargarDatos = async () => {
    try {
      setLoadingData(true);

      // Cargar todos los eventos
      const eventosResponse = await api.get("/eventos");
      setEventosExistentes(eventosResponse.data);

      // Buscar el evento actual
      const eventoActual = eventosResponse.data.find(
        (evento) => evento.id_evento === Number.parseInt(id)
      );

      if (!eventoActual) {
        agregarMensaje("fail", "#D32F2F", "Evento no encontrado", 8000);
        navigate("/admin/eventos");
        return;
      }

      // Cargar expositores
      const expositoresResponse = await api.get("/expositores");
      setExpositores(expositoresResponse.data);
      setExpositoresFiltrados(expositoresResponse.data);

      // Configurar datos del formulario
      const fechaFormateada = eventoActual.fecha_evento
        .replace(" ", "T")
        .substring(0, 16);

      const datosEvento = {
        titulo_evento: eventoActual.titulo_evento,
        fecha_evento: fechaFormateada,
        ubicacion: eventoActual.ubicacion,
        modalidad: eventoActual.modalidad,
        es_pago: eventoActual.es_pago === 1,
        costo: eventoActual.costo || "",
        es_publico: eventoActual.es_publico === 1,
        formulario: eventoActual.formulario === 1,
        imagen_evento: null,
        qr_pago: null,
      };

      setFormData(datosEvento);
      setDatosOriginales({
        ...datosEvento,
        expositores: eventoActual.expositores || [],
        enlaces: eventoActual.enlaces || [],
        imagen_evento_url: eventoActual.imagen_evento_url,
        qr_pago_url: eventoActual.qr_pago_url,
      });

      // Configurar imágenes actuales
      setImagenActual(eventoActual.imagen_evento_url);
      setQrActual(eventoActual.qr_pago_url);

      // Configurar expositores seleccionados
      setExpositoresSeleccionados(eventoActual.expositores || []);

      // Configurar enlaces
      const enlacesFormateados = (eventoActual.enlaces || []).map((enlace) => ({
        id: enlace.id_enlace,
        plataforma: enlace.plataforma,
        url_enlace: enlace.url_enlace,
        password_enlace: enlace.password_enlace || "",
        esExistente: true,
      }));
      setEnlaces(enlacesFormateados);
    } catch (error) {
      console.error("Error al cargar datos:", error);
      agregarMensaje(
        "fail",
        "#D32F2F",
        "Error al cargar los datos del evento",
        8000
      );
      navigate("/admin/eventos");
    } finally {
      setLoadingData(false);
    }
  };

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Manejar archivos
  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        agregarMensaje(
          "fail",
          "#D32F2F",
          "El archivo no debe superar los 5MB",
          8000
        );
        return;
      }
      setFormData((prev) => ({
        ...prev,
        [fieldName]: file,
      }));

      if (fieldName === "imagen_evento") {
        setAccionImagen("cambiar");
      } else if (fieldName === "qr_pago") {
        setAccionQr("cambiar");
      }
    }
  };

  const removeFile = (fieldName) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: null,
    }));

    if (fieldName === "imagen_evento") {
      setAccionImagen("mantener");
    } else if (fieldName === "qr_pago") {
      setAccionQr("mantener");
    }
  };

  // Manejar acciones de imagen
  const handleImageAction = (tipo, campo) => {
    if (tipo === "cambiar") {
      if (campo === "imagen") {
        document.getElementById("imagen_evento").click();
      } else if (campo === "qr") {
        document.getElementById("qr_pago").click();
      }
    } else if (tipo === "quitar") {
      if (campo === "imagen") {
        setAccionImagen("quitar");
        setFormData((prev) => ({ ...prev, imagen_evento: null }));
      } else if (campo === "qr") {
        setAccionQr("quitar");
        setFormData((prev) => ({ ...prev, qr_pago: null }));
      }
    }
  };

  // Manejar expositores
  const handleBusquedaExpositor = (e) => {
    const busqueda = e.target.value;
    setBusquedaExpositor(busqueda);

    if (busqueda.trim() === "") {
      setExpositoresFiltrados(expositores);
      setMostrarExpositores(false);
    } else {
      const filtrados = expositores.filter((exp) =>
        exp.nombre_expositor.toLowerCase().includes(busqueda.toLowerCase())
      );
      setExpositoresFiltrados(filtrados);
      setMostrarExpositores(true);
    }
  };

  const seleccionarExpositor = (expositor) => {
    if (
      !expositoresSeleccionados.find(
        (exp) => exp.id_expositor === expositor.id_expositor
      )
    ) {
      setExpositoresSeleccionados((prev) => [...prev, expositor]);
    }
    setBusquedaExpositor("");
    setMostrarExpositores(false);
  };

  const removerExpositor = (id) => {
    setExpositoresSeleccionados((prev) =>
      prev.filter((exp) => exp.id_expositor !== id)
    );
  };

  const agregarNuevoExpositor = () => {
    if (busquedaExpositor.trim()) {
      const nuevoExpositor = {
        id_expositor: `nuevo_${Date.now()}`,
        nombre_expositor: busquedaExpositor.trim(),
        esNuevo: true,
      };
      setExpositoresSeleccionados((prev) => [...prev, nuevoExpositor]);
      setBusquedaExpositor("");
      setMostrarExpositores(false);
    }
  };

  // Manejar enlaces
  const agregarEnlace = () => {
    setEnlaces((prev) => [
      ...prev,
      {
        id: Date.now(),
        plataforma: "Zoom",
        url_enlace: "",
        password_enlace: "",
        esExistente: false,
      },
    ]);
  };

  const actualizarEnlace = (id, campo, valor) => {
    setEnlaces((prev) =>
      prev.map((enlace) =>
        enlace.id === id ? { ...enlace, [campo]: valor } : enlace
      )
    );
  };

  const removerEnlace = (id) => {
    setEnlaces((prev) => prev.filter((enlace) => enlace.id !== id));
  };

  // Cancelar cambios
  const handleCancel = () => {
    if (datosOriginales) {
      setFormData({
        titulo_evento: datosOriginales.titulo_evento,
        fecha_evento: datosOriginales.fecha_evento,
        ubicacion: datosOriginales.ubicacion,
        modalidad: datosOriginales.modalidad,
        es_pago: datosOriginales.es_pago,
        costo: datosOriginales.costo,
        es_publico: datosOriginales.es_publico,
        formulario: datosOriginales.formulario,
        imagen_evento: null,
        qr_pago: null,
      });

      setExpositoresSeleccionados(datosOriginales.expositores || []);

      const enlacesOriginales = (datosOriginales.enlaces || []).map(
        (enlace) => ({
          id: enlace.id_enlace,
          plataforma: enlace.plataforma,
          url_enlace: enlace.url_enlace,
          password_enlace: enlace.password_enlace || "",
          esExistente: true,
        })
      );
      setEnlaces(enlacesOriginales);

      setAccionImagen("mantener");
      setAccionQr("mantener");
      setBusquedaExpositor("");
      setMostrarExpositores(false);

      agregarMensaje(
        "info",
        "#0288D1",
        "Cambios cancelados, datos restaurados",
        8000
      );
    }
  };

  // Validaciones
  const validarFormulario = () => {
    if (!formData.titulo_evento.trim()) {
      agregarMensaje(
        "fail",
        "#D32F2F",
        "El título del evento es obligatorio",
        8000
      );
      return false;
    }

    if (!formData.fecha_evento) {
      agregarMensaje(
        "fail",
        "#D32F2F",
        "La fecha del evento es obligatoria",
        8000
      );
      return false;
    }

    if (!formData.ubicacion.trim()) {
      agregarMensaje("fail", "#D32F2F", "La ubicación es obligatoria", 8000);
      return false;
    }

    if (
      formData.es_pago &&
      (!formData.costo || Number.parseFloat(formData.costo) <= 0)
    ) {
      agregarMensaje(
        "fail",
        "#D32F2F",
        "El costo es obligatorio para eventos de pago",
        8000
      );
      return false;
    }

    // Validar título único (excluyendo el evento actual)
    const tituloExiste = eventosExistentes.some(
      (evento) =>
        evento.id_evento !== Number.parseInt(id) &&
        evento.titulo_evento.toLowerCase() ===
          formData.titulo_evento.toLowerCase()
    );

    if (tituloExiste) {
      agregarMensaje(
        "fail",
        "#D32F2F",
        "Ya existe otro evento con este título",
        8000
      );
      return false;
    }

    // Validar enlaces para eventos virtuales
    if (formData.modalidad === "Virtual" && enlaces.length === 0) {
      agregarMensaje(
        "fail",
        "#D32F2F",
        "Los eventos virtuales requieren al menos un enlace",
        8000
      );
      return false;
    }

    for (const enlace of enlaces) {
      if (!enlace.url_enlace.trim()) {
        agregarMensaje(
          "fail",
          "#D32F2F",
          "Todos los enlaces deben tener una URL",
          8000
        );
        return false;
      }
    }

    return true;
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) return;

    setLoading(true);

    try {
      const formDataToSend = new FormData();

      // Datos básicos
      formDataToSend.append("titulo_evento", formData.titulo_evento);
      formDataToSend.append("fecha_evento", formData.fecha_evento);
      formDataToSend.append("ubicacion", formData.ubicacion);
      formDataToSend.append("modalidad", formData.modalidad);
      formDataToSend.append("es_pago", formData.es_pago ? "1" : "0");
      formDataToSend.append("costo", formData.es_pago ? formData.costo : "");
      formDataToSend.append("es_publico", formData.es_publico ? "1" : "0");
      formDataToSend.append("formulario", formData.formulario ? "1" : "0");

      // Manejo de imágenes
      formDataToSend.append(
        "quitar_imagen",
        accionImagen === "quitar" ? "1" : "0"
      );
      formDataToSend.append("quitar_qr", accionQr === "quitar" ? "1" : "0");

      // Solo enviar archivos si se van a cambiar
      if (accionImagen === "cambiar" && formData.imagen_evento) {
        formDataToSend.append("imagen_evento", formData.imagen_evento);
      }
      if (accionQr === "cambiar" && formData.qr_pago) {
        formDataToSend.append("qr_pago", formData.qr_pago);
      }

      // Expositores
      const expositoresArray = expositoresSeleccionados.map(
        (exp) => exp.nombre_expositor
      );
      expositoresArray.forEach((expositor, index) => {
        formDataToSend.append(`expositores[${index}]`, expositor);
      });

      // Enlaces
      enlaces.forEach((enlace, index) => {
        formDataToSend.append(
          `enlaces[${index}][plataforma]`,
          enlace.plataforma
        );
        formDataToSend.append(
          `enlaces[${index}][url_enlace]`,
          enlace.url_enlace
        );
        formDataToSend.append(
          `enlaces[${index}][password_enlace]`,
          enlace.password_enlace || ""
        );
      });

      await api.post(`/eventosActualizar/${id}`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      agregarMensaje(
        "success",
        "#2E7D32",
        "Evento actualizado exitosamente",
        5000
      );
      setTimeout(() => {
        navigate(-1);
      }, 2000);
    } catch (error) {
      console.error("Error al actualizar evento:", error);
      agregarMensaje(
        "fail",
        "#D32F2F",
        error.response?.data?.message || "Error al actualizar el evento",
        8000
      );
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return <LoadingSpinner message="Cargando datos del evento..." />;
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
            mensaje={mensaje.texto}
            onClose={() => eliminarMensaje(mensaje.id)}
          />
        ))}

        {/* Header */}
        <HeaderCard>
          <HeaderContent>
            <Title>
              <Calendar />
              Editar Evento
            </Title>
            <BackButton onClick={() => navigate(-1)}>
              <ArrowLeft size={20} />
              Volver
            </BackButton>
          </HeaderContent>
        </HeaderCard>

        {/* Formulario */}
        <FormCard>
          <form onSubmit={handleSubmit}>
            {/* Información General */}
            <Section>
              <SectionTitle>
                <FileText />
                Información General
              </SectionTitle>
              <FormGrid>
                <FormGroup>
                  <Label>
                    <FileText size={16} />
                    Título del Evento *
                  </Label>
                  <Input
                    type="text"
                    name="titulo_evento"
                    value={formData.titulo_evento}
                    onChange={handleInputChange}
                    placeholder="Ingrese el título del evento"
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>
                    <Clock size={16} />
                    Fecha y Hora *
                  </Label>
                  <Input
                    type="datetime-local"
                    name="fecha_evento"
                    value={formData.fecha_evento}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>
                    <MapPin size={16} />
                    Ubicación *
                  </Label>
                  <Input
                    type="text"
                    name="ubicacion"
                    value={formData.ubicacion}
                    onChange={handleInputChange}
                    placeholder="Ingrese la ubicación"
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>
                    <Video size={16} />
                    Modalidad *
                  </Label>
                  <Select
                    name="modalidad"
                    value={formData.modalidad}
                    onChange={handleInputChange}
                  >
                    <option value="Presencial">Presencial</option>
                    <option value="Virtual">Virtual</option>
                  </Select>
                </FormGroup>

                <FormGroup>
                  <CheckboxGroup>
                    <Checkbox
                      type="checkbox"
                      name="es_pago"
                      checked={formData.es_pago}
                      onChange={handleInputChange}
                    />
                    <CheckboxLabel>
                      <DollarSign size={16} />
                      Evento de pago
                    </CheckboxLabel>
                  </CheckboxGroup>
                </FormGroup>

                {formData.es_pago && (
                  <FormGroup>
                    <Label>
                      <DollarSign size={16} />
                      Costo *
                    </Label>
                    <Input
                      type="number"
                      step="0.01"
                      name="costo"
                      value={formData.costo}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      required
                    />
                  </FormGroup>
                )}

                <FormGroup>
                  <CheckboxGroup>
                    <Checkbox
                      type="checkbox"
                      name="es_publico"
                      checked={formData.es_publico}
                      onChange={handleInputChange}
                    />
                    <CheckboxLabel>
                      <Globe size={16} />
                      Evento público
                    </CheckboxLabel>
                  </CheckboxGroup>
                </FormGroup>

                <FormGroup>
                  <CheckboxGroup>
                    <Checkbox
                      type="checkbox"
                      name="formulario"
                      checked={formData.formulario}
                      onChange={handleInputChange}
                    />
                    <CheckboxLabel>
                      <FileText size={16} />
                      Habilitar formulario de inscripción
                    </CheckboxLabel>
                  </CheckboxGroup>
                </FormGroup>
              </FormGrid>
            </Section>

            {/* Archivos */}
            <Section>
              <SectionTitle>
                <ImageIcon />
                Archivos del Evento
              </SectionTitle>
              <FormGrid>
                <FormGroup>
                  <Label>
                    <ImageIcon size={16} />
                    Imagen del Evento
                  </Label>

                  {/* Imagen actual */}
                  {imagenActual && accionImagen !== "quitar" && (
                    <CurrentImageContainer>
                      <CurrentImagePreview>
                        <PreviewImage src={imagenActual} alt="Imagen actual" />
                        <div>
                          <p
                            style={{
                              fontWeight: "600",
                              marginBottom: "0.5rem",
                            }}
                          >
                            Imagen actual
                          </p>
                          <ImageActions>
                            <ChangeImageButton
                              type="button"
                              onClick={() =>
                                handleImageAction("cambiar", "imagen")
                              }
                            >
                              <RefreshCw size={14} />
                              Cambiar
                            </ChangeImageButton>
                            <RemoveImageButton
                              type="button"
                              onClick={() =>
                                handleImageAction("quitar", "imagen")
                              }
                            >
                              <Trash2 size={14} />
                              Quitar
                            </RemoveImageButton>
                          </ImageActions>
                        </div>
                      </CurrentImagePreview>
                    </CurrentImageContainer>
                  )}

                  {/* Nueva imagen seleccionada */}
                  {formData.imagen_evento && accionImagen === "cambiar" && (
                    <FilePreview>
                      <PreviewImage
                        src={URL.createObjectURL(formData.imagen_evento)}
                        alt="Nueva imagen"
                      />
                      <div>
                        <p style={{ fontWeight: "600" }}>
                          Nueva imagen: {formData.imagen_evento.name}
                        </p>
                        <p style={{ fontSize: "0.9rem", color: "#6b7280" }}>
                          {(formData.imagen_evento.size / 1024 / 1024).toFixed(
                            2
                          )}{" "}
                          MB
                        </p>
                      </div>
                      <RemoveFileButton
                        type="button"
                        onClick={() => removeFile("imagen_evento")}
                      >
                        <X size={16} />
                      </RemoveFileButton>
                    </FilePreview>
                  )}

                  {/* Área de subida cuando no hay imagen o se quitó */}
                  {(!imagenActual || accionImagen === "quitar") &&
                    !formData.imagen_evento && (
                      <FileUploadArea
                        onClick={() =>
                          document.getElementById("imagen_evento").click()
                        }
                      >
                        <ImageIcon size={48} color="#9ca3af" />
                        <p>Haz clic para seleccionar una imagen</p>
                        <p style={{ fontSize: "0.9rem", color: "#6b7280" }}>
                          Máximo 5MB - JPG, PNG, GIF
                        </p>
                      </FileUploadArea>
                    )}

                  <FileInput
                    id="imagen_evento"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "imagen_evento")}
                  />
                </FormGroup>

                {formData.es_pago && (
                  <FormGroup>
                    <Label>
                      <QrCode size={16} />
                      QR de Pago (Opcional)
                    </Label>

                    {/* QR actual */}
                    {qrActual && accionQr !== "quitar" && (
                      <CurrentImageContainer>
                        <CurrentImagePreview>
                          <PreviewImage src={qrActual} alt="QR actual" />
                          <div>
                            <p
                              style={{
                                fontWeight: "600",
                                marginBottom: "0.5rem",
                              }}
                            >
                              QR actual
                            </p>
                            <ImageActions>
                              <ChangeImageButton
                                type="button"
                                onClick={() =>
                                  handleImageAction("cambiar", "qr")
                                }
                              >
                                <RefreshCw size={14} />
                                Cambiar
                              </ChangeImageButton>
                              <RemoveImageButton
                                type="button"
                                onClick={() =>
                                  handleImageAction("quitar", "qr")
                                }
                              >
                                <Trash2 size={14} />
                                Quitar
                              </RemoveImageButton>
                            </ImageActions>
                          </div>
                        </CurrentImagePreview>
                      </CurrentImageContainer>
                    )}

                    {/* Nuevo QR seleccionado */}
                    {formData.qr_pago && accionQr === "cambiar" && (
                      <FilePreview>
                        <PreviewImage
                          src={URL.createObjectURL(formData.qr_pago)}
                          alt="Nuevo QR"
                        />
                        <div>
                          <p style={{ fontWeight: "600" }}>
                            Nuevo QR: {formData.qr_pago.name}
                          </p>
                          <p style={{ fontSize: "0.9rem", color: "#6b7280" }}>
                            {(formData.qr_pago.size / 1024 / 1024).toFixed(2)}{" "}
                            MB
                          </p>
                        </div>
                        <RemoveFileButton
                          type="button"
                          onClick={() => removeFile("qr_pago")}
                        >
                          <X size={16} />
                        </RemoveFileButton>
                      </FilePreview>
                    )}

                    {/* Área de subida cuando no hay QR o se quitó */}
                    {(!qrActual || accionQr === "quitar") &&
                      !formData.qr_pago && (
                        <FileUploadArea
                          onClick={() =>
                            document.getElementById("qr_pago").click()
                          }
                        >
                          <QrCode size={48} color="#9ca3af" />
                          <p>Haz clic para seleccionar el QR</p>
                          <p style={{ fontSize: "0.9rem", color: "#6b7280" }}>
                            Máximo 5MB - JPG, PNG
                          </p>
                        </FileUploadArea>
                      )}

                    <FileInput
                      id="qr_pago"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, "qr_pago")}
                    />
                  </FormGroup>
                )}
              </FormGrid>
            </Section>

            {/* Expositores */}
            <Section>
              <SectionTitle>
                <Users />
                Expositores
              </SectionTitle>
              <ExpositoresContainer>
                <SearchContainer>
                  <SearchIcon />
                  <SearchInput
                    type="text"
                    placeholder="Buscar o agregar expositor..."
                    value={busquedaExpositor}
                    onChange={handleBusquedaExpositor}
                  />
                </SearchContainer>

                {mostrarExpositores && (
                  <ExpositoresList>
                    {expositoresFiltrados.map((expositor) => (
                      <ExpositorItem
                        key={expositor.id_expositor}
                        onClick={() => seleccionarExpositor(expositor)}
                      >
                        <User
                          size={16}
                          style={{ display: "inline", marginRight: "0.5rem" }}
                        />
                        {expositor.nombre_expositor}
                      </ExpositorItem>
                    ))}
                    {busquedaExpositor && expositoresFiltrados.length === 0 && (
                      <ExpositorItem onClick={agregarNuevoExpositor}>
                        <Plus
                          size={16}
                          style={{ display: "inline", marginRight: "0.5rem" }}
                        />
                        Agregar "{busquedaExpositor}"
                      </ExpositorItem>
                    )}
                  </ExpositoresList>
                )}

                {expositoresSeleccionados.length > 0 && (
                  <SelectedExpositores>
                    {expositoresSeleccionados.map((expositor) => (
                      <ExpositorTag key={expositor.id_expositor}>
                        <User size={14} />
                        {expositor.nombre_expositor}
                        {expositor.esNuevo && (
                          <span style={{ fontSize: "0.8rem" }}>(Nuevo)</span>
                        )}
                        <RemoveExpositorButton
                          onClick={() =>
                            removerExpositor(expositor.id_expositor)
                          }
                        >
                          <X size={12} />
                        </RemoveExpositorButton>
                      </ExpositorTag>
                    ))}
                  </SelectedExpositores>
                )}
              </ExpositoresContainer>
            </Section>

            {/* Enlaces (solo para eventos virtuales) */}
            {formData.modalidad === "Virtual" && (
              <Section>
                <SectionTitle>
                  <Link />
                  Enlaces de Videoconferencia
                </SectionTitle>
                <EnlacesContainer>
                  {enlaces.map((enlace) => (
                    <EnlaceItem key={enlace.id}>
                      <RemoveEnlaceButton
                        type="button"
                        onClick={() => removerEnlace(enlace.id)}
                      >
                        <X size={16} />
                      </RemoveEnlaceButton>

                      <FormGrid>
                        <FormGroup>
                          <Label>Plataforma *</Label>
                          <Select
                            value={enlace.plataforma}
                            onChange={(e) =>
                              actualizarEnlace(
                                enlace.id,
                                "plataforma",
                                e.target.value
                              )
                            }
                          >
                            <option value="Zoom">Zoom</option>
                            <option value="Google Meet">Google Meet</option>
                          </Select>
                        </FormGroup>

                        <FormGroup>
                          <Label>URL del Enlace *</Label>
                          <Input
                            type="url"
                            value={enlace.url_enlace}
                            onChange={(e) =>
                              actualizarEnlace(
                                enlace.id,
                                "url_enlace",
                                e.target.value
                              )
                            }
                            placeholder="https://..."
                            required
                          />
                        </FormGroup>

                        <FormGroup>
                          <Label>
                            <Lock size={16} />
                            Contraseña (Opcional)
                          </Label>
                          <Input
                            type="text"
                            value={enlace.password_enlace}
                            onChange={(e) =>
                              actualizarEnlace(
                                enlace.id,
                                "password_enlace",
                                e.target.value
                              )
                            }
                            placeholder="Contraseña de acceso"
                          />
                        </FormGroup>
                      </FormGrid>
                    </EnlaceItem>
                  ))}

                  <AddEnlaceButton type="button" onClick={agregarEnlace}>
                    <Plus size={20} />
                    Agregar Enlace
                  </AddEnlaceButton>
                </EnlacesContainer>
              </Section>
            )}

            {/* Botones de acción */}
            <ActionButtons>
              <CancelButton type="button" onClick={handleCancel}>
                <RefreshCw size={16} />
                Cancelar Cambios
              </CancelButton>
              <SaveButton type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <SpinIcon>⟳</SpinIcon>
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Guardar Cambios
                  </>
                )}
              </SaveButton>
            </ActionButtons>
          </form>
        </FormCard>
      </MaxWidthContainer>
    </Container>
  );
};

export default EventoEditar;

// Animaciones
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const scaleIn = keyframes`
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
`;

// Contenedores principales
const Container = styled.div`
  min-height: 100vh;
  padding: 2rem 1rem;
  animation: ${fadeIn} 0.6s ease-out;

  @media (max-width: 768px) {
    padding: 1rem 0.5rem;
  }
`;

const MaxWidthContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

// Header
const HeaderCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: ${slideUp} 0.8s ease-out;

  @media (max-width: 768px) {
    padding: 1.5rem;
    margin-bottom: 1rem;
  }
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #000000;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #6c757d, #495057);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(108, 117, 125, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(108, 117, 125, 0.4);
  }

  &:active {
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
`;

// Formulario principal
const FormCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: ${scaleIn} 0.8s ease-out;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const Section = styled.div`
  margin-bottom: 2.5rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #e2e8f0;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 600;
  color: #374151;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Input = styled.input`
  padding: 0.875rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    transform: translateY(-1px);
  }

  &:disabled {
    background: #f9fafb;
    color: #9ca3af;
    cursor: not-allowed;
  }
`;

const Select = styled.select`
  padding: 0.875rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    transform: translateY(-1px);
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 12px;
  border: 2px solid #e5e7eb;
  transition: all 0.3s ease;

  &:hover {
    border-color: #667eea;
  }
`;

const Checkbox = styled.input`
  width: 1.25rem;
  height: 1.25rem;
  cursor: pointer;
`;

const CheckboxLabel = styled.label`
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

// Sección de archivos
const FileUploadArea = styled.div`
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
  background: #fafbfc;

  &:hover {
    border-color: #667eea;
    background: #f0f4ff;
  }

  &.dragover {
    border-color: #667eea;
    background: #e0e7ff;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const FilePreview = styled.div`
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
`;

const PreviewImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
`;

const CurrentImageContainer = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
`;

const CurrentImagePreview = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const ImageActions = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const ImageActionButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;

  &:hover {
    transform: translateY(-1px);
  }
`;

const ChangeImageButton = styled(ImageActionButton)`
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);

  &:hover {
    box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
  }
`;

const RemoveImageButton = styled(ImageActionButton)`
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);

  &:hover {
    box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4);
  }
`;

const RemoveFileButton = styled.button`
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #dc2626;
    transform: scale(1.1);
  }
`;

// Sección de expositores
const ExpositoresContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SearchContainer = styled.div`
  position: relative;
`;

const SearchInput = styled(Input)`
  padding-left: 3rem;
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  width: 1.25rem;
  height: 1.25rem;
`;

const ExpositoresList = styled.div`
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: white;
`;

const ExpositorItem = styled.div`
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border-bottom: 1px solid #f3f4f6;

  &:hover {
    background: #f8fafc;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const SelectedExpositores = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const ExpositorTag = styled.div`
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 500;
`;

const RemoveExpositorButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
  }
`;

// Sección de enlaces
const EnlacesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const EnlaceItem = styled.div`
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
  position: relative;
`;

const RemoveEnlaceButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #dc2626;
    transform: scale(1.1);
  }
`;

const AddEnlaceButton = styled.button`
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
  }

  &:active {
    transform: translateY(-1px);
  }
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1.25rem;
  margin-top: 2.5rem;
  padding-top: 2rem;
  border-top: 2px solid #e2e8f0;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.875rem 2rem;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }

  svg {
    margin-right: 0.5rem;
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 1rem;
  }
`;

const CancelButton = styled(Button)`
  background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
  color: white;

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #4b5563 0%, #374151 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const SaveButton = styled(Button)`
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  color: white;

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
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

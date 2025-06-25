import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import {
  Calendar,
  MapPin,
  Monitor,
  DollarSign,
  User,
  CreditCard,
  Mail,
  Phone,
  Upload,
  CheckCircle,
  AlertCircle,
  Clock,
  Download,
  Save,
} from "lucide-react";
import api from "../../utils/api";

const FormularioEvento = () => {
  const { slug } = useParams();

  const [evento, setEvento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });

  const [formData, setFormData] = useState({
    nombre_asistente: "",
    ci: "",
    email_inscripcion: "",
    celular_inscripcion: "",
    comprobante_pago: null,
  });

  const [errors, setErrors] = useState({});
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    cargarEvento();
  }, [slug]);

  const cargarEvento = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/eventos/publicos/${slug}`);
      setEvento(response.data.evento);
    } catch (error) {
      console.error("Error al cargar evento:", error);
      setError(error.response?.data?.error || "Error al cargar el evento");
    } finally {
      setLoading(false);
    }
  };

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case "nombre_asistente":
        if (!value.trim()) {
          newErrors[name] = "El nombre es obligatorio";
        } else if (value.length < 2) {
          newErrors[name] = "El nombre debe tener al menos 2 caracteres";
        } else {
          delete newErrors[name];
        }
        break;

      case "ci":
        if (!value.trim()) {
          newErrors[name] = "El CI es obligatorio";
        } else if (!/^\d+$/.test(value)) {
          newErrors[name] = "El CI solo debe contener números";
        } else if (value.length > 10) {
          newErrors[name] = "El CI no puede tener más de 10 dígitos";
        } else {
          delete newErrors[name];
        }
        break;

      case "email_inscripcion":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) {
          newErrors[name] = "El correo electrónico es obligatorio";
        } else if (!emailRegex.test(value)) {
          newErrors[name] = "Ingrese un correo electrónico válido";
        } else {
          delete newErrors[name];
        }
        break;

      case "celular_inscripcion":
        if (value && (!/^\d+$/.test(value) || value.length !== 7)) {
          newErrors[name] = "El celular debe tener exactamente 7 dígitos";
        } else {
          delete newErrors[name];
        }
        break;

      case "comprobante_pago":
        if (evento?.es_pago && !value) {
          newErrors[name] = "El comprobante de pago es obligatorio";
        } else {
          delete newErrors[name];
        }
        break;
    }

    setErrors(newErrors);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Restricciones específicas
    if (name === "ci" && (!/^\d*$/.test(value) || value.length > 10)) {
      return;
    }

    if (
      name === "celular_inscripcion" &&
      (!/^\d*$/.test(value) || value.length > 7)
    ) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    validateField(name, value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  const handleFile = (file) => {
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({
        ...prev,
        comprobante_pago: "Solo se permiten archivos de imagen",
      }));
      return;
    }

    // Validar tamaño (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        comprobante_pago: "El archivo no puede ser mayor a 5MB",
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      comprobante_pago: file,
    }));

    validateField("comprobante_pago", file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar todos los campos
    Object.keys(formData).forEach((key) => {
      validateField(key, formData[key]);
    });

    // Verificar si hay errores
    if (Object.keys(errors).length > 0) {
      setMensaje({
        tipo: "error",
        texto: "Por favor, corrija los errores en el formulario",
      });
      return;
    }

    try {
      setSubmitting(true);

      const submitData = new FormData();
      submitData.append("nombre_asistente", formData.nombre_asistente);
      submitData.append("ci", formData.ci);
      submitData.append("email_inscripcion", formData.email_inscripcion);

      if (formData.celular_inscripcion) {
        submitData.append("celular_inscripcion", formData.celular_inscripcion);
      }

      if (formData.comprobante_pago) {
        submitData.append("comprobante_pago", formData.comprobante_pago);
      }

      await api.post(`/eventos/${evento.id_evento}/inscribir`, submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess(true);
      setMensaje({
        tipo: "success",
        texto:
          "¡Inscripción realizada exitosamente! Recibirás un correo de confirmación.",
      });

      // Limpiar formulario
      setFormData({
        nombre_asistente: "",
        ci: "",
        email_inscripcion: "",
        celular_inscripcion: "",
        comprobante_pago: null,
      });
    } catch (error) {
      console.error("Error al inscribirse:", error);
      setMensaje({
        tipo: "error",
        texto:
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Error al agregar inscripción",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <LoadingContainer>
        <LoadingContent>
          <Spinner />
          <LoadingText>Cargando formulario...</LoadingText>
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
          <ErrorTitle>Evento no encontrado</ErrorTitle>
          <ErrorText>{error}</ErrorText>
        </ErrorContent>
      </ErrorContainer>
    );
  }

  const qrCodeURL = evento?.qr_pago_url;

  return (
    <Container>
      <Content>
        {evento.es_pago ? (
          <>
            <PaymentGrid>
              <EventCard>
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
                </EventImageContainer>

                <EventInfo>
                  <EventTitle>{evento.titulo_evento}</EventTitle>

                  <EventDetails>
                    <DetailItem>
                      <Clock size={20} />
                      <span>{formatDate(evento.fecha_evento)}</span>
                    </DetailItem>

                    {evento.modalidad === "Presencial" ? (
                      <DetailItem>
                        <MapPin size={20} />
                        <span>{evento.ubicacion}</span>
                      </DetailItem>
                    ) : (
                      <DetailItem>
                        <Monitor size={20} />
                        <span>Evento Virtual</span>
                      </DetailItem>
                    )}

                    <DetailItem>
                      <DollarSign size={20} />
                      <span>
                        {evento.es_pago ? `Bs. ${evento.costo}` : "Gratuito"}
                      </span>
                    </DetailItem>
                  </EventDetails>
                </EventInfo>
              </EventCard>

              {/* Sección de pago si es necesario */}
              <PaymentSection>
                <PaymentTitle>
                  <CreditCard size={24} />
                  Información de Pago
                </PaymentTitle>
                <p style={{ marginBottom: "1rem", color: "#9a3412" }}>
                  Costo del evento: <strong>Bs. {evento.costo}</strong>
                </p>
                {qrCodeURL && (
                  <QRContainer>
                    <QRImage src={qrCodeURL} alt="QR de pago" />
                    <DownloadButton href={qrCodeURL} download="qr_pago">
                      <Download size={16} />
                      Descargar QR
                    </DownloadButton>
                  </QRContainer>
                )}
                <p style={{ fontSize: "0.9rem", color: "#9a3412" }}>
                  Realiza el pago y sube tu comprobante en el formulario
                </p>
              </PaymentSection>
            </PaymentGrid>

            <FormSection isPago={evento.es_pago}>
              {/* Formulario de inscripción */}
              <FormContainer isPago={evento.es_pago} centered={evento.es_pago}>
                <FormTitle>Formulario de Inscripción</FormTitle>

                {mensaje.texto && (
                  <MessageBox className={mensaje.tipo}>
                    {mensaje.texto}
                  </MessageBox>
                )}

                <form onSubmit={handleSubmit}>
                  <FormGrid>
                    <FormGroup>
                      <Label>
                        <User size={18} />
                        Nombre Completo <span className="required">*</span>
                      </Label>
                      <Input
                        type="text"
                        name="nombre_asistente"
                        value={formData.nombre_asistente}
                        onChange={handleInputChange}
                        className={
                          errors.nombre_asistente
                            ? "error"
                            : formData.nombre_asistente
                            ? "success"
                            : ""
                        }
                        placeholder="Ingrese su nombre completo"
                      />
                      {errors.nombre_asistente && (
                        <ErrorMessage>
                          <AlertCircle />
                          {errors.nombre_asistente}
                        </ErrorMessage>
                      )}
                      {!errors.nombre_asistente &&
                        formData.nombre_asistente && (
                          <SuccessMessage>
                            <CheckCircle />
                            Nombre válido
                          </SuccessMessage>
                        )}
                    </FormGroup>

                    <FormGroup>
                      <Label>
                        <CreditCard size={18} />
                        Cédula de Identidad <span className="required">*</span>
                      </Label>
                      <Input
                        type="text"
                        name="ci"
                        value={formData.ci}
                        onChange={handleInputChange}
                        className={
                          errors.ci ? "error" : formData.ci ? "success" : ""
                        }
                        placeholder="Ingrese su CI (solo números)"
                        maxLength="10"
                      />
                      {errors.ci && (
                        <ErrorMessage>
                          <AlertCircle />
                          {errors.ci}
                        </ErrorMessage>
                      )}
                      {!errors.ci && formData.ci && (
                        <SuccessMessage>
                          <CheckCircle />
                          CI válido
                        </SuccessMessage>
                      )}
                    </FormGroup>

                    <FormGroup>
                      <Label>
                        <Mail size={18} />
                        Correo Electrónico <span className="required">*</span>
                      </Label>
                      <Input
                        type="email"
                        name="email_inscripcion"
                        value={formData.email_inscripcion}
                        onChange={handleInputChange}
                        className={
                          errors.email_inscripcion
                            ? "error"
                            : formData.email_inscripcion
                            ? "success"
                            : ""
                        }
                        placeholder="ejemplo@correo.com"
                        autoComplete="email"
                      />
                      {errors.email_inscripcion && (
                        <ErrorMessage>
                          <AlertCircle />
                          {errors.email_inscripcion}
                        </ErrorMessage>
                      )}
                      {!errors.email_inscripcion &&
                        formData.email_inscripcion && (
                          <SuccessMessage>
                            <CheckCircle />
                            Correo válido
                          </SuccessMessage>
                        )}
                    </FormGroup>

                    <FormGroup>
                      <Label>
                        <Phone size={18} />
                        Celular (Opcional)
                      </Label>
                      <Input
                        type="text"
                        name="celular_inscripcion"
                        value={formData.celular_inscripcion}
                        onChange={handleInputChange}
                        className={
                          errors.celular_inscripcion
                            ? "error"
                            : formData.celular_inscripcion &&
                              formData.celular_inscripcion.length === 7
                            ? "success"
                            : ""
                        }
                        placeholder="7 dígitos"
                        maxLength="7"
                      />
                      {errors.celular_inscripcion && (
                        <ErrorMessage>
                          <AlertCircle />
                          {errors.celular_inscripcion}
                        </ErrorMessage>
                      )}
                      {!errors.celular_inscripcion &&
                        formData.celular_inscripcion &&
                        formData.celular_inscripcion.length === 7 && (
                          <SuccessMessage>
                            <CheckCircle />
                            Celular válido
                          </SuccessMessage>
                        )}
                    </FormGroup>
                  </FormGrid>

                  {/* Campo de comprobante solo para eventos de pago */}
                  {evento.es_pago && (
                    <FormGroup style={{ marginTop: "1.5rem" }}>
                      <Label>
                        <Upload size={18} />
                        Comprobante de Pago <span className="required">*</span>
                      </Label>
                      <FileUploadContainer
                        className={`${dragOver ? "dragover" : ""} ${
                          errors.comprobante_pago ? "error" : ""
                        }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                      >
                        <FileUploadInput
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                        <FileUploadContent>
                          <Upload size={32} />
                          <div>
                            <strong>Haz clic para subir</strong> o arrastra tu
                            comprobante aquí
                          </div>
                          <div
                            style={{ fontSize: "0.875rem", color: "#6b7280" }}
                          >
                            Solo imágenes, máximo 5MB
                          </div>
                        </FileUploadContent>
                      </FileUploadContainer>

                      {formData.comprobante_pago && (
                        <FilePreview>
                          <CheckCircle size={20} />
                          <span>{formData.comprobante_pago.name}</span>
                        </FilePreview>
                      )}

                      {errors.comprobante_pago && (
                        <ErrorMessage>
                          <AlertCircle />
                          {errors.comprobante_pago}
                        </ErrorMessage>
                      )}
                    </FormGroup>
                  )}

                  <SubmitButton
                    type="submit"
                    disabled={submitting || Object.keys(errors).length > 0}
                    className={success ? "success" : ""}
                  >
                    {submitting ? (
                      <>
                        <SpinIcon>⟳</SpinIcon> Inscribiendo...
                      </>
                    ) : success ? (
                      <>
                        <CheckCircle size={16} />
                        ¡Inscripción exitosa!
                      </>
                    ) : (
                      <>
                        <Save size={16} /> Inscribirse al evento
                      </>
                    )}
                  </SubmitButton>
                </form>
              </FormContainer>
            </FormSection>
          </>
        ) : (
          <MainGrid>
            <EventCard>
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
              </EventImageContainer>

              <EventInfo>
                <EventTitle>{evento.titulo_evento}</EventTitle>

                <EventDetails>
                  <DetailItem>
                    <Clock size={20} />
                    <span>{formatDate(evento.fecha_evento)}</span>
                  </DetailItem>

                  {evento.modalidad === "Presencial" ? (
                    <DetailItem>
                      <MapPin size={20} />
                      <span>{evento.ubicacion}</span>
                    </DetailItem>
                  ) : (
                    <DetailItem>
                      <Monitor size={20} />
                      <span>Evento Virtual</span>
                    </DetailItem>
                  )}

                  <DetailItem>
                    <DollarSign size={20} />
                    <span>
                      {evento.es_pago ? `Bs. ${evento.costo}` : "Gratuito"}
                    </span>
                  </DetailItem>
                </EventDetails>
              </EventInfo>
            </EventCard>

            {/* Formulario de inscripción para eventos gratuitos */}
            <FormContainer>
              <FormTitle>Formulario de Inscripción</FormTitle>

              {mensaje.texto && (
                <MessageBox className={mensaje.tipo}>
                  {mensaje.texto}
                </MessageBox>
              )}

              <form onSubmit={handleSubmit}>
                <FormGrid>
                  <FormGroup>
                    <Label>
                      <User size={18} />
                      Nombre Completo <span className="required">*</span>
                    </Label>
                    <Input
                      type="text"
                      name="nombre_asistente"
                      value={formData.nombre_asistente}
                      onChange={handleInputChange}
                      className={
                        errors.nombre_asistente
                          ? "error"
                          : formData.nombre_asistente
                          ? "success"
                          : ""
                      }
                      placeholder="Ingrese su nombre completo"
                    />
                    {errors.nombre_asistente && (
                      <ErrorMessage>
                        <AlertCircle />
                        {errors.nombre_asistente}
                      </ErrorMessage>
                    )}
                    {!errors.nombre_asistente && formData.nombre_asistente && (
                      <SuccessMessage>
                        <CheckCircle />
                        Nombre válido
                      </SuccessMessage>
                    )}
                  </FormGroup>

                  <FormGroup>
                    <Label>
                      <CreditCard size={18} />
                      Cédula de Identidad <span className="required">*</span>
                    </Label>
                    <Input
                      type="text"
                      name="ci"
                      value={formData.ci}
                      onChange={handleInputChange}
                      className={
                        errors.ci ? "error" : formData.ci ? "success" : ""
                      }
                      placeholder="Ingrese su CI (solo números)"
                      maxLength="10"
                    />
                    {errors.ci && (
                      <ErrorMessage>
                        <AlertCircle />
                        {errors.ci}
                      </ErrorMessage>
                    )}
                    {!errors.ci && formData.ci && (
                      <SuccessMessage>
                        <CheckCircle />
                        CI válido
                      </SuccessMessage>
                    )}
                  </FormGroup>

                  <FormGroup>
                    <Label>
                      <Mail size={18} />
                      Correo Electrónico <span className="required">*</span>
                    </Label>
                    <Input
                      type="email"
                      name="email_inscripcion"
                      value={formData.email_inscripcion}
                      onChange={handleInputChange}
                      className={
                        errors.email_inscripcion
                          ? "error"
                          : formData.email_inscripcion
                          ? "success"
                          : ""
                      }
                      placeholder="ejemplo@correo.com"
                      autoComplete="email"
                    />
                    {errors.email_inscripcion && (
                      <ErrorMessage>
                        <AlertCircle />
                        {errors.email_inscripcion}
                      </ErrorMessage>
                    )}
                    {!errors.email_inscripcion &&
                      formData.email_inscripcion && (
                        <SuccessMessage>
                          <CheckCircle />
                          Correo válido
                        </SuccessMessage>
                      )}
                  </FormGroup>

                  <FormGroup>
                    <Label>
                      <Phone size={18} />
                      Celular (Opcional)
                    </Label>
                    <Input
                      type="text"
                      name="celular_inscripcion"
                      value={formData.celular_inscripcion}
                      onChange={handleInputChange}
                      className={
                        errors.celular_inscripcion
                          ? "error"
                          : formData.celular_inscripcion &&
                            formData.celular_inscripcion.length === 7
                          ? "success"
                          : ""
                      }
                      placeholder="7 dígitos"
                      maxLength="7"
                    />
                    {errors.celular_inscripcion && (
                      <ErrorMessage>
                        <AlertCircle />
                        {errors.celular_inscripcion}
                      </ErrorMessage>
                    )}
                    {!errors.celular_inscripcion &&
                      formData.celular_inscripcion &&
                      formData.celular_inscripcion.length === 7 && (
                        <SuccessMessage>
                          <CheckCircle />
                          Celular válido
                        </SuccessMessage>
                      )}
                  </FormGroup>
                </FormGrid>

                <SubmitButton
                  type="submit"
                  disabled={submitting || Object.keys(errors).length > 0}
                  className={success ? "success" : ""}
                >
                  {submitting ? (
                    <>
                      <SpinIcon>⟳</SpinIcon> Inscribiendo...
                    </>
                  ) : success ? (
                    <>
                      <CheckCircle size={16} />
                      ¡Inscripción exitosa!
                    </>
                  ) : (
                    <>
                      <Save size={16} /> Inscribirse al evento
                    </>
                  )}
                </SubmitButton>
              </form>
            </FormContainer>
          </MainGrid>
        )}
      </Content>
    </Container>
  );
};

export default FormularioEvento;

// Animaciones

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`;

const bounce = keyframes`
  0%, 20%, 53%, 80%, 100% {
    transform: translate3d(0,0,0);
  }
  40%, 43% {
    transform: translate3d(0, -30px, 0);
  }
  70% {
    transform: translate3d(0, -15px, 0);
  }
  90% {
    transform: translate3d(0, -4px, 0);
  }
`;

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(
    135deg,
    rgb(255, 255, 255) 0%,
    rgb(255, 255, 255) 100%
  );
  padding: 2rem 1rem;

  @media (max-width: 768px) {
    padding: 1rem 0.5rem;
  }
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  animation: ${fadeInUp} 0.6s ease-out;
`;

const EventCard = styled.div`
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }
`;

const EventImageContainer = styled.div`
  position: relative;
  height: 300px;
  overflow: hidden;

  @media (max-width: 768px) {
    height: 200px;
  }
`;

const EventImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const EventImagePlaceholder = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, #f0f0f0 25%, transparent 25%),
    linear-gradient(-45deg, #f0f0f0 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #f0f0f0 75%),
    linear-gradient(-45deg, transparent 75%, #f0f0f0 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  font-size: 1.2rem;
  animation: ${pulse} 2s infinite;
`;

const EventInfo = styled.div`
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const EventTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1rem;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const EventDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 12px;
  transition: all 0.3s ease;

  &:hover {
    background: #f1f5f9;
    transform: translateX(5px);
  }

  svg {
    color: #ff6b35;
    flex-shrink: 0;
  }

  span {
    color: #475569;
    font-weight: 500;
  }
`;

const PaymentSection = styled.div`
  background: linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%);
  border: 2px solid #fb923c;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  text-align: center;
`;

const PaymentTitle = styled.h3`
  color: #ea580c;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const QRContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem;
`;

const QRImage = styled.img`
  max-width: 300px;
  height: auto;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    max-width: 200px;
  }
`;

const DownloadButton = styled.a`
  background: #f97316;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #ea580c;
  }
`;

const FormContainer = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  ${(props) =>
    props.isPago && props.centered ? "margin: 0 auto; max-width: 600px;" : ""}

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const FormTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1.5rem;
  text-align: center;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background: linear-gradient(90deg, #ff6b35, #f59e0b);
    border-radius: 2px;
    animation: ${shimmer} 2s infinite;
    background-size: 200px 100%;
  }

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
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
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    color: #ff6b35;
  }

  .required {
    color: #ef4444;
  }
`;

const Input = styled.input`
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;

  &:focus {
    outline: none;
    border-color: #ff6b35;
    box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
    transform: translateY(-1px);
  }

  &.error {
    border-color: #ef4444;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
  }

  &.success {
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }
`;

const FileUploadContainer = styled.div`
  position: relative;
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
  background: #fafafa;

  &:hover {
    border-color: #ff6b35;
    background: #fff7ed;
  }

  &.dragover {
    border-color: #ff6b35;
    background: #fff7ed;
    transform: scale(1.02);
  }

  &.error {
    border-color: #ef4444;
    background: #fef2f2;
  }
`;

const FileUploadInput = styled.input`
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
`;

const FileUploadContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;

  svg {
    color: #9ca3af;
    transition: color 0.3s ease;
  }

  ${FileUploadContainer}:hover & svg {
    color: #ff6b35;
  }
`;

const FilePreview = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  margin-top: 0.5rem;

  svg {
    color: #16a34a;
  }
`;

const ErrorMessage = styled.span`
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;

  svg {
    width: 16px;
    height: 16px;
  }
`;

const SuccessMessage = styled.span`
  color: #16a34a;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;

  svg {
    width: 16px;
    height: 16px;
  }
`;

const SpinIcon = styled.span`
  display: inline-block;
  animation: ${spin} 1s linear infinite;
  margin-right: 0.5rem;
`;

const SubmitButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #ff6b35 0%, #f59e0b 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 2rem;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

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
    transition: left 0.5s;
  }

  &:hover {
    box-shadow: 0 8px 25px rgba(255, 107, 53, 0.3);

    &::before {
      left: 100%;
    }
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    box-shadow: none;
  }

  &.success {
    background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%);
    animation: ${bounce} 0.6s ease-out;
  }
`;

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const PaymentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormSection = styled.div`
  ${(props) => (props.isPago ? "max-width: 600px; margin: 0 auto;" : "")}
`;

const MessageBox = styled.div`
  padding: 1rem 1.5rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  font-weight: 500;

  &.success {
    background-color: #ecfdf5;
    border: 1px solid #bbf7d0;
    color: #065f46;
  }

  &.error {
    background-color: #fef2f2;
    border: 1px solid #fecaca;
    color: #b91c1c;
  }
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

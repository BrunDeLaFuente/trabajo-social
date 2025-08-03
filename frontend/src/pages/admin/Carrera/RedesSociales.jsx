import { useState, useEffect } from "react";
import { Save, X, Globe } from "lucide-react";
import styled, { keyframes } from "styled-components";
import api from "../../../utils/api";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";
import CajaMensaje from "../../../components/utils/CajaMensaje";
import {
  FaFacebook,
  FaYoutube,
  FaInstagram,
  FaLinkedin,
  FaWhatsapp,
  FaTelegram,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

// Función para obtener el icono y color según la red social
const getSocialIcon = (nombre) => {
  switch (nombre.toLowerCase()) {
    case "facebook":
      return { icon: <FaFacebook />, color: "#1877F2" };
    case "youtube":
      return { icon: <FaYoutube />, color: "#FF0000" };
    case "instagram":
      return { icon: <FaInstagram />, color: "#E4405F" };
    case "x":
      return { icon: <FaXTwitter />, color: "#000000" };
    case "linkedin":
      return { icon: <FaLinkedin />, color: "#0A66C2" };
    case "whatsapp":
      return { icon: <FaWhatsapp />, color: "#25D366" };
    case "telegram":
      return { icon: <FaTelegram />, color: "#0088cc" };
    default:
      return { icon: <Globe />, color: "#6B7280" };
  }
};

export default function RedesSociales() {
  const [carrera, setCarrera] = useState(null);
  const [redes, setRedes] = useState([]);
  const [originalRedes, setOriginalRedes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mensajes, setMensajes] = useState([]);

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

  // Cargar datos de la carrera
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get("/carrera");
        setCarrera(response.data);
        setRedes(response.data.redes_sociales);
        setOriginalRedes(
          JSON.parse(JSON.stringify(response.data.redes_sociales))
        ); // Copia profunda
      } catch (error) {
        console.error("Error al cargar los datos:", error);
        agregarMensaje(
          "fail",
          "#D32F2F",
          "Error al cargar los datos de redes sociales."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Manejar cambios en la URL
  const handleUrlChange = (index, value) => {
    const updatedRedes = [...redes];
    updatedRedes[index] = {
      ...updatedRedes[index],
      url_rrss: value,
    };
    setRedes(updatedRedes);
  };

  // Manejar cambios en el estado público
  const handlePublicChange = (index, checked) => {
    const updatedRedes = [...redes];
    updatedRedes[index] = {
      ...updatedRedes[index],
      es_publico: checked ? 1 : 0,
    };
    setRedes(updatedRedes);
  };

  // Cancelar cambios
  const handleCancel = () => {
    setRedes(JSON.parse(JSON.stringify(originalRedes))); // Restaurar datos originales
    agregarMensaje("warning", "#ED6C02", "Cambios cancelados.");
  };

  // Validar URL
  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };

  // Guardar cambios
  const handleSave = async () => {
    // Validar URLs
    for (const red of redes) {
      if (!red.url_rrss.trim()) {
        agregarMensaje(
          "fail",
          "#D32F2F",
          `La URL de ${red.nombre_rrss} no puede estar vacía.`
        );
        return;
      }

      if (!isValidUrl(red.url_rrss)) {
        agregarMensaje(
          "fail",
          "#D32F2F",
          `La URL de ${red.nombre_rrss} no es válida.`
        );
        return;
      }
    }

    try {
      setSaving(true);
      await api.put("/rrssUpdate", { redes_sociales: redes });
      setOriginalRedes(JSON.parse(JSON.stringify(redes))); // Actualizar datos originales
      agregarMensaje(
        "success",
        "#2E7D32",
        "Redes sociales actualizadas correctamente."
      );
    } catch (error) {
      console.error("Error al guardar los datos:", error);
      agregarMensaje(
        "fail",
        "#D32F2F",
        "Error al actualizar las redes sociales."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <LoadingSpinner message="Cargando información de redes sociales..." />
    );
  }

  if (!carrera || !redes.length) {
    return (
      <ErrorMessage>
        No se pudo cargar la información de redes sociales.
      </ErrorMessage>
    );
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
        <Globe size={24} /> Redes sociales
      </Title>

      <ContentArea>
        <TableContainer>
          <Table>
            {/* Header de la tabla - solo visible en desktop */}
            <TableHeader>
              <TableHeaderCell>Red Social</TableHeaderCell>
              <TableHeaderCell>URL</TableHeaderCell>
              <TableHeaderCell>Público</TableHeaderCell>
              <TableHeaderCell>Estado</TableHeaderCell>
            </TableHeader>

            <TableBody>
              {redes.map((red, index) => {
                const { icon, color } = getSocialIcon(red.nombre_rrss);
                return (
                  <TableRow key={red.id_carrera_rrss}>
                    {/* Red Social */}
                    <TableCell>
                      <SocialIcon style={{ backgroundColor: color }}>
                        {icon}
                      </SocialIcon>
                      <SocialName>{red.nombre_rrss}</SocialName>
                    </TableCell>

                    {/* URL */}
                    <TableCell>
                      <MobileFieldContainer>
                        <MobileLabel>URL</MobileLabel>
                        <Input
                          type="url"
                          value={red.url_rrss}
                          onChange={(e) =>
                            handleUrlChange(index, e.target.value)
                          }
                          placeholder={`URL de ${red.nombre_rrss}`}
                        />
                      </MobileFieldContainer>
                    </TableCell>

                    {/* Público */}
                    <TableCell>
                      <MobileFieldContainer>
                        <MobileLabel>Mostrar públicamente</MobileLabel>
                        <CheckboxContainer>
                          <Checkbox
                            type="checkbox"
                            id={`public-${red.id_carrera_rrss}`}
                            checked={red.es_publico === 1}
                            onChange={(e) =>
                              handlePublicChange(index, e.target.checked)
                            }
                          />
                          <CheckboxLabel
                            htmlFor={`public-${red.id_carrera_rrss}`}
                          >
                            {red.es_publico === 1 ? "Sí" : "No"}
                          </CheckboxLabel>
                        </CheckboxContainer>
                      </MobileFieldContainer>
                    </TableCell>

                    {/* Estado */}
                    <TableCell>
                      <MobileFieldContainer>
                        <MobileLabel>Estado</MobileLabel>
                        <span
                          style={{
                            padding: "0.25rem 0.5rem",
                            borderRadius: "0.375rem",
                            fontSize: "0.75rem",
                            fontWeight: "500",
                            backgroundColor:
                              red.url_rrss && isValidUrl(red.url_rrss)
                                ? "#dcfce7"
                                : "#fef2f2",
                            color:
                              red.url_rrss && isValidUrl(red.url_rrss)
                                ? "#166534"
                                : "#dc2626",
                          }}
                        >
                          {red.url_rrss && isValidUrl(red.url_rrss)
                            ? "Válida"
                            : "Inválida"}
                        </span>
                      </MobileFieldContainer>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Botones de acción - siempre visibles */}
        <ActionButtons>
          <CancelButton onClick={handleCancel} disabled={saving}>
            <X size={16} /> Cancelar
          </CancelButton>
          <SaveButton onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <SpinIcon>⟳</SpinIcon> Guardando...
              </>
            ) : (
              <>
                <Save size={16} /> Guardar cambios
              </>
            )}
          </SaveButton>
        </ActionButtons>
      </ContentArea>
    </Container>
  );
}

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Styled Components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  height: calc(100vh - 4rem);
  max-height: 800px;
  min-height: 600px;
  animation: ${fadeIn} 0.6s ease-out;

  @media (max-width: 768px) {
    padding: 1rem;
    height: calc(100vh - 2rem);
    max-height: none;
    min-height: 400px;
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
  flex-shrink: 0;

  @media (max-width: 768px) {
    font-size: 1.25rem;
    margin-bottom: 1rem;
  }
`;

const ContentArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background-color: #f9fafb;

  @media (max-width: 768px) {
    height: calc(100vh - 3rem);
    min-height: 400px;
  }
`;

const TableContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  background-color: white;
  border-radius: 0.5rem 0.5rem 0 0;

  /* Estilos para el scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
`;

const Table = styled.div`
  width: 100%;
  min-width: 800px;

  @media (max-width: 768px) {
    min-width: 100%;
  }
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 200px 3fr 120px 120px;
  background-color: #f3f4f6;
  padding: 1rem;
  border-bottom: 2px solid #e5e7eb;
  font-weight: 600;
  color: #374151;
  position: sticky;
  top: 0;
  z-index: 10;

  @media (max-width: 768px) {
    display: none;
  }
`;

const TableHeaderCell = styled.div`
  padding: 0.5rem;
  display: flex;
  align-items: center;
  font-size: 0.875rem;
`;

const TableBody = styled.div`
  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 200px 3fr 120px 120px;
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  transition: background-color 0.2s;
  align-items: center;

  &:hover {
    background-color: #f9fafb;
  }

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 768px) {
    display: block;
    background-color: white;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    margin-bottom: 1rem;
    padding: 1rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

    &:hover {
      background-color: white;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
    }
  }
`;

const TableCell = styled.div`
  padding: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: 768px) {
    padding: 0.25rem 0;
    margin-bottom: 0.5rem;

    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const SocialIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  color: white;
  font-size: 1.25rem;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 2rem;
    height: 2rem;
    font-size: 1rem;
  }
`;

const SocialName = styled.span`
  font-weight: 600;
  color: #333;
  margin-left: 0.5rem;

  @media (max-width: 768px) {
    font-size: 1rem;
    font-weight: 700;
  }
`;

const Input = styled.input`
  width: 100%;
  min-width: 0;
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
    font-size: 0.875rem;
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  @media (max-width: 768px) {
    justify-content: flex-start;
  }
`;

const Checkbox = styled.input`
  width: 1rem;
  height: 1rem;
  cursor: pointer;
`;

const CheckboxLabel = styled.label`
  font-size: 0.875rem;
  color: #4b5563;
  cursor: pointer;
  user-select: none;

  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background-color: #f9fafb;
  border-top: 1px solid #e5e7eb;
  border-radius: 0 0 0.5rem 0.5rem;
  flex-shrink: 0;

  @media (max-width: 768px) {
    flex-direction: row;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    justify-content: center;
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
  border: none;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  svg {
    margin-right: 0.25rem;
  }

  @media (max-width: 768px) {
    padding: 0.5rem 0.75rem;
    font-size: 0.8rem;
    flex: 1;
    max-width: 120px;
  }
`;

const CancelButton = styled(Button)`
  background-color: #e5e7eb;
  color: #4b5563;

  &:hover:not(:disabled) {
    background-color: #d1d5db;
  }
`;

const SaveButton = styled(Button)`
  background-color: #22c55e;
  color: white;

  &:hover:not(:disabled) {
    background-color: #16a34a;
  }
`;

const ErrorMessage = styled.div`
  text-align: center;
  color: #ef4444;
  font-weight: 500;
  margin: 2rem 0;
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

const MobileLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.25rem;

  @media (min-width: 769px) {
    display: none;
  }
`;

const MobileFieldContainer = styled.div`
  @media (max-width: 768px) {
    margin-bottom: 0.5rem;
    width: 100%;

    &:last-child {
      margin-bottom: 0;
    }
  }
`;

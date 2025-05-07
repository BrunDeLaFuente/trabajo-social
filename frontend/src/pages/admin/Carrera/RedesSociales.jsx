"use client";

import { useState, useEffect } from "react";
import { Save, X, Globe } from "lucide-react";
import styled from "styled-components";
import api from "../../../utils/api";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";
import CajaMensaje from "../../../components/utils/CajaMensaje";
import {
  FaFacebook,
  FaYoutube,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaWhatsapp,
  FaTelegram,
} from "react-icons/fa";

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
      return { icon: <FaTwitter />, color: "#000000" };
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

      <SocialList>
        {redes.map((red, index) => {
          const { icon, color } = getSocialIcon(red.nombre_rrss);
          return (
            <SocialItem key={red.id_carrera_rrss}>
              <SocialHeader>
                <SocialIcon style={{ backgroundColor: color }}>
                  {icon}
                </SocialIcon>
                <SocialName>{red.nombre_rrss}</SocialName>
              </SocialHeader>

              <SocialContent>
                <InputGroup>
                  <Label htmlFor={`url-${red.id_carrera_rrss}`}>URL</Label>
                  <Input
                    type="url"
                    id={`url-${red.id_carrera_rrss}`}
                    value={red.url_rrss}
                    onChange={(e) => handleUrlChange(index, e.target.value)}
                    placeholder={`URL de ${red.nombre_rrss}`}
                  />
                </InputGroup>

                <CheckboxContainer>
                  <Checkbox
                    type="checkbox"
                    id={`public-${red.id_carrera_rrss}`}
                    checked={red.es_publico === 1}
                    onChange={(e) =>
                      handlePublicChange(index, e.target.checked)
                    }
                  />
                  <Label htmlFor={`public-${red.id_carrera_rrss}`}>
                    Mostrar públicamente
                  </Label>
                </CheckboxContainer>
              </SocialContent>
            </SocialItem>
          );
        })}
      </SocialList>

      {/* Botones de acción */}
      <ActionButtons>
        <CancelButton onClick={handleCancel} disabled={saving}>
          <X size={18} /> Cancelar
        </CancelButton>
        <SaveButton onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <SpinIcon>⟳</SpinIcon> Guardando...
            </>
          ) : (
            <>
              <Save size={18} /> Guardar cambios
            </>
          )}
        </SaveButton>
      </ActionButtons>
    </Container>
  );
}

// Styled Components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 1rem;
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

const SocialList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const SocialItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  border-radius: 0.5rem;
  background-color: #f9fafb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    padding: 0.75rem;
  }
`;

const SocialHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
`;

const SocialName = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1rem;
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

  @media (max-width: 768px) {
    width: 2rem;
    height: 2rem;
    font-size: 1rem;
  }
`;

const SocialContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
`;

const Input = styled.input`
  width: 100%;
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
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Checkbox = styled.input`
  width: 1rem;
  height: 1rem;
  cursor: pointer;
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
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
    margin-right: 0.25rem;
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

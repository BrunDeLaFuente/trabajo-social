import { useEffect, useState } from "react";
import styled from "styled-components";
import {
  FaFacebookF,
  FaTelegram,
  FaLinkedinIn,
  FaInstagram,
  FaWhatsapp,
  FaTwitter,
  FaYoutube,
  FaGlobe,
} from "react-icons/fa";
import api from "../../utils/api"; // Ajusta la ruta según tu estructura

const iconMap = {
  facebook: { icon: <FaFacebookF />, color: "#1877F2" },
  telegram: { icon: <FaTelegram />, color: "#0088cc" },
  linkedin: { icon: <FaLinkedinIn />, color: "#0077B5" },
  instagram: { icon: <FaInstagram />, color: "#E4405F" },
  x: { icon: <FaTwitter />, color: "#1DA1F2" },
  youtube: { icon: <FaYoutube />, color: "#FF0000" },
  whatsapp: { icon: <FaWhatsapp />, color: "#25D366" },
  default: { icon: <FaGlobe />, color: "#6B7280" },
};

const SocialBar = () => {
  const [redes, setRedes] = useState([]);

  useEffect(() => {
    const fetchRedes = async () => {
      try {
        const { data } = await api.get("/carrera");
        const visibles = data.redes_sociales.filter(
          (rrss) => rrss.es_publico === 1
        );
        setRedes(visibles);
      } catch (error) {
        console.error("Error al obtener redes sociales", error);
      }
    };

    fetchRedes();
  }, []);

  return (
    <SocialBarContainer>
      <SocialContent>
        <Text>Visítanos en nuestras RRSS:</Text>
        <IconsContainer>
          {redes.map((rrss) => {
            const key = rrss.nombre_rrss.toLowerCase();
            const { icon, color } = iconMap[key] || iconMap.default;

            return (
              <IconLink
                key={rrss.id_carrera_rrss}
                href={rrss.url_rrss}
                target="_blank"
                rel="noopener noreferrer"
                $bgColor={color}
                title={`Visitar ${rrss.nombre_rrss}`}
              >
                {icon}
              </IconLink>
            );
          })}
        </IconsContainer>
      </SocialContent>
    </SocialBarContainer>
  );
};

export default SocialBar;

const SocialBarContainer = styled.div`
  background-color: #003366;
  padding: 5px 55px; /* Mayor separación */
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-size: 0.8rem;
  color: white;

  @media (max-width: 768px) {
    padding: 5px 25px; /* Más compacto en móviles */
    font-size: 0.7rem;
  }
`;

/* Contenedor del texto y los iconos */
const SocialContent = styled.div`
  display: flex;
  align-items: center;
  gap: 8px; /* Menos espacio entre texto e iconos */

  @media (max-width: 768px) {
    gap: 4px;
  }
`;

const Text = styled.span`
  white-space: nowrap;
  font-size: 0.8rem;

  @media (max-width: 768px) {
    font-size: 0.7rem;
  }
`;

const IconsContainer = styled.div`
  display: flex;
  gap: 8px; /* Espacio entre iconos */

  @media (max-width: 768px) {
    gap: 4px;
  }
`;

const IconLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  color: white;
  font-size: 0.9rem;
  transition: transform 0.2s ease, opacity 0.3s ease;
  background-color: ${({ $bgColor }) => $bgColor}; /* Usando transient prop */

  &:hover {
    transform: scale(1.1);
    opacity: 0.8;
  }
`;

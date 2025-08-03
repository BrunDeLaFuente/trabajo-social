import { useEffect, useState } from "react";
import styled from "styled-components";
import {
  FaFacebookF,
  FaTelegram,
  FaLinkedinIn,
  FaInstagram,
  FaWhatsapp,
  FaYoutube,
  FaGlobe,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import api from "../../utils/api";

const iconMap = {
  facebook: { icon: <FaFacebookF />, color: "#1877F2" },
  telegram: { icon: <FaTelegram />, color: "#0088cc" },
  linkedin: { icon: <FaLinkedinIn />, color: "#0077B5" },
  instagram: { icon: <FaInstagram />, color: "#E4405F" },
  x: { icon: <FaXTwitter />, color: "#000000" },
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
  padding: 5px 55px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-size: 0.8rem;
  color: white;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 10px 20px;
    gap: 6px;
    font-size: 0.7rem;
  }
`;

/* Contenedor del texto y los iconos */
const SocialContent = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: nowrap; /* ← evita que se dividan en líneas */

  @media (max-width: 768px) {
    gap: 4px;
    justify-content: center;
    overflow-x: auto; /* ← en caso de que no quepa, permite scroll horizontal */
  }
`;

const Text = styled.span`
  white-space: nowrap; /* ← mantiene el texto en una línea */
  font-size: 0.8rem;

  @media (max-width: 768px) {
    font-size: 0.7rem;
  }
`;

const IconsContainer = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: nowrap;

  @media (max-width: 768px) {
    gap: 6px;
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
  background-color: ${({ $bgColor }) => $bgColor};

  &:hover {
    transform: scale(1.1);
    opacity: 0.8;
  }

  @media (max-width: 768px) {
    width: 22px;
    height: 22px;
    font-size: 0.8rem;
  }
`;

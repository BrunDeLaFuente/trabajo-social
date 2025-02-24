import styled from "styled-components";
import { FaFacebookF, FaTelegram, FaLinkedinIn, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

const SocialBar = () => {
  return (
    <SocialBarContainer>
      <SocialContent>
        <Text>Visítanos en nuestras RRSS:</Text>
        <IconsContainer>
          <IconLink href="https://facebook.com" target="_blank" bgColor="#1877F2" title="Seguir en Facebook">
            <FaFacebookF />
          </IconLink>
          <IconLink href="https://t.me" target="_blank" bgColor="#0088cc" title="Unirse en Telegram">
            <FaTelegram />
          </IconLink>
          <IconLink href="https://linkedin.com" target="_blank" bgColor="#0077B5" title="Conectar en LinkedIn">
            <FaLinkedinIn />
          </IconLink>
          <IconLink href="https://instagram.com" target="_blank" bgColor="#E4405F" title="Seguir en Instagram">
            <FaInstagram />
          </IconLink>
          <IconLink href="https://twitter.com" target="_blank" bgColor="#1DA1F2" title="Seguir en Twitter">
            <FaTwitter />
          </IconLink>
          <IconLink href="https://youtube.com" target="_blank" bgColor="#FF0000" title="Suscribirse en YouTube">
            <FaYoutube />
          </IconLink>
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

const IconLink = styled.a.attrs(({ bgColor }) => ({
  style: { backgroundColor: bgColor }, // Se aplica el color como un estilo
}))`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  color: white;
  font-size: 0.9rem;
  transition: transform 0.2s ease, opacity 0.3s ease;

  &:hover {
    transform: scale(1.1);
    opacity: 0.8;
  }
`;


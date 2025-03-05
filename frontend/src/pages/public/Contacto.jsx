import HeroSection from "../../components/public/HeroSection";
import styled from "styled-components";
import { FaFacebookF, FaInstagram, FaTelegramPlane, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const Contacto = () => {
  return (
    <ContactContainer>
      <HeroSection title="Contacto" />
      <ContentWrapper>
        <InfoCard>
          <InfoHeader>
            <InfoTitle>INFORMACIÓN</InfoTitle>
            <InfoText>
              Para obtener cualquier información, visítenos en nuestra dirección o contáctenos a nuestros números.
            </InfoText>
          </InfoHeader>

          <InfoItem>
            <IconWrapper color="#E53935">
              <FaMapMarkerAlt />
            </IconWrapper>
            <div>
              <strong>Dirección:</strong>
              <p>Campus Central UMSS, Av. Oquendo y Jordán, Facultad de Ciencias y Tecnología.</p>
            </div>
          </InfoItem>

          <InfoItem>
            <IconWrapper color="#D32F2F">
              <FaEnvelope />
            </IconWrapper>
            <div>
              <strong>Correo:</strong>
              <p>contacto@umss.edu.bo</p>
            </div>
          </InfoItem>

          <InfoItem>
            <IconWrapper color="#1565C0">
              <FaPhoneAlt />
            </IconWrapper>
            <div>
              <strong>Teléfonos:</strong>
              <p>(+591) 4 4231765 – Interno 36317</p>
            </div>
          </InfoItem>

          <SocialSection>
            <strong>Síguenos en:</strong>
            <SocialIcons>
              <SocialIcon href="#" $bgColor="#1877F2">
                <FaFacebookF />
              </SocialIcon>
              <SocialIcon href="#" $bgColor="#E4405F">
                <FaInstagram />
              </SocialIcon>
              <SocialIcon href="#" $bgColor="#0088cc">
                <FaTelegramPlane />
              </SocialIcon>
            </SocialIcons>
          </SocialSection>
        </InfoCard>

        {/* 📌 Mapa */}
        <MapContainer>
          <iframe
            title="Ubicación"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d237.96176973877286!2d-66.14767562608226!3d-17.393142555341317!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x93e373f932f2d0a5%3A0x23e2a7de22bb83d2!2sJV42%2BPXC%2C%20Cochabamba!5e0!3m2!1ses-419!2sbo!4v1740801187263!5m2!1ses-419!2sbo"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </MapContainer>
      </ContentWrapper>
    </ContactContainer>
  );
};

export default Contacto;

// 📌 **Estilos**
const ContactContainer = styled.div`
  width: 100%;
  background-color: #ffffff;
  overflow-x: hidden;
`;

const ContentWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 30px;
  padding: 30px 5%;
  flex-wrap: wrap;
`;

/* 🔹 Estilos para la tarjeta de información */
const InfoCard = styled.div`
  background: white;
  padding: 0;
  border-radius: 0;
  box-shadow: none;
  max-width: 500px;
  width: 100%;
`;

const InfoHeader = styled.div`
  background: #f5f5f5;
  padding: 15px;
`;

const InfoTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: bold;
  margin-bottom: 5px;
`;

const InfoText = styled.p`
  font-size: 1rem;
  margin-bottom: 10px;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 15px;
  font-size: 1.1rem;
  margin-bottom: 10px;
`;

const IconWrapper = styled.div`
  font-size: 1.6rem;
  color: ${(props) => props.color};
`;

const SocialSection = styled.div`
  padding: 15px;
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 5px;
`;

const SocialIcon = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 35px;
  height: 35px;
  border-radius: 5px;
  background-color: ${(props) => props.$bgColor};
  color: white;
  font-size: 1.2rem;
  transition: opacity 0.3s;

  &:hover {
    opacity: 0.8;
  }
`;

const MapContainer = styled.div`
  iframe {
    width: 550px;
    height: 450px;
    border-radius: 12px;
    border: none;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    iframe {
      width: 100%;
      height: 350px;
    }
  }
`;

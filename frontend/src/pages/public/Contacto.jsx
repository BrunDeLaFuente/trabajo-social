import HeroSection from "../../components/public/HeroSection";
import styled from "styled-components";
import { FaFacebookF, FaInstagram, FaTelegramPlane, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";


const Contacto = () => {
  return (
    <ContactContainer>
       <HeroSection title="Contacto" />
      <ContentWrapper>
        <InfoCard>
          <InfoTitle>INFORMACIÓN</InfoTitle>
          <InfoText>Para obtener cualquier información, visítenos en nuestra dirección o contáctenos a nuestros números.</InfoText>
          
          <InfoItem>
            <FaMapMarkerAlt className="icon" />
            <div>
              <strong>Dirección:</strong>
              <p>Campus Central UMSS, Av. Oquendo y Jordán, Facultad de Ciencias y Tecnología.</p>
            </div>
          </InfoItem>

          <InfoItem>
            <FaEnvelope className="icon" />
            <div>
              <strong>Correo:</strong>
              <p>contacto@umss.edu.bo</p>
            </div>
          </InfoItem>

          <InfoItem>
            <FaPhoneAlt className="icon" />
            <div>
              <strong>Teléfonos:</strong>
              <p>(+591) 4 4231765 – Interno 36317</p>
            </div>
          </InfoItem>

          <SocialSection>
            <strong>Síguenos en:</strong>
            <SocialIcons>
              <SocialIcon href="#"><FaFacebookF /></SocialIcon>
              <SocialIcon href="#"><FaInstagram /></SocialIcon>
              <SocialIcon href="#"><FaTelegramPlane /></SocialIcon>
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

const ContactContainer = styled.div`
  width: 100%;
  background-color: #ffffff;
  overflow-x: hidden;
`;

const ContentWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 30px;
  padding: 30px 5%; /* 📌 Reducción del padding para acercar contenido */
  flex-wrap: wrap;
`;

const InfoCard = styled.div`
  background: #f8f9fa;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  border-left: 6px solid #ff6600;
`;

const InfoTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 15px;
`;

const InfoText = styled.p`
  font-size: 1rem;
  margin-bottom: 20px;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
  font-size: 1.1rem;

  .icon {
    font-size: 1.6rem;
    color: #ff6600;
  }
`;

const SocialSection = styled.div`
  margin-top: 20px;
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 5px;
`;

const SocialIcon = styled.a`
  color: #003366;
  font-size: 1.8rem;
  transition: color 0.3s;

  &:hover {
    color: #ff6600;
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

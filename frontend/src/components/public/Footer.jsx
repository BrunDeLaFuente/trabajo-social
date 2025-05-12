import styled from "styled-components";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTelegramPlane,
  FaYoutube,
} from "react-icons/fa";
import footerBackground from "../../assets/img/portada.png";
import logo from "../../assets/img/logo-footer.png";
import logoBordeado from "../../assets/img/logo.jpeg";
import banner from "../../assets/img/banner.png";

const Footer = () => {
  return (
    <FooterContainer>
      <TopSection>
        <Overlay />
        <ContentWrapper>
          <LogoContainer>
            <img src={logoBordeado} alt="Trabajo Social" />
          </LogoContainer>
          <LinksSection>
            <Column>
              <ColumnTitle>Centros y Laboratorios</ColumnTitle>
              <FooterLink href="/centro-aguas">
                Centro de Aguas y Saneamiento Ambiental
              </FooterLink>
              <FooterLink href="/geotecnia">Geotecnia</FooterLink>
              <FooterLink href="/hidraulica">Hidráulica</FooterLink>
              <FooterLink href="/pavimentos">Pavimentos y Asfaltos</FooterLink>
              <FooterLink href="/resistencia-materiales">
                Resistencia de Materiales
              </FooterLink>
            </Column>
            <Column>
              <ColumnTitle>Enlaces</ColumnTitle>
              <FooterLink href="https://www.umss.edu.bo/correos-y-plataformas-educativas/">
                Correo y Plataformas Educativas
              </FooterLink>
              <FooterLink href="https://sigea.hum.umss.edu.bo/">
                SIGEA
              </FooterLink>
              <FooterLink href="https://websis.umss.edu.bo/">
                WebSISS
              </FooterLink>
            </Column>
            <Column>
              <ColumnTitle>Postgrado</ColumnTitle>
              <FooterLink href="https://posgrado.hum.umss.edu.bo/">
                Postgrado Facultativo
              </FooterLink>
              <FooterLink href="https://posgrado.umss.edu.bo/">
                Postgrado Universitario
              </FooterLink>
            </Column>
            <Column>
              <ColumnTitle>Síguenos en</ColumnTitle>
              <SocialLinks>
                <SocialIcon href="https://facebook.com">
                  <FaFacebookF />
                </SocialIcon>
                <SocialIcon href="https://instagram.com">
                  <FaInstagram />
                </SocialIcon>
                <SocialIcon href="https://linkedin.com">
                  <FaLinkedinIn />
                </SocialIcon>
                <SocialIcon href="https://t.me">
                  <FaTelegramPlane />
                </SocialIcon>
                <SocialIcon href="https://youtube.com">
                  <FaYoutube />
                </SocialIcon>
              </SocialLinks>
            </Column>
          </LinksSection>
        </ContentWrapper>
      </TopSection>

      {/* 🔹 Sección inferior con copyright y redes sociales */}
      <BottomSection>
        <BottomContent>
          <BottomLogoContainer>
            <img src={logo} alt="Umss" />
          </BottomLogoContainer>
          <Copyright>
            DERECHOS RESERVADOS © {new Date().getFullYear()} -{" "}
            <span>UNIVERSIDAD MAYOR DE SAN SIMÓN</span>
          </Copyright>
        </BottomContent>
        <SocialMedia>
          <span>Visítanos en nuestras RRSS:</span>
          <SocialIcon href="https://www.facebook.com/UmssBolOficial/">
            <FaFacebookF />
          </SocialIcon>
          <SocialIcon href="https://www.instagram.com/umssboloficial/">
            <FaInstagram />
          </SocialIcon>
          <SocialIcon href="https://bo.linkedin.com/school/umssboloficial/">
            <FaLinkedinIn />
          </SocialIcon>
          <SocialIcon href="https://t.me/UmssBolOficial">
            <FaTelegramPlane />
          </SocialIcon>
          <SocialIcon href="https://www.youtube.com/c/UniversidadMayordeSanSimonOficial">
            <FaYoutube />
          </SocialIcon>
        </SocialMedia>
      </BottomSection>
    </FooterContainer>
  );
};

export default Footer;

// 📌 **Estilos Ajustados**
const FooterContainer = styled.footer`
  width: 100%;
  background-color: #003366;
  color: white;
  font-size: 0.9rem;
  overflow-x: hidden;
`;

const TopSection = styled.div`
  position: relative;
  background: url(${footerBackground}) no-repeat center center/cover;
  padding: 50px 5%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: left;

  @media (max-width: 768px) {
    padding: 50px 5%;
  }
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  max-width: 1200px;
  width: 100%;
  justify-content: space-between;
  align-items: flex-start;
  z-index: 2;
  gap: 30px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 20px;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;

  img {
    max-width: 280px;
    height: auto;
    object-fit: contain;
    border-radius: 15px;

    @media (max-width: 768px) {
      max-width: 200px;
    }
  }
`;

const LinksSection = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  width: 100%;
  max-width: 1000px;
  gap: 30px; /* 📌 Menos espacio entre columnas */

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 20px;
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 180px;
`;

const ColumnTitle = styled.h4`
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 12px;

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 10px;
  }
`;

const FooterLink = styled.a`
  text-decoration: none;
  color: white;
  font-size: 0.85rem;
  margin-bottom: 6px;
  transition: color 0.3s;

  &:hover {
    color: #ff6600;
  }

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 10px;
`;

const SocialIcon = styled.a`
  color: white;
  font-size: 1.4rem;
  transition: color 0.3s;

  &:hover {
    color: #ff6600;
  }

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const BottomSection = styled.div`
  background-blend-mode: multiply;
  background-image: url(${banner});
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 5%; /* 📌 Reducimos el padding para menor altura */
  background-color: #002a4c;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
  }
`;

const BottomContent = styled.div`
  display: flex;
  align-items: center;
  gap: 10px; /* 📌 Menos espacio entre logo y texto */

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 8px;
  }
`;

const BottomLogoContainer = styled.div`
  img {
    width: 45px;

    @media (max-width: 768px) {
      width: 40px;
    }
  }
`;

const Copyright = styled.p`
  font-size: 0.7rem;

  span {
    font-weight: bold;
    color: #ffcc00;
  }

  @media (max-width: 768px) {
    font-size: 0.6rem;
  }
`;

const SocialMedia = styled.div`
  display: flex;
  font-size: 0.8rem;
  align-items: center;
  gap: 8px; /* 📌 Menos espacio entre los íconos */
`;

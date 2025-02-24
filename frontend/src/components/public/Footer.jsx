import styled from "styled-components";

const Footer = () => {
  return (
    <FooterContainer>
      <p>&copy; {new Date().getFullYear()} Trabajo Social - Todos los derechos reservados.</p>
    </FooterContainer>
  );
};

export default Footer;

const FooterContainer = styled.footer`
  background-color: #222;
  color: white;
  text-align: center;
  padding: 10px;
  position: relative; /* Antes era fixed */
  width: 100%;
`;

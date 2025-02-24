import Navbar from "../components/public/Navbar";
import Footer from "../components/public/Footer";
import SocialBar from "../components/public/SocialBar"
import styled from "styled-components";



const PublicLayout = ({ children }) => {
  return (
    <LayoutContainer>
      <SocialBar />
      <Navbar />
      <Content>{children}</Content>
      <Footer />
    </LayoutContainer>
  );
};

export default PublicLayout;

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  justify-content: space-between;
`;

const Content = styled.main`
  flex-grow: 1;
  padding-bottom: 50px; /* Asegura que el contenido no esté sobre el footer */
`;

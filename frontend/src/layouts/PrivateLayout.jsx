import styled from "styled-components";
import Sidebar from "../components/admin/Sidebar";

const PrivateLayout = ({ children }) => {
  return (
    <LayoutContainer>
      <Sidebar />
      <MainContent>
        {children}
      </MainContent>
    </LayoutContainer>
  );
};

export default PrivateLayout;

// Estilos
const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;

const MainContent = styled.div`
  flex-grow: 1;
  padding: 20px;
  background: #f4f4f4;
`;

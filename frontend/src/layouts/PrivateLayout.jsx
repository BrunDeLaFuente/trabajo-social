import { useState } from "react";
import styled from "styled-components";
import Sidebar from "../components/admin/Sidebar";

const PrivateLayout = ({ children }) => {
  const [sidebarWidth, setSidebarWidth] = useState(250);

  // Function to update sidebar width
  const handleSidebarResize = (width) => {
    setSidebarWidth(width);
  };

  return (
    <LayoutContainer>
      <Sidebar onResize={handleSidebarResize} />
      <MainContent sidebarWidth={sidebarWidth}>{children}</MainContent>
    </LayoutContainer>
  );
};

export default PrivateLayout;

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden; /* ✅ solución al scroll horizontal */
`;

const MainContent = styled.main`
  flex: 1;
  margin-left: ${({ sidebarWidth }) => sidebarWidth}px;
  padding: 20px;
  transition: margin-left 0.3s ease;

  @media (max-width: 768px) {
    margin-left: 0;
    padding: 60px 20px 20px;
  }
`;

import { Link } from "react-router-dom";
import styled from "styled-components";
import { FaHome, FaInfo, FaCalendar, FaSignOutAlt } from "react-icons/fa";
import Logout from "./Logout"; // ✅ Importamos el botón de logout

const Sidebar = () => {
  return (
    <SidebarContainer>
      <NavItem to="/admin"> <FaHome /> Inicio </NavItem>
      <NavItem to="/admin/informacion-carrera"> <FaInfo /> Información Carrera </NavItem>
      <NavItem to="/admin/eventos"> <FaCalendar /> Eventos </NavItem>
      <LogoutButton> <Logout /> </LogoutButton> {/* ✅ Aquí usamos el componente Logout */}
    </SidebarContainer>
  );
};

export default Sidebar;

// 📌 Estilos
const SidebarContainer = styled.div`
  width: 250px;
  height: 100vh;
  background: #002f6c;
  color: white;
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

const NavItem = styled(Link)`
  color: white;
  text-decoration: none;
  font-size: 1rem;
  padding: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: background 0.3s;

  &:hover {
    background: #0047a3;
  }
`;

const LogoutButton = styled.div`
  margin-top: auto;
  padding: 15px;
  text-align: center;
  cursor: pointer;
`;

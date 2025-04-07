import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Logout from "./Logout";
import logo from "../../assets/img/logo-ts.png";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import {
  Home,
  Users,
  Briefcase,
  BookOpen,
  Calendar,
  FileText,
  LogOut,
  ChevronDown,
  ChevronUp,
  Menu,
  X,
} from "lucide-react"

// Sidebar width constants
const SIDEBAR_EXPANDED_WIDTH = 250
const SIDEBAR_COLLAPSED_WIDTH = 70
const SIDEBAR_MOBILE_WIDTH = 0

const Sidebar = ({ onResize }) => {
  const [isOpen, setIsOpen] = useState(true)
  const [collapsed, setCollapsed] = useState(false)
  const [openSubMenus, setOpenSubMenus] = useState({})

  const { user } = useContext(AuthContext);
  const username = user?.name || "Admin User";

  // Toggle sidebar on mobile
  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  // Toggle sidebar collapse on desktop
  const toggleCollapse = () => {
    setCollapsed(!collapsed)
  }

  // Toggle submenu
  const toggleSubMenu = (menuName) => {
    setOpenSubMenus({
      ...openSubMenus,
      [menuName]: !openSubMenus[menuName],
    })
  }

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCollapsed(false)
        if (window.innerWidth < 576) {
          setIsOpen(false)
        }
      } else {
        setIsOpen(true)
      }
    }

    window.addEventListener("resize", handleResize)
    handleResize() // Initialize on mount

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Notify parent component about sidebar width changes
  useEffect(() => {
    let currentWidth = SIDEBAR_MOBILE_WIDTH

    if (isOpen) {
      currentWidth = collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_EXPANDED_WIDTH
    }

    if (window.innerWidth < 768) {
      currentWidth = 0 // On mobile, content takes full width
    }

    if (onResize) {
      onResize(currentWidth)
    }
  }, [isOpen, collapsed, onResize])

  return (
    <>
      <ToggleButton isOpen={isOpen} onClick={toggleSidebar}>
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </ToggleButton>

      {window.innerWidth >= 768 && (
        <CollapseButton onClick={toggleCollapse}>
          {collapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
        </CollapseButton>
      )}

      <Overlay isOpen={isOpen} onClick={toggleSidebar} />
      <SidebarContainer isOpen={isOpen} collapsed={collapsed}>
        <SidebarHeader>
          <ProfileImage>
            <img src={logo} alt="Profile" />
          </ProfileImage>
          {!collapsed && <Username>{username}</Username>}
        </SidebarHeader>
        <NavMenu>
          {/* Inicio */}
          <NavItem>
            <NavLink to="/admin" collapsed={collapsed}>
              <Home size={20} />
              <span>Inicio</span>
            </NavLink>
          </NavItem>

          {/* Usuarios - Now with dropdown */}
          <NavItem>
            <NavButton collapsed={collapsed} onClick={() => toggleSubMenu("usuarios")}>
              <Users size={20} />
              <span>Usuarios</span>
              <div className="chevron">
                {openSubMenus.usuarios ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            </NavButton>
            <SubMenu isOpen={openSubMenus.usuarios} collapsed={collapsed}>
              <SubMenuItem>
                <SubMenuLink to="/admin/usuarios">Usuarios</SubMenuLink>
              </SubMenuItem>
              <SubMenuItem>
                <SubMenuLink to="/admin/cambiar-contrasena">Cambiar contraseña</SubMenuLink>
              </SubMenuItem>
            </SubMenu>
          </NavItem>

          {/* Carrera */}
          <NavItem>
            <NavButton collapsed={collapsed} onClick={() => toggleSubMenu("carrera")}>
              <BookOpen size={20} />
              <span>Carrera</span>
              <div className="chevron">
                {openSubMenus.carrera ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            </NavButton>
            <SubMenu isOpen={openSubMenus.carrera} collapsed={collapsed}>
              <SubMenuItem>
                <SubMenuLink to="/admin/informacion-carrera">Información</SubMenuLink>
              </SubMenuItem>
              <SubMenuItem>
                <SubMenuLink to="/admin/malla-curricular">Malla curricular</SubMenuLink>
              </SubMenuItem>
              <SubMenuItem>
                <SubMenuLink to="/admin/redes-sociales">Redes sociales</SubMenuLink>
              </SubMenuItem>
            </SubMenu>
          </NavItem>

          {/* Personal */}
          <NavItem>
            <NavButton collapsed={collapsed} onClick={() => toggleSubMenu("personal")}>
              <Briefcase size={20} />
              <span>Personal</span>
              <div className="chevron">
                {openSubMenus.personal ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            </NavButton>
            <SubMenu isOpen={openSubMenus.personal} collapsed={collapsed}>
              <SubMenuItem>
                <SubMenuLink to="/admin/docentes">Docentes</SubMenuLink>
              </SubMenuItem>
              <SubMenuItem>
                <SubMenuLink to="/admin/administrativos">Administrativos</SubMenuLink>
              </SubMenuItem>
              <SubMenuItem>
                <SubMenuLink to="/admin/autoridades">Autoridades</SubMenuLink>
              </SubMenuItem>
            </SubMenu>
          </NavItem>

          {/* Noticias */}
          <NavItem>
            <NavButton collapsed={collapsed} onClick={() => toggleSubMenu("noticias")}>
              <FileText size={20} />
              <span>Noticias</span>
              <div className="chevron">
                {openSubMenus.noticias ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            </NavButton>
            <SubMenu isOpen={openSubMenus.noticias} collapsed={collapsed}>
              <SubMenuItem>
                <SubMenuLink to="/admin/publicaciones">Publicaciones</SubMenuLink>
              </SubMenuItem>
              <SubMenuItem>
                <SubMenuLink to="/admin/comunicados">Comunicados</SubMenuLink>
              </SubMenuItem>
            </SubMenu>
          </NavItem>

          {/* Eventos */}
          <NavItem>
            <NavButton collapsed={collapsed} onClick={() => toggleSubMenu("eventos")}>
              <Calendar size={20} />
              <span>Eventos</span>
              <div className="chevron">
                {openSubMenus.eventos ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            </NavButton>
            <SubMenu isOpen={openSubMenus.eventos} collapsed={collapsed}>
              <SubMenuItem>
                <SubMenuLink to="/admin/eventos-sin-costo">Sin costo</SubMenuLink>
              </SubMenuItem>
              <SubMenuItem>
                <SubMenuLink to="/admin/eventos-con-costo">Con costo</SubMenuLink>
              </SubMenuItem>
              <SubMenuItem>
                <SubMenuLink to="/admin/eventos-dashboard">Dashboard</SubMenuLink>
              </SubMenuItem>
            </SubMenu>
          </NavItem>

          {/* Salir - Updated to properly use the Logout component */}
          <NavItem>
            <LogoutButton collapsed={collapsed}>
              <LogOut size={20} />
              <span>Salir</span>
              <Logout />
            </LogoutButton>
          </NavItem>
        </NavMenu>
      </SidebarContainer>
    </>
  )
}

export default Sidebar;

// Styled Components
const SidebarContainer = styled.div`
  background-color: #2c3e50;
  color: white;
  width: ${({ isOpen, collapsed }) => {
    if (!isOpen) return "0px"
    return collapsed ? `${SIDEBAR_COLLAPSED_WIDTH}px` : `${SIDEBAR_EXPANDED_WIDTH}px`
  }};
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  transition: width 0.3s ease;
  overflow-y: auto;
  z-index: 1000;

  @media (min-width: 768px) {
    width: ${({ isOpen, collapsed }) => {
    if (!isOpen) return "0px"
    return collapsed ? `${SIDEBAR_COLLAPSED_WIDTH}px` : `${SIDEBAR_EXPANDED_WIDTH}px`
  }};
  }
`

const SidebarHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`

const ProfileImage = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #34495e;
  margin-bottom: 10px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

const Username = styled.h3`
  font-size: 16px;
  margin: 0;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 90%;
`

const NavMenu = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`

const NavItem = styled.li`
  width: 100%;
`

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  padding: 12px 15px;
  color: white;
  text-decoration: none;
  transition: background-color 0.2s;
  position: relative;

  &:hover {
    background-color: #34495e;
  }

  &.active {
    background-color: #3498db;
  }

  svg {
    margin-right: ${({ collapsed }) => (collapsed ? "0" : "10px")};
  }

  span {
    display: ${({ collapsed }) => (collapsed ? "none" : "block")};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`

const NavButton = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 12px 15px;
  color: white;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.2s;
  position: relative;

  &:hover {
    background-color: #34495e;
  }

  svg {
    margin-right: ${({ collapsed }) => (collapsed ? "0" : "10px")};
  }

  span {
    display: ${({ collapsed }) => (collapsed ? "none" : "block")};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .chevron {
    position: absolute;
    right: 15px;
    display: ${({ collapsed }) => (collapsed ? "none" : "block")};
  }
`

const LogoutButton = styled(NavButton)`
  margin-top: auto;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  
  &:hover {
    background-color: #c0392b;
  }
`

const SubMenu = styled.ul`
  list-style: none;
  padding-left: ${({ collapsed }) => (collapsed ? "0" : "20px")};
  background-color: #34495e;
  max-height: ${({ isOpen }) => (isOpen ? "500px" : "0")};
  overflow: hidden;
  transition: max-height 0.3s ease;
`

const SubMenuItem = styled.li`
  width: 100%;
`

const SubMenuLink = styled(Link)`
  display: block;
  padding: 10px 15px;
  color: white;
  text-decoration: none;
  transition: background-color 0.2s;
  font-size: 14px;

  &:hover {
    background-color: #2c3e50;
  }

  &.active {
    background-color: #2980b9;
  }
`

const ToggleButton = styled.button`
  position: fixed;
  top: 10px;
  left: ${({ isOpen }) => (isOpen ? "250px" : "10px")};
  z-index: 1001;
  background-color: #2c3e50;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: left 0.3s ease;

  @media (min-width: 768px) {
    display: none;
  }
`

const CollapseButton = styled.button`
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 1001;
  background-color: #2c3e50;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: none;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  @media (min-width: 768px) {
    display: flex;
  }
`

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: ${({ isOpen }) => (isOpen ? "block" : "none")};

  @media (min-width: 768px) {
    display: none;
  }
`


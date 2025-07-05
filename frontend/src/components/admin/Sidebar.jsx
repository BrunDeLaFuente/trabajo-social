import React, { useState, useContext } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Avatar,
  Typography,
  Box,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Home,
  People,
  Work,
  School,
  Article,
  Event,
  ExpandLess,
  ExpandMore,
  Menu,
  Close,
  Key,
  Info,
  Share,
  Assignment,
  SupervisorAccount,
  Groups,
  AdminPanelSettings,
  Newspaper,
  CalendarMonth,
  BarChart,
  ExitToApp,
  LocalLibrary,
  PeopleAlt,
  RecordVoiceOver,
} from "@mui/icons-material";
import { AuthContext } from "../../context/AuthContext";
import Logout from "./Logout";
import logo from "../../assets/img/logo-ts.png";

const DRAWER_WIDTH = 280;
const DRAWER_WIDTH_COLLAPSED = 70;

const menuItems = [
  {
    title: "Inicio",
    url: "/admin",
    icon: Home,
    color: "#2196F3",
  },
  {
    title: "Usuarios",
    icon: People,
    color: "#9C27B0",
    items: [
      {
        title: "Usuarios",
        url: "/admin/usuarios",
        icon: Groups,
        adminOnly: true,
      },
      {
        title: "Cambiar contraseña",
        url: "/admin/cambiar-contrasena",
        icon: Key,
      },
    ],
  },
  {
    title: "Carrera",
    icon: School,
    color: "#4CAF50",
    items: [
      {
        title: "Información",
        url: "/admin/informacion-carrera",
        icon: Info,
      },
      {
        title: "Malla curricular",
        url: "/admin/malla-curricular",
        icon: Assignment,
      },
      {
        title: "Redes sociales",
        url: "/admin/redes-sociales",
        icon: Share,
      },
      {
        title: "Trámites",
        url: "/admin/tramites",
        icon: Assignment,
      },
    ],
  },
  {
    title: "Personal",
    icon: Work,
    color: "#FF9800",
    items: [
      {
        title: "Docentes",
        url: "/admin/docentes",
        icon: SupervisorAccount,
      },
      {
        title: "Administrativos",
        url: "/admin/administrativos",
        icon: Groups,
      },
      {
        title: "Autoridades",
        url: "/admin/autoridades",
        icon: AdminPanelSettings,
      },
    ],
  },
  {
    title: "Noticias",
    icon: Article,
    color: "#F44336",
    items: [
      {
        title: "Publicaciones",
        url: "/admin/noticias",
        icon: Newspaper,
      },
      //      {
      //        title: "Biblioteca",
      //        url: "/admin/biblioteca",
      //        icon: LocalLibrary,
      //      },
    ],
  },
  {
    title: "Eventos",
    icon: Event,
    color: "#673AB7",
    items: [
      {
        title: "Actividades",
        url: "/admin/eventos",
        icon: CalendarMonth,
      },
      {
        title: "Asistentes",
        url: "/admin/eventos/asistentes",
        icon: PeopleAlt,
      },
      {
        title: "Expositores",
        url: "/admin/eventos/expositores",
        icon: RecordVoiceOver,
      },
      {
        title: "Dashboard",
        url: "/admin/eventos-dashboard",
        icon: BarChart,
      },
    ],
  },
];

const Sidebar = ({ onResize }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [openSubMenus, setOpenSubMenus] = useState({});
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const username = user?.name || "Admin User";
  const userEmail = user?.email || "admin@example.com";

  // Toggle mobile drawer
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Toggle collapse on desktop
  const handleCollapseToggle = () => {
    setCollapsed(!collapsed);
  };

  // Toggle submenu
  const toggleSubMenu = (menuName) => {
    setOpenSubMenus((prev) => ({
      ...prev,
      [menuName]: !prev[menuName],
    }));
  };

  // Check if route is active
  const isActiveRoute = (url) => {
    return location.pathname === url;
  };

  // Check if group has active child
  const hasActiveChild = (items) => {
    return items?.some((item) => isActiveRoute(item.url));
  };

  // Notify parent about width changes
  React.useEffect(() => {
    const currentWidth = isMobile
      ? 0
      : collapsed
      ? DRAWER_WIDTH_COLLAPSED
      : DRAWER_WIDTH;
    if (onResize) {
      onResize(currentWidth);
    }
  }, [collapsed, isMobile, onResize]);

  const drawerContent = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          gap: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
          minHeight: 80,
          position: "relative",
        }}
      >
        {/* Botón de cerrar móvil - movido dentro del header */}
        {isMobile && (
          <IconButton
            onClick={handleDrawerToggle}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              zIndex: 1,
              backgroundColor: "rgba(0,0,0,0.1)",
              "&:hover": {
                backgroundColor: "rgba(0,0,0,0.2)",
              },
            }}
          >
            <Close />
          </IconButton>
        )}

        <Avatar
          src={logo}
          sx={{
            width: collapsed ? 32 : 48,
            height: collapsed ? 32 : 48,
            transition: "all 0.3s ease",
          }}
        />
        {!collapsed && (
          <Box sx={{ minWidth: 0, flex: 1, pr: isMobile ? 5 : 0 }}>
            <Typography variant="subtitle1" fontWeight="bold" noWrap>
              {username}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {userEmail}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Navigation */}
      <Box sx={{ flex: 1, overflow: "auto" }}>
        <List sx={{ pt: 1 }}>
          {menuItems.map((item) => {
            if (item.items) {
              // Menu with submenu
              const isOpen = openSubMenus[item.title];
              const hasActive = hasActiveChild(item.items);

              return (
                <React.Fragment key={item.title}>
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => toggleSubMenu(item.title)}
                      sx={{
                        minHeight: 48,
                        px: 2.5,
                        backgroundColor: hasActive
                          ? "action.selected"
                          : "transparent",
                        "&:hover": {
                          backgroundColor: "action.hover",
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: collapsed ? 0 : 3,
                          justifyContent: "center",
                          color: item.color,
                        }}
                      >
                        <item.icon />
                      </ListItemIcon>
                      {!collapsed && (
                        <>
                          <ListItemText
                            primary={item.title}
                            sx={{ opacity: 1 }}
                          />
                          {isOpen ? <ExpandLess /> : <ExpandMore />}
                        </>
                      )}
                    </ListItemButton>
                  </ListItem>

                  {!collapsed && (
                    <Collapse in={isOpen} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {item.items.map((subItem) => {
                          if (subItem.adminOnly && !user?.is_admin) {
                            return null;
                          }

                          const isActive = isActiveRoute(subItem.url);

                          return (
                            <ListItem key={subItem.title} disablePadding>
                              <ListItemButton
                                component={Link}
                                to={subItem.url}
                                sx={{
                                  pl: 4,
                                  minHeight: 40,
                                  backgroundColor: isActive
                                    ? "primary.main"
                                    : "transparent",
                                  color: isActive
                                    ? "primary.contrastText"
                                    : "text.primary",
                                  "&:hover": {
                                    backgroundColor: isActive
                                      ? "primary.dark"
                                      : "action.hover",
                                  },
                                }}
                              >
                                <ListItemIcon
                                  sx={{
                                    minWidth: 0,
                                    mr: 2,
                                    justifyContent: "center",
                                    color: "inherit",
                                  }}
                                >
                                  <subItem.icon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText
                                  primary={subItem.title}
                                  primaryTypographyProps={{
                                    fontSize: "0.875rem",
                                  }}
                                />
                              </ListItemButton>
                            </ListItem>
                          );
                        })}
                      </List>
                    </Collapse>
                  )}
                </React.Fragment>
              );
            } else {
              // Simple menu item
              const isActive = isActiveRoute(item.url);

              return (
                <ListItem key={item.title} disablePadding>
                  <Tooltip
                    title={collapsed ? item.title : ""}
                    placement="right"
                  >
                    <ListItemButton
                      component={Link}
                      to={item.url}
                      sx={{
                        minHeight: 48,
                        px: 2.5,
                        backgroundColor: isActive
                          ? "primary.main"
                          : "transparent",
                        color: isActive
                          ? "primary.contrastText"
                          : "text.primary",
                        "&:hover": {
                          backgroundColor: isActive
                            ? "primary.dark"
                            : "action.hover",
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: collapsed ? 0 : 3,
                          justifyContent: "center",
                          color: isActive ? "inherit" : item.color,
                        }}
                      >
                        <item.icon />
                      </ListItemIcon>
                      {!collapsed && (
                        <ListItemText
                          primary={item.title}
                          sx={{ opacity: 1 }}
                        />
                      )}
                    </ListItemButton>
                  </Tooltip>
                </ListItem>
              );
            }
          })}
        </List>
      </Box>

      {/* Footer */}
      <Box sx={{ borderTop: "1px solid", borderColor: "divider" }}>
        <ListItem disablePadding>
          <ListItemButton
            sx={{
              minHeight: 48,
              px: 2.5,
              "&:hover": {
                backgroundColor: "error.light",
                color: "error.contrastText",
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: collapsed ? 0 : 3,
                justifyContent: "center",
                color: "error.main",
              }}
            >
              <ExitToApp />
            </ListItemIcon>
            {!collapsed && (
              <>
                <ListItemText primary="Cerrar sesión" />
                <Logout />
              </>
            )}
          </ListItemButton>
        </ListItem>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Mobile Toggle Button - Solo se muestra cuando el menú está cerrado */}
      {isMobile && !mobileOpen && (
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{
            position: "fixed",
            top: 16,
            left: 16,
            zIndex: 1300,
            backgroundColor: "primary.main",
            color: "primary.contrastText",
            "&:hover": {
              backgroundColor: "primary.dark",
            },
          }}
        >
          <Menu />
        </IconButton>
      )}

      {/* Desktop Collapse Button */}
      {!isMobile && (
        <IconButton
          onClick={handleCollapseToggle}
          sx={{
            position: "fixed",
            top: 16,
            right: 16,
            zIndex: 1200,
            backgroundColor: "primary.main",
            color: "primary.contrastText",
            "&:hover": {
              backgroundColor: "primary.dark",
            },
          }}
        >
          {collapsed ? <ExpandMore /> : <ExpandLess />}
        </IconButton>
      )}

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: DRAWER_WIDTH,
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: collapsed ? DRAWER_WIDTH_COLLAPSED : DRAWER_WIDTH,
            transition: "width 0.3s ease",
            overflowX: "hidden",
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Sidebar;

import { useState } from "react";
import { Box } from "@mui/material";
import MaterialSidebar from "../components/admin/Sidebar";

const PrivateLayout = ({ children }) => {
  const [sidebarWidth, setSidebarWidth] = useState(280);

  const handleSidebarResize = (width) => {
    setSidebarWidth(width);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <MaterialSidebar onResize={handleSidebarResize} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: { xs: 0, md: `${sidebarWidth}px` },
          transition: "margin-left 0.3s ease",
          minHeight: "100vh",
          backgroundColor: "#f5f5f5",
        }}
      >
        {/* Main Content */}
        <Box sx={{ p: 3, pt: { xs: 8, md: 3 } }}>
          <Box sx={{ mx: "auto" }}>{children}</Box>
        </Box>
      </Box>
    </Box>
  );
};

export default PrivateLayout;

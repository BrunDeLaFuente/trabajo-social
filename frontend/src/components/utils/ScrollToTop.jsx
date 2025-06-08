import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Solo aplicar scroll al top para rutas que empiecen con esta base
    const scrollRoutes = [
      "/pregrado/modalidades-titulacion",
      "/noticias/anuncios",
    ];

    const shouldScroll = scrollRoutes.some((route) =>
      pathname.startsWith(route)
    );

    if (shouldScroll) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop;

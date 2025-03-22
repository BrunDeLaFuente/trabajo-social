import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Logout = () => {
  const { logout } = useContext(AuthContext);

  return <button onClick={logout}>Cerrar Sesión</button>;
};

export default Logout;

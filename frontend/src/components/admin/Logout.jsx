import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import styled from "styled-components";

const Logout = () => {
  const { logout } = useContext(AuthContext)

  return <LogoutButtonHidden onClick={logout} />
}

export default Logout;

const LogoutButtonHidden = styled.button`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
`


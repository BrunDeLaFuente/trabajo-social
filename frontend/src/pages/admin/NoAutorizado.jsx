import styled from "styled-components";
import { FaLock } from "react-icons/fa";

const NoAutorizado = () => {
  return (
    <Container>
      <IconWrapper>
        <FaLock size={64} />
      </IconWrapper>
      <Title>Acceso no autorizado</Title>
      <Message>No tienes permiso para ver esta página.</Message>
    </Container>
  );
};

export default NoAutorizado;

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
  background-color: #fef2f2;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(255, 0, 0, 0.15);
`;

const IconWrapper = styled.div`
  color: #dc2626;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #b91c1c;
  margin-bottom: 10px;
  font-weight: 700;
`;

const Message = styled.p`
  font-size: 1.125rem;
  color: #7f1d1d;
`;

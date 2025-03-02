import styled, { keyframes } from "styled-components";
import HeroSection from "../../../components/public/HeroSection";
import iconoUser from "../../../assets/img/user-icon.png";
import { FaUserTie } from "react-icons/fa";

const autoridadesData = [
  {
    nombre: "PhD. Ing. Mauricio F. Villazón Gómez",
    cargo: "Director de Carrera",
    correo1: "mauricio.villazon@fcyt.umss.edu.bo",
    correo2: "direccion.civil@fcyt.umss.edu.bo",
    imagen: iconoUser, // Ruta de icono en assets
  },
  {
    nombre: "Ing. Jaime Ayllón Acosta",
    cargo: "Jefe de Departamento",
    correo1: "jaimeayllon.a@fcyt.umss.edu.bo",
    correo2: "departamento.civil@fcyt.umss.edu.bo",
    imagen: "", // Ruta de icono en assets
  },
  {
    nombre: "PhD. Ing. Mauricio F. Villazón Gómez",
    cargo: "Director de Carrera",
    correo1: "mauricio.villazon@fcyt.umss.edu.bo",
    correo2: "direccion.civil@fcyt.umss.edu.bo",
    imagen: "", // Ruta de icono en assets
  },
  {
    nombre: "Ing. Jaime Ayllón Acosta",
    cargo: "Jefe de Departamento",
    correo1: "jaimeayllon.a@fcyt.umss.edu.bo",
    correo2: "departamento.civil@fcyt.umss.edu.bo",
    imagen: "", // Ruta de icono en assets
  },
  {
    nombre: "PhD. Ing. Mauricio F. Villazón Gómez",
    cargo: "Director de Carrera",
    correo1: "mauricio.villazon@fcyt.umss.edu.bo",
    correo2: "direccion.civil@fcyt.umss.edu.bo",
    imagen: "", // Ruta de icono en assets
  },
  {
    nombre: "Ing. Jaime Ayllón Acosta",
    cargo: "Jefe de Departamento",
    correo1: "jaimeayllon.a@fcyt.umss.edu.bo",
    correo2: "departamento.civil@fcyt.umss.edu.bo",
    imagen: "", // Ruta de icono en assets
  },
  {
    nombre: "PhD. Ing. Mauricio F. Villazón Gómez",
    cargo: "Director de Carrera",
    correo1: "mauricio.villazon@fcyt.umss.edu.bo",
    correo2: "direccion.civil@fcyt.umss.edu.bo",
    imagen: "", // Ruta de icono en assets
  },
  {
    nombre: "Ing. Jaime Ayllón Acosta",
    cargo: "Jefe de Departamento",
    correo1: "jaimeayllon.a@fcyt.umss.edu.bo",
    correo2: "departamento.civil@fcyt.umss.edu.bo",
    imagen: "", // Ruta de icono en assets
  },
];

const Autoridades = () => {
  return (
    <PageContainer>
      <HeroSection title="Autoridades de la Carrera" />
      <ContentWrapper>
        {autoridadesData.map((autoridad, index) => (
          <Card key={index}>
            <ImageContainer>
              {autoridad.imagen ? (
                <ProfileImage src={autoridad.imagen} alt={autoridad.nombre} />
              ) : (
                <IconPlaceholder />
              )}
            </ImageContainer>
            <Name>{autoridad.nombre}</Name>
            <Position>{autoridad.cargo}</Position>
            <EmailContainer>
              <EmailLabel>Correo:</EmailLabel> {autoridad.correo1}
            </EmailContainer>
            <EmailContainer>{autoridad.correo2}</EmailContainer>
          </Card>
        ))}
      </ContentWrapper>
    </PageContainer>
  );
};

export default Autoridades;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const PageContainer = styled.div`
  width: 100%;
  overflow-x: hidden;
  background-color: #ffffff;
`;

const ContentWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 50px;
  flex-wrap: wrap;
  padding: 30px 5%;
  margin-top: 30px;
`;

const Card = styled.div`
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 300px;
  animation: ${fadeIn} 0.6s ease-out;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
  }
`;

const ImageContainer = styled.div`
  width: 150px;
  height: 150px;
  margin: 0 auto 15px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #ddd;
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const IconPlaceholder = styled(FaUserTie)`
  font-size: 100px;
  color: #666;
  margin-top: 20px;
`;

const Name = styled.h3`
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
`;

const Position = styled.p`
  font-size: 1rem;
  color: #0056b3;
  font-weight: bold;
  margin-bottom: 10px;
`;

const EmailContainer = styled.p`
  font-size: 0.9rem;
  color: #444;
  margin: 3px 0;
`;

const EmailLabel = styled.span`
  font-weight: bold;
  color: #000;
`;

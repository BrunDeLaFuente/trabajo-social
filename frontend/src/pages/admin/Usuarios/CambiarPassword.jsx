import { useState, useContext } from "react";
import styled, { keyframes } from "styled-components";
import {
  Eye,
  EyeOff,
  Lock,
  User,
  Mail,
  Phone,
  Key,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { AuthContext } from "../../../context/AuthContext";
import api from "../../../utils/api";

const CambiarPassword = () => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    password_actual: "",
    nueva_password: "",
    nueva_password_confirmation: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.password_actual.trim()) {
      newErrors.password_actual = "La contraseña actual es obligatoria";
    }

    if (!formData.nueva_password.trim()) {
      newErrors.nueva_password = "La nueva contraseña es obligatoria";
    } else if (
      formData.nueva_password.length < 10 ||
      formData.nueva_password.length > 15
    ) {
      newErrors.nueva_password =
        "La nueva contraseña debe tener entre 10 y 15 caracteres";
    }

    if (!formData.nueva_password_confirmation.trim()) {
      newErrors.nueva_password_confirmation =
        "Debe confirmar la nueva contraseña";
    } else if (
      formData.nueva_password !== formData.nueva_password_confirmation
    ) {
      newErrors.nueva_password_confirmation = "Las contraseñas no coinciden";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setSuccess(false);

    try {
      await api.post("/cambiar-password", formData);

      setSuccess(true);
      setFormData({
        password_actual: "",
        nueva_password: "",
        nueva_password_confirmation: "",
      });
      setErrors({});

      // Ocultar mensaje de éxito después de 5 segundos
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (error) {
      console.error("Error al cambiar contraseña:", error);

      if (error.response?.data?.error) {
        // Error de contraseña actual incorrecta
        setErrors({ password_actual: error.response.data.error });
      } else if (error.response?.data?.errors) {
        // Errores de validación del backend
        const backendErrors = {};
        Object.keys(error.response.data.errors).forEach((key) => {
          backendErrors[key] = error.response.data.errors[key][0];
        });
        setErrors(backendErrors);
      } else {
        setErrors({
          general: "Error al cambiar la contraseña. Inténtalo de nuevo.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container2>
      <Container>
        <Title>
          <Key size={28} />
          Cambiar Contraseña
        </Title>

        <UserInfoCard>
          <UserInfoTitle>
            <User size={20} />
            Información del Usuario
          </UserInfoTitle>
          <UserInfoGrid>
            <UserInfoItem>
              <UserInfoIcon>
                <User size={18} />
              </UserInfoIcon>
              <UserInfoContent>
                <UserInfoLabel>Nombre</UserInfoLabel>
                <UserInfoValue>{user?.name || "No disponible"}</UserInfoValue>
              </UserInfoContent>
            </UserInfoItem>

            <UserInfoItem>
              <UserInfoIcon>
                <Mail size={18} />
              </UserInfoIcon>
              <UserInfoContent>
                <UserInfoLabel>Correo</UserInfoLabel>
                <UserInfoValue>{user?.email || "No disponible"}</UserInfoValue>
              </UserInfoContent>
            </UserInfoItem>

            <UserInfoItem>
              <UserInfoIcon>
                <Phone size={18} />
              </UserInfoIcon>
              <UserInfoContent>
                <UserInfoLabel>Celular</UserInfoLabel>
                <UserInfoValue>
                  {user?.celular_user || "No registrado"}
                </UserInfoValue>
              </UserInfoContent>
            </UserInfoItem>
          </UserInfoGrid>
        </UserInfoCard>

        <PasswordCard>
          <PasswordTitle>
            <Lock size={20} />
            Cambiar Contraseña
          </PasswordTitle>

          {success && (
            <SuccessMessage>
              <CheckCircle size={18} />
              Contraseña cambiada exitosamente
            </SuccessMessage>
          )}

          {errors.general && (
            <ErrorMessage>
              <AlertCircle size={14} />
              {errors.general}
            </ErrorMessage>
          )}

          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="password_actual">
                <Lock size={16} />
                Contraseña Actual
              </Label>
              <InputContainer>
                <Input
                  type={showPasswords.current ? "text" : "password"}
                  id="password_actual"
                  name="password_actual"
                  value={formData.password_actual}
                  onChange={handleInputChange}
                  placeholder="Ingresa tu contraseña actual"
                  $hasError={!!errors.password_actual}
                />
                <ToggleButton
                  type="button"
                  onClick={() => togglePasswordVisibility("current")}
                >
                  {showPasswords.current ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </ToggleButton>
              </InputContainer>
              {errors.password_actual && (
                <ErrorMessage>
                  <AlertCircle size={14} />
                  {errors.password_actual}
                </ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="nueva_password">
                <Key size={16} />
                Nueva Contraseña (10-15 caracteres)
              </Label>
              <InputContainer>
                <Input
                  type={showPasswords.new ? "text" : "password"}
                  id="nueva_password"
                  name="nueva_password"
                  value={formData.nueva_password}
                  onChange={handleInputChange}
                  placeholder="Ingresa tu nueva contraseña"
                  $hasError={!!errors.nueva_password}
                />
                <ToggleButton
                  type="button"
                  onClick={() => togglePasswordVisibility("new")}
                >
                  {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                </ToggleButton>
              </InputContainer>
              {errors.nueva_password && (
                <ErrorMessage>
                  <AlertCircle size={14} />
                  {errors.nueva_password}
                </ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="nueva_password_confirmation">
                <Key size={16} />
                Confirmar Nueva Contraseña
              </Label>
              <InputContainer>
                <Input
                  type={showPasswords.confirm ? "text" : "password"}
                  id="nueva_password_confirmation"
                  name="nueva_password_confirmation"
                  value={formData.nueva_password_confirmation}
                  onChange={handleInputChange}
                  placeholder="Confirma tu nueva contraseña"
                  $hasError={!!errors.nueva_password_confirmation}
                />
                <ToggleButton
                  type="button"
                  onClick={() => togglePasswordVisibility("confirm")}
                >
                  {showPasswords.confirm ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </ToggleButton>
              </InputContainer>
              {errors.nueva_password_confirmation && (
                <ErrorMessage>
                  <AlertCircle size={14} />
                  {errors.nueva_password_confirmation}
                </ErrorMessage>
              )}
            </FormGroup>

            <SubmitButton type="submit" disabled={loading}>
              {loading ? (
                <>
                  <LoadingSpinner />
                  Cambiando contraseña...
                </>
              ) : (
                <>
                  <CheckCircle size={18} />
                  Cambiar Contraseña
                </>
              )}
            </SubmitButton>
          </Form>
        </PasswordCard>
      </Container>
    </Container2>
  );
};

export default CambiarPassword;

// Animaciones
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

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Container2 = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem 1rem;

  @media (max-width: 768px) {
    padding: 1rem 0.5rem;
  }
`;

// Styled Components
const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  animation: ${fadeIn} 0.6s ease-out;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const UserInfoCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  animation: ${slideUp} 0.6s ease-out;
  border: 1px solid #e5e7eb;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const UserInfoTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const UserInfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const UserInfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
`;

const UserInfoIcon = styled.div`
  color: #6b7280;
  flex-shrink: 0;
`;

const UserInfoContent = styled.div`
  flex: 1;
`;

const UserInfoLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 500;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const UserInfoValue = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-top: 0.25rem;
`;

const PasswordCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  animation: ${slideUp} 0.8s ease-out;
  border: 1px solid #e5e7eb;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const PasswordTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const InputContainer = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  padding-right: 3rem;
  border: 2px solid ${(props) => (props.$hasError ? "#ef4444" : "#d1d5db")};
  border-radius: 8px;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  background: white;

  &:focus {
    outline: none;
    border-color: ${(props) => (props.$hasError ? "#ef4444" : "#3b82f6")};
    box-shadow: 0 0 0 3px
      ${(props) =>
        props.$hasError ? "rgba(239, 68, 68, 0.1)" : "rgba(59, 130, 246, 0.1)"};
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const ToggleButton = styled.button`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    color: #374151;
    background: #f3f4f6;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 0.75rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.25rem;
`;

const SuccessMessage = styled.div`
  color: #10b981;
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  border-radius: 8px;
  margin-bottom: 1rem;
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border: none;
  padding: 0.875rem 2rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

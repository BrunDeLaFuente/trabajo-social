"use client"

import { useState, useEffect } from "react"
import styled from "styled-components"
import { CheckCircle, AlertCircle, AlertTriangle, X } from "lucide-react"

// Estilos con styled-components
const MensajeContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-radius: 8px;
  background-color: ${(props) => props.backgroundColor || "#ffffff"};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin: 10px 0;
  max-width: 100%;
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  animation: slideUp 0.3s ease-out;
  transition: opacity 0.3s ease-out;
  opacity: ${(props) => (props.visible ? 1 : 0)};
  width: auto;
  min-width: 300px;
  max-width: 90%;

  @media (max-width: 768px) {
    padding: 10px 12px;
    bottom: 10px;
    min-width: 250px;
    max-width: 95%;
  }

  @keyframes slideUp {
    from {
      transform: translate(-50%, 20px);
      opacity: 0;
    }
    to {
      transform: translate(-50%, 0);
      opacity: 1;
    }
  }
`

const IconoWrapper = styled.div`
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.color || "#000000"};
`

const Contenido = styled.div`
  flex: 1;
  color: ${(props) => props.color || "#000000"};
  font-size: 14px;
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 13px;
  }
`

const CerrarBoton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.color || "#000000"};
  opacity: 0.7;
  transition: opacity 0.2s;
  padding: 4px;
  margin-left: 8px;

  &:hover {
    opacity: 1;
  }
`

const CajaMensaje = ({
  tipo = "success",
  color = "#000000",
  mensaje = "",
  duracion = 5000,
  backgroundColor = "",
  onClose = () => {},
}) => {
  const [visible, setVisible] = useState(true)

  // Determinar el color de fondo predeterminado según el tipo si no se proporciona
  const getBgColor = () => {
    if (backgroundColor) return backgroundColor

    switch (tipo) {
      case "success":
        return "#E6F7EF"
      case "fail":
        return "#FEECEC"
      case "warning":
        return "#FFF8E6"
      default:
        return "#E6F7EF"
    }
  }

  // Seleccionar el icono según el tipo
  const renderIcono = () => {
    switch (tipo) {
      case "success":
        return <CheckCircle size={20} />
      case "fail":
        return <AlertCircle size={20} />
      case "warning":
        return <AlertTriangle size={20} />
      default:
        return <CheckCircle size={20} />
    }
  }

  // Efecto para ocultar el mensaje después de la duración especificada
  useEffect(() => {
    if (duracion > 0) {
      const timer = setTimeout(() => {
        setVisible(false)
        setTimeout(() => {
          onClose()
        }, 300) // Esperar a que termine la animación de fade out
      }, duracion)

      return () => clearTimeout(timer)
    }
  }, [duracion, onClose])

  // Manejar el cierre manual
  const handleClose = () => {
    setVisible(false)
    setTimeout(() => {
      onClose()
    }, 300)
  }

  return (
    <MensajeContainer backgroundColor={getBgColor()} visible={visible}>
      <IconoWrapper color={color}>{renderIcono()}</IconoWrapper>
      <Contenido color={color}>{mensaje}</Contenido>
      <CerrarBoton onClick={handleClose} color={color}>
        <X size={16} />
      </CerrarBoton>
    </MensajeContainer>
  )
}

export default CajaMensaje

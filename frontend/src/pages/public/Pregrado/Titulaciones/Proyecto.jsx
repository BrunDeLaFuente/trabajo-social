import { useEffect, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import styled from "styled-components";

function TimelineStep({ step, title, content, position }) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, amount: 0.3 })
    const controls = useAnimation()

    useEffect(() => {
        if (isInView) {
            controls.start("visible")
        }
    }, [isInView, controls])

    const variants = {
        hidden: {
            opacity: 0,
            x: position === "left" ? -50 : 50,
        },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut",
            },
        },
    }

    return (
        <StepContainer ref={ref}>
            {/* Circle on timeline */}
            <TimelineCircle>{step}</TimelineCircle>

            {/* Content box */}
            <ContentBox position={position} initial="hidden" animate={controls} variants={variants}>
                <StepTitle>
                    Paso {step}: {title}
                </StepTitle>
                <StepContent>{content}</StepContent>
            </ContentBox>
        </StepContainer>
    )
}

export default function Tesis() {
    return (
        <Container>
            {/* Header Section */}
            <Header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                <Title>Modalidad de Graduación: Proyecto de Grado</Title>
                <div style={{ maxWidth: "60rem", margin: "0 auto" }}>
                    <Description>
                        El Proyecto de Grado en la Carrera de Trabajo Social es un trabajo de investigación que se ajusta a las exigencias de la metodología científica y tiene como objetivo abordar una problemática específica, tanto desde una perspectiva práctica como teórica, dentro del ámbito de esta profesión.
                    </Description>
                </div>
            </Header>
            {/* Timeline Section */}
            <TimelineContainer>
                {/* Vertical Line */}
                <VerticalLine />

                {/* Timeline Steps */}
                <TimelineStep
                    step={1}
                    title="Inscríbete a Trabajo de Grado I"
                    content="Inscripción en la asignatura de Trabajo de Grado I para culminar el plan de estudios de la Carrera de Trabajo Social. En esta etapa, la docente de la asignatura asumirá el rol de Tutora Metodológica, encargada de supervisar al estudiante del proyecto en la elaboración del tema de investigación y/o desarrollo del Proyecto de Grado."
                    position="left"
                />

                <TimelineStep
                    step={2}
                    title="Obtener certificación de NO DUPLICIDAD"
                    content="El estudiante deberá enviar una carta al Director del Instituto de Investigaciones de la FHyCE para registrar el título del Proyecto de Grado y obtener la certificación de NO DUPLICIDAD, asegurando así la originalidad del trabajo."
                    position="right"
                />

                <TimelineStep
                    step={3}
                    title="Solicitar Tutor Temático"
                    content={
                        <>
                            <Paragraph>
                                Para solicitar la designación del Tutor Temático, el estudiante debe enviar una carta dirigida al
                                Director de Carrera, adjuntando los siguientes documentos:
                            </Paragraph>
                            <List>
                                <ListItem>Carta de suficiencia del tutor metodológico.</ListItem>
                                <ListItem>Copia del Certificado de No Duplicidad de la Tesis de Grado.</ListItem>
                                <ListItem>Kardex académico actualizado.</ListItem>
                                <ListItem>1 ejemplar anillado del trabajo de investigación previo.</ListItem>
                            </List>
                            <Paragraph>
                                Estos documentos son necesarios para formalizar la solicitud y facilitar el proceso de asignación del
                                Tutor Temático, quien brindará orientación y apoyo en el desarrollo de la Tesis de Grado.
                            </Paragraph>
                        </>
                    }
                    position="left"
                />

                <TimelineStep
                    step={4}
                    title="Solicitar Tribunal Calificador"
                    content={
                        <>
                            <Paragraph>
                                Para solicitar la designación del Tribunal Calificador, el estudiante debe enviar una carta dirigida
                                al Director de Carrera, adjuntando los siguientes documentos:
                            </Paragraph>
                            <List>
                                <ListItem>Carta de suficiencia de la tutora metodológica.</ListItem>
                                <ListItem>Carta de suficiencia del Tutor Temático.</ListItem>
                                <ListItem>Copia del Certificado de No Duplicidad de la Tesis de Grado.</ListItem>
                                <ListItem>Kardex académico actualizado.</ListItem>
                                <ListItem>3 ejemplares anillados del trabajo de investigación previo.</ListItem>
                            </List>
                            <Paragraph>
                                Estos documentos son necesarios para formalizar la solicitud y proceder con la designación del
                                Tribunal Calificador, el cual será el encargado de evaluar y calificar el Proyecto de Grado.
                                La conformación de un Tribunal Calificador idóneo es esencial para garantizar la calidad y rigor
                                académico en el proceso de evaluación final de la investigación.
                            </Paragraph>
                        </>
                    }
                    position="right"
                />

                <TimelineStep
                    step={5}
                    title="Solicitar fecha y hora de defensa pública"
                    content="Para solicitar la fecha y hora de la defensa pública, el estudiante debe enviar una carta dirigida al Director de Carrera, en la que solicite formalmente la programación del evento. Además, se debe cumplir con los requisitos establecidos por la Secretaría de Trabajo Social. Estos requisitos pueden incluir trámites administrativos y la presentación de ciertos documentos o información necesaria para llevar a cabo la defensa."
                    position="left"
                />

                <TimelineStep
                    step={6}
                    title="Defensa del Proyecto de Grado"
                    content="En esta etapa, el estudiante llevará a cabo la defensa de su Proyecto de Grado. Durante la presentación, expondrá los resultados de su investigación frente al Tribunal Calificador y la comunidad académica. La defensa es una instancia importante para demostrar el conocimiento adquirido y la relevancia de la investigación realizada."
                    position="right"
                />
            </TimelineContainer>
        </Container>
    )
}

// Styled Components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 1rem;
`

const Header = styled(motion.div)`
  text-align: center;
  margin-bottom: 4rem;
`

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  color: #003366;
  margin-bottom: 1.5rem;
  
  @media (min-width: 768px) {
    font-size: 2.5rem;
  }
`

const Description = styled.p`
  font-size: 1.125rem;
  color: #4b5563;
  max-width: 60rem;
  margin: 0;
  line-height: 1.6;
  text-align: left; 

  @media (max-width: 768px) {
    font-size: 1rem;
  }  
`

const TimelineContainer = styled.div`
  position: relative;
`

const VerticalLine = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  height: 100%;
  width: 4px;
  background-color: #d1d5db;
`

const StepContainer = styled.div`
  position: relative;
  margin-bottom: 4rem;
`

const TimelineCircle = styled.div`
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background-color: #3b82f6;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
`

const ContentBox = styled(motion.div)`
  width: 100%;
  background-color: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  
  @media (min-width: 768px) {
    width: 41.666667%;
    ${(props) =>
        props.position === "left" ? "margin-right: auto; padding-right: 2rem;" : "margin-left: auto; padding-left: 2rem;"}
  }
`

const StepTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 0.75rem;
  color: #2563eb;
`

const StepContent = styled.div`
  color: #4b5563;
  line-height: 1.6;
`

const List = styled.ul`
  list-style-type: decimal;
  padding-left: 1.25rem;
  margin-top: 0.5rem;
`

const ListItem = styled.li`
  margin-bottom: 0.25rem;
`

const Paragraph = styled.p`
  margin-top: 0.5rem;
`

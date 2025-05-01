import { useEffect, useRef } from "react"
import { motion, useAnimation, useInView } from "framer-motion"
import styled from "styled-components"

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

export default function Trabajo() {
    return (
        <Container>
            {/* Header Section */}
            <Header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                <Title>Modalidad de Graduación: Trabajo dirigido</Title>
                <div style={{ maxWidth: "60rem", margin: "0 auto" }}>
                    <Description>
                        El Trabajo Dirigido es un proceso de práctica profesional mediante el cual el estudiante interviene
                        en la identificación, análisis y contribución a la solución de un problema concreto en el contexto de
                        una organización específica y dentro del área de su profesión. Esta modalidad tiene como objetivo
                        acercar al estudiante a los problemas prácticos del mundo laboral, trabajando en conjunto con instituciones
                        públicas, privadas u organizaciones sociales, con las cuales se establece un convenio para llevar
                        a cabo el proyecto.
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
                    content="Inscripción en la asignatura de Trabajo de Grado I para concluir con el plan de estudios de la Carrera de Trabajo Social. La docente de la asignatura asumirá el rol de Tutora Metodológica, siendo responsable de supervisar al estudiante en la elaboración del Perfil del Plan de Trabajo."
                    position="left"
                />

                <TimelineStep
                    step={2}
                    title="Solicitud de Tutor Temático"
                    content={
                        <>
                            <Paragraph>
                                Para solicitar la designación del Tutor Temático, el estudiante debe enviar una carta dirigida
                                al Director de Carrera, adjuntando los siguientes documentos:
                            </Paragraph>
                            <List>
                                <ListItem>Carta de suficiencia del tutor metodológico.</ListItem>
                                <ListItem>Carta de aprobación y conformidad por parte de la institución con la cual se
                                    realizará el Trabajo Dirigido.</ListItem>
                                <ListItem>Kardex académico actualizado.</ListItem>
                                <ListItem>1 ejemplar del Perfil de Plan de Trabajo.</ListItem>
                            </List>
                            <Paragraph>
                                Estos documentos son necesarios para formalizar la solicitud y facilitar el proceso de
                                asignación del Tutor Temático.
                            </Paragraph>
                        </>
                    }
                    position="right"
                />

                <TimelineStep
                    step={3}
                    title="Desarrollo del Trabajo Dirigido"
                    content="Durante el desarrollo del Trabajo Dirigido, el estudiante informará sobre los avances a la docente de la Materia de Trabajo de Grado I (1ª etapa) y al docente de Trabajo de Grado II (2ª etapa), así como al Tutor Temático, de acuerdo con las fechas establecidas en el cronograma del plan. Estos avances deberán contar con el visto bueno del responsable institucional con el que se haya conveniado el proyecto."
                    position="left"
                />

                <TimelineStep
                    step={4}
                    title="Solicitar Tribunal Calificador"
                    content={
                        <>
                            <Paragraph>
                                El estudiante deberá enviar una carta dirigida al Director de Carrera para solicitar
                                la designación del Tribunal Calificador, adjuntando los siguientes documentos:
                            </Paragraph>
                            <List>
                                <ListItem>Carta de suficiencia de la tutora metodológica.</ListItem>
                                <ListItem>Carta de suficiencia del Tutor Temático.</ListItem>
                                <ListItem>Carta de suficiencia de la institución con la cual se realizó el Trabajo Dirigido.</ListItem>
                                <ListItem>Kardex académico actualizado.</ListItem>
                                <ListItem>3 ejemplares anillados del trabajo final.</ListItem>
                            </List>
                            <Paragraph>
                                Estos documentos son necesarios para formalizar la solicitud y proceder con la designación del
                                Tribunal Calificador, el cual será el encargado de evaluar y calificar el trabajo final.
                                La conformación de un Tribunal Calificador idóneo es esencial para garantizar la calidad y
                                rigor académico en el proceso de evaluación final.
                            </Paragraph>
                        </>
                    }
                    position="right"
                />

                <TimelineStep
                    step={5}
                    title="Solicitar fecha y hora de defensa pública"
                    content={
                        <>
                            <Paragraph>
                                Para solicitar la fecha y hora de la defensa pública, el estudiante debe enviar una carta
                                dirigida al Director de Carrera, en la que solicite formalmente la programación del evento.
                                Además, se debe cumplir con los requisitos establecidos por la Secretaría de Trabajo Social.
                                Estos requisitos pueden incluir trámites administrativos y la presentación de ciertos documentos
                                o información necesaria para llevar a cabo la defensa.
                            </Paragraph>
                            <Paragraph>
                                Es importante seguir las pautas y fechas establecidas por la Secretaría para
                                asegurar una defensa pública exitosa y bien organizada. Al solicitar la fecha y
                                hora de la defensa a través de la carta, el estudiante deberá coordinar con las autoridades
                                pertinentes y cumplir con los plazos establecidos para garantizar un proceso fluido y ordenado.
                            </Paragraph>
                        </>
                    }
                    position="left"
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

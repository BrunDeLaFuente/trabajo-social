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

export default function Excelencia() {
    return (
        <Container>
            {/* Header Section */}
            <Header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                <Title>Modalidad de Graduación: Excelencia Académica</Title>
                <div style={{ maxWidth: "60rem", margin: "0 auto" }}>
                    <Description>
                        La modalidad de graduación Excelencia Académica reconoce a los estudiantes sobresalientes que,
                        de manera voluntaria, optan por esta opción, eximiéndolos de otras modalidades de graduación.
                        La obtención de la graduación por Excelencia Académica implica una evaluación cualitativa y
                        cuantitativa del rendimiento académico del estudiante a lo largo de su formación.

                        Requisitos:

                        <List>
                            <ListItem>Haber aprobado todas las materias del plan de estudios en primera instancia.</ListItem>
                            <ListItem>No haber reprobado ninguna materia del plan de estudios de la carrera.</ListItem>
                            <ListItem>No haber abandonado ninguna materia.</ListItem>
                            <ListItem>No tener materias convalidadas de una carrera anterior.</ListItem>
                            <ListItem>Haber aprobado todas las materias, a excepción de la correspondiente a Taller de Grado II,
                                en un tiempo no mayor al establecido en el plan de estudios.</ListItem>
                        </List>

                        Para aquellos que cumplen con los incisos anteriores, la nota mínima promedio para beneficiarse con
                        esta modalidad debe ser igual o mayor a la mediana del promedio aritmético individual de las notas
                        del historial académico de todos los estudiantes que han concluido el plan de estudios de la carrera
                        en esa gestión académica.
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
                    title=""
                    content="Dentro de un plazo máximo de 30 días hábiles después de concluir la gestión académica, se publicará una lista que incluirá tanto a los estudiantes egresados como a aquellos que cumplen con los requisitos para optar por la modalidad de graduación Excelencia Académica."
                    position="left"
                />

                <TimelineStep
                    step={2}
                    title=""
                    content="Los estudiantes interesados en elegir la Modalidad de Excelencia deberán presentar una solicitud por escrito dirigida al Director de Carrera, manifestando su deseo de acogerse a esta modalidad de graduación."
                    position="right"
                />

                <TimelineStep
                    step={3}
                    title=""
                    content="Se procederá a asignar la nota correspondiente a la materia de Trabajo de Grado II, como parte del proceso de evaluación para obtener la graduación por Excelencia Académica."
                    position="left"
                />

                <TimelineStep
                    step={4}
                    title=""
                    content="Finalmente, se emitirán las resoluciones que habilitan a los estudiantes para obtener la graduación con reconocimiento de Excelencia Académica. Estas resoluciones oficializan el logro académico y destacan el esfuerzo y la excelencia demostrados por los estudiantes durante su formación."
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

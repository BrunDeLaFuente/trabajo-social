import { motion } from "framer-motion"
import styled from "styled-components"

export default function Examen() {
    return (
        <Container>
            <Header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                <Title>Modalidad de Graduación: Examen de Grado</Title>
                <Description>
                    Es una prueba oral y escrita que permite medir la efectividad del proceso de formación profesional a través de la valoración
                    de conocimientos teórico-prácticos, obtenidos en el transcurso de la carrera.
                </Description>
            </Header>

            <Section>
                <Subtitle>Los estudiantes que postulan a esta Modalidad deben:</Subtitle>
                <List>
                    <ListItem>Haber vencido todas las materias de la Carrera, en la línea de Examen de Grado.</ListItem>
                    <ListItem>Pago de Derecho a Examen de Grado (Bs. 700) en Caja de la Facultad.</ListItem>
                    <ListItem>No tener deudas pendientes con la biblioteca de la Universidad.</ListItem>
                    <ListItem>
                        El estudiante deberá solicitar su inscripción mediante una nota dirigida al Director de Carrera, Lic. John Reynaldo Loredo Olivares, adjuntando los siguientes documentos estipulados en el Reglamento:
                        <SubList>
                            <li>Certificado de conclusión de estudios emitido por la Carrera.</li>
                            <li>Kárdex actualizado (UTI-Facultativa).</li>
                            <li>Papeleta Valorado por concepto de Derecho a Examen de Grado, de Bs.700, cancelados en la Caja de la Facultad.</li>
                            <li>Certificado del Instituto de Investigaciones que acredite que no se encuentra registrado(a) en otra modalidad de titulación o carta renunciando al tema de tesis o proyecto, en caso de que hubieran sido aprobados previamente.</li>
                            <li>Certificaciones de las bibliotecas de la Universidad (Central, Paulo Freire y Salas de Lectura de Lingüística), que indiquen que no adeuda material alguno.</li>
                        </SubList>
                    </ListItem>
                </List>
            </Section>
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
  margin: 0 auto;
  line-height: 1.6;
  text-align: left;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`

const Section = styled.section`
  margin-top: 2rem;
`

const Subtitle = styled.h2`
  font-size: 1.25rem;
  font-weight: bold;
  color: #1e40af;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 1.125rem;
  }
`

const List = styled.ul`
  list-style: decimal;
  padding-left: 1.5rem;
  color: #374151;
  line-height: 1.7;
`

const ListItem = styled.li`
  margin-bottom: 1rem;
`

const SubList = styled.ul`
  list-style: disc;
  padding-left: 1.5rem;
  margin-top: 0.5rem;

  li {
    margin-bottom: 0.5rem;
  }
`

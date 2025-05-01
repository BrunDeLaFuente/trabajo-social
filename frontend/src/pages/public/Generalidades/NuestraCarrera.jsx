import { useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { Download } from "lucide-react";
import HeroSection from "../../../components/public/HeroSection";
import pdfFile from "../../../assets/doc/brochure-trabajo-social.pdf";


export default function NuestraCarrera() {

  useEffect(() => {
    // Efecto para animar elementos cuando aparecen en el viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible")
          }
        })
      },
      { threshold: 0.1 },
    )

    document.querySelectorAll("section").forEach((section) => {
      observer.observe(section)
    })

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <Container2>
      <HeroSection title="Acerca de la Carrera" />
      <SectionWrapper bgColor="#fffff">
        <Container>
          <SectionContent>
            <SectionTitle>Historia</SectionTitle>
            <HistoryText>
              La Carrera de Trabajo Social inicia actividades oficiales al primer semestre de la gestión 2006 y su
              origen se debe a diversos factores, entre los más importantes se puede señalar:
            </HistoryText>
            <HistoryText>
              • La idea de definir la creación de la Carrera de Trabajo Social, como una nueva oferta académica, se
              inicia en la Carrera de Sociología con el objetivo de diversificar la oferta curricular con nuevos
              programas y entre ellas se encontraban precisamente, Comunicación Social y Trabajo Social.
            </HistoryText>
            <HistoryText>
              • Existía ausencia de oferta de formación profesional para Trabajadores Sociales en la UMSS, ofreciendo la
              misma solo en una universidad privada.
            </HistoryText>
            <HistoryText>
              De esta manera, el 4 de diciembre de 1997 en Sesión de Honorable Consejo de Carrera de Sociología se
              aprueban los perfiles de Comunicación Social y Trabajo Social, ambos departamentos funcionaron bajo la
              dependencia de la Carrera de Sociología. En el caso de Trabajo Social, no se llegó a ninguna decisión, por
              lo que el trámite se derivó a la Facultad de Humanidades y Ciencias de la Educación.
            </HistoryText>
            <HistoryText>
              De esta manera mediante R.C.F. 334/05 de 13 de diciembre de 2005, se aprueba la creación del Programa de
              Trabajo Social, refrendándose con la Resolución del Comité Académico del Consejo Universitario (Acuerdo
              CA-HCU N° 19/2006 DE FECHA 16 DE MAYO DE 2006) . Así fue aprobado en el H. Consejo Universitario según
              Resolución N° 24/06 de fecha 06 de julio de 2006.
            </HistoryText>
            <HistoryText>
              En términos institucionales, Trabajo Social tiene un Jefe de Departamento y a partir del 2009 se confirmó
              un Consejo de Programa en la que participan docentes y estudiantes electos democráticamente en forma
              paritaria.
            </HistoryText>
            <HistoryText>
              El proceso de conversión a carrera y la compatibilización Curricular del Programa de Trabajo Social y las
              acciones que han derivado de ella, se han basado permanentemente en el marco normativo de la Universidad
              Boliviana en General y la Universidad Mayor de San Simón en particular.
            </HistoryText>
            <HistoryText>
              De hecho, la Nueva Constitución Política del Estado Plurinacional (NCPE) , orientado a satisfacer las
              necesidades de la población más necesitada, ha posibilitado el desarrollo de Políticas Sociales orientadas
              a esta población, en la que se destaca la participación de profesionales de Trabajo Social, tanto en
              instituciones públicas como privadas que operativizan Políticas Sociales, a través de planes, programas y
              proyectos dentro de las áreas de educación, vivienda, salud, trabajo, etc., en la que necesariamente deben
              participar los profesionales en Trabajo Social por las competencias que tienen.
            </HistoryText>
          </SectionContent>
        </Container>
      </SectionWrapper>

      {/* Sección Misión y Visión */}
      <SectionWrapper bgColor="#f5f7fa">
        <Container>
          <SectionContent>
            <SectionTitle>Misión y Visión</SectionTitle>
            <FlexRow>
              <Card>
                <CardTitle>Visión</CardTitle>
                <p>
                  La Carrera de Trabajo Social es una unidad académica reconocida por su destacado aporte a la sociedad,
                  que integra procesos de formación, investigación e intervención con alta capacidad y sensibilidad
                  humana para contribuir a la resolución de problemáticas emergentes de la dinámica de la cuestión
                  social, comprometida con la construcción de una sociedad justa y solidaria.
                </p>
              </Card>
              <Card>
                <CardTitle>Misión</CardTitle>
                <p>
                  Formar profesionales altamente calificados con capacidad de manejo teórico-práctico en procesos de
                  investigación e intervención, para responder a demandas y problemas sociales con sólidas bases éticas,
                  respecto a la dignidad humana y derechos fundamentales en un contexto dinámico y cambiante.
                </p>
              </Card>
            </FlexRow>
            <CenteredWrapper>
              <DownloadButton href={pdfFile} download>
                <Download size={18} />
                Descargar Brochure
              </DownloadButton>
            </CenteredWrapper>

          </SectionContent>
        </Container>
      </SectionWrapper>

      {/* Sección Objetivos */}
      <SectionWrapper bgColor="#fffff">
        <Container>
          <SectionContent>
            <SectionTitle>Objetivos de la Carrera</SectionTitle>
            <ObjectiveGrid>
              <ObjectiveCard>
                <h3>Profesionalización de Pregrado</h3>
              </ObjectiveCard>
              <ObjectiveCard>
                <h3>Formación Integral</h3>
              </ObjectiveCard>
              <ObjectiveCard>
                <h3>Investigación</h3>
              </ObjectiveCard>
              <ObjectiveCard>
                <h3>Interacción y Extensión</h3>
              </ObjectiveCard>
              <ObjectiveCard>
                <h3>Cualificación de Postgrado</h3>
              </ObjectiveCard>
              <ObjectiveCard>
                <h3>Gestión de Apoyo</h3>
              </ObjectiveCard>
            </ObjectiveGrid>
          </SectionContent>
        </Container>
      </SectionWrapper>

      {/* Sección Perfil */}
      <SectionWrapper bgColor="#f5f7fa">
        <Container>
          <SectionContent>
            <SectionTitle>Perfil</SectionTitle>
            <FlexRow>
              <FlexColumn>
                <Image src="/placeholder.svg?height=400&width=600" alt="Imagen de profesionales de Trabajo Social" />
              </FlexColumn>
              <FlexColumn>
                <Card>
                  <CardTitle>Perfil profesional</CardTitle>
                  <p>
                    Los profesionales graduados de la Carrera de Trabajo Social de la Universidad Mayor de San Simón, se
                    destacan por:
                  </p>
                  <ProfileList>
                    <li>Orientar su accionar hacia la investigación e intervención para lograr el bienestar social.</li>
                    <li>
                      Entidades públicas y privadas donde se desarrollan políticas y programas de educación y
                      capacitación.
                    </li>
                    <li>Promover la inclusión social y el respeto a la diversidad.</li>
                    <li>
                      Demostrar ética profesional, compromiso, solidaridad, sensibilidad y respeto por la dignidad
                      humana.
                    </li>
                    <li>
                      Facilitar la autodeterminación de los sujetos para resolver problemas y alcanzar su desarrollo
                      personal y social.
                    </li>
                    <li>Tener solvencia en el manejo teórico, metodológico para enfrentar diferentes problemáticas.</li>
                    <li>
                      Desarrollar competencias comunicacionales y habilidades sociales, orientadas a generar estrategias
                      de relacionamiento, comprensión e interacción con el entorno social.
                    </li>
                    <li>
                      Motivar, animar y establecer relaciones interpersonales sólidas con creatividad e imaginación.
                    </li>
                  </ProfileList>
                </Card>
              </FlexColumn>
            </FlexRow>

            <FlexRow style={{ marginTop: "3rem" }}>
              <FlexColumn>
                <Card>
                  <CardTitle>Práctica profesional</CardTitle>
                  <h4>Campos y/o áreas de acción</h4>
                  <ProfileList>
                    <li>Instituciones Sociales (pública, privadas y ONG´S).</li>
                    <li>Área de Intervención</li>
                    <li>Salud</li>
                    <li>Educación</li>
                    <li>Vivienda</li>
                    <li>Familia</li>
                    <li>Seguridad Social</li>
                    <li>Penitenciaria</li>
                    <li>Desarrollo Comunitario</li>
                    <li>Nuevas áreas emergentes, potenciales y alternativas.</li>
                  </ProfileList>

                  <h4 style={{ marginTop: "1.5rem" }}>Espacio laboral</h4>
                  <p>El profesional de esta carrera, puede desempeñarse en los siguientes espacios:</p>
                  <ProfileList>
                    <li>
                      Entidades públicas y privadas donde se desarrollan políticas y programas de salud, como Caja
                      Nacional de Salud, hospitales, clínicas, etc.
                    </li>
                    <li>
                      Entidades públicas y privadas donde se desarrollan políticas y programas de educación y
                      capacitación.
                    </li>
                    <li>
                      Instituciones públicas y privadas con programas de niños/as y adolescentes cómo: Defensorías, DNI,
                      Infante, etc.
                    </li>
                    <li>
                      Instituciones públicas y privadas con programas de prevención, promoción, rehabilitación como:
                      S.D.G.S.
                    </li>
                    <li>
                      Instituciones públicas y privadas en el área jurídica, como: juzgados de familia, del menor,
                      penal, etc.
                    </li>
                    <li>Instituciones con programas de desarrollo de la mujer con enfoque de género.</li>
                  </ProfileList>
                </Card>
              </FlexColumn>
              <FlexColumn>
                <Image src="/placeholder.svg?height=600&width=600" alt="Profesionales de Trabajo Social en acción" />
              </FlexColumn>
            </FlexRow>
          </SectionContent>
        </Container>
      </SectionWrapper>
    </Container2>
  )
}

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`

// Componentes estilizados
const Container2 = styled.div`
  max-width: 100%;
  background-color: #ffffff;

  @media (max-width: 768px) {
    overflow-x: hidden;
  } 
`

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`

// Nuevo componente para el wrapper de la sección con color de fondo completo
const SectionWrapper = styled.div`
  width: 100%;
  background-color: ${(props) => props.bgColor};
  animation: ${fadeIn} 0.8s ease-out;
`

// Contenido de la sección con padding
const SectionContent = styled.section`
  padding: 4rem 2rem;

  @media (max-width: 768px) {
    padding: 3rem 1rem;
  }
`

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  color: #2a6496;
  text-align: left;
  margin-bottom: 2rem;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 100px;
    height: 4px;
    background-color: #FF8C00; /* Color naranja */
  }

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`

const HistoryText = styled.p`
  text-align: center;
  line-height: 1.8;
  margin-bottom: 1.5rem;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
  text-align: left;
`

const FlexRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  margin-top: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`

const FlexColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`

const Card = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  height: 100%;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`

const CardTitle = styled.h3`
  font-size: 1.5rem;
  color: #2a6496;
  margin-bottom: 1rem;
  text-align: center;
`
const CenteredWrapper = styled.div`
  display: flex;
  justify-content: center;
`

const DownloadButton = styled.a`
  display: inline-flex; /* Cambiado de flex a inline-flex */
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  animation: ${pulse} 2s infinite;
  text-decoration: none;

  /* Centrado */
  margin: 2rem auto 0;
  
  &:hover {
    background-color: #c0392b;
    transform: scale(1.05);
  }
`

const ObjectiveGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`

const ObjectiveCard = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    background-color: #2a6496;
    color: white;
  }
`

const ProfileList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;

  li {
    margin-bottom: 0.8rem;
    padding-left: 1.5rem;
    position: relative;
    line-height: 1.6;

    &:before {
      content: "•";
      position: absolute;
      left: 0;
      color: #2a6496;
      font-weight: bold;
    }
  }
`

const Image = styled.img`
  width: 100%;
  height: auto;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.03);
  }
`

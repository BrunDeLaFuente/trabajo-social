import { motion } from "framer-motion";
import styled from "styled-components";

export default function Adscripcion() {
  return (
    <Container>
      <Header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Title>Modalidad de Graduación: Adscripción</Title>
        <Description>
          Es la incorporación de uno o más estudiantes no graduados para la
          realización de trabajos en diferentes secciones de los ambientes
          académicos, de investigación, de interacción y/o de gestión en la
          Universidad Mayor de San Simón que desarrollan actividades bajo
          términos de referencia específicos, enmarcados en las áreas de
          conocimiento de la Carrera.
        </Description>
      </Header>

      <Section>
        <SectionTitle>Partes que Intervienen y Funciones:</SectionTitle>

        <SubsectionTitle>— Unidades Patrocinadoras.</SubsectionTitle>
        <Paragraph>
          Son aquellas unidades académicas y/o administrativas de la UMSS, que
          presentan requerimientos específicos provenientes de docentes,
          estudiantes, institutos de investigación o unidades administrativas,
          para resolver problemas o elaborar productos mediante procesos de
          Adscripción.
        </Paragraph>
        <List>
          <li>
            Identificar las necesidades y/o requerimientos internos que puedan
            ser cubiertos con el concurso de estudiantes adscritos.
          </li>
          <li>Presentar sus demandas ante la Unidad Académica de Origen. </li>
          <li>
            Elaborar los términos de referencia del trabajo a ser elaborado por
            el/los estudiantes adscritos a su unidad.
          </li>
          <li>
            Asignar un supervisor con conocimientos del trabajo a ser elaborado
            por el estudiante adscrito a su unidad.
          </li>
          <li>
            Asignar un supervisor con conocimientos del trabajo de adscripción,
            al estudiante para que desarrolle las tareas previstas en los
            términos de referencia.
          </li>
          <li>Suscribir el convenio de partes respectivo.</li>
        </List>

        <SubsectionTitle>— Unidad Académica de Origen.</SubsectionTitle>
        <Paragraph>
          Las unidades Académicas de Origen son las carreras o programas,
          representadas por la Dirección de Carrera, de las que provienen los
          estudiantes adscritos.
        </Paragraph>
        <List>
          <li>Recoger las demandas de las unidades patrocinadoras.</li>
          <li>
            Establecer la pertinencia y factibilidad de las demandas en el campo
            de la producción, investigación, interacción y/o gestión
            universitaria.
          </li>
          <li>
            Revisar y/o adecuar la precisión de los términos de referencia del
            trabajo a ser desarrollado por el estudiante adscrito.
          </li>
          <li>
            Elaborar y publicar la convocatoria interna para postulantes a la
            Adscripción.
          </li>
          <li>
            Seleccionar a los postulantes, considerando los perfiles
            profesionales requeridos.
          </li>
          <li>Auspiciar y suscribir el convenio de partes respectivo.</li>
          <li>
            Asignar un docente Tutor para orientar y asesorar al estudiante
            adscrito al aspecto técnico-académico propios del perfil
            profesional.
          </li>
        </List>
      </Section>

      <Section>
        <SectionTitle>Términos de Referencia</SectionTitle>
        <Paragraph>
          Las actividades que se le asignan al estudiante adscrito serán
          formuladas y detalladas en los Términos de Referencia elaborados por
          la Unidad Patrocinadora y aprobadas por la Unidad de Origen del
          Estudiante.
        </Paragraph>
        <List>
          <li>Objetivos del trabajo a ser realizados.</li>
          <li>Principales actividades.</li>
          <li>Productos realizados.</li>
          <li>Cronograma de actividades</li>
          <li>Indicadores de verificación y evaluación.</li>
          <li>Recursos Humanos.</li>
          <li>Materiales y financieros requeridos.</li>
        </List>
      </Section>

      <Section>
        <SectionTitle>Proceso</SectionTitle>
        <List>
          <li>
            Convocatoria.La Unidad Patrocinadora elaborará y publicará la
            convocatoria para los estudiantes que postulen a la modalidad.
          </li>
          <li>
            Selección de estudiantes.Recepción de los perfiles de los
            estudiantes que desean presentarse, y serán elegidos revisando la
            pertinencia para los términos de referencia.
          </li>
          <li>Designación del tutor o tutores. </li>
          <li>Informes parciales.</li>
          <li>Informes parciales.</li>
          <li>Informe de suficiencia del trabajo de Adscripción .</li>
          <li>Evaluación.</li>
          <li>Designación del Tribunal Calificador.</li>
        </List>
      </Section>

      <Section>
        <SectionTitle>Requisitos</SectionTitle>
        <List>
          <li>
            Carta dirigida al Director de la Carrera, solicitando la designación
            del Tribunal Calificador.
          </li>
          <li>
            Tabla de Suficiencias del Trabajo por Adscripción de la Tutora.
          </li>
          <li>Tabla de Suficiencia de la Unidad Patrocinadora.</li>
          <li>
            Resolución de Aprobación de los Términos de Referencia (en la
            resolución debe especificar los nombres de los estudiantes
            adscriptos y el tema del trabajo)
          </li>
          <li>
            kardex actualizado, original y firmado por el responsable de la UTI
            Facultativa.
          </li>
          <li>
            3 ejemplares del Trabajo Final aprobado por la Tutora y la
            responsable de la Unidad Patrocinadora.
          </li>
        </List>
      </Section>
    </Container>
  );
}

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 1rem;
`;

const Header = styled(motion.div)`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  color: #003366;
  margin-bottom: 1rem;

  @media (min-width: 768px) {
    font-size: 2.5rem;
  }
`;

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
`;

const Section = styled.section`
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: #003366;
  font-weight: bold;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 1.125rem;
  }
`;

const SubsectionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: bold;
  margin: 1.5rem 0 0.5rem;
  color: #111827;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const Paragraph = styled.p`
  font-size: 1rem;
  color: #4b5563;
  margin-bottom: 1rem;
  line-height: 1.6;
`;

const List = styled.ul`
  padding-left: 1.25rem;
  margin-bottom: 1.5rem;
  color: #374151;

  li {
    margin-bottom: 0.5rem;
    line-height: 1.6;
  }
`;

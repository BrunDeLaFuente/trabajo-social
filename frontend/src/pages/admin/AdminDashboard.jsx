import styled from "styled-components"

const DashboardContainer = styled.div`
  padding: 20px;
`

const DashboardHeader = styled.div`
  margin-bottom: 20px;
`

const DashboardTitle = styled.h1`
  font-size: 24px;
  margin-bottom: 10px;
`

const DashboardSubtitle = styled.p`
  color: #666;
`

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
`

const Card = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`

const CardTitle = styled.h2`
  font-size: 18px;
  margin-bottom: 10px;
`

const CardContent = styled.p`
  color: #666;
`

const AdminDashboard = () => {
    return (
        <DashboardContainer>
            <DashboardHeader>
                <DashboardTitle>Panel de Administración</DashboardTitle>
                <DashboardSubtitle>Bienvenido al panel de control</DashboardSubtitle>
            </DashboardHeader>

            <CardGrid>
                <Card>
                    <CardTitle>Usuarios</CardTitle>
                    <CardContent>Gestiona los usuarios del sistema</CardContent>
                </Card>
                <Card>
                    <CardTitle>Carrera</CardTitle>
                    <CardContent>Administra la información de la carrera</CardContent>
                </Card>
                <Card>
                    <CardTitle>Personal</CardTitle>
                    <CardContent>Gestiona docentes y administrativos</CardContent>
                </Card>
                <Card>
                    <CardTitle>Noticias</CardTitle>
                    <CardContent>Publica y edita noticias</CardContent>
                </Card>
            </CardGrid>
        </DashboardContainer>
    )
}

export default AdminDashboard;


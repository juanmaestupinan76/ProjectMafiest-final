# MaFiEst

## Descripción del Proyecto
MaFiEst es una plataforma educativa diseñada para gestionar actividades académicas, seguimiento estudiantil y recursos educativos. La aplicación permite a los docentes realizar seguimiento personalizado de estudiantes, gestionar actividades y recursos, mientras que los estudiantes pueden acceder a sus materiales, enviar actividades y consultar su progreso académico.

## Características Principales

### Sistema de Usuarios
- **Roles de Usuario**:
  - Administrador: Gestión completa del sistema
  - Docente: Gestión de actividades y seguimiento
  - Estudiante: Acceso a actividades y seguimiento personal
  - Independiente: Acceso a grabaciones y recursos

### Módulo de Actividades
- **Para Docentes**:
  - Crear y publicar actividades
  - Calificar entregas de estudiantes
  - Seguimiento personalizado de estudiantes
  - Subir y gestionar grabaciones de clase

- **Para Estudiantes**:
  - Ver actividades asignadas
  - Enviar entregas de actividades
  - Consultar calificaciones
  - Acceso a grabaciones de clase
  - Ver su seguimiento académico

### Sistema de Seguimiento
- **Docentes**:
  - Registro de seguimiento individual por estudiante
  - Historial completo de observaciones
  - Gestión de progreso académico

- **Estudiantes**:
  - Visualización de su historial de seguimiento
  - Acceso a comentarios y observaciones de docentes

### Gestión Administrativa
- **Administradores**:
  - Gestión de usuarios y roles
  - Creación y administración de grupos
  - Control de permisos y accesos
  - Supervisión general del sistema

### Sistema de Grabaciones
- **Docentes**:
  - Subir grabaciones de clases
  - Organizar contenido por temas
  - Gestionar acceso a materiales

- **Estudiantes e Independientes**:
  - Acceso a grabaciones organizadas
  - Visualización de contenido educativo
  - Búsqueda y filtrado de materiales

## Estructura del Proyecto

### Backend (mafiest_backend)
- **Controladores**:
  - `auth.js`: Autenticación y gestión de sesiones
  - `users.js`: Gestión de usuarios y roles
  - `groups.js`: Administración de grupos académicos
  - `activities.js`: Gestión de actividades
  - `activitySubmissions.js`: Manejo de entregas
  - `activityResults.js`: Calificaciones y resultados
  - `tracking.js`: Sistema de seguimiento
  - `recordings.js`: Gestión de grabaciones
  - `contacts.js`: Manejo de solicitudes de contacto
  - `advisories.js`: Gestión de asesorías

- **Modelos**:
  - `User.js`: Usuarios y roles
  - `Group.js`: Grupos académicos
  - `Activity.js`: Actividades y tareas
  - `ActivitySubmission.js`: Entregas de actividades
  - `ActivityResult.js`: Resultados y calificaciones
  - `Recording.js`: Grabaciones y recursos
  - `Tracking.js`: Seguimiento académico
  - `Contact.js`: Contactos
  - `Advisory.js`: Asesorías

- **Rutas**: Definición de los endpoints de la API.
  - `auth.js`: Rutas de autenticación.
  - `users.js`: Rutas de gestión de usuarios.
  - `groups.js`: Rutas de gestión de grupos.
  - `progress.js`: Rutas de progreso.
  - `achievements.js`: Rutas de logros.
  - `contacts.js`: Rutas de contacto.
  - `advisories.js`: Rutas de asesorías.

- **Utilidades**: Funciones y configuraciones auxiliares.
  - `config.js`: Variables de entorno.
  - `db.js`: Conexión a la base de datos.
  - `logger.js`: Gestión de logs.
  - `middleware.js`: Middlewares para autenticación.

### Frontend (mafiest_frontend)
- **Páginas**:
  - Administrador:
    - Dashboard administrativo
    - Gestión de usuarios y roles
    - Gestión de grupos
  - Docente:
    - Dashboard docente
    - Subir actividades
    - Calificar entregas
    - Seguimiento de estudiantes
    - Gestión de grabaciones
  - Estudiante:
    - Dashboard estudiantil
    - Ver/entregar actividades
    - Consultar calificaciones
    - Ver seguimiento personal
    - Acceso a grabaciones
  - Independiente:
    - Dashboard independiente
    - Acceso a grabaciones
    - Recursos disponibles

- **Componentes**:
  - `Navbar.jsx`: Barra de navegación responsiva
  - `Sidebar.jsx`: Panel lateral por rol
  - `RecordingCard.jsx`: Tarjeta de grabación

- **Rutas**: Configuración de las rutas de la aplicación según el rol del usuario.

- **Estilos**: Archivos CSS para la apariencia de la aplicación.

## Instalación
1. Clona el repositorio:
   ```
   git clone <url_del_repositorio>
   ```
2. Navega al directorio del backend y frontend:
   ```
   cd mafiest_backend
   npm install
   cd ../mafiest_frontend
   npm install
   ```
3. Configura las variables de entorno en el archivo `.env` del backend.
4. Inicia el servidor del backend:
   ```
   cd mafiest_backend
   node server.js
   ```
5. Inicia la aplicación del frontend:
   ```
   cd mafiest_frontend
   npm run dev
   ```

## Contribuciones
Las contribuciones son bienvenidas. Si deseas contribuir, por favor abre un issue o envía un pull request.

## Licencia
Este proyecto está bajo la Licencia MIT.
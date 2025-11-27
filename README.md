InkStudio – Sistema de Gestión de Turnos para Estudio de Tatuajes

Proyecto desarrollado para la materia Metodología de Sistemas / Laboratorio de Computación IV
Universidad Tecnológica Nacional – FRMDP
Año 2025

📌 Descripción

InkStudio es un sistema web que permite gestionar de forma completa un estudio de tatuajes.
Incluye administración de:

🧑‍🎨 Artistas (con su perfil público y su panel privado)

📅 Turnos (crear, cancelar, completar y eliminar)

👤 Usuarios (roles: admin, artista, cliente)

📝 Reservas online

🔐 Autenticación con distintos accesos por rol

El sistema utiliza Angular 20 (standalone) y JSON Server como API simulada.

🎯 Objetivos del proyecto

Digitalizar la gestión manual de turnos del estudio.

Permitir que los clientes reserven turnos fácilmente.

Proveer panel privado para cada artista.

Ofrecer una interfaz clara, moderna y responsive.

Reducir errores (doble reserva, estados incorrectos, turnos solapados).

Separar vistas públicas, privadas y administrativas.

🛠️ Tecnologías utilizadas

Angular 20 (standalone components, signals, directives nuevas @if / @for)

TypeScript

HTML + CSS

JSON Server

Node.js

Git + GitHub

VS Code

📂 Estructura del proyecto  
```txt
src/
 └── app/
     ├── pages/
     │   ├── home/
     │   │   ├── home.html
     │   │   ├── home.css
     │   │   └── home.ts
     │   ├── login/
     │   │   ├── login.html
     │   │   ├── login.css
     │   │   └── login.ts
     │   ├── register/
     │   │   ├── register.html
     │   │   ├── register.css
     │   │   └── register.ts
     │   ├── perfil/
     │   │   ├── perfil.html
     │   │   ├── perfil.css
     │   │   └── perfil.ts
     │   ├── perfil-tatuadora/
     │   │   ├── perfil-tatuadora.html
     │   │   ├── perfil-tatuadora.css
     │   │   └── perfil-tatuadora.ts
     │   ├── tatuadoras/
     │   │   ├── tatuadoras.html
     │   │   ├── tatuadoras.css
     │   │   └── tatuadoras.ts
     │   ├── turnos/
     │   │   ├── turnos.html
     │   │   ├── turnos.css
     │   │   └── turnos.ts
     │   ├── admin/
     │   │   ├── admin.html
     │   │   ├── admin.css
     │   │   └── admin.ts
     ├── services/
     │   ├── api.service.ts
     │   ├── artist.service.ts
     │   ├── auth.service.ts
     │   ├── turnos.service.ts
     │   └── user-state.service.ts
     ├── models/
     │   ├── user.model.ts
     │   ├── artist.model.ts
     │   └── reserva.model.ts
     ├── app.routes.ts
     ├── app.html
     ├── app.css
     └── app.ts
```



🚀 Instalación y ejecución

Clonar el repositorio:

git clone https://github.com/martitaperez/tpfinal.git
cd tpfinal


Instalar dependencias:

npm install


Levantar JSON Server:

json-server --watch db.json --port 3000


Levantar Angular:

ng serve -o

🔎 Funcionalidades
🧑‍🎨 Artistas

Perfil público con foto, bio, estilos y redes

Panel privado para gestionar su información

Acceso a “Mis turnos”

📅 Turnos

Crear turnos (cliente)

Visualización según artista

Cambiar estado:

Pendiente → Completado

Pendiente → Cancelado

Eliminación de turnos

Modal de confirmación

Toasts de confirmación sin alerts del navegador

👤 Usuarios

Registro

Login por rol

Perfil editable (datos personales, contraseña)

🔐 Roles y permisos

Cliente → reserva turnos

Artista → administra SOLO sus turnos + edita su perfil artístico

Admin → AMB del sistema entero

🖼️ Home / Vista pública

Hero con mensaje de bienvenida

Modal animado para mostrar las tatuadoras

Perfiles visuales con fotos cargadas desde assets

🧭 Rutas del sistema
Ruta	Acceso	Función
/home	público	Inicio + info
/login	público	Iniciar sesión
/register	público	Crear cuenta
/tatuadoras	artista	Panel “Mis turnos”
/perfil	logueados	Perfil usuario
/perfil-tatuadora	artista	Info profesional
/turnos	cliente	Reservar turnos
/admin	admin	Gestión completa
🛡️ Autenticación y seguridad

AuthService con login local

LocalStorage persistente

Nav dinámico según rol

Protección de rutas a nivel UI

📦 Base de Datos (JSON Server)

Estructura incluida:

/users

/artists

/turnos

Cada artista está asociado a un userId.

🎨 Interfaz

Botones con estilo uniforme

Tarjetas y modales con sombras suaves

Navbar responsive con menú hamburguesa

Modal animado para perfiles de artistas

Toasts personalizados

👥 Autores

Martina Perez
Carla Duarte
Rodrigo Dantas

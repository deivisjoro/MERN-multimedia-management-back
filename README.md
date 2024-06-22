# Multimedia Management Backend

Este proyecto es una API RESTful para la gestión de contenido multimedia. El proyecto está construido utilizando Node.js, Express, y MongoDB. Además, utiliza Jest y Supertest para pruebas automatizadas y Swagger para la documentación de la API.

## Requisitos Previos

- Node.js (v14 o superior)
- MongoDB (v4.2 o superior)
- npm (v5 o superior)

## Configuración del Proyecto

1. **Clonar el repositorio**:
    ```bash
    git clone https://github.com/deivisjoro/MERN-multimedia-management-back.git
    cd multimedia-management-back
    ```

2. **Instalar las dependencias**:
    ```bash
    npm install
    ```

3. **Configurar las variables de entorno**:
    Crea un archivo `.env` en la raíz del proyecto y añade las siguientes variables:
    ```env
    MONGO_URI=mongodb://localhost:27017/multimedia-management
    JWT_SECRET=your_jwt_secret
    EMAIL_HOST=smtp.example.com
    EMAIL_PORT=587
    EMAIL_USER=your_email@example.com
    EMAIL_PASS=your_email_password
    EMAIL_SECURE=false
    ADMIN_EMAIL=admin@example.com
    ADMIN_PASSWORD=password123

    ```

4. **Iniciar el servidor**:
    ```bash
    npm run server
    ```
El servidor estará corriendo en http://localhost:5000.

5. **Estructura del Proyecto**
- models/: Contiene los modelos de Mongoose para la base de datos.
- controllers/: Contiene la lógica de negocio de la aplicación.
- routes/: Define las rutas de la API.
- config/: Configuración de base de datos y otros.
- utils/: Funciones y utilidades varias.
- __tests__/: Pruebas automatizadas.

### Estructura completa
```markdown
multimedia-management-back/
├── __tests__/
│ ├── files/
│ │ └── profile.jpg
│ ├── authController.test.js
│ ├── categoryController.test.js
│ ├── reactionTypeController.test.js
│ └── topicController.test.js
├── config/
│ ├── db.js
│ ├── multer.js
│ └── swagger.js
├── controllers/
│ ├── authController.js
│ ├── categoryController.js
│ ├── contentController.js
│ ├── contentTypeController.js
│ ├── reactionTypeController.js
│ ├── topicController.js
│ └── userController.js
├── middleware/
│ └── authMiddleware.js
├── models/
│ ├── Category.js
│ ├── Comment.js
│ ├── Content.js
│ ├── ContentType.js
│ ├── Rating.js
│ ├── Reaction.js
│ ├── ReactionType.js
│ ├── Topic.js
│ └── User.js
├── routes/
│ ├── adminRoutes.js
│ ├── authRoutes.js
│ ├── categoryAdminRoutes.js
│ ├── contentAdminRoutes.js
│ ├── contentTypeAdminRoutes.js
│ ├── creatorRoutes.js
│ ├── publicRoutes.js
│ ├── reactionTypeAdminRoutes.js
│ ├── readerRoutes.js
│ ├── topicAdminRoutes.js
│ ├── userAdminRoutes.js
│ └── userRoutes.js
├── uploads/
│ ├── default-category.jpg
│ └── profile.jpg
├── utils/
│ └── sendEmail.js
├── .env.example
├── .gitignore
├── initDb.js
├── LICENSE
├── package.json
├── README.md
└── server.js
```

6. **Carga Automática de Datos Iniciales**

El sistema inicializa automáticamente un usuario administrador y varios tipos de contenido, categorías, tópicos y tipos de reacciones. Esta operación se realiza en el archivo `initDb.js`.


Al cargar la aplicación, se creará el usuario `admin` con los siguientes datos de acceso:

- **Username**: admin
- **Email**: admin@example.com
- **Password**: password123
- **UserType**: Admin

7. **Documentación de la API**
La documentación de la API está disponible a través de Swagger. Para acceder a la documentación, inicia el servidor y navega a http://localhost:5000/api-docs.

## Configuración de Swagger
Swagger está configurado en el archivo swagger.js en el directorio config. Aquí está un ejemplo de configuración básica


8. **Pruebas Automatizadas**
El proyecto utiliza `jest` y `supertest` para las pruebas unitarias y de integración.

Las pruebas automatizadas se realizan utilizando Jest y Supertest. Las pruebas se encuentran en el directorio __tests__.

Para ejecutar las pruebas, utiliza el siguiente comando:

1. **Ejecutar todas las pruebas**:
    ```bash
    npm test
    ```

2. **Ejecutar pruebas específicas**:
    Puedes ejecutar pruebas específicas utilizando el nombre del archivo de prueba, por ejemplo:
    ```bash
    jest __tests__/authController.test.js
    ```
    
9. **Pruebas Manuales**

Para realizar pruebas manuales, puedes utilizar Postman. Aquí tienes una lista de casos de prueba para diferentes endpoints de la API.

  #### Autenticación

  1. **Registro de Usuario**

    - **Endpoint**: `POST /api/auth/register`
    - **Body**:
      ```json
      {
        "username": "admin",
        "email": "admin@example.com",
        "password": "password123",
        "userType": "Admin"
      }
      ```
    - **Resultado esperado**: 200 OK con mensaje de éxito y detalles del usuario.

  2. **Inicio de Sesión**

    - **Endpoint**: `POST /api/auth/login`
    - **Body**:
      ```json
      {
        "email": "admin@example.com",
        "password": "password123"
      }
      ```
    - **Resultado esperado**: 200 OK con el token JWT.

  3. **Verificación de Correo Electrónico**

    - **Endpoint**: `GET /api/auth/verify-email/:token`
    - **Resultado esperado**: 200 OK con mensaje de verificación exitosa.

  #### Categorías

  4. **Crear Categoría**

    - **Endpoint**: `POST /api/categories`
    - **Headers**: Agregar el token JWT en el header `Authorization`.
    - **Body**:
      ```json
      {
        "name": "Imágenes",
        "description": "Categoría para imágenes"
      }
      ```
    - **Resultado esperado**: 200 OK con detalles de la categoría creada.

  5. **Obtener Categorías**

    - **Endpoint**: `GET /api/categories`
    - **Headers**: Agregar el token JWT en el header `Authorization`.
    - **Resultado esperado**: 200 OK con la lista de categorías.

  6. **Obtener una Categoría por ID**

    - **Endpoint**: `GET /api/categories/:id`
    - **Headers**: Agregar el token JWT en el header `Authorization`.
    - **Resultado esperado**: 200 OK con los detalles de la categoría.

  7. **Actualizar una Categoría**

    - **Endpoint**: `PUT /api/categories/:id`
    - **Headers**: Agregar el token JWT en el header `Authorization`.
    - **Body**:
      ```json
      {
        "name": "Imágenes Actualizadas",
        "description": "Categoría para imágenes actualizadas"
      }
      ```
    - **Resultado esperado**: 200 OK con los detalles de la categoría actualizada.

  8. **Eliminar una Categoría**

    - **Endpoint**: `DELETE /api/categories/:id`
    - **Headers**: Agregar el token JWT en el header `Authorization`.
    - **Resultado esperado**: 200 OK con mensaje de eliminación exitosa.

  #### Temáticas

  9. **Crear Temática**

    - **Endpoint**: `POST /api/topics`
    - **Headers**: Agregar el token JWT en el header `Authorization`.
    - **Body**:
      ```json
      {
        "name": "Naturaleza",
        "description": "Temática relacionada con la naturaleza",
        "allowedContentTypes": ["image", "video"]
      }
      ```
    - **Resultado esperado**: 200 OK con detalles de la temática creada.

  10. **Obtener Temáticas**

      - **Endpoint**: `GET /api/topics`
      - **Headers**: Agregar el token JWT en el header `Authorization`.
      - **Resultado esperado**: 200 OK con la lista de temáticas.

  11. **Obtener una Temática por ID**

      - **Endpoint**: `GET /api/topics/:id`
      - **Headers**: Agregar el token JWT en el header `Authorization`.
      - **Resultado esperado**: 200 OK con los detalles de la temática.

  12. **Actualizar una Temática**

      - **Endpoint**: `PUT /api/topics/:id`
      - **Headers**: Agregar el token JWT en el header `Authorization`.
      - **Body**:
        ```json
        {
          "name": "Naturaleza Actualizada",
          "description": "Temática relacionada con la naturaleza actualizada",
          "allowedContentTypes": ["image", "video", "text"]
        }
        ```
      - **Resultado esperado**: 200 OK con los detalles de la temática actualizada.

  13. **Eliminar una Temática**

      - **Endpoint**: `DELETE /api/topics/:id`
      - **Headers**: Agregar el token JWT en el header `Authorization`.
      - **Resultado esperado**: 200 OK con mensaje de eliminación exitosa.


  #### Contenidos

  14. **Crear Contenido**

      - **Endpoint**: `POST /api/contents`
      - **Headers**: Agregar el token JWT en el header `Authorization`.
      - **Body**:
        ```json
        {
          "title": "Foto de la naturaleza",
          "type": "image",
          "category": "<category_id>",
          "topic": "<topic_id>",
          "creator": "<user_id>",
          "url": "http://example.com/image.jpg"
        }
        ```
      - **Resultado esperado**: 200 OK con detalles del contenido creado.

  15. **Obtener Contenidos**

      - **Endpoint**: `GET /api/contents`
      - **Headers**: Agregar el token JWT en el header `Authorization`.
      - **Resultado esperado**: 200 OK con la lista de contenidos.

  16. **Obtener un Contenido por ID**

      - **Endpoint**: `GET /api/contents/:id`
      - **Headers**: Agregar el token JWT en el header `Authorization`.
      - **Resultado esperado**: 200 OK con los detalles del contenido.

  17. **Actualizar un Contenido**

      - **Endpoint**: `PUT /api/contents/:id`
      - **Headers**: Agregar el token JWT en el header `Authorization`.
      - **Body**:
        ```json
        {
          "title": "Foto de la naturaleza actualizada",
          "type": "image",
          "category": "<category_id>",
          "topic": "<topic_id>",
          "creator": "<user_id>",
          "url": "http://example.com/image_updated.jpg"
        }
        ```
      - **Resultado esperado**: 200 OK con los detalles del contenido actualizado.

  18. **Eliminar un Contenido**

      - **Endpoint**: `DELETE /api/contents/:id`
      - **Headers**: Agregar el token JWT en el header `Authorization`.
      - **Resultado esperado**: 200 OK con mensaje de eliminación exitosa.

  #### Tipos de Reacción

  19. **Crear Tipo de Reacción**

      - **Endpoint**: `POST /api/reaction-types`
      - **Headers**: Agregar el token JWT en el header `Authorization`.
      - **Body**:
        ```json
        {
          "name": "Me gusta",
          "icon": "👍"
        }
        ```
      - **Resultado esperado**: 200 OK con detalles del tipo de reacción creado.

  20. **Obtener Tipos de Reacción**

      - **Endpoint**: `GET /api/reaction-types`
      - **Headers**: Agregar el token JWT en el header `Authorization`.
      - **Resultado esperado**: 200 OK con la lista de tipos de reacciones.

  21. **Obtener un Tipo de Reacción por ID**

      - **Endpoint**: `GET /api/reaction-types/:id`
      - **Headers**: Agregar el token JWT en el header `Authorization`.
      - **Resultado esperado**: 200 OK con los detalles del tipo de reacción.

  22. **Actualizar un Tipo de Reacción**

      - **Endpoint**: `PUT /api/reaction-types/:id`
      - **Headers**: Agregar el token JWT en el header `Authorization`.
      - **Body**:
        ```json
        {
          "name": "Me gusta Actualizado",
          "icon": "👍"
        }
        ```
      - **Resultado esperado**: 200 OK con los detalles del tipo de reacción actualizado.

  23. **Eliminar un Tipo de Reacción**

      - **Endpoint**: `DELETE /api/reaction-types/:id`
      - **Headers**: Agregar el token JWT en el header `Authorization`.
      - **Resultado esperado**: 200 OK con mensaje de eliminación exitosa.

  #### Reacciones

  24. **Agregar Reacción a Contenido**

      - **Endpoint**: `POST /api/contents/:id/reactions`
      - **Headers**: Agregar el token JWT en el header `Authorization`.
      - **Body**:
        ```json
        {
          "reactionTypeId": "<reaction_type_id>"
        }
        ```
      - **Resultado esperado**: 200 OK con mensaje de éxito.

  25. **Eliminar Reacción de Contenido**

      - **Endpoint**: `DELETE /api/contents/:id/reactions/:reactionId`
      - **Headers**: Agregar el token JWT en el header `Authorization`.
      - **Resultado esperado**: 200 OK con mensaje de éxito.

10. **Contribuciones**

Las contribuciones son bienvenidas. Por favor, sigue los siguientes pasos para contribuir:

  1. Haz un fork del repositorio.
  2. Crea una nueva rama (git checkout -b feature/nueva-feature).
  3. Realiza los cambios necesarios y realiza commits (git commit -m 'Agrega nueva feature').
  4. Haz push a la rama (git push origin feature/nueva-feature).
  5. Abre un Pull Request.

11. **Licencia**
Este proyecto está bajo la licencia MIT. Consulta el archivo LICENSE para más detalles.

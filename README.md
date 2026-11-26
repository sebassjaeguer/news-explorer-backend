# News Explorer — Backend

API del proyecto final de TripleTen. Gestiona usuarios, autenticación mediante JWT y artículos guardados en MongoDB.

## Enlaces

- API: https://news-explorer-api-sebas.duckdns.org
- Aplicación: https://news-explorer-sebas.duckdns.org
- Frontend: https://github.com/sebassjaeguer/news-explorer-frontend
- Backend: https://github.com/sebassjaeguer/news-explorer-backend

## Tecnologías

Node.js, Express, MongoDB, Mongoose, bcryptjs, jsonwebtoken, celebrate, Joi, dotenv, Helmet, express-rate-limit y ESLint con Airbnb Base.

## Requisitos

- Node.js y npm compatibles con las dependencias del proyecto.
- MongoDB instalado y en ejecución para el desarrollo local.

## Instalación

```sh
git clone --branch stage-back-end https://github.com/sebassjaeguer/news-explorer-backend.git
cd news-explorer-backend
npm ci
```

## Desarrollo local

El backend puede funcionar sin un archivo `.env`. En ese caso utiliza:

- MongoDB: `mongodb://127.0.0.1:27017/newsexplorer`.
- Una clave JWT de desarrollo.
- Puerto `3000`.

Para iniciar:

```sh
npm run dev
```

Dirección local: `http://127.0.0.1:3000`.

## Variables de entorno

Puedes crear un archivo `.env` en la raíz del backend:

```dotenv
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/newsexplorer
JWT_SECRET=REEMPLAZA_CON_UNA_CLAVE_ALEATORIA
```

Para generar una clave:

```sh
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

En producción, agrega:

```dotenv
NODE_ENV=production
```

En producción son obligatorias `MONGO_URI` y `JWT_SECRET`. Si faltan, el servidor no arranca.

La configuración se concentra en `config/env.js`. Reinicia el servidor después de cambiar las variables.

El nombre al final de `MONGO_URI` identifica la base de datos. Conserva el nombre de tu base si ya contiene información.

Si cambias `JWT_SECRET`, debes iniciar sesión nuevamente.

El archivo `.env` está excluido de Git.

## Comandos

| Comando | Función |
| --- | --- |
| `npm run dev` | Inicia el servidor y reinicia al cambiar archivos. |
| `npm start` | Inicia el servidor sin reinicio automático. |
| `npm run lint` | Revisa el código con las reglas Airbnb Base. |
| `npm audit` | Consulta vulnerabilidades conocidas en las dependencias. |

## Estructura

- `config/`: conexión a MongoDB, variables de entorno, códigos y mensajes.
- `controllers/`: operaciones de usuarios y artículos.
- `errors/`: clase de errores HTTP.
- `middlewares/`: autenticación, validación, registros, límite de solicitudes y manejo de errores.
- `models/`: modelos de Mongoose.
- `routes/`: definición y agrupación de rutas.
- `app.js`: configuración de Express y arranque del servidor.

## Rutas

| Método | Ruta | Función | Requiere token |
| --- | --- | --- | --- |
| POST | `/signup` | Registra un usuario. | No |
| POST | `/signin` | Devuelve el token y los datos del usuario. | No |
| GET | `/` | Comprueba que el servidor responde. | Sí |
| GET | `/users/me` | Consulta el usuario conectado. | Sí |
| GET | `/articles` | Consulta sus artículos guardados. | Sí |
| POST | `/articles` | Guarda un artículo. | Sí |
| DELETE | `/articles/:id` | Elimina un artículo propio. | Sí |

Las rutas protegidas requieren:

```text
Authorization: Bearer TU_TOKEN
```

En Postman, selecciona Authorization → Bearer Token y pega el token obtenido en `/signin`.

## Datos de un artículo

`POST /articles` recibe estos campos obligatorios:

- `keyword`: palabra utilizada en la búsqueda.
- `title`: título.
- `description`: descripción.
- `date`: fecha.
- `source`: fuente.
- `url`: dirección HTTP o HTTPS del artículo.
- `image`: dirección HTTP o HTTPS de la imagen.

El propietario se obtiene del token. No se envía `owner` en el cuerpo de la solicitud.

Cada usuario consulta y elimina únicamente sus propios artículos. Guardar la misma URL nuevamente con la misma cuenta devuelve `409`.

## Validación y errores

Celebrate y Joi validan las solicitudes antes de ejecutar los controladores. Los modelos también validan los datos.

El manejo de errores se concentra en `middlewares/errorHandler.js`.

| Código | Significado |
| --- | --- |
| 200 | Solicitud completada. |
| 201 | Recurso creado. |
| 400 | Datos o JSON inválidos. |
| 401 | Autenticación ausente o inválida. |
| 403 | Intento de eliminar un artículo ajeno. |
| 404 | Recurso o ruta no encontrados. |
| 409 | Correo o artículo duplicado. |
| 413 | Cuerpo de la solicitud demasiado grande. |
| 429 | Límite de solicitudes superado. |
| 500 | Error interno del servidor. |

## Seguridad

- Las contraseñas se guardan como hashes mediante bcryptjs.
- Las respuestas no incluyen contraseñas ni sus hashes.
- Los tokens JWT caducan a los siete días.
- Helmet configura encabezados de seguridad.
- El limitador permite 100 solicitudes por IP durante una ventana de 15 minutos.
- El contador del limitador se guarda en memoria y se reinicia con el proceso.
- El campo `owner` está oculto por defecto y se consulta para comprobar la propiedad del artículo.

## Registros

Los registros se guardan en la raíz del backend:

- `request.log`: solicitudes recibidas y respuestas completadas, con estado HTTP y duración.
- `error.log`: respuestas con códigos de error.

Cada entrada ocupa una línea JSON. No se registran cuerpos de solicitudes, contraseñas ni tokens.

Los archivos `.log` están excluidos de Git.

## Despliegue

La aplicación utiliza Google Cloud, MongoDB en el servidor, PM2, Nginx y HTTPS mediante Let's Encrypt.

El proceso de PM2 se llama `news-explorer-backend`.

Esta versión del backend escucha en `127.0.0.1:3000`. Al desplegarla, Nginx debe reenviar las solicitudes a ese puerto.

El frontend también puede acceder mediante `/api/` desde su propio dominio. Nginx elimina ese prefijo al reenviar las solicitudes al backend.

En producción, Express confía en el proxy local para identificar la IP del visitante.

## Autor

Sebastian Medina.

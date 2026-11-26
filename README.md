# News Explorer — Backend

API del proyecto final de TripleTen. Gestiona usuarios, autenticación mediante JWT y artículos guardados en MongoDB.

## Enlaces

- API: https://news-explorer-api-sebas.duckdns.org
- Aplicación: https://news-explorer-sebas.duckdns.org
- Repositorio del frontend: https://github.com/sebassjaeguer/news-explorer-frontend

## Tecnologías

Node.js, Express, MongoDB, Mongoose, bcryptjs, jsonwebtoken, celebrate, dotenv y ESLint.

## Requisitos

- Node.js y npm compatibles con las dependencias del proyecto.
- MongoDB instalado y en ejecución para el desarrollo local.

## Instalación

```sh
git clone https://github.com/sebassjaeguer/news-explorer-backend.git
cd news-explorer-backend
git switch stage-back-end
npm ci
```

## Desarrollo local

El backend puede funcionar sin un archivo `.env`.

Si no se configuran variables de entorno, utiliza:

- MongoDB: `mongodb://127.0.0.1:27017/newsexplorer`.
- Una clave JWT de desarrollo definida en `config/env.js`.
- Puerto: `3000`.

Inicia el servidor:

```sh
npm run dev
```

Dirección local:

```text
http://localhost:3000
```

### Configuración opcional con .env

Para utilizar otra conexión o una clave JWT personalizada, crea un archivo `.env` en la raíz del backend:

```dotenv
MONGO_URI=mongodb://127.0.0.1:27017/newsexplorer
JWT_SECRET=REEMPLAZA_CON_UNA_CLAVE_ALEATORIA
```

Puedes generar una clave con:

```sh
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copia el resultado como valor de `JWT_SECRET`.

Las variables configuradas tienen prioridad sobre los valores de desarrollo. Reinicia el servidor después de modificar `.env`.

El nombre al final de `MONGO_URI` identifica la base de datos. `newsexplorer` y `news-explorer` son bases diferentes. Si ya tienes datos en otra base, conserva su nombre en tu configuración.

Si cambias la clave JWT, inicia sesión nuevamente para obtener un token válido.

## Comandos

| Comando | Función |
| --- | --- |
| `npm run dev` | Ejecuta `app.js` y reinicia al cambiar archivos. |
| `npm start` | Ejecuta `app.js` sin reinicio automático. |
| `npm run lint` | Analiza el código con ESLint. |

## Rutas

| Método | Ruta | Función | Requiere token |
| --- | --- | --- | --- |
| GET | `/` | Comprueba que el servidor responde. | No |
| POST | `/signup` | Registra un usuario. | No |
| POST | `/signin` | Valida credenciales y devuelve `token` y `user`. | No |
| GET | `/users/me` | Devuelve los datos del usuario conectado. | Sí |
| GET | `/articles` | Consulta los artículos guardados del usuario. | Sí |
| POST | `/articles` | Guarda un artículo para el usuario. | Sí |
| DELETE | `/articles/:id` | Elimina un artículo del usuario. | Sí |

Las rutas protegidas reciben este encabezado:

```text
Authorization: Bearer TU_TOKEN
```

En Postman, selecciona Authorization → Bearer Token y pega el token obtenido en `/signin`.

## Datos de un artículo

`POST /articles` recibe los siguientes campos obligatorios:

- `keyword`: palabra utilizada en la búsqueda.
- `title`: título del artículo.
- `description`: descripción del artículo.
- `date`: fecha del artículo.
- `source`: fuente de la noticia.
- `url`: dirección HTTP o HTTPS del artículo.
- `image`: dirección HTTP o HTTPS de la imagen.

El backend obtiene el propietario a partir del token. No se envía `owner` en el cuerpo de la solicitud.

Cada usuario puede consultar y eliminar únicamente sus propios artículos. Guardar nuevamente la misma URL con la misma cuenta devuelve un error `409`.

## Validación y errores

Las solicitudes se validan mediante celebrate y Joi antes de ejecutar los controladores. Los modelos también validan los datos almacenados.

El manejo de errores está centralizado en `middlewares/errorHandler.js`.

Entre los códigos de respuesta utilizados están:

- `200`: solicitud completada.
- `201`: recurso creado.
- `400`: datos inválidos.
- `401`: autenticación ausente o inválida.
- `403`: intento de eliminar un artículo de otra cuenta.
- `404`: recurso o ruta no encontrados.
- `409`: correo o artículo duplicado.
- `500`: error interno del servidor.

## Registros

El backend genera archivos de registro en su carpeta raíz:

- `request.log`: solicitudes recibidas.
- `error.log`: respuestas con códigos de error.

Cada entrada se guarda como una línea JSON. Los registros no incluyen contraseñas ni tokens.

Los archivos `.log` están excluidos mediante `.gitignore`.

## Configuración de producción

En el servidor se configuran estas variables en `.env`:

```dotenv
NODE_ENV=production
MONGO_URI=mongodb://127.0.0.1:27017/newsexplorer
JWT_SECRET=REEMPLAZA_CON_UNA_CLAVE_ALEATORIA
```

En producción, el backend exige `MONGO_URI` y `JWT_SECRET`.

La clave de desarrollo no se utiliza como alternativa cuando falta `JWT_SECRET` en producción.

El archivo `.env` está excluido de Git.

## Publicación

La API está publicada en Google Cloud:

https://news-explorer-api-sebas.duckdns.org

- MongoDB se ejecuta en el servidor.
- PM2 mantiene activo el proceso `news-explorer-backend`.
- Nginx reenvía las solicitudes al puerto `3000`.
- HTTPS está configurado mediante certificados de Let's Encrypt y Certbot.

El frontend también accede al backend mediante `/api/` desde su propio dominio. Nginx elimina ese prefijo antes de reenviar la solicitud.

## Seguridad

Las contraseñas se almacenan como hashes mediante bcryptjs y no se devuelven en las respuestas.

Los tokens JWT caducan a los siete días.

El campo `owner` de los artículos está oculto por defecto. Se consulta explícitamente cuando se necesita comprobar la propiedad.

## Autor

Sebastian Medina.

# News Explorer — Backend

API del proyecto final de TripleTen. Gestiona usuarios, autenticación mediante JWT y artículos guardados en MongoDB.

## Autor

Sebastian Medina.

## Tecnologías

Node.js, Express, MongoDB, Mongoose, bcryptjs, jsonwebtoken, celebrate, dotenv y ESLint.

## Requisitos

- Node.js y npm compatibles con las dependencias del proyecto.
- MongoDB local instalado y en ejecución para el desarrollo.

## Instalación

```sh
git clone https://github.com/sebassjaeguer/news-explorer-backend.git
cd news-explorer-backend
npm install
```

## Desarrollo local

El backend puede funcionar sin un archivo `.env`.

Cuando no se configuran variables de entorno, utiliza:

- MongoDB: `mongodb://127.0.0.1:27017/newsexplorer`.
- Una clave JWT de desarrollo definida en `config/env.js`.
- Puerto: `3001`.

Inicia el servidor:

```sh
npm run dev
```

Cuando se conecta a MongoDB, el servidor escucha en:

```text
http://localhost:3001
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
| `npm run lint` | Revisa el código con ESLint. |

## Rutas

| Método | Ruta | Función | Requiere token |
| --- | --- | --- | --- |
| GET | `/` | Comprueba que el servidor responde. | No |
| POST | `/signup` | Registra un usuario con nombre, correo y contraseña. | No |
| POST | `/signin` | Valida credenciales y devuelve `token` y `user`. | No |
| GET | `/users/me` | Devuelve el usuario identificado por el token. | Sí |
| GET | `/articles` | Consulta los artículos de ese usuario. | Sí |
| POST | `/articles` | Guarda un artículo para ese usuario. | Sí |
| DELETE | `/articles/:id` | Elimina un artículo de ese usuario. | Sí |

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

Las solicitudes se validan antes de ejecutar los controladores mediante celebrate y Joi. Los modelos también validan los datos almacenados.

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

- `request.log`: registra las solicitudes recibidas.
- `error.log`: registra las respuestas con códigos de error.

Cada entrada se guarda como una línea JSON. Los registros no incluyen contraseñas ni tokens.

Los archivos `.log` están excluidos mediante `.gitignore`.

## Configuración de producción

En el servidor de producción deben configurarse estas variables:

```dotenv
NODE_ENV=production
MONGO_URI=URI_DE_LA_BASE_DE_DATOS_DEL_SERVIDOR
JWT_SECRET=CLAVE_SECRETA_ALEATORIA
```

Los valores de ejemplo deben sustituirse por los reales.

En producción, el backend exige `MONGO_URI` y `JWT_SECRET`. La clave de desarrollo no se utiliza como alternativa cuando falta `JWT_SECRET`.

Con las variables configuradas, inicia el servidor mediante:

```sh
npm start
```

El archivo `.env` y los registros están excluidos de Git.

## Despliegue

Pendiente: publicar la API, configurar el dominio y HTTPS, y agregar aquí su dirección pública.

## Seguridad

Las contraseñas se almacenan como hashes mediante bcryptjs y no se devuelven en las respuestas.

Los tokens JWT caducan a los siete días.

El campo `owner` de los artículos está oculto por defecto y se consulta explícitamente cuando se necesita comprobar la propiedad.

## Frontend

[Repositorio del frontend](https://github.com/sebassjaeguer/news-explorer-frontend)

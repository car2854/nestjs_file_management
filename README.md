<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

# Servidor administrador de archivos

## Descripción
Este es un servidor para la aplicacion de administracion de archivos, este servidor se encarga de subir imagenes al servidor Google Cloud Storage.

# Instalacion

```bash
$ npm install
```

### Explicación Detallada
Para correr el servidor correctamente necesita dos archivos, 
1. .env 
2. collection-map-414120-e036c2f5aee7.json 

Esto para evitar subir los archivos a Git, lo pasare por mensaje para que puedan moverlo y colocarlo en la raiz de la aplicacionn es decir como este ejemplo

- `dist/`
- `node_modules/`
- `src/`
- `...otras carpetas y archivos aquí...`
- `collection-map-414120-e036c2f5aee7.json` *(aqui debe estar este archivo)*
- `.env` *(aqui debe estar este archivo)*
- `package-lock.json`
- `package.json`
- `...otros archivos relacionados con el proyecto...`

# Correr la aplicacion

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

# API Endpoints

## GET /api/files
### Descripción
Este endpoint que permite recuperar los archivos del servidor.

### URL
`/api/files`

### Método HTTP
`GET`

### Datos opcional Query
- `folderName`: Si quiere obtener los archivos de una carpeta en especifico, enviar en el query este dato `String`.

## POST /api/files
### Descripción
Este endpoint permite subir un archivo al servidor.

### URL
`/api/files`

### Método HTTP
`POST`

### Datos de Entrada
- `image`: Archivo que se va a subir. Se envía como `multipart/form-data`.

### Datos opcional Query
- `folderName`: Si quieres subir la imagen en una carpeta en especifico, enviar en el query el nombre de la carpeta `String`.

## POST /api/files/folders
### Descripción
Este endpoint permite crear carpetas en el servidor

### URL
`/api/files/folders`

### Método HTTP
`POST`

### Datos de Entrada en el body
- `folderName`: Nombre de la carpeta que se va a crear. Se envía como `String`.

### Datos opcional Query
- `folderName`: Si quieres crear la carpeta en una carpeta en especifico, enviar en el query el nombre de la carpeta `String`.

## DELETE /api/files/:fileName
### Descripción
Este endpoint permite eliminar una carpeta o archivo, cuando se elimina una carpeta elimina todo lo que esta dentro de la carpeta

### URL
`/api/files/:fileName`

### Método HTTP
`DELETE`

### Datos de Entrada en el paramentro
- `fileName`: Nombre de la carpeta o archivo ha eliminar `String`.


# librerias instaladas

## 1. multer
Para manejar la subida de archivos en aplicaciones web

## 2. @nestjs/platform-express: 
Proporciona integración con Express, permite que las aplicaciones de NestJS utilicen el middleware y las funcionalidades de Express

## 3. @nestjs/config 
Facilita la gestión de la configuración en aplicaciones NestJS

## 4. class-validator
Permite definir y ejecutar validaciones basadas en decoradores para objetos y clases

## 5. class-transformer
Permite transformar objetos de forma sencilla
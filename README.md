# Solvex (Back)

Repositorio del Back del proyecto final.

---

### Tecnologias a utilizar (de momento)

- Nest
- TypeOrm
- Postgres
- Swagger
- Bcrypt
- Json Web Token

### Rutas de Git Flow

- Main: Solo se modifica cuando esta el producto/demo listo.
- Development: Rama donde estan todos los cambios. Pero no se modifica directamente.
- Rama personal: Rama que crea cada uno en donde se realizan sus cambios para luego hacer un Pull Request en development.

### Ejemplo de .env.development

- PORT = 'Aqui va el puerto de coneccion al servidor' || 3000
- DB_HOST = 'Aqui va el Host a utilizar' || localhost
- DB_PORT = 'Aqui va el puerto de la base de datos' || 5432
- DB_USERNAME = 'Aqui va el usuario de la base de datos'
- DB_NAME = 'Aqui val el nombre de la base de datos'
- DB_PASSWORD = 'Aqui va la constraseña para la pase de datos'
- JWT_SECRET = 'Aqui va la secret key para el JWT' || 'clavesecreta'

Para autenticacion de google:

- GOOGLE_CLIENT_ID='Aqui va el client ID de google'
- GOOGLE_CLIENT_SECRET='Aqui va el client secret de google'
- GOOGLE_CALLBACK_URL='Aqui va el callback URL'

Para cloudinary:

Recordar iniciar sesion con la cuenta de solvex:

- CLOUDINARY_CLOUD_NAME='Nombre de la nube en cloudinary'
- CLOUDINARY_API_KEY='Api key que se encuentra en cloudinary'
- CLOUDINARY_API_SECRET='Esta es la key secreta que se encuentra en clodinary'

- Importante: Crear .env.development al nivel de la carpeta principal solvex y crear primero la base de datos en postgres

### Ejemplo consumo de ruta register

- Ejemplo con campos opcionales (Recomendado)

en el json 1 se pueden omitir los campos de Role y Second_name, al ser opciones tienen un valor de default

    {
        "email": "prueba@example.com",
    	"password": "12345",
    	"password2": "12345",
        "name": "prueba",
    	"lastname": "prueba",
        "identification_number": "12345673",
        "phone": 1234567890,
        "typeId": "1"
    }

######################################################################################################################################################################################

- Ejemplo con campos completos:

        {
        "email": "prueba@example.com",
      "password": "12345",
      "password2": "12345",
        "name": "prueba",
      "lastname": "prueba",
        "identification_number": "12345673",
        "phone": 1234567890,
        "typeId": "1",
        "role": "3" →→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→ Este campo puede ser omitido ya que tiene como valor default 3 que corresponde al rol de empleado

  }

### Ejemplo de respuesta al realizar register:

{
"id_user": "45179b9e-734b-4e03-8f34-69b5e08073c0",
"name": "prueba",
"lastname": "prueba",
"identification_number": "123456723",
"phone": "1234567890",
"typeId": {
"id_typeid": 1,
"name": "C.C"
},
"role": {
"id_role": 3,
"role_name": "Empleado"
}
}

### Datos temporal de seeders para demo

Admin:
email: 'admin@solvex.com',
password: 'Admin123!',

Soporte:
email: 'soporte@solvex.com',
password: 'Soporte123!',

### crear tickets

la ruta a consumir para la creacion de tickets es: tickets/createTicket

el json de ejemplo para consumir la ruta:

En Header:

1. debe estar el contet-type con multipart/foorm-data
2. Agregar un apartado de "Authorization" y como argumento "Bearer " seguido del token generado por jwt

En Body

1. Un campo "title" seguido de los datos ingresados por el usuario capturados desde el front.
2. Un campo "description" seguido de los datos ingresados por el usuario capturados desde el front.
   CAMPOS OPCIONALES:
   es posible agregar de 0 a 3 imagenes por loq ue los campos de imagenes pueden estar o no.
3. El campo para agregar imagenes y todos deben estar apartados, todos deben llamarse "images"

En caso de dudas se anexara una imagen al discord para un ejemplo más grafico

# Ejemplo respuesta Json

{
"id_ticket": 2,
"title": "prueba",
"description": "pruebass",
"creation_date": "2025-07-16T17:41:06.848Z",
"closing_date": null,
"img_1": "https://res.cloudinary.com/ds02h9dbp/image/upload/v1752687666/tickets/vc4ad3sddnp1grwosvhj.jpg",
"img_2": "no image",
"img_3": "no image",
"id_status": {
"id_status": 1,
"name": "pending"
},
"id_empleado": {
"id_user": "17e79b9f-88e6-4a2f-9cf7-c497c4929250",
"name": "Admin",
"lastname": "Solvex",
"identification_number": "987654321",
"phone": "313564564564"
}
}

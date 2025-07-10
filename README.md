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

- Importante: Crear .env.development al nivel de la carpeta principal solvex y crear primero la base de datos en postgres

### Ejemplo consumo de ruta register

- Ejemplo con campos opcionales (Recomendado)

en el json 1 se pueden omitir los campos de Role y Second_name, al ser opciones tienen un valor de default

    {
        "email": "prueba@example.com",
		"password": "$2a$10$Ejemplo",
        "first_name": "prueba",
		"first_surname": "prueba",
		"second_surname": "prueba",
        "identification_number": "12345673",
        "phone": 1234567890,
        "typeId": "1"
    }

######################################################################################################################################################################################

- Ejemplo con campos completos:

        {
        "email": "prueba@example.com",
		"password": "$2a$10$Ejemplo",
        "first_name": "prueba",
		"second_name": "prueba", →→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→ Este campo puede ser omitido ya que tiene como valor default ''
		"first_surname": "prueba",
		"second_surname": "prueba",
        "identification_number": "12345673",
        "phone": 1234567890,
        "typeId": "1",
        "role": "3" →→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→ Este campo puede ser omitido ya que tiene como valor default 3 que corresponde al rol de empleado
    }

### Ejemplo de respuesta al realizar register:

{
	"id_user": "872480a5-57a8-442c-83d2-45a19d2a37a3",
	"first_name": "prueba",
	"second_name": "prueba",
	"first_surname": "prueba",
	"second_surname": "prueba",
	"identification_number": "123456173",
	"phone": "1234567890",
	"typeId": {
		"id_typeid": 1,
		"name": "C.C"
	},
	"role": {
		"id_role": 1,
		"role_name": "Admin"
	}
}


# Solvex (Back)

Repositorio del Back del proyecto final.

---

### Tecnologias a utilizar (de momento)

-   Nest
-   TypeOrm
-   Postgres
-   Swagger
-   Bcrypt
-   Json Web Token

### Rutas de Git Flow

-   Main: Solo se modifica cuando esta el producto/demo listo.
-   Development: Rama donde estan todos los cambios. Pero no se modifica directamente.
-   Rama personal: Rama que crea cada uno en donde se realizan sus cambios para luego hacer un Pull Request en development.

### Ejemplo de .env.development

-   PORT = 'Aqui va el puerto de coneccion al servidor' || 3000
-   DB_HOST = 'Aqui va el Host a utilizar' || localhost
-   DB_PORT = 'Aqui va el puerto de la base de datos' || 5432
-   DB_USERNAME = 'Aqui va el usuario de la base de datos'
-   DB_PASSWORD = 'Aqui va la constraseña para la pase de datos'

-   Importante: Crear .env.development al nivel de la carpeta principal solvex y crear primero la base de datos en postgres

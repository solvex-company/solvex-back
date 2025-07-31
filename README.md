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

Para mercadopago:

- MP_ACCESS_TOKEN='Aqui va el access token de MercadoPago'
- MP_WEBHOOK_URL='Aqui va el webhook URL de MercadoPago'

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

### EJEMPLO DE LOGIN USUARIO

{
"email": "prueba@example.com",
"password": "Password!123"
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

### CUENTAS TEST MERCADO PAGO

- USUARIO VENDEDOR

Usuario: TESTUSER1418251512
Contraseña: tOmEKvxLCu

- USUARIO COMPRADOR

Usuario: TESTUSER172172853
Contraseña: euBFOQ5Z93

### ACCESS TOKEN MERCADO PAGO

Access Token: APP_USR-5372043080270248-071710-1654fdad50fa9e4a557b269b264cfdef-2567481644

## Pruebas de flujo de pagos con Mercado Pago usando Insomnia

### 1. Crear un usuario

- Endpoint: `POST /auth/signup`
- Body (JSON):

```json
{
  "email": "prueba@example.com",
  "password": "Password123!",
  "password2": "Password123!",
  "name": "prueba",
  "lastname": "prueba",
  "identification_number": "12345673",
  "phone": "1234567890",
  "typeId": 1
}
```

### 2. Loguearse para obtener el token JWT

- Endpoint: `POST /auth/signin`
- Body (JSON):

```json
{
  "email": "prueba@example.com",
  "password": "Password123!"
}
```

- La respuesta incluirá un campo `token`.

### 3. Usar el token en el header Authorization para iniciar el checkout

- Endpoint: `GET /payments/checkout`
- Header:
  - `Authorization: Bearer <token>`
- Ejemplo en Insomnia:
  - Método: `GET`
  - URL: `http://localhost:4000/payments/checkout`
  - Header: `Authorization: Bearer eyJhbGciOi...`

### 4. Flujo completo

1. Crear usuario (signup)
2. Loguearse (signin) y copiar el token JWT de la respuesta
3. Hacer GET a `/payments/checkout` con el header Authorization
4. Usar el `paymentUrl` recibido para realizar el pago en Mercado Pago
5. El backend recibirá los webhooks y actualizará el estado del pago automáticamente

### IMPORTANTE PARA QUE FUNCIONE AL HACER PRUEBAS LOCALES HAY QUE USAR NGROK

MP_WEBHOOK_URL: 'https://abcd1234.ngrok.io/payments/webhook'

Uso de ngrok para webhooks de Mercado Pago
Si desarrollas localmente, necesitas una URL pública para que Mercado Pago pueda enviar los webhooks a tu backend.
Usa ngrok para exponer tu servidor local:
Instala ngrok y ejecuta en la terminal:
ngrok http 4000
(Reemplaza 4000 por el puerto de tu backend si es diferente).
ngrok te dará una URL pública como https://abcd1234.ngrok.io.
Usa esa URL en el campo notification_url al crear la preferencia de pago, por ejemplo:
notification_url: 'https://abcd1234.ngrok.io/payments/webhook'
Importante: Cada vez que reinicies ngrok, la URL cambiará. Actualiza el notification_url con la nueva URL.

## Notificaciones Internas (CRON)

### ¿Qué hace este módulo?

- Genera notificaciones internas para el usuario admin cuando un usuario con rol "Soporte" (helper) no resuelve tickets en 48 horas, y luego cada 24 horas adicionales.
- Permite a cualquier usuario autenticado (admin, soporte, empleado) consultar sus propias notificaciones y marcarlas como leídas.

### ¿Cómo funciona el flujo?

1. **CRON automático:**  
   - Cada hora, el sistema revisa todos los usuarios con rol "Soporte".
   - Si un helper no resolvió ningún ticket en las últimas 48h, se genera una notificación para el admin.
   - Si sigue sin resolver, se genera una nueva notificación cada 24h adicional.
   - El contador se reinicia si el helper resuelve un ticket.

2. **Consulta de notificaciones:**  
   - Cualquier usuario autenticado puede consultar sus notificaciones con `GET /notifications`.
   - Solo el admin verá notificaciones sobre la inactividad de helpers.
   - Soporte verá notificaciones sobre los tickets sin resolver pasadas 24hs y empleados verán notificaciones si en el futuro se implementan para ellos.

3. **Marcar como leída:**  
   - Cualquier usuario autenticado puede marcar sus notificaciones como leídas con `PATCH /notifications/:id/read`.

### ¿Cómo extender o modificar?

- Para agregar notificaciones internas para otros roles (soporte, empleado), extender la lógica en el servicio de notificaciones.
- Para cambiar la frecuencia o condiciones del CRON, modificar el método `notifyAdminHelpersInactive` en `crons.service.ts`.

### Notas técnicas

- El sistema usa `node-cron` para la tarea programada.
- Los nombres de roles deben coincidir exactamente con los de la base de datos (`'Admin'`, `'Soporte'`, `'Empleado'`).
- El endpoint `/notifications/test-cron` puede usarse para pruebas manuales (proteger o eliminar en producción)

### Muchas gracias por toda la participacion de todos, un gran equipo de trabajo
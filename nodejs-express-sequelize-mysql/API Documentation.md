# API Documentation

## Base URLs

- Mobile: `/app/measures`
- Admin: `/server/data`


## Mobile Route

### Get the name for the jersey number
- **Endpoint:** `/ident`
- **Method:** `GET`
- **Description:** Permet d'obtenir le nom/pseudo associé à un numéro de dossard auprès du serveur de la RQM.
- **Query Parameters:** 
  - `dosNumber` - Numéro de dossard
- **Responses:**
  - **200 OK**
    ```json
    {
      "dosNumber": 1234,
      "name": "John Doe"
    }
    ```
  - **404 Not Found**
    ```json
    {
      "message": "User not found"
    }
    ```
  - **500 Internal Server Error**
    ```json
    {
      "message": "Something went wrong on our side"
    }
    ```






### Login
- **Endpoint:** `/login`
- **Method:** `POST`
- **Description:** Crée un participant dans la DB du serveur. Si le participant existe déjà, renvoie simplement les informations déjà connues.
- **Body Parameters:**
  ```json
  {
    "dosNumber": 1234,
    "username": "John Doe"
  }
- **Responses:**
  - **200 Ok**
    ```json
    {
      "dosNumber": 1234,
      "username": "John Doe",
      "distTraveled": 100
    }
    ```
  - **201 Created**
    ```json
    {
      "dosNumber": 1234,
      "username": "John Doe",
      "distTraveled": 100
    }
    ```
  - **500 Internal Server Error**
    ```json
    {
      "message": "Error logging in user"
    }
    ```

### Start of a measure
- **Endpoint:** `/start`
- **Method:** `POST`
- **Description:** Permet de démarrer une mesure.
- **Body Parameters:**
  ```json
  {
    "dosNumber": 1234,
    "name": "John Doe",
    "number": 1
  }
- **Responses:**
  - **201 Created**
    ```json
    {
      "dosNumber": 1234,
      "myUuid": "04610a98-5cef-4201-b7aa-e5d9ac293055"
    }
    ```
  - **202 Accepted**
    ```json
    {
      "dosNumber": 1234,
      "myUuid": "04610a98-5cef-4201-b7aa-e5d9ac293055",
      "error": "Notification not sent"
    }
    ```
  - **400 Bad Request**
    ```json
    {
      "message": "Malformed request"
    }
    ```
  - **404 Not Found**
    ```json
    {
      "message": "User not found"
    }
    ```
  - **500 Internal Server Error**
    ```json
    {
      "message": "Something went wrong on our side"
    }
    ```

### Stopping a measure
- **Endpoint:** `/stop`
- **Method:** `POST`
- **Description:** Permet d'arrêter une mesure. On envoie avec les dernières données qui doivent être entrées dans la mesure.
- **Body Parameters:**
  ```json
  {
    "dosNumber": 1234,
    "uuid": "04610a98-5cef-4201-b7aa-e5d9ac293055",
    "dist": 100,
    "time": 3600
  }
  ```
- **Responses:**
  - **200 Created**
    ```json
    {
      "message": "Measure stopped"
    }
    ```
  - **404 Created**
    ```json
    {
      "message": "User not found"
    }
    ```
  - **500 Created**
    ```json
    {
      "message": "Error stopping measure"
    }
    ```

### Update a measure
- **Endpoint:** `/update-dist`
- **Method:** `POST`
- **Description:** Permet de mettre à jour une mesure en cours avec un nouveau temps et une nouvelle distance.
- **Body Parameters:**
  ```json
  {
    "uuid": "04610a98-5cef-4201-b7aa-e5d9ac293055",
    "dist": 100,
    "time": 3600
  }
  ```
- **Responses:**
  - **200 OK**
    ```json
    {
      "message": "Measure updated"
    }
    ```
  - **404 Not Found**
    ```json
    {
      "message": "User not found"
    }
    ```
  - **500 Internal Server Error**
    ```json
    {
      "message": "Error updating measure"
    }
    ```

### Get a user distance
- **Endpoint:** `/getUserDist`
- **Method:** `GET`
- **Description:** Permet d'obtenir la distance totale parcourue par un participant.
- **Query Parameters**
  - `dosNumber` - Numéro de dossard
- **Responses:**
  - **200 OK**
    ```json
    {
      "dosNumber": 1234,
      "distTraveled": 100
    }
    ```
  - **400 Not Found**
    ```json
    {
      "message": "Malformed request"
    }
    ```
  - **404 Not Found**
    ```json
    {
      "message": "User not found"
    }
    ```

### Get the total distance travelled during the event
- **Endpoint:** `/getAllDist`
- **Method:** `GET`
- **Description:** Permet d'obtenir la distance totale parcourue par les participant durant l'évènement.
- **Query Parameters**
  - `none`
- **Responses:**
  - **200 OK**
    ```json
    {
      "distTraveled": 1000
    }
    ```
  - **400 Not Found**
    ```json
    {
      "message": "Malformed request"
    }
    ```


## Admin Routes

### Get all users data
- **Endpoint:** `/get-all-data`
- **Method:** `GET`
- **Description:** Récupère toutes les données et les agrège en fonction de l'utilisateur. Retourne une liste d'utilisateur avec leur numéro de dossard, leur nom, la distance totale qu'ils ont parcourue, le temps total qu'ils ont passé sur le parcours et le nombre de mesures effectuées.
- **Headers:**
  - `Authorization: user_id`
- **Query Parameters:**
  - `none`
- **Responses:**
  - **200 OK**
    ```json
    [
      {
        "dosNumber": 1234,
        "name": "John Doe",
        "total_distance_traveled": 150,
        "total_temps_spent": 3600,
        "number_of_measures": 5
      }
    ]
    ```
    **401 Unauthorized**
    ```json
    {
      "message": "Missing or invalid authorization header"
    }
    ```
  - **500 Internal Server Error**
    ```json
    {
      "message": "Error retrieving data"
    }
    ```

### Get data for a specific user
- **Endpoint:** `/get-data/:dosNum`
- **Method:** `GET`
- **Description:** Récupères les informations d'un utilisateur en fonction du numéro de dossard passé. Les données récupérées sont le numéro de dossard, le nom, la distance totale qu'il a parcourue, le temps total qu'il a passé sur le parcours et le nombre de mesures effectuées.
- **Headers:**
  - `Authorization: user_id`
- **Query Parameters:**
  - `dosNum` - Numéro de dossard
- **Responses:**
  - **200 OK**
    ```json
    {
      "dosNumber": 1234,
      "name": "John Doe",
      "total_distance_traveled": 150,
      "total_temps_spent": 3600,
      "number_of_measures": 5
    }
    ```
  - **404 Not Found**
    ```json
    {
      "message": "User not found"
    }
    ```
  - **500 Internal Server Error**
    ```json
    {
      "message": "Error retrieving data"
    }
    ```

### Get distance for a specific user
- **Endpoint:** `/get-dist/:dosNum`
- **Method:** `GET`
- **Description:** Permet de récupérer la distance parcourue par un utilisateur, identifié par son numéro de dossard.
- **Headers:**
  - `Authorization: user_id`
- **Query Parameters:**
  - `dosNum` - Numéro de dossard
- **Responses:**
  - **200 OK**
    ```json
    {
      "dosNumber": 1234,
      "distTraveled": 150
    }
    ```
  - **400 Bad Request**
    ```json
    {
      "message": "Malformed request"
    }
    ```
  - **404 Not Found**
    ```json
    {
      "message": "User not found"
    }
    ```

### Get time spent by a specific user
- **Endpoint:** `/get-time/:dosNum`
- **Method:** `GET`
- **Description:** Permet de récupérer le temps passé par un utilisateur, identifié par son numéro de dossard.
- **Headers:**
  - `Authorization: user_id`
- **Query Parameters:**
  - `dosNum` - User's dossier number
- **Responses:**
  - **200 OK**
    ```json
    {
      "dosNumber": 1234,
      "timeSpent": 3600
    }
    ```
  - **404 Not Found**
    ```json
    {
      "message": "User not found"
    }
    ```
  - **400 Bad Request**
    ```json
    {
      "message": "Malformed request"
    }
    ```

### Get total distance traveled
- **Endpoint:** `/get-total-dist`
- **Method:** `GET`
- **Description:** Permet de récupérer la distance totale parcourue par les participants durant l'évènement
- **Headers:**
  - `Authorization: user_id`
- **Query Parameters:**
  - `none`
- **Responses:**
  - **200 OK**
    ```json
    {
      "distTraveled": 1000
    }
    ```
  - **400 Bad Request**
    ```json
    {
      "message": "Malformed request"
    }
    ```

### Get total time spent 
- **Endpoint:** `/get-total-time`
- **Method:** `GET`
- **Description:** Permet de récupérer le temps total passé sur le parcours par les participants.
- **Headers:**
  - `Authorization: user_id`
- **Query Parameters:**
  - `none`
- **Responses:**
  - **200 OK**
    ```json
    {
      "timeSpent": 36000
    }
    ```
  - **400 Bad Request**
    ```json
    {
      "message": "Malformed request"
    }
    ```

### Get Logs
- **Endpoint:** `/logs`
- **Method:** `GET`
- **Description:** Permet de récupérer certains logs de l'évènement. Les logs récupérés sont ceux indiquant le début d'une mesure et l'arrêt d'une mesure, ainsi que la raison de cet arrêt.
- **Headers:**
  - `Authorization: user_id`
- **Query Parameters:**
  - `none`
- **Responses:**
  - **501 OK** - Not implemented

### Create a new participant
- **Endpoint:** `/create-participant`
- **Method:** `POST`
- **Description:** Permet d'ajouter un participant à la base de donnée de l'API.
- **Headers:**
  - `Authorization: user_id`
- **Body Parameters:**
  ```json
  {
    "dosNumber": 1234,
    "username": "John Doe"
  }
  ```
- **Responses:**
  - **201 Created**
    ```json
    {
      "dosNumber": 1234,
      "username": "John Doe"
    }
    ```
  - **409 Conflict**
    ```json
    {
      "message": "User already exists"
    }
    ```
  - **500 Internal Server Error**
    ```json
    {
      "message": "Error creating user"
    }
    ```

### Add measure for a participant
- **Endpoint:** `/add-participant-data`
- **Method:** `POST`
- **Description**: Ajoute une nouvelle mesure pour un participant. La mesure sera immédiatement considérée terminée.
- **Headers:**
  - `Authorization: user_id`
- **Body Parameters:**
```json
{
  "dosNumber": 1234,
  "distTraveled": 100,
  "timeSpent": 3600,
  "number": 1
}
```
- **Responses:**
  - **201 Created**
    ```json
    {
      "dosNumber": 1234,
      "username": "John Doe"
    }
    ```
  - **404 Not found**
    ```json
    {
      "message": "User not found"
    }
    ```
  - **500 Internal Server Error**
    ```json
    {
      "message": "Error creating/updating measure"
    }
    ```

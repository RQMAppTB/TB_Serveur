# API Documentation

## Admin Routes
La route de base pour tous les endpoints de l'application mobile est `/server/data`.
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
        "dosNumber": "1234",
        "name": "John Doe",
        "total_distance_traveled": 150,
        "total_temps_spent": 3600,
        "number_of_measures": 5
      },
      {
        "dosNumber": "23456",
        "name": "Doe John",
        "total_distance_traveled": 510,
        "total_temps_spent": 6300,
        "number_of_measures": 15
      },
      .
      .
      .
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
<div style="page-break-after: always;"></div>

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
      "dosNumber": "1234",
      "name": "John Doe",
      "total_distance_traveled": 150,
      "total_temps_spent": 3600,
      "number_of_measures": 5
    }
    ```
  - **400 Bad Request**
    ```json
    {
      "message": "Malformed request"
    }
    ```
    **401 Unauthorized**
    ```json
    {
      "message": "Missing or invalid authorization header"
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
<div style="page-break-after: always;"></div>

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
    **401 Unauthorized**
    ```json
    {
      "message": "Missing or invalid authorization header"
    }
    ```
  - **404 Not Found**
    ```json
    {
      "message": "No measure found"
    }
    ```
  - **500 Internal Server Error**
    ```json
    {
      "message": "Something went wrong on our side"
    }
    ```
<div style="page-break-after: always;"></div>

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
  - **400 Bad Request**
    ```json
    {
      "message": "Malformed request"
    }
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
      "message": "Something went wrong on our side"
    }
    ```
<div style="page-break-after: always;"></div>

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
    **401 Unauthorized**
    ```json
    {
      "message": "Missing or invalid authorization header"
    }
    ```
  - **500 Internal Server Error**
    ```json
    {
      "message": "Something went wrong on our side"
    }
    ```
<div style="page-break-after: always;"></div>

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
    **401 Unauthorized**
    ```json
    {
      "message": "Missing or invalid authorization header"
    }
    ```
  - **500 Internal Server Error**
    ```json
    {
      "message": "Something went wrong on our side"
    }
    ```

<div style="page-break-after: always;"></div>

### Get Logs
- **Endpoint:** `/logs`
- **Method:** `GET`
- **Description:** Permet de récupérer certains logs de l'évènement. Les logs récupérés sont ceux indiquant le début d'une mesure et l'arrêt d'une mesure, ainsi que la raison de cet arrêt.
- **Headers:**
  - `Authorization: user_id`
- **Query Parameters:**
  - `none`
- **Responses:**
  - **501 Not Implemented** - Ne sera probablement pas implémenté pour la fin du TB
<div style="page-break-after: always;"></div>

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
  - **400 Bad Request**
    ```json
    {
      "message": "Malformed request"
    }
    ```
    **401 Unauthorized**
    ```json
    {
      "message": "Missing or invalid authorization header"
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
      "message": "Something went wrong on our side"
    }
    ```

<div style="page-break-after: always;"></div>

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
      "message": "Measure created"
    }
    ```
    **401 Unauthorized**
    ```json
    {
      "message": "Missing or invalid authorization header"
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
      "message": "Something went wrong on our side"
    }
    ```

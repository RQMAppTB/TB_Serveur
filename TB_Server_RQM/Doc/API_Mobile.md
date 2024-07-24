# API Documentation

## Mobile Route
La route de base pour tous les endpoints de l'application mobile est `/app/measures`.
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
  - **400 Bad Request**
    ```json
    {
      "message": "Malformed Request"
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
  - **500 Internal Server Error**
    ```json
    {
      "message": "Something went wrong on our side"
    }
    ```
<div style="page-break-after: always;"></div>

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
  - **500 Internal Server Error**
    ```json
    {
      "message": "Something went wrong on our side"
    }
    ```
<div style="page-break-after: always;"></div>

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
  Renvoyé si l'utilisateur existe déjà
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
  - **400 Bad Request**
    ```json
    {
      "message": "Malformed request"
    }
    ```
  - **500 Internal Server Error**
    ```json
    {
      "message": "Something went wrong on our side"
    }
    ```
<div style="page-break-after: always;"></div>

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
      "message": "User don't exist"
    }
    ```
  - **500 Internal Server Error**
    ```json
    {
      "message": "Something went wrong on our side"
    }
    ```
<div style="page-break-after: always;"></div>

### Stopping a measure
- **Endpoint:** `/stop`
- **Method:** `POST`
- **Description:** Permet d'arrêter une mesure. On envoie avec les dernières données qui doivent être entrées dans la mesure.
- **Body Parameters:**
  ```json
  {
    "uuid": "04610a98-5cef-4201-b7aa-e5d9ac293055",
    "dist": 100,
    "time": 3600
  }
  ```
- **Responses:**
  - **201 Created**
    ```json
    {
      "message": "Measure stopped"
    }
    ```
  - **202 Accepted**
    ```json
    {
      "message": "Measure stopped but could not send notification"
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
      "message": "No running measure"
    }
    ```
  - **500 Internal Server Error**
    ```json
    {
      "message": "Something went wrong on our side"
    }
    ```
<div style="page-break-after: always;"></div>

### Update a measure
- **Endpoint:** `/update-dist`
- **Method:** `POST`
- **Description:** Permet de mettre à jour une mesure en cours avec un nouveau temps et une nouvelle distance.
- **Body Parameters:**  
Si plusieurs personnes ont participés à la mesure, la multiplication doit être faite au préalable.
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
  - **400 Bad Request**
    ```json
    {
      "message": "Malformed request"
    }
    ```
  - **404 Not Found**
    ```json
    {
      "message": "Measure not found"
    }
    ```
  - **500 Internal Server Error**
    ```json
    {
      "message": "Something went wrong on our side"
    }
    ```
<div style="page-break-after: always;"></div>
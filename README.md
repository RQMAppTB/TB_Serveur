# Serveur API pour le projet de TB Application mobile "Objectif 2'000'000 m"
Ce serveur est prévu pour permettre le regroupement et le traitement des données de mesures faites durant l'évènement de La Roue Qui Marche.

Son fonctionnement requiert l'utilisation de [Docker](https://docs.docker.com/engine/install/) et de [Docker Compose](https://docs.docker.com/compose/).

Une fois ces deux composants installé, se mettre à la racine du projet, dans le dossier TB_Server_RQM.

Pour lancer le projet, utiliser la commande  
`docker-compose up`  
et attendre que le serveur et la base de donnée se lance. Il peut arriver qu'au premier lancement, le serveur ne se lance pas correctement. Dans ce cas, arreter les containers sans rien détruire et refaire la commande  
`docker-compose up`.

Pour toute la documentation sur les endpoint peut être trouvée dans le fichier [Full API Documentation.md](TB_Server_RQM/Doc/FullAPIDocumentation.md)
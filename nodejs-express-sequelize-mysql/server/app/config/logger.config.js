const winston = require('winston');
const path = require('path');

// Configuration de winston pour écrire les logs dans un fichier
const logDir = path.join(__dirname, 'logs');

const logger = winston.createLogger({
  level: 'start',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  transports: [
    new winston.transports.File({ filename: path.join(logDir, 'app.log') }),
  ],
});

// Utilisez le logger pour enregistrer les actions
logger.info('Application has started');

// Exemple d'utilisation
function someAction() {
  logger.info('Some action was performed');
}

// Exporter le logger pour l'utiliser dans d'autres modules si nécessaire
module.exports = logger;

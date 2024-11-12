const winston = require('winston');
const { createLogger, transports, format } = winston;

const logger = createLogger({
  level: 'info', // Set the log level as needed
  format: format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level}]: ${message}`;
    })
  ),
  transports: [
    new transports.File({ filename: 'logs/api.log' }), // Log to a file (app.log)
  ],
});

module.exports = logger;

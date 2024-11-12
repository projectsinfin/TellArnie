const swaggerJSDoc = require('swagger-jsdoc');
const swaggerDocument = require('../swaggerDocumentation.json')

const options = {
  definition: swaggerDocument,
  apis: ['./src/app.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;

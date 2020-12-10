'use strict';

import config from './config';
import app from './index';
import { logger, started } from './libs/logger';
import swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from './swagger.json';

const env = config.get('environment');
const port = config.get('port');

app.listen(port, '0.0.0.0', (err?: any) => {
  if (err) {
    return logger.error(`There was a problem starting the server, ${err.message}`);
  }
  app.use('/stryds-swagger-api-test', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  if (env !== 'production') {
    return started(port, 'server');
  }
  return logger.info(`Production server running on port: ${port}`);
});

module.exports = app;

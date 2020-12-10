
/* eslint-env es6 */

'use strict';

import bodyParser from 'body-parser';
import flash from 'connect-flash';
import cookieParser from 'cookie-parser';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { logger } from './libs/logger';
import configureRoutes from './router';

process.on('unhandledRejection', (err: any) => {
  logger.error(`Unhandled rejection: ${err}`);
  // @ts-ignore
  if (err && err.stack) {
    // @ts-ignore
    logger.error(`stack: ${err.stack}`);
  }
});

const app = express();

app.use(cookieParser());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use(flash());

const docpath = path.join(__dirname, '../', 'public/doc/api');

fs.access(docpath, fs.constants.R_OK, (err: any) => {
  if (err) {
    logger.warn('API documentation does not exist');
    return;
  }

  app.use('/doc', express.static(docpath));
});

app.get('/', (req, res) => {
  res.status(401).send('Access denied');
});
// Serve API routes
configureRoutes(app);

// Error handling middleware. This needs to be last in or it will
// not get called.

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const code = err.code ? err.code : 500;
  const message = err.message ? err.message : 'Internal Server Error';
  res.status(code).json({ error: message, success: false });
});

export default app;

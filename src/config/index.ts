'use strict';

import dotenv from 'dotenv';
import nconf from 'nconf';
import path from 'path';

const configFileName = 'config.json';
const env = process.env.NODE_ENV || 'development';

if (env === 'development') {
  dotenv.config();
}

/**
 * These settings contain sensitive information and should not be
 * stored in the repo. They are extracted from environment variables
 * and added to the config.
 */

// overrides are always as defined
nconf.overrides({
  environment: env,
  host: process.env.HOST || '127.0.0.1',
  port: process.env.PORT || 8001,
});

// load other properties from file.
nconf
  .argv()
  .env()
  .file({ file: path.join(__dirname, configFileName) });

// if nothing else is set, use defaults. This will be set if
// they do not exist in overrides or the config file.
nconf.defaults({
  appUrl: process.env.APP_URL || 'http://localhost:3000',
});

export default nconf;

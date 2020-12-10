/* eslint-env es6 */

'use strict';

import cors from 'cors';
import config from '../config';
import Auth from './routes/auth';

let whitelist: string[] = [];
if (config.get('environment') === 'development') {
	whitelist = [ 'http://localhost:8100', 'http://localhost:8101' ];
} else {
	whitelist = [ config.get('appUrl') ];
}

const options = {
	allowedHeaders: [ 'Accept', 'Content-Type', 'Authorization' ],
	credentials: true,
	origin: (origin, callback) => {
		// Allow all CORS origin for testing.
		if (config.get('environment') === 'test') {
			callback(null, true);
			return;
		}

		if (whitelist.indexOf(origin) !== -1) {
			callback(null, true);
		} else {
			callback(null, true);
			// callback(new Error('Not allowed by CORS'));
		}
	}
};

const configureRoutes = (app: any) => {
	// app.use(cors(options));
	app.use(cors({ origin: true }));
	// client

	app.use('/api/v1/auth', Auth);
};

export default configureRoutes;

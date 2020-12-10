'use strict';

import { Response } from 'express';
import { logger } from '../libs/logger';
import { Users } from '../models';
import { errorWithCode, saltRounds } from '../libs/utils';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const getAllUsers = ({ user }: { user: any }, res: Response) => {
	Users.get()
		.then((snapshot) => {
			const User = snapshot.docs.map((doc) => {
				const UserData = doc.data();
				delete UserData.password;
				return UserData;
			});

			Promise.all(User).then(function(allDatas) {
				return res.status(200).json(allDatas);
			});
		})
		.catch((err) => {
			const message = 'Error getting Sponsors User data informations.';
			logger.error(`${message}, err = ${err.message}`);
			res.status(404).json(err.message);
		});
};

export const login = ({ body }: { body: any }, res: Response) => {
	Users.where('emailAddress', '==', body.email)
		.get()
		.then((snapshot) => {
			if (snapshot.docs.length === 0) {
				res.status(401).json('Email is incorrect.');
			}
			const userDatas = snapshot.docs[0].data();
			if (bcrypt.compareSync(body.password, userDatas.password)) {
				const accessToken = jwt.sign(userDatas, process.env.JWT_SECRET);
				res.status(200).json({ ...userDatas, accessToken: accessToken });
			} else {
				res.status(401).json('Password is incorrect');
			}
		})
		.catch((err) => {
			const message = 'Error getting User data informations.';
			logger.error(`${message}, err = ${err.message}`);
			res.status(404).json(err.message);
		});
};

export const signin = async ({ body }: { body: any }, res: Response) => {
	const duplicateEmail = await Users.where('emailAddress', '==', body.emailAddress)
		.get()
		.then((snapshot) => {
			if (snapshot.docs.length === 0) {
				return false;
			} else return true;
		})
		.catch(() => {
			return false;
		});
	const duplicatePhone = await Users.where('phoneNumber', '==', body.phoneNumber)
		.get()
		.then((snapshot) => {
			if (snapshot.docs.length === 0) {
				return false;
			} else return true;
		})
		.catch(() => {
			return false;
		});
	if (duplicateEmail || duplicatePhone) {
		const message = 'Duplicated Username or PhoneNumber';
		throw errorWithCode(message, 500);
	}
	const hash = bcrypt.hashSync(body.password, saltRounds);
	const userData = { ...body, password: hash };
	Users.doc(body.userName)
		.set(userData)
		.then(() => {
			delete userData.password;
			const accessToken = jwt.sign(userData, process.env.JWT_SECRET);
			res.status(200).json({ ...userData, accessToken: accessToken });
		})
		.catch((err) => {
			const message = 'Error inserting User data informations.';
			logger.error(`${message}, err = ${err.message}`);
			res.status(404).json(err.message);
		});
};
export const updateUser = ({ body, user }: { params: any; body: any; user: any }, res: Response) => {
	const hash = bcrypt.hashSync(body.password, saltRounds);
	const userData = { ...body, password: hash };
	Users.where('emailAddress', '==', user.emailAddress).limit(1).get().then((query) => {
		const sponsor = query.docs[0];
		sponsor.ref
			.update(userData)
			.then(() => {
				delete userData.password;
				res.status(200).json(userData);
			})
			.catch((err) => {
				const message = 'Error updating Sponsor User data informations.';
				logger.error(`${message}, err = ${err.message}`);
				res.status(404).json(err.message);
			});
	});
};


/* eslint-env es6 */
import jwt from 'jsonwebtoken';

/**
 * Check if a string consists of [Aa-Az], [0-9], -, _, and %.
 *
 * @param {String} message The error message
 * @param {Number} code    The error code (property)
 * @returns An `Error` object with the message and code set
 */
export const errorWithCode = (message, code) => {
  const error = new Error(message);
  // @ts-ignore
  error.code = code;

  return error;
};

export const asyncMiddleware = (fn: any) =>
  // Make sure to `.catch()` any errors and pass them along to the `next()`
  // middleware in the chain, in this case the error handler.
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }

      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};
export const saltRounds = 10;
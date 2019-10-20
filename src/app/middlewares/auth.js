import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const authHaeder = req.headers.authorization;

  if (!authHaeder) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  const [, token] = authHaeder.split(' ');

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    req.userId = decoded.id;

    return next();
  } catch (eror) {
    return res.status(401).json({ erro: 'Token invalid' });
  }
};

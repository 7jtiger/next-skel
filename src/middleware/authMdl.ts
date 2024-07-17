import { NextApiResponse } from 'next';
import { verifyToken } from '../utils/jwt';
import { getToken } from '../utils/redis';
import logger from '../utils/logger';
import GuruApiReq from '../types/GuruApiReq';

export function authMiddleware(handler: (req: GuruApiReq, res: NextApiResponse) => Promise<void>) {
  return async (req: GuruApiReq, res: NextApiResponse) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      logger.warn('No token provided');
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      logger.warn('Invalid token');
      return res.status(401).json({ error: 'Invalid token' });
    }

    const storedToken = await getToken(decoded.userId);
    if (token !== storedToken) {
      logger.warn(`Token revoked for user: ${decoded.userId}`);
      return res.status(401).json({ error: 'Token revoked' });
    }

    req.userId = decoded.userId;
    logger.info(`Authenticated request for user: ${decoded.userId}`);
    return handler(req, res);
  };
}
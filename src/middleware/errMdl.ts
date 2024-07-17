import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import logger from '../utils/logger';

export function errorMiddleware(handler: NextApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      return await handler(req, res);
    } catch (error) {
      logger.error('Unhandled error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}
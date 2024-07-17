import { NextApiRequest, NextApiResponse } from 'next';
import { login, register } from '../../services/authSvc';
import { errorMiddleware } from '../../middleware/errMdl';
import logger from '../../utils/logger';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { action, email, password, name } = req.body;

    switch (action) {
      case 'login':
        try {
          const result = await login(email, password);
          if (result) {
            res.status(200).json({ user: result.user, token: result.token });
          } else {
            res.status(401).json({ error: 'Invalid credentials' });
          }
        } catch (error) {
          logger.error('Login error:', error);
          res.status(500).json({ error: 'Internal server error' });
        }
        break;

      case 'register':
        try {
          const user = await register(email, password, name);
          res.status(201).json(user);
        } catch (error) {
          logger.error('Registration error:', error);
          res.status(400).json({ error: 'Registration failed', message: (error as Error).message });
        }
        break;

      default:
        logger.warn(`Invalid action: ${action}`);
        res.status(400).json({ error: 'Invalid action' });
    }
  } else {
    logger.warn(`Method not allowed: ${req.method}`);
    res.status(405).json({ error: 'Method not allowed' });
  }
}

export default errorMiddleware(handler);
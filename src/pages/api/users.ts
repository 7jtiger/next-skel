import { NextApiRequest, NextApiResponse } from 'next';
import { loginHandler, registerHandler } from '../../controllers/authCtrl';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    if (req.body.action === 'login') {
      await loginHandler(req, res);
    } else if (req.body.action === 'register') {
      await registerHandler(req, res);
    } else {
      res.status(400).json({ error: 'Invalid action' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
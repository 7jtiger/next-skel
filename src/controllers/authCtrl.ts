import { NextApiRequest, NextApiResponse } from 'next';
import { login, register } from '../services/authSvc';

export async function loginHandler(req: NextApiRequest, res: NextApiResponse) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const result = await login(email, password);
    if (result) {
      res.status(200).json({ user: result.user, token: result.token });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function registerHandler(req: NextApiRequest, res: NextApiResponse) {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Email, password, and name are required' });
  }

  try {
    const user = await register(email, password, name);
    res.status(201).json(user);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ error: 'Registration failed', message: (error as Error).message });
  }
}
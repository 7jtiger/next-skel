import jwt from 'jsonwebtoken';

import { config } from '../config/config';

export function generateToken(userId: number): string {
  return jwt.sign({ userId }, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
}

export function verifyToken(token: string): { userId: number } | null {
  try {
    return jwt.verify(token, config.jwt.secret) as { userId: number };
  } catch (error) {
    return null;
  }
}
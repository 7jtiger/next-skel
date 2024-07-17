import { query } from '../utils/database';
import logger from '../utils/logger';

export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
}

export async function findUserByEmail(email: string): Promise<User | null> {
  try {
    const results = await query<User[]>('SELECT * FROM users WHERE email = ?', [email]);
    return results[0] || null;
  } catch (error) {
    logger.error('Error in findUserByEmail:', error);
    throw error;
  }
}

export async function createUser(user: Omit<User, 'id'>): Promise<User> {
  try {
    const result: any = await query('INSERT INTO users (email, password, name) VALUES (?, ?, ?)', [user.email, user.password, user.name]);
    logger.info(`New user created with id: ${result.insertId}`);
    return { id: result.insertId, ...user };
  } catch (error) {
    logger.error('Error in createUser:', error);
    throw error;
  }
}
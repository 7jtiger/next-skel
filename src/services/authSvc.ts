import bcrypt from 'bcrypt';
import { findUserByEmail, createUser, User } from '../models/userMod';
import { generateToken } from '../utils/jwt';
import { setToken } from '../utils/redis';
import logger from '../utils/logger';

export async function login(email: string, password: string): Promise<{ user: Omit<User, 'password'>; token: string } | null> {
  try {
    const user = await findUserByEmail(email);
    if (!user || !await bcrypt.compare(password, user.password)) {
      logger.warn(`Failed login attempt for email: ${email}`);
      return null;
    }

    const token = generateToken(user.id);
    await setToken(user.id, token, 3600); // 1 hour expiration
    logger.info(`User logged in: ${user.id}`);

    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  } catch (error) {
    logger.error('Error in login:', error);
    throw error;
  }
}

export async function register(email: string, password: string, name: string): Promise<Omit<User, 'password'>> {
  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await createUser({ email, password: hashedPassword, name });
    logger.info(`New user registered: ${newUser.id}`);

    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  } catch (error) {
    logger.error('Error in register:', error);
    throw error;
  }
}
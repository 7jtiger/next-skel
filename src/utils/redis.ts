import Redis from 'ioredis';
import { config } from '../config/config';

const redis = new Redis({
  host: config.redis.host,
  port: config.redis.port,
});

export async function setToken(userId: number, token: string, expiresIn: number): Promise<void> {
  await redis.set(`user:${userId}:token`, token, 'EX', expiresIn);
}

export async function getToken(userId: number): Promise<string | null> {
  return redis.get(`user:${userId}:token`);
}

export async function deleteToken(userId: number): Promise<void> {
  await redis.del(`user:${userId}:token`);
}
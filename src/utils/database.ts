import mysql from 'mysql2/promise';
import { typedConfig } from '../config/config';
import logger from './logger';

const pool = mysql.createPool({
  host: typedConfig.database.host,
  user: typedConfig.database.user,
  password: typedConfig.database.password,
  database: typedConfig.database.database,
});

export async function query<T>(sql: string, params: any[] = []): Promise<T> {
  try {
    const [results] = await pool.execute(sql, params);
    return results as T;
  } catch (error) {
    logger.error('Database query error:', error);
    throw error;
  }
}
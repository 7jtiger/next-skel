import fs from 'fs';
import toml from 'toml';

const configFile = fs.readFileSync('./config.toml', 'utf-8');
export const config = toml.parse(configFile);

// 타입 정의 추가
export interface Config {
  database: {
    host: string;
    user: string;
    password: string;
    database: string;
  };
  redis: {
    host: string;
    port: number;
  };
  jwt: {
    secret: string;
    expiresIn: string;
  };
}

// 타입 단언 추가
export const typedConfig = config as Config;
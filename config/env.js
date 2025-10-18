// config/env.js
import { config } from "dotenv";

config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

export const PORT = process.env.PORT || 5000;
export const NODE_ENV = process.env.NODE_ENV || "development";
export const DB_URI = process.env.DB_URI 
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';
export const JWT_SECRET=process.env.JWT_SECRET
export const ARCJET_API_KEY=process.env.ARCJET_API_KEY
export const ARCJET_ENV=process.env.ARCJET_ENV || 'development'
export const QSTASH_URL=process.env.QSTASH_URL
export const QSTASH_TOKEN=process.env.QSTASH_TOKEN
export const SERVER_URL=process.env.SERVER_URL 
export const EMAIL_PASSWORD=process.env.EMAIL_PASSWORD


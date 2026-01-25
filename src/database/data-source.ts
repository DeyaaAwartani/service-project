// import 'reflect-metadata';
// import { DataSource } from 'typeorm';
// import * as path from 'path';
// import * as dotenv from 'dotenv';

// dotenv.config();

// const root = process.cwd(); // ✅ يشتغل مع ESM

// export default new DataSource({
//   type: 'mysql',
//   host: process.env.DB_HOST || 'localhost',
//   port: Number(process.env.DB_PORT) || 3306,
//   username: process.env.DB_USERNAME || 'root',
//   password: process.env.DB_PASSWORD || '',
//   database: process.env.DB_NAME || 'notifications_db',

//   entities: [path.join(root, 'src', '**', '*.entity.{ts,js}')],
//   migrations: [path.join(root, 'src', 'migrations', '*.{ts,js}')],

//   synchronize: false,
// });
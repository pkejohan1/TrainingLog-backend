import env from "dotenv";
import { DataSource } from "typeorm";
import path from "path";

env.config();

const __dirname = path.dirname(new URL(import.meta.url).pathname);

console.log(process.env.PGHOST);
console.log(process.env.PGPORT);
console.log(process.env.PGUSER);
console.log(process.env.DB_PASSWORD);
console.log(process.env.PG_DATABASE);

const dataSource = new DataSource({
  type: "postgres",
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  username: process.env.PGUSER,
  password: process.env.DB_PASSWORD,
  database: process.env.PG_DATABASE,
  synchronize: false,
  logging: true,
  entities: ["src/entities/**/*.js"],
});

export { dataSource };

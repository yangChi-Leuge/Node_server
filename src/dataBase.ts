import { createConnection, Connection } from "mysql2/promise";
import { env } from "./env";

let connection: Connection;

export const connectDatabase = async (): Promise<void> => {
  try {
    connection = await createConnection({
      host: env.DB_HOST,
      user: env.DB_USER,
      password: env.DB_PASSWORD,
      database: env.DB_DATABASE,
    });
    console.log("Connected to MySQL database");
  } catch (error) {
    console.error("Error connecting to MySQL database:", error);
    process.exit(1); // Exit with error
  }
};

export const getConnection = (): Connection => connection;

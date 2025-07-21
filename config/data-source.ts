import { DataSource } from "typeorm";
import { User } from "../models/user";
import { Product } from "../models/product";

export const AppDataSource = new DataSource({
	type: "postgres",
	url: process.env.DATABASE_URL,
	entities: [User, Product],
	migrations: ["dist/migrations/*.js"],
	synchronize: process.env.NODE_ENV !== "production",
	logging: false,
});

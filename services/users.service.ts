import type { Context, ServiceSchema } from "moleculer";
import { AppDataSource } from "../config/data-source";
import { User } from "../models/user";
import { hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";
import type { Repository } from "typeorm";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

const UsersService: ServiceSchema = {
	name: "users",
	settings: {
		fields: ["id", "email", "createdAt", "updatedAt"],
	},
	actions: {
		async register(ctx: Context<{ email: string; password: string }>) {
			const { email, password } = ctx.params;
			const repo: Repository<User> = AppDataSource.getRepository(User);
			if (await repo.findOne({ where: { email } })) {
				throw new Error("Email ya registrado");
			}
			const passwordHash = await hash(password, 10);
			const user = repo.create({ email, passwordHash });
			await repo.save(user);
			// @ts-ignore
			delete user.passwordHash;
			return user;
		},
		async login(ctx: Context<{ email: string; password: string }>) {
			const { email, password } = ctx.params;
			const repo: Repository<User> = AppDataSource.getRepository(User);
			const user = await repo.findOne({ where: { email } });
			if (!user) throw new Error("Usuario no encontrado");
			const valid = await compare(password, user.passwordHash);
			if (!valid) throw new Error("Credenciales inválidas");
			// Generar token JWT
			const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "24h" });
			return { token };
		},

		async forgotPassword(ctx: Context<{ email: string }>) {
			const { email } = ctx.params;
			const repo: Repository<User> = AppDataSource.getRepository(User);
			const user = await repo.findOne({ where: { email } });
			if (!user) throw new Error("Usuario no encontrado");
			const resetToken = jwt.sign({ userId: user.id }, JWT_SECRET, {
				expiresIn: "1h",
				subject: "password-reset",
			});
			const resetLink = `${FRONTEND_URL}/reset-password?token=${resetToken}`;
			return { success: true, resetLink: resetLink };
		},

		async resetPassword(ctx: Context<{ token: string; newPassword: string }>) {
			const { token, newPassword } = ctx.params;
			let payload: any;
			try {
				payload = jwt.verify(token, JWT_SECRET, { subject: "password-reset" });
			} catch (err) {
				throw new Error("Token inválido o expirado");
			}
			const userId = payload.userId;
			const repo: Repository<User> = AppDataSource.getRepository(User);
			const user = await repo.findOne({ where: { id: userId } });
			if (!user) throw new Error("Usuario no encontrado");
			user.passwordHash = await hash(newPassword, 10);
			await repo.save(user);
			return { success: true };
		},
	},
};

export default UsersService;

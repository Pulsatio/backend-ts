import { ServiceSchema, Context } from "moleculer";
import ApiGateway from "moleculer-web";
import jwt from "jsonwebtoken";
import { IncomingRequest, Route } from "moleculer-web";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

interface Meta {
	userId?: number;
}

const ApiService: ServiceSchema = {
	name: "api",
	mixins: [ApiGateway],
	settings: {
		port: process.env.PORT ? Number(process.env.PORT) : 3000,
		ip: "0.0.0.0",
		use: [],
		routes: [
			{
				path: "/api",
				whitelist: [
					"users.register",
					"users.login",
					"users.forgotPassword",
					"users.resetPassword",
					"users.*",
					"products.*",
				],
				autoAliases: true,
				aliases: {
					"POST /users/register": "users.register",
					"POST /users/login": "users.login",
					"POST /users/forgot": "users.forgotPassword",
					"POST /users/reset": "users.resetPassword",
					"GET    /products": "products.list",
					"GET    /products/:id": "products.get",
					"POST   /products": "products.create",
					"PUT    /products/:id": "products.update",
					"DELETE /products/:id": "products.remove",
				},
				authentication: true,
				authorization: false,
				bodyParsers: {
					json: { strict: false, limit: "1MB" },
					urlencoded: { extended: true, limit: "1MB" },
				},
				mappingPolicy: "all",
				swagger: {
					enabled: true,
					path: "/docs",
					ui: { customCss: ".swagger-ui .topbar { display: none }" },
				},
			},
		],
		assets: { folder: "public", options: {} },
		log4XXResponses: false,
		logging: true,
	},
	methods: {
		authenticate(ctx: Context<null, Meta>, route: Route, req: IncomingRequest): object | null {
			const path = req.url?.split("?")[0] || "";
			if (path.startsWith("/api/docs") || path === "/api/swagger.json") return null;
			const authHeader = req.headers["authorization"] as string;
			if (authHeader?.startsWith("Bearer ")) {
				const token = authHeader.slice(7);
				try {
					const payload = jwt.verify(token, JWT_SECRET) as { userId: number };
					ctx.meta.userId = payload.userId;
					return { userId: payload.userId };
				} catch {
					throw new ApiGateway.Errors.UnAuthorizedError(
						ApiGateway.Errors.ERR_INVALID_TOKEN,
						null,
					);
				}
			}
			const actionName = req.$action?.name || "";
			const publicActions = [
				"users.register",
				"users.login",
				"users.forgotPassword",
				"users.resetPassword",
			];
			if (publicActions.includes(actionName)) return null;
			throw new ApiGateway.Errors.UnAuthorizedError(ApiGateway.Errors.ERR_NO_TOKEN, null);
		},
	},
};

export default ApiService;

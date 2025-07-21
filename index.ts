import "dotenv/config";
import "reflect-metadata";
import { ServiceBroker } from "moleculer";
import brokerConfig from "./moleculer.config";
import { AppDataSource } from "./config/data-source";
import ApiService from "./services/api.service";
import UsersService from "./services/users.service";
import ProductsService from "./services/products.service";

async function main() {
	try {
		await AppDataSource.initialize();
		const broker = new ServiceBroker(brokerConfig);
		broker.createService(ApiService);
		broker.createService(UsersService);
		broker.createService(ProductsService);
		await broker.start();
		console.log("Ok");
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
}

main();

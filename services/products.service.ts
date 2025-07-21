import { ServiceSchema } from "moleculer";
import createDbServiceMixin from "../mixins/db.mixin";

const ProductsService: ServiceSchema = {
	name: "products",
	mixins: [createDbServiceMixin("products")],
	methods: {},
	settings: {
		entityValidator: {
			name: { type: "string", min: 1 },
			price: { type: "number", positive: true },
		},
	},
};

export default ProductsService;

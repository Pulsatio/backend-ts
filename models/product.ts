import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
} from "typeorm";

@Entity("products")
export class Product {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column()
	name!: string;

	@Column("decimal", { precision: 10, scale: 2, default: 0.0 })
	price!: number;

	@CreateDateColumn({ name: "created_at" })
	createdAt!: Date;

	@UpdateDateColumn({ name: "updated_at" })
	updatedAt!: Date;
}

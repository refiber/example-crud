import { Category } from "./category";
import { User } from "./user";

export type Product = {
	id: string;
	title: string;
	description: string | null;
	category: Category | null;
	createdBy: User;
	createdAt: Date;
	updatedAt: Date;
};

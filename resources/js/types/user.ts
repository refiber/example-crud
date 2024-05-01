enum Role {
	MASTER = "MASTER",
	ADMIN = "ADMIN",
}

export type User = {
	id: string;
	name: string;
	email: string;
	role: Role;
};

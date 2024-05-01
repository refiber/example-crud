/// <reference types="vite/client" />

import { PageProps } from "@inertiajs/core";
import { User } from "types/user";

declare module "@inertiajs/core" {
	export interface PageProps extends PageProps {
		auth: User | null;
		flash: {
			type: "error" | "success" | "info" | "warning";
			message: string;
		} | null;
	}
}

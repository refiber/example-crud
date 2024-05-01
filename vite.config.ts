import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import refiber from "refiber-vite-plugin";
import path from "path";

// https://vitjs.dev/config/
export default defineConfig({
	plugins: [
		refiber({
			input: ["resources/js/app.tsx"],
			refresh: true,
		}),
		react(),
	],
	resolve: {
		alias: [
			{
				find: "components",
				replacement: path.resolve(__dirname, "./resources/js/components"),
			},
			{
				find: "lib",
				replacement: path.resolve(__dirname, "./resources/js/lib"),
			},
			{
				find: "css",
				replacement: path.resolve(__dirname, "./resources/css"),
			},
			{
				find: "types",
				replacement: path.resolve(__dirname, "./resources/js/types"),
			},
		],
	},
});

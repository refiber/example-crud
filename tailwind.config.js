/** @type {import('tailwindcss').Config} */
export default {
	content: ["./resources/**/*.{html,tsx,ts}"],
	theme: {
		extend: {},
	},
	plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};

import { createRoot } from "react-dom/client";

import "../css/app.css";
import { createInertiaApp } from "@inertiajs/react";
import { ToastProvider } from "components/ToastProvider";

createInertiaApp({
	resolve: (name) => {
		const pages = import.meta.glob("./pages/**/*.tsx", { eager: true });
		return pages[`./pages/${name}.tsx`];
	},

	setup: ({ el, App, props }) => {
		return createRoot(el).render(
			<ToastProvider>
				<App {...props} />
			</ToastProvider>
		);
	},
});

const rootBreadcrumbs = [{ name: "Products", href: "/products" }];

export function getBreadcrumbs(data: typeof rootBreadcrumbs) {
	let allData = [...rootBreadcrumbs, ...data];

	const pathname = window.location.pathname;

	return allData.map((d) => {
		if (d.href === pathname) return { ...d, current: true };
		// TODO improve
		return { ...d, current: false };
	});
}

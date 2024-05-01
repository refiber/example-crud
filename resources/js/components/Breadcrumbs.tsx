import { Link } from "@inertiajs/react";
import Container from "./Container";

import { cn } from "lib/helpers";

export type Breadcrumb = {
	name: string;
	href: string;
	current: boolean;
};

type BreadcrumbsProps = {
	pages: Breadcrumb[];
};

const Breadcrumbs = ({ pages }: BreadcrumbsProps) => {
	return (
		<Container className="mb-6">
			<nav className="flex" aria-label="Breadcrumb">
				<ol role="list" className="flex items-center space-x-4">
					{pages.map((page, i) => (
						<li key={i}>
							<div className="flex items-center">
								{i > 0 && (
									<svg
										className="h-5 w-5 flex-shrink-0 text-gray-300"
										fill="currentColor"
										viewBox="0 0 20 20"
										aria-hidden="true"
									>
										<path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
									</svg>
								)}

								<Link
									href={page.href}
									className={cn(
										"text-sm font-medium text-gray-500 hover:text-gray-700",
										i > 0 ? "ml-4 " : null
									)}
									aria-current={page.current ? "page" : undefined}
								>
									{page.name}
								</Link>
							</div>
						</li>
					))}
				</ol>
			</nav>
		</Container>
	);
};

export default Breadcrumbs;

import { Link } from "@inertiajs/react";

import Card from "components/Card";
import Button from "components/Button";
import Header from "components/Header";
import Breadcrumbs from "components/Breadcrumbs";
import Layout, { Body } from "components/Layout";

import { getBreadcrumbs } from "./data";
import { Category } from "types/category";

type CategoryIndexPageProps = {
	categories: Category[];
};

export default function CategoryIndexPage({
	categories,
}: CategoryIndexPageProps) {
	return (
		<>
			<Breadcrumbs pages={getBreadcrumbs([])} />

			<Header>Category</Header>

			<Body>
				<Card>
					<div className="sm:flex sm:items-center">
						<div className="sm:flex-auto">
							<h1 className="text-base font-semibold leading-6 text-gray-900">
								Category
							</h1>
							<p className="mt-2 text-sm text-gray-700">
								A list of all the categories.
							</p>
						</div>
						<div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
							<Link href="/categories/create">
								<Button>Create New Category</Button>
							</Link>
						</div>
					</div>
					<div className="mt-8 flow-root">
						<div className="-mx-4 -my-2 overflow-x-auto">
							<div className="inline-block min-w-full py-2 align-middle">
								<table className="min-w-full divide-y divide-gray-300">
									<thead>
										<tr>
											<th
												scope="col"
												className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 lg:pl-8"
											>
												Title
											</th>
											<th
												scope="col"
												className="relative py-3.5 pl-3 pr-4 sm:pr-6 lg:pr-8"
											>
												<span className="sr-only">Edit</span>
											</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-gray-200 bg-white">
										{categories.map((category) => (
											<tr key={category.id}>
												<td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">
													<Link href={`/categories/${category.id}/edit`}>
														{category.title}
													</Link>
												</td>
												<td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 lg:pr-8">
													<Link
														href={`/categories/${category.id}/edit`}
														className="text-indigo-600 hover:text-indigo-900"
													>
														Edit
														<span className="sr-only">, {category.title}</span>
													</Link>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</Card>
			</Body>
		</>
	);
}

CategoryIndexPage.layout = (page: React.ReactNode) => (
	<Layout children={page} />
);

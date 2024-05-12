import { useMemo, useRef } from "react";
import { router, useForm } from "@inertiajs/react";

import Form from "components/Form";
import Card from "components/Card";
import Input from "components/Input";
import Header from "components/Header";
import Button from "components/Button";
import Breadcrumbs from "components/Breadcrumbs";
import Layout, { Body } from "components/Layout";
import ConfirmationModal, {
	ConfirmationModalHandle,
} from "components/ConfirmationModal";

import { getBreadcrumbs } from "./data";
import { Category } from "types/category";

type CategoryCreateOrEditPageProps = {
	category: Category | undefined;
};

export default function CategoryCreateOrEditPage({
	category,
}: CategoryCreateOrEditPageProps) {
	const pages = useMemo(
		() => [
			{
				name: category?.title || "Create",
				href: category?.id
					? `/categories/${category.id}/edit`
					: "/categories/create",
			},
		],
		[category]
	);

	const confirmationModalRef = useRef<ConfirmationModalHandle>(null);

	const form = useForm({
		title: category?.title || "",
	});

	return (
		<>
			<Breadcrumbs pages={getBreadcrumbs(pages)} />

			<Header
				rightElement={
					category ? (
						<Button
							onClick={() => confirmationModalRef.current?.onOpen()}
							className="bg-red-600 hover:bg-red-500"
						>
							Delete
						</Button>
					) : undefined
				}
			>
				{category?.title || "Create New Category"}
			</Header>

			<Body>
				<Card>
					<Form.Main
						onSubmit={(e) => {
							e.preventDefault();

							const onError = (err: any) => {
								const errKeys = Object.keys(err);
								(e as any).target[errKeys[0]].focus();
							};

							if (category) {
								return form.put(`/categories/${category.id}/edit`, {
									onError,
									onSuccess: () => form.setDefaults(),
								});
							}
							return form.post("/categories/create", { onError });
						}}
					>
						<Form.Body>
							<Form.Section.Main
								title="Category"
								description="This information will be displayed publicly so be careful what you share."
							>
								<Form.Section.Body>
									<Form.InputGroup>
										<Form.Label htmlFor="title">Title</Form.Label>
										<Form.Field>
											<Input
												id="title"
												name="title"
												type="text"
												className="sm:max-w-xs"
												error={form.errors.title}
												value={form.data.title}
												onChange={(e) => form.setData("title", e.target.value)}
											/>
										</Form.Field>
									</Form.InputGroup>
								</Form.Section.Body>
							</Form.Section.Main>
						</Form.Body>

						<div className="mt-6 flex items-center justify-end gap-x-6">
							<Button
								type="reset"
								onClick={() => form.reset()}
								disabled={!form.isDirty}
								className="bg-transparent text-gray-900 hover:bg-transparent shadow-none"
							>
								Cancel
							</Button>

							<Button type="submit" disabled={!form.isDirty}>
								Save
							</Button>
						</div>
					</Form.Main>
				</Card>
			</Body>

			{category && (
				<ConfirmationModal
					ref={confirmationModalRef}
					title="Delete category"
					description="Are you sure want to delete this Category? Data will be permanently removed. This action cannot be undone."
					confirmTextButton="Delete"
					onConfirm={() => router.delete(`/categories/${category.id}/delete`)}
				/>
			)}
		</>
	);
}

CategoryCreateOrEditPage.layout = (page: React.ReactNode) => (
	<Layout children={page} />
);

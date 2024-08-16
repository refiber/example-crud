import { useMemo, useRef } from "react";
import { router, useForm } from "@inertiajs/react";

import Form from "components/Form";
import Card from "components/Card";
import Input from "components/Input";
import Header from "components/Header";
import Button from "components/Button";
import Textarea from "components/Textarea";
import Breadcrumbs from "components/Breadcrumbs";
import Layout, { Body } from "components/Layout";
import ConfirmationModal, {
  ConfirmationModalHandle,
} from "components/ConfirmationModal";
import Select from "components/Select";

import { getBreadcrumbs } from "./data";
import { Product } from "types/product";
import { Category } from "types/category";

type ProductsCreateOrEditPageProps = {
  product: Product | undefined;
  categories: Category[];
};

export default function ProductsCreateOrEditPage({
  product,
  categories,
}: ProductsCreateOrEditPageProps) {
  const pages = useMemo(
    () => [
      {
        name: product?.title || "Create",
        href: product?.id ? `/products/${product.id}/edit` : "/products/create",
      },
    ],
    [product],
  );

  const confirmationModalRef = useRef<ConfirmationModalHandle>(null);

  const form = useForm({
    Title: product?.title || "",
    Description: product?.description || "",
    CategoryID: product?.category?.id.toString(),
  });

  return (
    <>
      <Breadcrumbs pages={getBreadcrumbs(pages)} />

      <Header
        rightElement={
          product ? (
            <Button
              onClick={() => confirmationModalRef.current?.onOpen()}
              className="bg-red-600 hover:bg-red-500"
            >
              Delete
            </Button>
          ) : undefined
        }
      >
        {product?.title || "Create New Product"}
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

              if (product) {
                return form.put(`/products/${product.id}/edit`, {
                  onError,
                  onSuccess: () => form.setDefaults(),
                });
              }
              return form.post("/products/create", { onError });
            }}
          >
            <Form.Body>
              <Form.Section.Main
                title="Product"
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
                        error={form.errors.Title}
                        value={form.data.Title}
                        onChange={(e) => form.setData("Title", e.target.value)}
                      />
                    </Form.Field>
                  </Form.InputGroup>

                  <Form.InputGroup>
                    <Form.Label htmlFor="cateogry">Category</Form.Label>
                    <Form.Field>
                      <Select
                        id="category"
                        name="category"
                        value={form.data.CategoryID}
                        className="sm:max-w-xs"
                        onChange={(e) =>
                          form.setData("CategoryID", e.target.value)
                        }
                      >
                        <option>Choose category</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.title}
                          </option>
                        ))}
                      </Select>
                    </Form.Field>
                  </Form.InputGroup>

                  <Form.InputGroup>
                    <Form.Label htmlFor="description">Description</Form.Label>
                    <Form.Field>
                      <Textarea
                        id="description"
                        name="Description"
                        value={form.data.Description}
                        error={form.errors.Description}
                        onChange={(e) =>
                          form.setData("Description", e.target.value)
                        }
                        helper="Write a few sentences about the product."
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

      {product && (
        <ConfirmationModal
          ref={confirmationModalRef}
          title="Delete product"
          description="Are you sure want to delete this Product? Data will be permanently removed. This action cannot be undone."
          confirmTextButton="Delete"
          onConfirm={() => router.delete(`/products/${product.id}/delete`)}
        />
      )}
    </>
  );
}

ProductsCreateOrEditPage.layout = (page: React.ReactNode) => (
  <Layout children={page} />
);

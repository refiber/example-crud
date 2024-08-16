import { useForm } from "@inertiajs/react";

import Button from "components/Button";
import Input from "components/Input";

import "css/layout.css";

export default function LoginPage() {
  const form = useForm("Auth", {
    Email: "taylor@mail.com",
    Password: "password123",
  });

  return (
    <div className="h-full flex justify-center items-center">
      <div className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-lg">
          <form
            className="w-full space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              form.post("/login", {
                onError: (err) => {
                  const errKeys = Object.keys(err);
                  (e as any).target[errKeys[0]].focus();
                },
              });
            }}
          >
            <Input
              name="Email"
              type="email"
              defaultValue={form.data.Email}
              placeholder="email"
              className="w-full"
              error={form.errors.Email}
              onChange={(e) => form.setData("Email", e.target.value)}
            />

            <Input
              name="password"
              type="password"
              defaultValue={form.data.Password}
              placeholder="password"
              error={form.errors.Password}
              onChange={(e) => form.setData("Password", e.target.value)}
            />

            <Button type="submit" className="w-full" disabled={form.processing}>
              Submit
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

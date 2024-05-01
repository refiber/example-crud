import { Link, usePage } from "@inertiajs/react";
import { Fragment, ReactNode, useEffect, useMemo } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

import { useToast } from "components/ToastProvider";

import "css/layout.css";
import { cn } from "lib/helpers";

const navigationData = [
	{ name: "Dashboard", href: "/" },
	{ name: "Products", href: "/products" },
];

const userNavigation = [
	{ name: "Your Profile", href: "#" },
	{ name: "Sign out", href: "/logout", method: "post" },
];

export default function Layout({ children }: { children: ReactNode }) {
	const { auth: user, flash } = usePage().props;

	const toast = useToast();

	const pathname = window.location.pathname;

	const isCurrent = (href: string) => {
		return pathname === "/"
			? href === pathname
			: href.endsWith(pathname.split("/").filter((p) => p !== "")[0]);
	};

	const navigation = useMemo(() => {
		return navigationData.map((n) => ({ ...n, current: isCurrent(n.href) }));
	}, [pathname]);

	useEffect(() => {
		if (!flash) return;
		toast(flash);
	}, [flash]);

	return (
		<>
			<div className="min-h-full">
				<Disclosure as="nav" className="bg-white shadow-sm">
					{({ open }) => (
						<>
							<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
								<div className="flex h-16 justify-between">
									<div className="flex">
										<div className="flex flex-shrink-0 items-center">
											<img
												className="block h-8 w-auto lg:hidden"
												src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
												alt="Your Company"
											/>
											<img
												className="hidden h-8 w-auto lg:block"
												src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
												alt="Your Company"
											/>
										</div>
										<div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
											{navigation.map((item) => (
												<Link
													key={item.name}
													href={item.href}
													className={cn(
														item.current
															? "border-indigo-500 text-gray-900"
															: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
														"inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium"
													)}
													aria-current={item.current ? "page" : undefined}
												>
													{item.name}
												</Link>
											))}
										</div>
									</div>
									<div className="hidden sm:ml-6 sm:flex sm:items-center">
										{/* Profile dropdown */}
										{user && (
											<Menu as="div" className="relative ml-3">
												<div>
													<Menu.Button className="relative flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
														<span className="absolute -inset-1.5" />
														<span className="sr-only">Open user menu</span>
														<img
															className="h-8 w-8 rounded-full"
															src="https://miro.medium.com/v2/resize:fill:176:176/1*e3DUu5swaVubfa_fGUHn_g.jpeg"
															alt=""
														/>
													</Menu.Button>
												</div>
												<Transition
													as={Fragment}
													enter="transition ease-out duration-200"
													enterFrom="transform opacity-0 scale-95"
													enterTo="transform opacity-100 scale-100"
													leave="transition ease-in duration-75"
													leaveFrom="transform opacity-100 scale-100"
													leaveTo="transform opacity-0 scale-95"
												>
													<Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
														{userNavigation.map((item) => (
															<Menu.Item key={item.name}>
																{({ active }) => (
																	<Link
																		href={item.href}
																		method={(item.method as any) || "get"}
																		className={cn(
																			active ? "bg-gray-100" : "",
																			"block px-4 py-2 text-sm text-gray-700"
																		)}
																	>
																		{item.name}
																	</Link>
																)}
															</Menu.Item>
														))}
													</Menu.Items>
												</Transition>
											</Menu>
										)}
									</div>
									<div className="-mr-2 flex items-center sm:hidden">
										{/* Mobile menu button */}
										<Disclosure.Button className="relative inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
											<span className="absolute -inset-0.5" />
											<span className="sr-only">Open main menu</span>
											{open ? (
												<XMarkIcon
													className="block h-6 w-6"
													aria-hidden="true"
												/>
											) : (
												<Bars3Icon
													className="block h-6 w-6"
													aria-hidden="true"
												/>
											)}
										</Disclosure.Button>
									</div>
								</div>
							</div>

							<Disclosure.Panel className="sm:hidden">
								<div className="space-y-1 pb-3 pt-2">
									{navigation.map((item) => (
										<Disclosure.Button
											key={item.name}
											as={Link}
											href={item.href}
											className={cn(
												item.current
													? "border-indigo-500 bg-indigo-50 text-indigo-700"
													: "border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800",
												"block border-l-4 py-2 pl-3 pr-4 text-base font-medium"
											)}
											aria-current={item.current ? "page" : undefined}
										>
											{item.name}
										</Disclosure.Button>
									))}
								</div>
								{user && (
									<div className="border-t border-gray-200 pb-3 pt-4">
										<div className="flex items-center px-4">
											<div className="flex-shrink-0">
												<img
													className="h-10 w-10 rounded-full"
													src="https://miro.medium.com/v2/resize:fill:176:176/1*e3DUu5swaVubfa_fGUHn_g.jpeg"
													alt=""
												/>
											</div>
											<div className="ml-3">
												<div className="text-base font-medium text-gray-800">
													{user.name}
												</div>
												<div className="text-sm font-medium text-gray-500">
													{user.email}
												</div>
											</div>
										</div>
										<div className="mt-3 space-y-1">
											{userNavigation.map((item) => (
												<Disclosure.Button
													key={item.name}
													as={Link}
													href={item.href}
													method={(item?.method as any) || "get"}
													className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
												>
													{item.name}
												</Disclosure.Button>
											))}
										</div>
									</div>
								)}
							</Disclosure.Panel>
						</>
					)}
				</Disclosure>

				<div className="py-10">{children}</div>
			</div>
		</>
	);
}

export const Body = ({ children }: { children: ReactNode }) => (
	<main>
		<div className="mx-auto max-w-7xl sm:px-6 lg:px-8">{children}</div>
	</main>
);

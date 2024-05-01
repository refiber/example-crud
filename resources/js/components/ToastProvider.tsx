import {
	Fragment,
	ReactNode,
	createContext,
	useCallback,
	useContext,
	useState,
} from "react";
import { Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/20/solid";

import { cn } from "lib/helpers";

type Toast = {
	message: string;
	type: "error" | "success" | "info" | "warning";
	duration?: number;
};

type ToastData = Toast & {
	id: number;
	active: boolean;
};

export const ToastContext = createContext<(toast: Toast) => void>(() => {});

export const useToast = () => useContext(ToastContext);

type ToastProviderProps = {
	children: ReactNode;
};

export const ToastProvider = ({ children }: ToastProviderProps) => {
	const [data, setData] = useState<ToastData[]>([]);

	const removeToast = useCallback((id: number) => {
		// trigger close animation before remove state data from the state data
		setData((prev) =>
			prev.map((d) => (d.id === id ? { ...d, active: false } : d))
		);

		// remove state from state data
		setTimeout(() => {
			setData((prev) => prev.filter((d) => d.id !== id));
		}, 1000);
	}, []);

	const addToast = useCallback((t: Toast) => {
		// add toast to state data
		const toast = { ...t, id: Date.now(), active: false };
		setData((prev) => [...prev, toast]);

		setTimeout(() => {
			// trigger show state animation
			setData((prev) =>
				prev.map((d) => (d.id === toast.id ? { ...d, active: true } : d))
			);

			// close state
			setTimeout(() => {
				removeToast(toast.id);
			}, t.duration || 5000);
		}, 1);
	}, []);

	return (
		<ToastContext.Provider value={addToast}>
			{children}
			<ToastList data={data} removeToast={removeToast} />
		</ToastContext.Provider>
	);
};

type ToastListProps = {
	data: ToastData[];
	removeToast: (id: number) => void;
};

const getStyleByTpe = (type: Toast["type"]) => {
	switch (type) {
		case "success":
			return {
				body: "bg-green-50",
				message: "text-green-800",
				button: "bg-green-50 text-green-500  hover:bg-green-100",
			};
		case "error":
			return {
				body: "bg-red-50",
				message: "text-red-800",
				button: "bg-red-50 text-red-500  hover:bg-red-100",
			};
		case "info":
			return {
				body: "bg-blue-50",
				message: "text-blue-800",
				button: "bg-blue-50 text-blue-500  hover:bg-blue-100",
			};
		case "warning":
			return {
				body: "bg-yellow-50",
				message: "text-yellow-800",
				button: "bg-yellow-50 text-yellow-500  hover:bg-yellow-100",
			};
		default:
			return {
				body: "bg-white",
				message: "text-gray-900",
				button: "bg-white text-gray-400 hover:text-gray-500",
			};
	}
};

const ToastCard = ({
	toast,
	close,
}: {
	toast: ToastData;
	close: () => void;
}) => {
	const style = getStyleByTpe(toast.type);

	return (
		<Transition
			show={toast.active}
			as={Fragment}
			enter="transform ease-out duration-300 transition"
			enterFrom="translate-x-0 opacity-0 sm:translate-y-0 sm:translate-y-2"
			enterTo="translate-y-0 opacity-100 sm:translate-x-0"
			leave="transition ease-in duration-100"
			leaveFrom="opacity-100"
			leaveTo="opacity-0"
		>
			<div
				className={cn(
					"pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg shadow-lg",
					style.body
				)}
			>
				<div className="p-4">
					<div className="flex items-center">
						<div className="flex w-0 flex-1 justify-between">
							<p
								className={cn("w-0 flex-1 text-sm font-medium", style.message)}
							>
								{toast.message}
							</p>
						</div>
						<div className="ml-4 flex flex-shrink-0">
							<button
								type="button"
								className={cn(
									"inline-flex rounded-md  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
									style.button
								)}
								onClick={close}
							>
								<span className="sr-only">Close</span>
								<XMarkIcon className="h-5 w-5" aria-hidden="true" />
							</button>
						</div>
					</div>
				</div>
			</div>
		</Transition>
	);
};

export const ToastList = ({ data, removeToast }: ToastListProps) =>
	data.length > 0 && (
		<div
			aria-live="assertive"
			className="pointer-events-none fixed inset-0 flex justify-center items-end px-4 py-6  sm:p-6"
		>
			<div className="flex w-full flex-col items-center space-y-4 ">
				{data.map((d, i) => (
					<ToastCard key={i} toast={d} close={() => removeToast(d.id)} />
				))}
			</div>
		</div>
	);

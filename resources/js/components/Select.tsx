import { cn, defaultInputClasses } from "lib/helpers";
import { useMemo } from "react";

type MainProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
	error?: string;
	helper?: string;
};

const Select = ({
	className,
	error,
	helper,
	children,
	...props
}: MainProps) => {
	const isError = useMemo(() => Boolean(error), [error]);
	return (
		<div>
			<select
				{...props}
				className={cn(
					defaultInputClasses,
					isError
						? "text-red-900 ring-red-300 placeholder:text-red-300 focus:ring-red-500 pr-10"
						: null,
					className
				)}
			>
				{children}
			</select>
			<p
				className={cn(
					"mt-3 text-sm leading-6 text-gray-600",
					Boolean(helper) ? "visible" : "hidden"
				)}
			>
				{helper}
			</p>
			<p
				className={cn(
					"mt-2 text-sm text-red-600",
					isError ? "visible" : "hidden"
				)}
			>
				{error}
			</p>
		</div>
	);
};

export default Select;

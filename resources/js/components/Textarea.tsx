import { useMemo } from "react";

import { cn, defaultInputClasses } from "lib/helpers";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
	error?: string;
	helper?: string;
};

const Textarea = ({
	className,
	error,
	helper,
	rows,
	...props
}: TextareaProps) => {
	const isError = useMemo(() => Boolean(error), [error]);

	return (
		<div>
			<textarea
				{...props}
				rows={rows || 3}
				className={cn(
					defaultInputClasses,
					"max-w-2xl",
					isError
						? "text-red-900 ring-red-300 placeholder:text-red-300 focus:ring-red-500 pr-10"
						: null,
					className
				)}
			/>
			<p
				className={cn(
					"mt-3 text-sm leading-6 text-gray-600",
					Boolean(helper) ? "visible" : "hidden"
				)}
			>
				Write a few sentences about the product.
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

export default Textarea;

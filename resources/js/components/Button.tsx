import { cn } from "lib/helpers";
import { ButtonHTMLAttributes } from "react";

// TODO: loading state

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

const Button = ({ children, className, ...props }: ButtonProps) => {
	return (
		<button
			type="button"
			{...props}
			className={cn(
				"block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600",
				"transition-colors",
				"disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500",
				className
			)}
		>
			{children}
		</button>
	);
};

export default Button;

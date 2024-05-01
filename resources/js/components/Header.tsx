import { cn } from "lib/helpers";
import { ReactNode } from "react";

type HeaderProps = {
	children: ReactNode | string;
	rightElement?: ReactNode;
	className?: string;
};

const Header = ({ children, className, rightElement }: HeaderProps) => {
	return (
		<header className={cn("mb-8", className)}>
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex justify-between gap-3">
				<h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
					{children}
				</h1>

				{rightElement}
			</div>
		</header>
	);
};

export default Header;

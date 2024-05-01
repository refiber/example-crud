import { cn } from "lib/helpers";

const Main = (props: React.FormHTMLAttributes<HTMLFormElement>) => (
	<form {...props} />
);

const Body = ({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) => (
	<div {...props} className={cn("space-y-12 sm:space-y-16", className)} />
);

const SectionBody = ({
	children,
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) => (
	<div
		{...props}
		className={cn(
			"space-y-8 border-b border-gray-900/10 pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0",
			className
		)}
	>
		{children}
	</div>
);

const SectionMain = ({
	children,
	title,
	description,
	...props
}: React.HTMLAttributes<HTMLDivElement> & {
	title?: string;
	description?: string;
}) => (
	<div {...props}>
		{(title || description) && (
			<div className="space-y-1 mb-10">
				{title && (
					<h2 className="text-base font-semibold leading-7 text-gray-900">
						Product
					</h2>
				)}

				{description && (
					<p className="max-w-2xl text-sm leading-6 text-gray-600">
						This information will be displayed publicly so be careful what you
						share.
					</p>
				)}
			</div>
		)}
		<div></div>
		{children}
	</div>
);

const InputGroup = ({
	className,
	children,
	...props
}: React.HTMLAttributes<HTMLDivElement>) => {
	return (
		<div
			{...props}
			className={cn(
				"sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6",
				className
			)}
		>
			{children}
		</div>
	);
};

const Field = ({
	className,
	children,
	...props
}: React.HTMLAttributes<HTMLDivElement>) => (
	<div {...props} className={cn("mt-2 sm:col-span-2 sm:mt-0", className)}>
		{children}
	</div>
);

const Label = ({
	className,
	children,
	...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) => (
	<label
		{...props}
		className={cn(
			"block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5",
			className
		)}
	>
		{children}
	</label>
);

export default {
	Main,
	Body,
	Label,
	InputGroup,
	Field,
	Section: { Main: SectionMain, Body: SectionBody },
};

import { ReactNode } from "react";

type CardProps = {
	children?: ReactNode;
};

export default function Card({ children }: CardProps) {
	return <div className="px-4 py-8 bg-white rounded-lg">{children}</div>;
}

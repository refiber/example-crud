import Card from "components/Card";
import Header from "components/Header";

import Layout, { Body } from "components/Layout";

export default function HomePage() {
	return (
		<>
			<Header>Dashboard</Header>

			<Body>
				<Card>TODO</Card>
			</Body>
		</>
	);
}

HomePage.layout = (page: React.ReactNode) => <Layout children={page} />;

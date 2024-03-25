import { Box, Button, Container, Flex, Title } from "@mantine/core";

import { useNavigate } from "react-router-dom";

function Home() {
	const navigate = useNavigate();

	return (
		<Container
			fluid
			style={{
				flex: 1,

				width: "100%",

				backgroundColor: "#495057",

				gap: "20px",
			}}
		>
			<Box
				style={{
					display: "flex",

					alignItems: "center",

					justifyContent: "center",

					position: "fixed",

					top: 100,

					width: "100%",

					flexDirection: "column",

					justifyItems: "center",

					gap: 50,
				}}
			>
				<Title order={1} style={{ fontSize: "75px" }} variant="gradient">
					Sketch your ideas
				</Title>

				<Flex gap={10}>
					<Button
						size="xl"
						radius="lg"
						variant="gradient"
						color="red"
						onClick={() => {
							navigate("/sketch/new");
						}}
					>
						Start Sketching
					</Button>

					<Button
						size="xl"
						radius="lg"
						variant="gradient"
						color="red"
						onClick={() => {
							navigate("/sketch/custom/new");
						}}
					>
						Custom Sketching
					</Button>

					<Button
						size="xl"
						radius="lg"
						variant="gradient"
						color="red"
						onClick={() => {
							navigate("/sketch/new");
						}}
					>
						Register
					</Button>
				</Flex>
			</Box>
		</Container>
	);
}

export default Home;

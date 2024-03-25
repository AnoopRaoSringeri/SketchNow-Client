import { ActionIcon, Flex } from "@mantine/core";
import { observer } from "mobx-react";
import Icon from "../../components/Icon";
import { useCanvas } from "../../hooks/canvas-context";

const CanvasOptions = observer(function CanvasOptions() {
	const { canvas } = useCanvas();

	if (!canvas) {
		return <div />;
	}
	return (
		<Flex
			align="center"
			style={{
				position: "absolute",
				top: 20,
				right: 20,
				zIndex: 1,
			}}
		>
			<ActionIcon variant="filled">
				<Icon
					icon="save"
					onClick={() => {
						console.log(canvas.toJSON(["data", "fill", "fillStyle"]));
					}}
				/>
			</ActionIcon>
		</Flex>
	);
});

export default CanvasOptions;

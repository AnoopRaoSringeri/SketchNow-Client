import { Box, ActionIcon, Flex, Divider } from "@mantine/core";
import Icon from "../../components/Icon";
import { observer } from "mobx-react";
import { useCanvasStore } from "../../stores/canvas-store";
import { Option, OptionPanelPosition } from "../../types/layout";
import { ReactNode, useMemo } from "react";
import classes from "./canvas.module.css";
import { useElementSize } from "@mantine/hooks";

const LeftOptions = observer(function LeftOptions({
	width = 50,
	buttonHeight = 50,
	buttonWidth = 50,
	options,
	position,
	additionalComponent,
}: {
	height?: number;
	width?: number;
	buttonHeight?: number;
	buttonWidth?: number;
	position: OptionPanelPosition;
	options: Option[];
	additionalComponent?: ReactNode;
}) {
	const canvasStore = useCanvasStore();
	const selected = canvasStore.ElementType;
	const { ref, height } = useElementSize();
	const className = useMemo(() => {
		switch (position) {
			case "left":
				return classes.left;
			case "bottom":
				return classes.top;
			case "right":
				return classes.left;
			case "top":
				return classes.top;
		}
	}, [position]);

	const isElementLocked = canvasStore.LockElementType;

	return (
		<Box
			className={className}
			ref={ref}
			style={{
				"--width": width + "px",
				"--height": height + "px",
				"--buttonWidth": buttonWidth + "px",
				"--buttonHeight": buttonHeight + "px",
			}}
		>
			<Flex align="center">
				<Box className={classes.content}>
					<ActionIcon
						onClick={() => {
							canvasStore.toggleLockElementType();
						}}
						className="actionBtn"
						variant={isElementLocked ? undefined : "default"}
					>
						{isElementLocked ? <Icon icon="lock" /> : <Icon icon="unlock" />}
					</ActionIcon>
					<Divider my="sm" style={{ width: "100%" }} />
					{options.map((o) => (
						<ActionIcon
							variant={o.value == selected ? undefined : "default"}
							key={o.value}
							onClick={() => {
								canvasStore.ElementType = o.value;
								canvasStore.SelectedElement = null;
							}}
							className="actionBtn"
						>
							<Icon icon={o.icon} />
						</ActionIcon>
					))}
				</Box>
			</Flex>
			{additionalComponent ?? null}
		</Box>
	);
});

export default LeftOptions;

import {
	Box,
	ActionIcon,
	Flex,
	Menu,
	ColorPicker,
	DEFAULT_THEME,
	Slider,
} from "@mantine/core";
import Icon from "../../components/Icon";
import { useCanvasStore } from "../../stores/canvas-store";
import { observer } from "mobx-react";
import { useState } from "react";
import { useCanvas } from "../../hooks/canvas-context";

import classes from "./canvas.module.css";
import { useElementSize } from "@mantine/hooks";

const TopCanvasOptions = observer(function TopCanvasOptions({
	buttonWidth = 50,
}: {
	buttonWidth?: number;
}) {
	const canvasStore = useCanvasStore();
	const { canvas } = useCanvas();
	const [color, setColor] = useState<string>(canvasStore.Options.stroke);
	const { ref: elementRef, width } = useElementSize();
	const [strokeWidth, setStrokeWidth] = useState<number>(
		canvasStore.Options.strokeWidth,
	);

	return (
		<Box
			ref={elementRef}
			className={classes.top}
			style={{
				"--width": width + "px",
				"--height": "50px",
				"--buttonWidth": buttonWidth + "px",
			}}
		>
			<Flex direction="column" align="center">
				<Box className={classes.topContent}>
					<Menu width={250}>
						<Menu.Target>
							<ActionIcon className="actionBtn" variant="default">
								<Icon icon="palette" color={canvasStore.Options.stroke} />
							</ActionIcon>
						</Menu.Target>
						<Menu.Dropdown>
							<ColorPicker
								swatchesPerRow={10}
								style={{ width: "100%" }}
								format="hexa"
								value={color}
								onChange={(color) => {
									setColor(color);
								}}
								onChangeEnd={(c) => {
									canvasStore.updateOptions("stroke", c);
									setColor(c);
									if (canvas) {
										canvas.freeDrawingBrush.color = c;
									}
								}}
								swatches={[
									...DEFAULT_THEME.colors.red,
									...DEFAULT_THEME.colors.green,
									...DEFAULT_THEME.colors.blue,
								]}
							/>
						</Menu.Dropdown>
					</Menu>
					<Menu width={250}>
						<Menu.Target>
							<ActionIcon className="actionBtn" variant="default">
								<Icon icon="pen-ruler" />
							</ActionIcon>
						</Menu.Target>
						<Menu.Dropdown>
							<Slider
								value={strokeWidth}
								onChange={setStrokeWidth}
								min={1}
								max={100}
								onChangeEnd={(value) => {
									canvasStore.updateOptions("strokeWidth", value);
									if (canvas) {
										canvas.freeDrawingBrush.width = value;
									}
								}}
							/>
						</Menu.Dropdown>
					</Menu>
				</Box>
			</Flex>
		</Box>
	);
});

export default TopCanvasOptions;

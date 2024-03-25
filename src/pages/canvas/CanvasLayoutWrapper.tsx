import { Box } from "@mantine/core";
import Canvas from "./Canvas";
import { Option } from "../../types/layout";
import { OptionsButton } from "../../components/Options";
import { ZoomController } from "../../components/Zoom";
import LeftOptions from "./OptionsLayout";
import TopCanvasOptions from "./TopOptions";
import classes from "./canvas.module.css";
import CanvasOptions from "./CanvasOptions";
import CanvasLayers from "./CanvasLayers";
// import { MiniMap } from "../../components/MiniMap";

const LeftOptionLists: Option[] = [
	{ icon: "up-down-left-right", value: "none" },
	{ icon: "pencil", value: "pencil" },
	{ icon: "table-cells-large", value: "rectangle" },
	{ icon: "circle", value: "circle" },
	{ icon: "square", value: "square" },
	{ icon: "chart-line", value: "line" },
	{ icon: "coins", value: "ellipse" },
];

const CanvasLayoutWrapper = function CanvasLayoutWrapper() {
	return (
		<Box className={classes.canvasOuterContainer}>
			<TopCanvasOptions />
			<LeftOptions options={LeftOptionLists} position="left" />
			<CanvasOptions />
			<OptionsButton />
			<ZoomController />
			<Canvas />
			{/* <CanvasLayers /> */}
			{/* <MiniMap /> */}
		</Box>
	);
};
export default CanvasLayoutWrapper;

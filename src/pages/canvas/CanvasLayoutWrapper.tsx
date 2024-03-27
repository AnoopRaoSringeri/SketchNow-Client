import Canvas from "./Canvas";
import CanvasLayers from "./CanvasLayers";
import CanvasOptions from "./CanvasOptions";
import LeftOptions from "./OptionsLayout";
import { Option } from "@/types/layout";
import { OptionsButton } from "@/components/Options";
import TopCanvasOptions from "./TopOptions";
import { ZoomController } from "@/components/Zoom";
import classes from "./canvas.module.css";

// import { MiniMap } from"@/components/MiniMap";

const LeftOptionLists: Option[] = [
    { icon: "up-down-left-right", value: "none" },
    { icon: "pencil", value: "pencil" },
    { icon: "table-cells-large", value: "rectangle" },
    { icon: "circle", value: "circle" },
    { icon: "square", value: "square" },
    { icon: "chart-line", value: "line" },
    { icon: "coins", value: "ellipse" }
];

const CanvasLayoutWrapper = function CanvasLayoutWrapper() {
    return (
        <div className={classes.canvasOuterContainer}>
            <TopCanvasOptions />
            <LeftOptions options={LeftOptionLists} position="left" />
            <CanvasOptions />
            <OptionsButton />
            <ZoomController />
            <Canvas />
            {/* <CanvasLayers /> */}
            {/* <MiniMap /> */}
        </div>
    );
};
export default CanvasLayoutWrapper;

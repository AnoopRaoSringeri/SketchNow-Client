import { Circle, Cylinder, LineChart, Move, Pencil, RectangleHorizontal, Square } from "lucide-react";

import { OptionsButton } from "@/components/Options";
import { ZoomController } from "@/components/Zoom";
import { Option } from "@/types/layout";

import Canvas from "./Canvas";
import CanvasOptions from "./CanvasOptions";
import LeftOptions from "./OptionsLayout";
import TopCanvasOptions from "./TopOptions";

// import { MiniMap } from"@/components/MiniMap";

const LeftOptionLists: Option[] = [
    { icon: Move, value: "none" },
    { icon: Pencil, value: "pencil" },
    { icon: RectangleHorizontal, value: "rectangle" },
    { icon: Circle, value: "circle" },
    { icon: Square, value: "square" },
    { icon: LineChart, value: "line" },
    { icon: Cylinder, value: "ellipse" }
];

const CanvasLayoutWrapper = function CanvasLayoutWrapper() {
    return (
        <div className="flex size-full overflow-hidden bg-gray-200">
            <div className="absolute flex size-full items-center justify-center bg-slate-300">
                <TopCanvasOptions />
                <LeftOptions options={LeftOptionLists} />
                <CanvasOptions />
                <OptionsButton />
                <ZoomController />
            </div>
            <Canvas />
            {/* <CanvasLayers /> */}
            {/* <MiniMap /> */}
        </div>
    );
};
export default CanvasLayoutWrapper;

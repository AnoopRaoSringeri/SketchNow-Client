import { Circle, Cylinder, LineChart, Move, Pencil, RectangleHorizontal, Square } from "lucide-react";
import { useEffect } from "react";

import { OptionsButton } from "@/components/mini-components/options";
import { ZoomController } from "@/components/mini-components/zoom";
import { useCustomCursor } from "@/hooks/curser-provider";
import { Option } from "@/types/layout";

import Canvas from "./canvas";
import CanvasOptions from "./canvas-options";
import LeftOptions from "./left-options";
import TopCanvasOptions from "./top-options";

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
    const { cursorChangeHandler } = useCustomCursor();

    useEffect(() => {
        cursorChangeHandler("none");
        return () => {
            cursorChangeHandler("none");
        };
    }, []);

    return (
        <div className="relative flex flex-1 overflow-hidden bg-gray-200">
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

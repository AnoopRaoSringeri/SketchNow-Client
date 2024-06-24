import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

import { useStore } from "@/api-stores/store-provider";
import { ElementOptions } from "@/components/mini-components/element-options";
import { Loader } from "@/components/ui/loader";
import { useCanvas } from "@/hooks/use-canvas";

import CanvasOptions from "./canvas-options";

export const CanvasBoard = observer(function CanvasBoard() {
    const { id } = useParams<{ id: string }>();
    const [sketchName, setSketchName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { sketchStore } = useStore();
    const { canvasBoard } = useCanvas(id ?? "new");
    const canvas = canvasBoard.CanvasRef;

    useEffect(() => {
        if (id && id != "new") {
            loadCanvas(id);
        } else {
            canvasBoard.createBoard({});
        }
    }, [canvas]);

    const loadCanvas = async (id: string) => {
        setIsLoading(true);
        const response = await sketchStore.GetSketchById(id);
        if (response) {
            setSketchName(response.name);
            canvasBoard.loadBoard(response.metadata, {
                draw: true,
                height: window.innerHeight,
                width: window.innerWidth,
                readonly: false
            });
        }
        setIsLoading(false);
    };
    return (
        <>
            <Loader loading={isLoading} />
            <CanvasOptions name={sketchName} />
            <ElementOptions />
            <canvas id="canvas-board" className="absolute z-10 overscroll-contain" ref={canvasBoard.CanvasRef}></canvas>
            <canvas
                id="canvas-board-copy"
                className="absolute z-20 overscroll-contain"
                ref={canvasBoard.CanvasCopyRef}
            ></canvas>
        </>
    );
});

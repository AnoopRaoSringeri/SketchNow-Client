import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

import { useStore } from "@/api-stores/store-provider";
import { useCanvas } from "@/hooks/use-canvas";

import CanvasOptions from "../canvas/canvas-options";

export const PlaygroundCanvas = observer(function PlaygroundCanvas() {
    const { id } = useParams<{ id: string }>();
    const [sketchName, setSketchName] = useState("");
    const { sketchStore } = useStore();
    const playgroundCanvas = useCanvas(id ?? "new");
    const canvas = playgroundCanvas.CanvasRef;

    useEffect(() => {
        playgroundCanvas.init({ height: window.innerHeight, width: window.innerWidth });
    }, [playgroundCanvas]);

    useEffect(() => {
        if (id) {
            loadCanvas(id);
        } else {
            playgroundCanvas.drawBoard([]);
        }
    }, [canvas, playgroundCanvas]);

    const loadCanvas = async (id: string) => {
        const response = await sketchStore.GetSketchById(id);
        if (response) {
            setSketchName(response.name);
            playgroundCanvas.loadBoard(response.metadata, { draw: true });
        }
    };

    return (
        <>
            <CanvasOptions name={sketchName} />
            <canvas id="playground-canvas" className="z-10" ref={playgroundCanvas.CanvasRef}></canvas>
            <canvas id="playground-canvas-copy" className="absolute z-20" ref={playgroundCanvas.CanvasCopyRef}></canvas>
        </>
    );
});

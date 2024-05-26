import { observer } from "mobx-react";
import { useLayoutEffect, useRef } from "react";
import { useParams } from "react-router";

import { useStore } from "@/api-stores/store-provider";
import { useCanvasStore } from "@/data-stores/canvas-store";
import { useCanvas } from "@/hooks/canvas-context";

const Canvas = observer(function Canvas() {
    const { sketchStore } = useStore();
    const { id } = useParams<{ id: string }>();
    const canvasRef = useRef(null);
    const { initCanvas, setCanvas } = useCanvas();
    const canvasStore = useCanvasStore();

    useLayoutEffect(() => {
        if (id) {
            loadCanvas(id);
        } else {
            initCanvas(canvasRef.current, {
                width: canvasStore.CanvasSize.width,
                height: canvasStore.CanvasSize.height,
                backgroundColor: "white"
            });
        }
        return () => {
            setCanvas(null);
        };
    }, [canvasRef, initCanvas, id]);

    const loadCanvas = async (id: string) => {
        const json = await sketchStore.GetSketchById(id);
        canvasStore.SketchName = json.name;
        initCanvas(
            canvasRef.current,
            {
                width: canvasStore.CanvasSize.width,
                height: canvasStore.CanvasSize.height
            },
            json.metadata
        );
    };
    return <canvas id="canvas" ref={canvasRef} />;
});

export default Canvas;

import { observer } from "mobx-react";
import { useLayoutEffect, useRef } from "react";

import { useCanvasStore } from "@/data-stores/canvas-store";
import { useCanvas } from "@/hooks/canvas-context";

const Canvas = observer(function Canvas() {
    const canvasRef = useRef(null);
    const { initCanvas } = useCanvas();
    const canvasStore = useCanvasStore();

    useLayoutEffect(() => {
        initCanvas(canvasRef.current, {
            width: canvasStore.CanvasSize.width,
            height: canvasStore.CanvasSize.height,
            backgroundColor: "white"
        });
    }, [canvasRef, initCanvas]);

    return <canvas id="canvas" ref={canvasRef} />;
});

export default Canvas;

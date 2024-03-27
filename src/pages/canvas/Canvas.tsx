import { useLayoutEffect, useRef } from "react";

import { observer } from "mobx-react";
import { useCanvas } from "@/hooks/canvas-context";
import { useCanvasStore } from "@/stores/canvas-store";

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

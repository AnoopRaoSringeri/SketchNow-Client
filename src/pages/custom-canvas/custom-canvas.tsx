import { observer } from "mobx-react";
import { useLayoutEffect, useRef } from "react";

import { useCanvasStore } from "@/data-stores/canvas-store";
import { useCustomCanvas } from "@/hooks/custom-canvas-context";

export const CustomCanvas = observer(function CustomCanvas() {
    const canvasStore = useCanvasStore();
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const { initCanvas } = useCustomCanvas();
    useLayoutEffect(() => {
        initCanvas(canvasRef.current);
    }, [canvasRef, initCanvas]);

    return <canvas id="CustomCanvas" ref={canvasRef} />;
});

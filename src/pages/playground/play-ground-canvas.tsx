import { useCallback, useEffect, useRef } from "react";

import { CanvasBoard } from "@/lib/canvas/canvas-board";

export const PlaygroundCanvas = function PlaygroundCanvas() {
    const playgroundCanvas = new CanvasBoard(useRef<HTMLCanvasElement>(null));
    const canvas = playgroundCanvas.CanvasRef;
    const initCanvas = useCallback((element: HTMLCanvasElement | null) => {
        if (element) {
            element.height = window.innerHeight;
            element.width = window.innerWidth;
            const context = element.getContext("2d");
            if (context) {
                context.beginPath();
                context.lineWidth = 5;
                context.strokeStyle = "#fff";
                context.moveTo(200, 200);
                context.lineTo(300, 300);
                context.stroke();

                context.fillStyle = "#fff";
                context.beginPath();
                // context.arc(startPosition.x, startPosition.y, 2, 0, 2 * Math.PI);
                context.fill();
            }
        }
    }, []);

    useEffect(() => {
        initCanvas(canvas.current);
    }, [canvas]);

    return <canvas id="playground-canvas" ref={playgroundCanvas.CanvasRef}></canvas>;
};

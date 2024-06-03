import { useEffect } from "react";

import { CanvasBoard } from "@/lib/canvas/canvas-board";

const CanvasMap: Map<string, CanvasBoard> = new Map();
let playgroundCanvas: CanvasBoard | null = null;

export function useCanvas(canvasId: string) {
    const savedCanvas = CanvasMap.get(canvasId);
    if (!savedCanvas) {
        playgroundCanvas = new CanvasBoard();
        CanvasMap.set(canvasId, playgroundCanvas);
    } else {
        playgroundCanvas = savedCanvas;
    }

    useEffect(() => {
        window.addEventListener("resize", onResize);
        return () => {
            window.removeEventListener("resize", onResize);
        };
    }, [onResize]);

    useEffect(() => {
        window.addEventListener("mousedown", onMouseDown);
        return () => {
            window.removeEventListener("mousedown", onMouseDown);
        };
    }, [onMouseDown]);

    useEffect(() => {
        window.addEventListener("mousemove", onMouseMove);
        return () => {
            window.removeEventListener("mousemove", onMouseMove);
        };
    }, [onMouseDown]);

    useEffect(() => {
        window.addEventListener("mouseup", onMouseUp);
        return () => {
            window.removeEventListener("mouseup", onMouseUp);
        };
    }, [onMouseUp]);

    function onResize() {
        playgroundCanvas?.resizeBoard();
    }

    function onMouseDown(e: MouseEvent) {
        playgroundCanvas?.onMouseDown(e);
    }

    function onMouseMove(e: MouseEvent) {
        playgroundCanvas?.onMouseMove(e);
    }

    function onMouseUp(e: MouseEvent) {
        playgroundCanvas?.onMouseUp(e);
    }

    return playgroundCanvas;
}

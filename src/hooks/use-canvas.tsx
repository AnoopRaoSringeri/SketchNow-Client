import { useEffect } from "react";

import { CanvasBoard } from "@/lib/canvas/canvas-board";

const CanvasMap: Map<string, CanvasBoard> = new Map();
let canvasBoard: CanvasBoard | null = null;

export function useCanvas(canvasId: string) {
    const savedCanvas = CanvasMap.get(canvasId);
    if (!savedCanvas) {
        canvasBoard = new CanvasBoard();
        CanvasMap.set(canvasId, canvasBoard);
    } else {
        canvasBoard = savedCanvas;
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
        canvasBoard?.resizeBoard();
    }

    function onMouseDown(e: MouseEvent) {
        canvasBoard?.onMouseDown(e);
    }

    function onMouseMove(e: MouseEvent) {
        canvasBoard?.onMouseMove(e);
    }

    function onMouseUp(e: MouseEvent) {
        canvasBoard?.onMouseUp(e);
    }

    function removeCanvasCache(id: string) {
        CanvasMap.delete(id);
    }

    return { canvasBoard, removeCanvasCache };
}

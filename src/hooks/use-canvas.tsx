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
        window.addEventListener("touchstart", onTouchStart, { passive: false });
        return () => {
            window.removeEventListener("touchstart", onTouchStart);
        };
    }, [onTouchStart]);

    useEffect(() => {
        window.addEventListener("mousemove", onMouseMove);
        return () => {
            window.removeEventListener("mousemove", onMouseMove);
        };
    }, [onMouseMove]);

    useEffect(() => {
        window.addEventListener("touchmove", onTouchMove, { passive: false });
        return () => {
            window.removeEventListener("touchmove", onTouchMove);
        };
    }, [onTouchMove]);

    useEffect(() => {
        window.addEventListener("mouseup", onMouseUp);
        return () => {
            window.removeEventListener("mouseup", onMouseUp);
        };
    }, [onMouseUp]);

    useEffect(() => {
        window.addEventListener("touchend", onTouchEnd);
        return () => {
            window.removeEventListener("touchend", onTouchEnd);
        };
    }, [onTouchEnd]);

    function onResize() {
        canvasBoard?.resizeBoard();
    }

    function onMouseDown(e: MouseEvent) {
        canvasBoard?.onMouseDown(e);
    }

    function onTouchStart(e: globalThis.TouchEvent) {
        canvasBoard?.onTouchStart(e);
    }

    function onMouseMove(e: MouseEvent) {
        canvasBoard?.onMouseMove(e);
    }

    function onTouchMove(e: globalThis.TouchEvent) {
        canvasBoard?.onTouchMove(e);
    }

    function onMouseUp(e: MouseEvent) {
        canvasBoard?.onMouseUp(e);
    }

    function onTouchEnd(e: globalThis.TouchEvent) {
        canvasBoard?.onTouchEnd(e);
    }

    function removeCanvasCache(id: string) {
        CanvasMap.delete(id);
    }

    return { canvasBoard, removeCanvasCache };
}

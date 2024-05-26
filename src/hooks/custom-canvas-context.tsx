import { observer } from "mobx-react";
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

import { useCanvasStore } from "../data-stores/canvas-store";
import { Position } from "../types/canvas";

const WIDTH = 250;
const HEIGHT = 200;
interface CustomCanvasContext {
    canvas: HTMLCanvasElement | null;
    initCanvas: (element: HTMLCanvasElement | null) => unknown;
    setCanvas: (canvas: HTMLCanvasElement | null) => unknown;
}

export const CustomCanavsContext = createContext<CustomCanvasContext>({} as CustomCanvasContext);
type CanvasAction = "click" | "pan" | "zoom" | "none";
export const CustomCanavsContextProvider = observer(function CustomCanavsContextProvider({
    children
}: {
    children: React.ReactNode;
}) {
    const canvasStore = useCanvasStore();
    const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
    const [action, setAction] = useState<CanvasAction>("none");
    const origin = useRef<Position | null>(null);
    const currentPointer = useRef<Position | null>(null);
    const ref = useRef(null);
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
        setCanvas(element);
    }, []);

    useEffect(() => {
        if (!canvas) {
            return;
        }
        window.addEventListener("resize", onResize);
        return () => {
            window.removeEventListener("resize", onResize);
        };
    }, [canvas]);

    const onResize = () => {
        if (!canvas) {
            return;
        }
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };

    return (
        <CustomCanavsContext.Provider
            value={{
                canvas: canvas,
                initCanvas,
                setCanvas
            }}
        >
            {children}
        </CustomCanavsContext.Provider>
    );
});

export const useCustomCanvas = (): CustomCanvasContext => useContext(CustomCanavsContext);

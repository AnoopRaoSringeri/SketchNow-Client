import {
    BaseFabricOption,
    CanvasBoardSize,
    CreateElementProps,
    Draw,
    NullableFabricElement,
    UpdateElementProps,
    Views,
    Zoom
} from "@/types/canvas";

import { fabric } from "fabric";
import { v4 as uuid } from "uuid";

export function resizeCanvas(canvas: HTMLCanvasElement | null) {
    if (!canvas) {
        return false;
    }
    const { width, height } = canvas.getBoundingClientRect();

    if (canvas.width !== width || canvas.height !== height) {
        const { devicePixelRatio: ratio = 1 } = window;
        const context = canvas.getContext("2d");
        canvas.width = width * ratio;
        canvas.height = height * ratio;
        context?.scale(ratio, ratio);
        return true;
    }
    return false;
}

export const _draw = ({ context, currentPosition, previousPosition }: Draw) => {
    const { x: currentX, y: currentY } = currentPosition;
    const startPosition = previousPosition ?? currentPosition;
    // _zoom({ scale: 1, position: currentPosition, context });
    context.beginPath();
    context.lineWidth = 5;
    context.strokeStyle = "#000";
    context.moveTo(startPosition.x, startPosition.y);
    context.lineTo(currentX, currentY);
    context.stroke();

    context.fillStyle = "#000";
    context.beginPath();
    context.arc(startPosition.x, startPosition.y, 2, 0, 2 * Math.PI);
    context.fill();
};

export const _zoom = ({ scale, position, context }: Zoom) => {
    context.translate(position.x, position.y);
    context.scale(scale, scale);
    scale++;
    return { context, scale };
};

export const _createElement = ({ type, canvas, event, options, layer }: CreateElementProps) => {
    const points = canvas?.getPointer(event.e);
    const { stroke, strokeWidth } = options;
    if (!points) {
        return;
    }
    const generalOptions: BaseFabricOption = {
        top: points?.y,
        left: points?.x,
        stroke: stroke,
        strokeWidth: strokeWidth,
        radius: 0,
        selectable: false,
        fill: "",
        hasControls: false,
        lockMovementX: true,
        lockMovementY: true,
        hasBorders: false,
        evented: false,
        transparentCorners: false,
        cornerStyle: "circle",
        data: { type, id: uuid(), layer }
    };
    switch (type) {
        case "circle":
            return new fabric.Circle({
                ...generalOptions
            });
        case "line":
            return new fabric.Line([points?.y, points?.x, points?.y, points?.x], {
                ...generalOptions
            });
        case "rectangle":
            return new fabric.Rect({
                ...generalOptions
            });
        case "square":
            return new fabric.Rect({
                ...generalOptions
            });
        case "ellipse":
            return new fabric.Ellipse({
                ...generalOptions
            });
        case "pencil":
            return;
    }
};

export const _updateElement = ({ type, canvas, event, origin }: UpdateElementProps) => {
    const pointer = canvas?.getPointer(event.e);
    const element = canvas?.getActiveObject() as NullableFabricElement;
    if (!pointer || !element) {
        return;
    }
    const { x: origX, y: origY } = origin;
    switch (type) {
        case "circle": {
            const radius = Math.min(Math.abs(origX - pointer.x), Math.abs(origY - pointer.y));
            if (origX > pointer.x) {
                element.set({ left: origX - radius });
            }
            if (origY > pointer.y) {
                element.set({ top: origY - radius });
            }
            element.set({ radius: radius / 2 });
            return element;
        }
        case "ellipse": {
            if (origX > pointer.x) {
                element.set({ left: Math.abs(pointer.x) });
            }
            if (origY > pointer.y) {
                element.set({ top: Math.abs(pointer.y) });
            }
            element.set({
                rx: Math.abs(origX - pointer.x) / 2,
                ry: Math.abs(origY - pointer.y) / 2
            });
            return element;
        }
        case "line": {
            element.set({ x1: origX, x2: pointer.x, y1: origY, y2: pointer.y });
            return element;
        }
        case "rectangle": {
            if (origX > pointer.x) {
                element.set({ left: Math.abs(pointer.x) });
            }
            if (origY > pointer.y) {
                element.set({ top: Math.abs(pointer.y) });
            }
            element.set({
                width: Math.abs(origX - pointer.x),
                height: Math.abs(origY - pointer.y)
            });
            return element;
        }
        case "square": {
            const length = Math.min(Math.abs(origX - pointer.x), Math.abs(origY - pointer.y));
            element.set({ width: length });
            element.set({ height: length });
            if (origX > pointer.x) {
                element.set({ left: Math.abs(origX - length) });
            }
            if (origY > pointer.y) {
                element.set({ top: Math.abs(origY - length) });
            }
            return element;
        }
        case "pencil":
            return;
    }
};

export const Layout: { [key in Views]: CanvasBoardSize } = {
    infinite: { width: window.innerWidth, height: window.innerHeight }
};

export const computePointerPositionForMouse = (e: MouseEvent, canvas: HTMLCanvasElement | null) => {
    if (!canvas) {
        return;
    }
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    return { x, y };
};

export const computePointerPositionForTouch = (e: TouchEvent, canvas: HTMLCanvasElement | null) => {
    if (!canvas) {
        return;
    }
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.touches?.[0].clientX - rect.left) * scaleX;
    const y = (e.touches?.[0].clientY - rect.top) * scaleY;
    return { x, y };
};

import { Position, Size } from "@/types/canvas";
import {
    CanvasObject,
    CursorPosition,
    ICanvasObjectWithId,
    ICanvasTransform,
    IObjectStyle,
    IObjectValue,
    IToSVGOptions
} from "@/types/custom-canvas";

export const DefaultStyle: IObjectStyle = { fillColor: "transparent", strokeStyle: "#fff", strokeWidth: 1 };

const HOVER_OFFSET = 10;

export const GUTTER = 2;

export const CANVAS_SCALING_FACTOR = 0.0001;
export const CANVAS_SCALING_LIMIT = 0.1;
export const CANVAS_SCALING_MULTIPLIER = 100;
export const MIN_INTERVAL = 1;

export const DEFAULT_TRANSFORM: ICanvasTransform = {
    a: 1,
    b: 0,
    c: 0,
    d: 1,
    e: 0,
    f: 0
};
let CanvasWorker: Worker | null = null;
export class CanvasHelper {
    static getHeightRatio(canvasHeight: number, newHeight: number) {
        return newHeight / canvasHeight;
    }

    static getWidthRatio(canvasWidth: number, newWidth: number) {
        return newWidth / canvasWidth;
    }

    static getSizeRatio(nSize: Size, cSize: Size): Size {
        return { height: nSize.height / cSize.height, width: nSize.width / cSize.width };
    }

    static isUnderMouse(mousePosition: Position, values: Partial<IObjectValue>, transform: ICanvasTransform) {
        const { x, y } = mousePosition;
        const { x: cx = 0, y: cy = 0, h = 0, w = 0, r = 0, points = [], style = DefaultStyle } = values;
        const { strokeWidth } = style;
        const wFactor = strokeWidth / 2;
        const ucx = cx + transform.e + -wFactor;
        const ucy = cy + transform.f + -wFactor;
        const uh = h + wFactor * 2;
        const uw = w + wFactor * 2;
        const ur = r + wFactor;
        const [lpx, lpy] = points.length > 0 ? points[0] : [0, 0];
        return (
            (x >= ucx && x <= ucx + uw && y >= ucy && y <= ucy + uh) ||
            (x >= ucx && x <= ucx + uh && y >= ucy && y <= ucy + uh) ||
            (x >= cx - ur && y >= cy - ur && x <= cx + ur && y <= cy + ur) ||
            points.find(
                ([px, py]) =>
                    px - (HOVER_OFFSET + wFactor) <= x &&
                    x <= px + HOVER_OFFSET + wFactor &&
                    py - (HOVER_OFFSET + wFactor) <= y &&
                    y <= py + HOVER_OFFSET + wFactor
            ) != null ||
            // (x == ucx && y == ucy) ||
            (x == lpx + wFactor && y == lpy + wFactor)
        );
    }

    static getCursorPosition(
        mousePosition: Position,
        values: CanvasObject,
        transform: ICanvasTransform
    ): CursorPosition {
        const { x, y } = mousePosition;
        const { x: cx = 0, y: cy = 0, h = 0, w = 0, style = DefaultStyle } = values;
        const { strokeWidth } = style;
        const wFactor = strokeWidth / 2;
        const ucx = cx + transform.e + -wFactor;
        const ucy = cy + transform.f + -wFactor;
        const uh = h + ucy + wFactor * 2;
        const uw = w + ucx + wFactor * 2;
        return x >= ucx - HOVER_OFFSET && x <= ucx + HOVER_OFFSET && y >= ucy - HOVER_OFFSET && y <= ucy + HOVER_OFFSET
            ? "tl"
            : x >= ucx - HOVER_OFFSET && x <= ucx + HOVER_OFFSET && y >= uh - HOVER_OFFSET && y <= uh + HOVER_OFFSET
              ? "bl"
              : x >= uw - HOVER_OFFSET && x <= uw + HOVER_OFFSET && y >= ucy - HOVER_OFFSET && y <= ucy + HOVER_OFFSET
                ? "tr"
                : x >= uw - HOVER_OFFSET && x <= uw + HOVER_OFFSET && y >= uh - HOVER_OFFSET && y <= uh + HOVER_OFFSET
                  ? "br"
                  : "m";
    }

    static getCursor(position: CursorPosition) {
        switch (position) {
            case "tl":
            case "br":
                return "se-resize";
            case "tr":
            case "bl":
                return "sw-resize";
            case "m":
                return "move";
            default:
                return "default";
        }
    }

    static hoveredElement(mouseCords: Position, elements: ICanvasObjectWithId[], transform: ICanvasTransform) {
        return elements.find(
            (e) =>
                this.isUnderMouse(mouseCords, e.getValues(), transform) ||
                this.getCursorPosition(mouseCords, e.getValues(), transform) != "m"
        );
    }

    static applyStyles(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, style: IObjectStyle) {
        ctx.save();
        const { fillColor, strokeStyle, strokeWidth } = style;
        ctx.fillStyle = fillColor;
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = strokeWidth;
    }

    static getHTMLStyle(style: IObjectStyle, { height, width }: IToSVGOptions) {
        return `fill: ${style.fillColor}; stroke: ${style.strokeStyle}; stroke-width: ${style.strokeWidth * Math.max(height, width)}px;`;
    }

    static getMousePosition({ x, y }: Position, { e, f, a }: ICanvasTransform) {
        return { x: x, y: y, ax: (x - e) / a, ay: (y - f) / a };
    }

    static getCurrentMousePosition(event: MouseEvent, { e, f, a }: ICanvasTransform) {
        const { offsetX: x, offsetY: y } = event;
        return { offsetX: (x - e) / a, offsetY: (y - f) / a };
    }

    static getAbsolutePosition({ x, y }: Position, { e, f, a }: ICanvasTransform) {
        return { x, y, ax: (x + e) * a, ay: (y + f) * a };
    }

    static clearCanvasArea(
        ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
        { a, e, f }: ICanvasTransform
    ) {
        const xf = (Math.abs(e) * (a + 1)) / a;
        const yf = (Math.abs(f) * (a + 1)) / a;
        ctx.clearRect(-xf, -yf, window.innerWidth + xf * 2, window.innerHeight + yf * 2);
    }

    static clearOffscreenCanvasArea(
        ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
        { a, e, f }: ICanvasTransform,
        size: Size
    ) {
        const xf = (Math.abs(e) * (a + 1)) / a;
        const yf = (Math.abs(f) * (a + 1)) / a;
        ctx.clearRect(-xf, -yf, size.width + xf * 2, size.height + yf * 2);
    }

    static GetDefaultTransForm() {
        return { ...DEFAULT_TRANSFORM };
    }

    static GetCanvasWorker() {
        if (!CanvasWorker) {
            CanvasWorker = new Worker(new URL("../workers/canvas-worker", import.meta.url), {
                type: "module",
                name: "canvas-worker"
            });
        }
        return CanvasWorker;
    }

    static getCanvasBoundary(
        ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
        { a, e, f }: ICanvasTransform,
        size: Size
    ) {
        const xf = (Math.abs(e) * (a + 1)) / a;
        const yf = (Math.abs(f) * (a + 1)) / a;
        return { x: -xf, y: -yf, w: size.width + xf * 2, h: size.height + yf * 2 };
    }
}

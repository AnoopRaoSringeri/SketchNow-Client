import { Position, Size } from "@/types/canvas";
import {
    ICanvasObjectWithId,
    ICanvasTransform,
    IObjectStyle,
    IObjectValue,
    IToSVGOptions
} from "@/types/custom-canvas";

export const DefaultStyle: IObjectStyle = { fillColor: "transparent", strokeStyle: "#fff", strokeWidth: 1 };
const HOVER_OFFSET = 10;
// const LINE_JOINING_POINTS = 10;
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

    static hoveredElement(mouseCords: Position, elements: ICanvasObjectWithId[], transform: ICanvasTransform) {
        return elements.find((e) => this.isUnderMouse(mouseCords, e.getValues(), transform));
    }

    static applyStyles(ctx: CanvasRenderingContext2D, style: IObjectStyle) {
        ctx.save();
        const { fillColor, strokeStyle, strokeWidth } = style;
        ctx.fillStyle = fillColor;
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = strokeWidth;
    }

    static getHTMLStyle(style: IObjectStyle, { height, width }: IToSVGOptions) {
        return `fill: ${style.fillColor}; stroke: ${style.strokeStyle}; stroke-width: ${style.strokeWidth * Math.max(height, width)}px;`;
    }

    static getMousePosition({ x, y }: Position, { e, f }: ICanvasTransform) {
        return { x, y, ax: x - e, ay: y - f };
    }

    static clearCanvasArea(ctx: CanvasRenderingContext2D, transform: ICanvasTransform) {
        ctx.clearRect(
            -Math.abs(transform.e),
            -Math.abs(transform.f),
            window.innerWidth + Math.abs(transform.e) * 2,
            window.innerHeight + Math.abs(transform.f) * 2
        );
    }
}

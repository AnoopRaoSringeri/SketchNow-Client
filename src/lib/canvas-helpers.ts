import { Position, Size } from "@/types/canvas";
import { ICanvasObjectWithId, IObjectStyle, IObjectValue, IToSVGOptions } from "@/types/custom-canvas";

export const DefaultStyle: IObjectStyle = { fillColor: "transparent", strokeStyle: "#fff", strokeWidth: 1 };
const HOVER_OFFSET = 5;
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

    static isUnderMouse(mousePosition: Position, values: Partial<IObjectValue>) {
        const { x, y } = mousePosition;
        const { x: cx = 0, y: cy = 0, h = 0, w = 0, r = 0, points = [], style = DefaultStyle } = values;
        const { strokeWidth } = style;
        const wFactor = strokeWidth / 2;
        const ucx = cx - wFactor;
        const ucy = cy - wFactor;
        const uh = h + wFactor * 2;
        const uw = w + wFactor * 2;
        const ur = r + wFactor;
        return (
            (x >= ucx && x <= ucx + uw && y >= ucy && y <= ucy + uh) ||
            (x >= cx - ur && y >= cy - ur && x <= cx + ur && y <= cy + ur) ||
            points.find(
                ([px, py]) =>
                    px - (HOVER_OFFSET + wFactor) <= x &&
                    x <= px + HOVER_OFFSET + wFactor &&
                    py - (HOVER_OFFSET + wFactor) <= y &&
                    y <= py + HOVER_OFFSET + wFactor
            ) != null
        );
    }

    static hoveredElement(mouseCords: Position, elements: ICanvasObjectWithId[]) {
        return elements.find((e) => this.isUnderMouse(mouseCords, e.getValues()));
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
}

import { v4 as uuid } from "uuid";

import { CanvasHelper, DefaultStyle } from "@/lib/canvas-helpers";
import { Position, Size } from "@/types/canvas";
import {
    ElementEnum,
    ICanvasObject,
    ICanvasObjectWithId,
    IObjectStyle,
    IObjectValue,
    IToSVGOptions,
    MouseAction,
    PartialCanvasObject
} from "@/types/custom-canvas";

import { CanvasBoard } from "../canvas-board";

export class Pencil implements ICanvasObjectWithId {
    readonly _parent: CanvasBoard;

    type: ElementEnum = ElementEnum.Pencil;
    id = uuid();
    style = DefaultStyle;
    constructor(v: PartialCanvasObject, parent: CanvasBoard) {
        this.points = [...(v.points ?? [])];
        this.id = v.id;
        this.style = { ...(v.style ?? DefaultStyle) };
        this._parent = parent;
    }
    points: [number, number][] = [];
    private _isSelected = false;

    get IsSelected() {
        return this._isSelected;
    }

    draw(ctx: CanvasRenderingContext2D) {
        CanvasHelper.applyStyles(ctx, this.style);
        ctx.beginPath();
        if (this.points.length > 0) {
            this.points.forEach((p, i) => {
                const [x, y] = p;
                if (i == 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });
        }
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    }

    create(ctx: CanvasRenderingContext2D) {
        CanvasHelper.applyStyles(ctx, this.style);
        ctx.beginPath();
        const [x, y] = this.points[0];
        ctx.moveTo(x, y);
        ctx.stroke();
    }

    update(ctx: CanvasRenderingContext2D, objectValue: Partial<IObjectValue>, clearCanvas = true) {
        if (clearCanvas) {
            ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        }
        const { points = this.points } = objectValue;
        ctx.beginPath();
        if (this.points.length > 0) {
            this.points.forEach((p, i) => {
                const [px, py] = p;
                if (i == 0) {
                    ctx.moveTo(px, py);
                } else {
                    ctx.lineTo(px, py);
                }
            });
            ctx.stroke();
        }
        ctx.closePath();
        this.points = points;
    }

    move(ctx: CanvasRenderingContext2D, position: Position, action: MouseAction) {
        const { x, y } = position;
        if (action == "down") {
            CanvasHelper.applyStyles(ctx, this.style);
        }
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        ctx.beginPath();
        if (this.points.length > 0) {
            this.points.forEach((p, i) => {
                const [px, py] = p;
                const offsetX = x + px;
                const offsetY = y + py;
                if (i == 0) {
                    ctx.moveTo(offsetX, offsetY);
                } else {
                    ctx.lineTo(offsetX, offsetY);
                }
            });
            ctx.stroke();
        }
        if (action == "up") {
            ctx.closePath();
            ctx.restore();
            this.points = this.points.map((p) => {
                const [px, py] = p;
                const offsetX = x + px;
                const offsetY = y + py;
                return [offsetX, offsetY];
            });
        }
    }

    updateStyle<T extends keyof IObjectStyle>(ctx: CanvasRenderingContext2D, key: T, value: IObjectStyle[T]) {
        this.style[key] = value;
        this.draw(ctx);
    }

    toSVG({ height, width }: IToSVGOptions) {
        let s = "";
        if (this.points.length > 0) {
            const [ix, iy] = this.points[0];
            const d: string[] = [`M ${ix * width} ${iy * height}`];
            s = d
                .concat(
                    this.points.slice(1).map((p) => {
                        const [x, y] = p;
                        return `L ${x * width} ${y * height}`;
                    })
                )
                .join(" ");
        }
        return `<path d="${s}" style="${CanvasHelper.getHTMLStyle(this.style, { height, width })}" />`;
    }

    getValues() {
        return {
            type: this.type,
            id: this.id,
            points: this.points,
            style: this.style
        };
    }

    delete() {}
    onSelect() {}
    set<T extends keyof ICanvasObject>(key: T, value: ICanvasObject[T]) {
        console.log(key, value);
    }
    resize(size: Size) {
        console.log(size);
    }
}

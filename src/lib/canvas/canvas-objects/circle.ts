import { v4 as uuid } from "uuid";

import { CanvasHelper, DefaultStyle } from "@/lib/canvas-helpers";
import { Delta, Position } from "@/types/canvas";
import {
    CursorPosition,
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
export class Circle implements ICanvasObjectWithId {
    readonly _parent: CanvasBoard;
    type: ElementEnum = ElementEnum.Circle;
    id = uuid();
    style = DefaultStyle;
    constructor(v: PartialCanvasObject, parent: CanvasBoard) {
        this._parent = parent;
        this.x = v.x ?? 0;
        this.y = v.y ?? 0;
        this.w = v.w ?? 0;
        this.h = v.h ?? 0;
        this.ro = v.ro ?? 0;
        this.sa = v.sa ?? 0;
        this.ea = v.ea ?? 2 * Math.PI;
        this.id = v.id;
        this.style = { ...(v.style ?? DefaultStyle) };
    }
    x = 0;
    y = 0;
    w = 0;
    h = 0;
    sa = 0;
    ro = 0;
    ea = 2 * Math.PI;
    private _isSelected = false;

    get IsSelected() {
        return this._isSelected;
    }

    draw(ctx: CanvasRenderingContext2D) {
        this.create(ctx);
        if (this.IsSelected) {
            this.select({ x: this.x, y: this.y });
        }
    }

    create(ctx: CanvasRenderingContext2D) {
        CanvasHelper.applyStyles(ctx, this.style);
        ctx.beginPath();
        const { x: ax, y: ay, h: rY, w: rX } = CanvasHelper.getBoundingArea(this.type, this.getValues());
        ctx.ellipse(ax, ay, rX, rY, this.ro, this.sa, this.ea);
        ctx.stroke();
    }

    select({ x = this.x, y = this.y, w = this.w, h = this.h }: Partial<IObjectValue>) {
        this._isSelected = true;
        if (this._parent.CanvasCopy) {
            const copyCtx = this._parent.CanvasCopy.getContext("2d");
            if (copyCtx) {
                CanvasHelper.applySelection(copyCtx, { height: h, width: w, x, y });
            }
        }
    }

    unSelect() {
        this._isSelected = false;
    }

    getPosition() {
        return CanvasHelper.getAbsolutePosition({ x: this.x, y: this.y }, this._parent.Transform);
    }

    update(ctx: CanvasRenderingContext2D, objectValue: Partial<IObjectValue>, action: MouseAction, clearCanvas = true) {
        CanvasHelper.applyStyles(ctx, this.style);
        let { h = this.h, w = this.w, x = this.x, y = this.y } = objectValue;
        if (clearCanvas) {
            CanvasHelper.clearCanvasArea(ctx, this._parent.Transform);
        }
        ctx.beginPath();
        if (h < 0) {
            y = y + h;
            h = Math.abs(h);
        }
        if (w < 0) {
            x = x + w;
            w = Math.abs(w);
        }
        const { x: ax, y: ay, h: rY, w: rX } = CanvasHelper.getBoundingArea(this.type, { x, y, h, w });
        ctx.ellipse(ax, ay, rX, rY, this.ro, this.sa, this.ea);
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
        if (action === "up") {
            this.h = h;
            this.w = w;
            this.x = x;
            this.y = y;
        }
    }

    updateStyle<T extends keyof IObjectStyle>(ctx: CanvasRenderingContext2D, key: T, value: IObjectStyle[T]) {
        this.style[key] = value;
        CanvasHelper.applyStyles(ctx, this.style);
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        ctx.beginPath();
        const { x: ax, y: ay, h: rY, w: rX } = CanvasHelper.getBoundingArea(this.type, this.getValues());
        ctx.ellipse(ax, ay, rX, rY, this.ro, this.sa, this.ea);
        ctx.stroke();
        ctx.fill();
    }

    move(ctx: CanvasRenderingContext2D, position: Position, action: MouseAction) {
        const { x, y } = position;
        if (action == "down") {
            CanvasHelper.applyStyles(ctx, this.style);
        }
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        const offsetX = x + this.x;
        const offsetY = y + this.y;
        ctx.beginPath();
        const {
            x: ax,
            y: ay,
            h: rY,
            w: rX
        } = CanvasHelper.getBoundingArea(this.type, { h: this.h, w: this.w, x: offsetX, y: offsetY });
        ctx.ellipse(ax, ay, rX, rY, this.ro, this.sa, this.ea);
        ctx.stroke();
        ctx.fill();
        this.select({ x: offsetX, y: offsetY });
        if (action == "up") {
            ctx.closePath();
            ctx.restore();
            this.x = offsetX;
            this.y = offsetY;
        }
    }

    toSVG(options: IToSVGOptions) {
        const rX = this.w - this.x;
        const rY = this.h - this.y;
        return `<ellipse rx="${rX * options.width}" ry="${rY * options.height}" cx="${this.x * options.width}" cy="${this.y * options.height}" style="${CanvasHelper.getHTMLStyle(this.style, options)}" />`;
    }

    getValues() {
        return {
            type: this.type,
            id: this.id,
            h: this.h,
            w: this.w,
            ro: this.ro,
            sa: this.sa,
            ea: this.ea,
            x: this.x,
            y: this.y,
            style: this.style
        };
    }

    delete() {}
    onSelect() {}
    set<T extends keyof ICanvasObject>(key: T, value: ICanvasObject[T]) {
        console.log(key, value);
    }
    resize(ctx: CanvasRenderingContext2D, delta: Delta, cPos: CursorPosition, action: MouseAction) {
        const { dx, dy } = delta;
        if (action == "down") {
            CanvasHelper.applyStyles(ctx, this.style);
        }
        CanvasHelper.clearCanvasArea(ctx, this._parent.Transform);
        let w = dx;
        let h = dy;
        let y = this.y;
        let x = this.x;
        switch (cPos) {
            case "tl":
                x = x + w;
                y = y + h;
                if (h < 0) {
                    h = Math.abs(Math.abs(h) + this.h);
                } else {
                    h = Math.abs(this.h - Math.abs(h));
                }
                if (w < 0) {
                    w = Math.abs(Math.abs(w) + this.w);
                } else {
                    w = Math.abs(this.w - Math.abs(w));
                }
                break;
            case "tr":
                y = y + h;
                if (h < 0) {
                    h = Math.abs(this.h + Math.abs(h));
                } else {
                    h = Math.abs(Math.abs(h) - this.h);
                }
                if (w < 0) {
                    w = this.w + w;
                } else {
                    w = Math.abs(this.w + Math.abs(w));
                }
                break;
            case "bl":
                x = x + w;
                if (h < 0) {
                    h = this.h - Math.abs(h);
                } else {
                    h = Math.abs(Math.abs(h) + this.h);
                }
                if (w < 0) {
                    w = Math.abs(this.w + Math.abs(w));
                } else {
                    w = Math.abs(this.w - Math.abs(w));
                }
                break;
            case "br":
                if (h < 0) {
                    h = h + this.h;
                } else {
                    h = Math.abs(this.h + Math.abs(h));
                }
                if (w < 0) {
                    w = this.w + w;
                } else {
                    w = Math.abs(this.w + Math.abs(w));
                }
                break;
            case "t":
                break;
            case "b":
                break;
            case "l":
                break;
            case "r":
                break;
        }
        if (x >= this.x + this.w) {
            x = this.x + this.w;
        }
        if (y >= this.y + this.h) {
            y = this.y + this.h;
        }
        if (h < 0) {
            y = y + h;
            h = Math.abs(h);
        }
        if (w < 0) {
            x = x + w;
            w = Math.abs(w);
        }
        const { x: ax, y: ay, h: rY, w: rX } = CanvasHelper.getBoundingArea(this.type, { x, y, h, w });
        ctx.beginPath();
        ctx.ellipse(ax, ay, rX, rY, this.ro, this.sa, this.ea);
        ctx.stroke();
        this.select({ h, w, x, y });
        if (action == "up") {
            this.h = h;
            this.w = w;
            this.x = x;
            this.y = y;
        }
    }
}

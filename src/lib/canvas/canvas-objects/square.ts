import { v4 as uuid } from "uuid";

import { CanvasHelper, DefaultStyle, GUTTER } from "@/lib/canvas-helpers";
import { Delta, Position } from "@/types/canvas";
import {
    CursorPosition,
    ElementEnum,
    ICanvasObjectWithId,
    IObjectStyle,
    IObjectValue,
    IToSVGOptions,
    MouseAction,
    PartialCanvasObject
} from "@/types/custom-canvas";

import { CanvasBoard } from "../canvas-board";

export class Square implements ICanvasObjectWithId {
    readonly _parent: CanvasBoard;
    type: ElementEnum = ElementEnum.Square;
    id = uuid();
    style = DefaultStyle;
    constructor({ x, y, h, id, style }: PartialCanvasObject, parent: CanvasBoard) {
        this.x = x ?? 0;
        this.y = y ?? 0;
        this.h = h ?? 0;
        this.id = id;
        this.style = { ...(style ?? DefaultStyle) };
        this._parent = parent;
    }
    x = 0;
    y = 0;
    h = 0;
    private _isSelected = false;

    get IsSelected() {
        return this._isSelected;
    }

    select({ x = this.x, y = this.y }: Partial<IObjectValue>) {
        this._isSelected = true;
        if (this._parent.CanvasCopy) {
            const copyCtx = this._parent.CanvasCopy.getContext("2d");
            if (copyCtx) {
                copyCtx.save();
                copyCtx.strokeStyle = "#00ffff";
                copyCtx.fillStyle = "#00ffff";
                copyCtx.lineWidth = 1;
                copyCtx.strokeRect(x - GUTTER, y - GUTTER, this.h + GUTTER * 2, this.h + GUTTER * 2);

                copyCtx.beginPath();
                copyCtx.moveTo(x, y);
                copyCtx.arc(x, y, 4, 0, 2 * Math.PI);
                copyCtx.stroke();
                copyCtx.fill();

                copyCtx.beginPath();
                copyCtx.moveTo(x, y + this.h);
                copyCtx.arc(x, y + this.h, 4, 0, 2 * Math.PI);
                copyCtx.stroke();
                copyCtx.fill();

                copyCtx.beginPath();
                copyCtx.moveTo(x + this.h, y);
                copyCtx.arc(x + this.h, y, 4, 0, 2 * Math.PI);
                copyCtx.stroke();
                copyCtx.fill();

                copyCtx.beginPath();
                copyCtx.moveTo(x + this.h, y + this.h);
                copyCtx.arc(x + this.h, y + this.h, 4, 0, 2 * Math.PI);
                copyCtx.stroke();
                copyCtx.fill();

                copyCtx.closePath();
                copyCtx.restore();
            }
        }
    }

    unSelect() {
        this._isSelected = false;
    }

    draw(ctx: CanvasRenderingContext2D) {
        this.create(ctx);
        if (this.IsSelected) {
            this.select({ x: this.x, y: this.y });
        }
    }

    create(ctx: CanvasRenderingContext2D) {
        CanvasHelper.applyStyles(ctx, this.style);
        ctx.strokeRect(this.x, this.y, this.h, this.h);
        ctx.fillRect(this.x, this.y, this.h, this.h);
    }

    update(ctx: CanvasRenderingContext2D, objectValue: Partial<IObjectValue>, action: MouseAction, clearCanvas = true) {
        const { h = this.h, w = this.h } = objectValue;
        const side = Math.min(h, w);
        CanvasHelper.applyStyles(ctx, this.style);
        if (clearCanvas) {
            ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        }
        ctx.strokeRect(this.x, this.y, side, side);
        ctx.fillRect(this.x, this.y, side, side);
        this.h = side;
    }

    updateStyle<T extends keyof IObjectStyle>(ctx: CanvasRenderingContext2D, key: T, value: IObjectStyle[T]) {
        this.style[key] = value;
        CanvasHelper.applyStyles(ctx, this.style);
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        ctx.strokeRect(this.x, this.y, this.h, this.h);
        ctx.fillRect(this.x, this.y, this.h, this.h);
    }

    move(ctx: CanvasRenderingContext2D, position: Position, action: MouseAction) {
        const { x, y } = position;
        if (action == "down") {
            CanvasHelper.applyStyles(ctx, this.style);
        }
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        const offsetX = x + this.x;
        const offsetY = y + this.y;
        ctx.strokeRect(offsetX, offsetY, this.h, this.h);
        ctx.fillRect(offsetX, offsetY, this.h, this.h);
        this.select({ x: offsetX, y: offsetY });
        if (action == "up") {
            this.x = offsetX;
            this.y = offsetY;
        }
    }

    resize(ctx: CanvasRenderingContext2D, delta: Delta, cPos: CursorPosition, action: MouseAction) {
        const { dx, dy } = delta;
        console.log(dx, dy);
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
                    w = Math.abs(Math.abs(w) + this.h);
                } else {
                    w = Math.abs(this.h - Math.abs(w));
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
                    w = this.h + w;
                } else {
                    w = Math.abs(this.h + Math.abs(w));
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
                    w = Math.abs(this.h + Math.abs(w));
                } else {
                    w = Math.abs(this.h - Math.abs(w));
                }
                break;
            case "br":
                if (h < 0) {
                    h = h + this.h;
                } else {
                    h = Math.abs(this.h + Math.abs(h));
                }
                if (w < 0) {
                    w = this.h + w;
                } else {
                    w = Math.abs(this.h + Math.abs(w));
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
        if (x >= this.x + this.h) {
            x = this.x + this.h;
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
        ctx.strokeRect(x, y, w, h);
        ctx.fillRect(x, y, w, h);
        this.select({ h, w, x, y });
        if (action == "up") {
            this.h = h;
            this.h = w;
            this.x = x;
            this.y = y;
        }
    }

    getValues() {
        return {
            type: this.type,
            id: this.id,
            h: this.h,
            x: this.x,
            y: this.y,
            style: this.style
        };
    }

    getPosition() {
        return CanvasHelper.getAbsolutePosition({ x: this.x, y: this.y }, this._parent.Transform);
    }

    toSVG(options: IToSVGOptions) {
        const side = Math.max(this.h * options.width, this.h * options.height);
        return `<rect width="${side}" height="${side}" x="${this.x * options.width}" y="${this.y * options.height}" style="${CanvasHelper.getHTMLStyle(this.style, options)}" />`;
    }
}

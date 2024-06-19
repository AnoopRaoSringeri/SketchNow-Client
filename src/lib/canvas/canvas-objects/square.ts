import { v4 as uuid } from "uuid";

import { CanvasHelper, DefaultStyle, GUTTER } from "@/lib/canvas-helpers";
import { Position, Size } from "@/types/canvas";
import {
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

    select({ x, y }: Position) {
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

    update(ctx: CanvasRenderingContext2D, objectValue: Partial<IObjectValue>, clearCanvas = true) {
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

    resize(size: Size) {
        console.log(size);
    }

    toSVG(options: IToSVGOptions) {
        const side = Math.max(this.h * options.width, this.h * options.height);
        return `<rect width="${side}" height="${side}" x="${this.x * options.width}" y="${this.y * options.height}" style="${CanvasHelper.getHTMLStyle(this.style, options)}" />`;
    }
}

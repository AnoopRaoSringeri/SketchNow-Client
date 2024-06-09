import { v4 as uuid } from "uuid";

import { CanvasHelper, DefaultStyle } from "@/lib/canvas-helpers";
import { Position, Size } from "@/types/canvas";
import {
    ElementEnum,
    ICanvasObject,
    ICanvasObjectWithId,
    IObjectStyle,
    IObjectValue,
    IObjectValueWithId,
    IToSVGOptions,
    MouseAction
} from "@/types/custom-canvas";

export class Square implements ICanvasObjectWithId {
    type: ElementEnum = ElementEnum.Square;
    id = uuid();
    style = DefaultStyle;
    constructor({ x, y, h, id, style }: IObjectValueWithId) {
        this.x = x ?? 0;
        this.y = y ?? 0;
        this.h = h ?? 0;
        this.id = id;
        this.style = style ?? DefaultStyle;
    }
    x = 0;
    y = 0;
    h = 0;
    private _isSelected = false;

    get IsSelected() {
        return this._isSelected;
    }

    draw(ctx: CanvasRenderingContext2D) {
        this.create(ctx);
    }

    create(ctx: CanvasRenderingContext2D) {
        CanvasHelper.applyStyles(ctx, this.style);
        ctx.strokeRect(this.x, this.y, this.h, this.h);
        ctx.fillRect(this.x, this.y, this.h, this.h);
    }

    update(ctx: CanvasRenderingContext2D, objectValue: Partial<IObjectValue>) {
        const { h = 0, w = 0 } = objectValue;
        const side = Math.min(h, w);
        CanvasHelper.applyStyles(ctx, this.style);
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
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
        if (action == "up") {
            this.x = offsetX;
            this.y = offsetY;
        }
    }

    getValues() {
        return {
            h: this.h,
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

    resize(size: Size) {
        console.log(size);
    }

    toSVG(options: IToSVGOptions) {
        const side = Math.max(this.h * options.width, this.h * options.height);
        return `<rect width="${side}" height="${side}" x="${this.x * options.width}" y="${this.y * options.height}" style="${CanvasHelper.getHTMLStyle(this.style, options)}" />`;
    }
}

import { v4 as uuid } from "uuid";

import { CanvasHelper, DefaultStyle } from "@/lib/canvas-helpers";
import { Position, Size } from "@/types/canvas";
import {
    ElementEnum,
    ICanvasObject,
    ICanvasObjectWithId,
    IObjectValue,
    IObjectValueWithId,
    IToSVGOptions,
    MouseAction
} from "@/types/custom-canvas";
export class Circle implements ICanvasObjectWithId {
    type: ElementEnum = ElementEnum.Circle;
    id = uuid();
    style = DefaultStyle;
    constructor(v: IObjectValueWithId) {
        this.x = v.x ?? 0;
        this.y = v.y ?? 0;
        this.r = v.r ?? 0;
        this.sa = v.sa ?? 0;
        this.ea = v.ea ?? 2 * Math.PI;
        this.id = v.id;
        this.style = v.style ?? DefaultStyle;
    }
    x = 0;
    y = 0;
    r = 0;
    sa = 0;
    ea = 2 * Math.PI;

    draw(ctx: CanvasRenderingContext2D) {
        this.create(ctx);
        ctx.restore();
    }

    create(ctx: CanvasRenderingContext2D) {
        CanvasHelper.applyStyles(ctx, this.style);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, this.sa, this.ea);
        ctx.stroke();
        ctx.closePath();
    }

    update(ctx: CanvasRenderingContext2D, objectValue: Partial<IObjectValue>) {
        const { r = 0 } = objectValue;
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        ctx.beginPath();
        ctx.arc(this.x, this.y, r, this.sa, this.ea);
        ctx.stroke();
        this.r = r;
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
        ctx.arc(offsetX, offsetY, this.r, this.sa, this.ea);
        ctx.stroke();
        if (action == "up") {
            ctx.closePath();
            ctx.restore();
            this.x = offsetX;
            this.y = offsetY;
        }
    }

    toSVG(options: IToSVGOptions) {
        return `<circle r="${this.r * Math.max(options.width, options.height)}" cx="${this.x * options.width}" cy="${this.y * options.height}" style="${CanvasHelper.getHTMLStyle(this.style, options)}" />`;
    }

    getValues() {
        return {
            r: this.r,
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
    resize(size: Size) {
        console.log(size);
    }
}

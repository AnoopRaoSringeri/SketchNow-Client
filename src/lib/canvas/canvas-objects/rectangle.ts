import { action, makeObservable, observable } from "mobx";
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

export class Rectangle implements ICanvasObjectWithId {
    type: ElementEnum = ElementEnum.Rectangle;
    id = uuid();
    style = DefaultStyle;
    constructor({ x, y, h, w, id, style }: IObjectValueWithId) {
        this.x = x ?? 0;
        this.y = y ?? 0;
        this.h = h ?? 0;
        this.w = w ?? 0;
        this.id = id;
        this.style = style ?? DefaultStyle;
        makeObservable(this, {
            style: observable,
            updateStyle: action
        });
    }
    x = 0;
    y = 0;
    h = 0;
    w = 0;
    private _isSelected = false;

    get IsSelected() {
        return this._isSelected;
    }

    get Style() {
        return this.style;
    }

    select() {
        this._isSelected = true;
    }

    draw(ctx: CanvasRenderingContext2D) {
        this.create(ctx);
    }

    create(ctx: CanvasRenderingContext2D) {
        CanvasHelper.applyStyles(ctx, this.style);
        ctx.strokeRect(this.x, this.y, this.w, this.h);
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }

    update(ctx: CanvasRenderingContext2D, objectValue: Partial<IObjectValue>) {
        const { h = 0, w = 0 } = objectValue;
        CanvasHelper.applyStyles(ctx, this.style);
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        ctx.strokeRect(this.x, this.y, this.w, this.h);
        ctx.fillRect(this.x, this.y, this.w, this.h);
        this.h = h;
        this.w = w;
    }

    updateStyle<T extends keyof IObjectStyle>(ctx: CanvasRenderingContext2D, key: T, value: IObjectStyle[T]) {
        this.style[key] = value;
        CanvasHelper.applyStyles(ctx, this.style);
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        ctx.strokeRect(this.x, this.y, this.w, this.h);
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }

    move(ctx: CanvasRenderingContext2D, position: Position, action: MouseAction) {
        const { x, y } = position;
        if (action == "down") {
            CanvasHelper.applyStyles(ctx, this.style);
        }
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        const offsetX = x + this.x;
        const offsetY = y + this.y;
        ctx.strokeRect(offsetX, offsetY, this.w, this.h);
        ctx.fillRect(offsetX, offsetY, this.w, this.h);
        if (action == "up") {
            this.x = offsetX;
            this.y = offsetY;
        }
    }

    getValues() {
        return {
            h: this.h,
            w: this.w,
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
        return `<rect width="${this.w * options.width}" height="${this.h * options.height}" x="${this.x * options.width}" y="${this.y * options.height}" style="${CanvasHelper.getHTMLStyle(this.style, options)}" />`;
    }
}

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

export class Line implements ICanvasObjectWithId {
    type: ElementEnum = ElementEnum.Line;
    id = uuid();
    style = DefaultStyle;
    constructor(v: IObjectValueWithId) {
        this.x = v.x ?? 0;
        this.y = v.y ?? 0;
        this.points = [...(v.points ?? [])];
        this.id = v.id;
        this.style = { ...(v.style ?? DefaultStyle) };
    }
    points: [number, number][] = [];
    x = 0;
    y = 0;
    private _isSelected = false;

    get IsSelected() {
        return this._isSelected;
    }

    draw(ctx: CanvasRenderingContext2D) {
        CanvasHelper.applyStyles(ctx, this.style);
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        if (this.points.length > 0) {
            const [x, y] = this.points[0];
            ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    }

    create(ctx: CanvasRenderingContext2D) {
        CanvasHelper.applyStyles(ctx, this.style);
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
    }

    update(ctx: CanvasRenderingContext2D, objectValue: Partial<IObjectValue>) {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        const { points = [] } = objectValue;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        if (points.length > 0) {
            const [x, y] = points[0];
            ctx.lineTo(x, y);
            ctx.stroke();
            this.points = points;
        }
    }

    updateStyle<T extends keyof IObjectStyle>(ctx: CanvasRenderingContext2D, key: T, value: IObjectStyle[T]) {
        this.style[key] = value;
        CanvasHelper.applyStyles(ctx, this.style);
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        this.draw(ctx);
    }

    move(ctx: CanvasRenderingContext2D, position: Position, action: MouseAction) {
        const { x, y } = position;
        if (action == "down") {
            CanvasHelper.applyStyles(ctx, this.style);
        }
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        ctx.beginPath();
        if (this.points.length > 0) {
            const [px, py] = this.points[0];
            const offsetX = x + this.x;
            const offsetY = y + this.y;
            const offsetPX = x + px;
            const offsetPY = y + py;
            ctx.moveTo(offsetX, offsetY);
            ctx.lineTo(offsetPX, offsetPY);
            ctx.stroke();
        }
        if (action == "up") {
            ctx.closePath();
            ctx.restore();
            this.x = x + this.x;
            this.y = y + this.y;
            this.points = this.points.map((p) => {
                const [px, py] = p;
                const offsetX = x + px;
                const offsetY = y + py;
                return [offsetX, offsetY];
            });
        }
    }

    toSVG({ height, width }: IToSVGOptions) {
        let s = "";
        if (this.points.length > 0) {
            const [ix, iy] = this.points[0];
            s = `M ${this.x * width} ${this.y * height} L ${ix * width} ${iy * height}`;
        }
        return `<path d="${s}" style="${CanvasHelper.getHTMLStyle(this.style, { height, width })}" />`;
    }

    getValues() {
        return {
            points: this.points,
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

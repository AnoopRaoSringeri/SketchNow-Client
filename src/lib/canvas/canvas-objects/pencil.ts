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

export class Pencil implements ICanvasObjectWithId {
    type: ElementEnum = ElementEnum.Pencil;
    id = uuid();
    style = DefaultStyle;
    constructor(v: IObjectValueWithId) {
        this.points = v.points ?? [];
        this.id = v.id;
        this.style = v.style ?? DefaultStyle;
    }
    points: [number, number][] = [];

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

    update(ctx: CanvasRenderingContext2D, objectValue: Partial<IObjectValue>) {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        const { points = [] } = objectValue;
        if (points.length > 0) {
            const [prevX, prevY] = this.points[this.points.length - 1];
            const [x, y] = points[0];
            ctx.lineTo(x, y);
            ctx.stroke();
            if (prevX != x || prevY != y) {
                this.points.push([x, y]);
            }
        }
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

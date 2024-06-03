import { Position, Size } from "@/types/canvas";
import { ElementEnum, ICanvasObject, IObjectValue, IToSVGOptions } from "@/types/custom-canvas";

export class Pencil implements Partial<ICanvasObject> {
    type: ElementEnum = ElementEnum.Pencil;
    constructor(v: Partial<IObjectValue>) {
        this.points = v.points ?? [];
    }
    points: [number, number][] = [];

    draw(ctx: CanvasRenderingContext2D) {
        ctx.restore();
        ctx.strokeStyle = "#fff";
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
        ctx.save();
    }

    create(ctx: CanvasRenderingContext2D) {
        ctx.restore();
        ctx.strokeStyle = "#fff";
        ctx.beginPath();
        const [x, y] = this.points[0];
        ctx.moveTo(x, y);
        ctx.stroke();
    }

    update(ctx: CanvasRenderingContext2D, objectValue: Partial<IObjectValue>) {
        const { points = [] } = objectValue;
        if (points.length > 0) {
            const [x, y] = points[0];
            ctx.lineTo(x, y);
            ctx.stroke();
            const [prevX, prevY] = this.points[this.points.length - 1];
            if (prevX != x || prevY != y) {
                this.points.push([x, y]);
            }
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
        return `<path d="${s}" class="fill-transparent stroke-white"/>`;
    }
    delete() {}
    onSelect() {}
    set<T extends keyof ICanvasObject>(key: T, value: ICanvasObject[T]) {
        console.log(key, value);
    }
    move(position: Position) {
        console.log(position);
    }
    resize(size: Size) {
        console.log(size);
    }
}

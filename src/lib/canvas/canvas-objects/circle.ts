import { Position, Size } from "@/types/canvas";
import { ElementEnum, ICanvasObject, IObjectValue, IToSVGOptions } from "@/types/custom-canvas";

export class Circle implements Partial<ICanvasObject> {
    type: ElementEnum = ElementEnum.Circle;
    constructor(v: Partial<IObjectValue>) {
        this.x = v.x ?? 0;
        this.y = v.y ?? 0;
        this.r = v.r ?? 0;
        this.sa = v.sa ?? 0;
        this.ea = v.ea ?? 2 * Math.PI;
    }
    x = 0;
    y = 0;
    r = 0;
    sa = 0;
    ea = 0;

    draw(ctx: CanvasRenderingContext2D) {
        this.create(ctx);
        ctx.save();
    }

    create(ctx: CanvasRenderingContext2D) {
        ctx.restore();
        ctx.strokeStyle = "#fff";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, this.sa, this.ea);
        ctx.stroke();
    }

    update(ctx: CanvasRenderingContext2D, objectValue: Partial<IObjectValue>) {
        const { r = 0 } = objectValue;
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        ctx.beginPath();
        ctx.arc(this.x, this.y, r, this.sa, this.ea);
        ctx.stroke();
        this.r = r;
    }

    toSVG(options: IToSVGOptions) {
        return `<circle r="${this.r * Math.max(options.width, options.height)}" cx="${this.x * options.width}" cy="${this.y * options.height}" class="fill-transparent stroke-white" />`;
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

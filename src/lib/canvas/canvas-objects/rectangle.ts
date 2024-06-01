import { ElementSize, Position } from "@/types/canvas";
import { ICanvasObject } from "@/types/custom-canvas";

export class Rectangle implements ICanvasObject {
    constructor({ x, y, height, width }: Position & ElementSize) {
        this.x = x;
        this.y = y;
        this.h = height;
        this.w = width;
    }
    x = 0;
    y = 0;
    h = 0;
    w = 0;
    create() {}
    delete() {}
    update() {}
    onSelect() {}
    get() {
        return this;
    }
    set<T extends keyof ICanvasObject>(key: T, value: ICanvasObject[T]) {
        console.log(key, value);
    }
    move(position: Position) {
        console.log(position);
    }
    resize(size: ElementSize) {
        console.log(size);
    }
}

import { ElementSize, Position } from "@/types/canvas";
import { ICanvas, ICanvasObject } from "@/types/custom-canvas";

export class CanvasBoard implements ICanvas {
    private _canvas: React.RefObject<HTMLCanvasElement>;
    constructor(ref: React.RefObject<HTMLCanvasElement>) {
        this._canvas = ref;
    }
    get Elements() {
        return [];
    }
    get Canvas() {
        return this._canvas.current;
    }
    get CanvasRef() {
        return this._canvas;
    }
}

import { computed, makeObservable, observable } from "mobx";
import { createRef } from "react";

import { AdditionalCanvasOptions, CanvasMetadata, Position, Size } from "@/types/canvas";
import { ElementEnum, ICanvas, ICanvasObject, IToSVGOptions } from "@/types/custom-canvas";

import { CanvasHelper } from "../canvas-helpers";
import { CavasObjectMap } from "./canvas-objects/object-mapping";

export class CanvasBoard implements ICanvas {
    private _canvas: React.RefObject<HTMLCanvasElement>;
    private _canvasCopy: React.RefObject<HTMLCanvasElement>;
    private _elements: ICanvasObject[] = [];
    private _pointerOrigin: Position | null = null;
    private _activeObjects: ICanvasObject[] = [];
    private _zoom = 100;
    private _readOnly: boolean = false;
    _elementType: ElementEnum = ElementEnum.Move;

    constructor() {
        this._canvas = createRef();
        this._canvasCopy = createRef();
        makeObservable(this, {
            _elementType: observable,
            ElementType: computed
        });
    }

    get Elements() {
        return this._elements;
    }

    get Canvas() {
        if (!this._canvas.current) {
            throw new Error("canvas is not initialized");
        }
        return this._canvas.current!;
    }

    get CanvasCopy() {
        if (this.ReadOnly) {
            return null;
        }
        // if (!this._canvasCopy.current) {
        //     throw new Error("canvas copy is not initialized");
        // }
        return this._canvasCopy.current!;
    }

    get CanvasRef() {
        return this._canvas;
    }

    get CanvasCopyRef() {
        return this._canvasCopy;
    }

    get ElementType() {
        return this._elementType;
    }

    get Height() {
        return this.Canvas.height;
    }

    get Width() {
        return this.Canvas.width;
    }

    get ReadOnly() {
        return this._readOnly;
    }

    get Zoom() {
        return this._zoom;
    }

    set ElementType(type: ElementEnum) {
        this._elementType = type;
    }

    set Height(height: number) {
        this.Canvas.height = height;
    }

    set Width(width: number) {
        this.Canvas.width = width;
    }

    set ReadOnly(value: boolean) {
        this._readOnly = value;
    }

    set Zoom(zoom: number) {
        this._zoom = zoom;
    }

    init({ width, height }: Size) {
        if (!this.CanvasCopy) {
            return;
        }
        this.Canvas.width = this.CanvasCopy.width = width;
        this.Canvas.height = this.CanvasCopy.height = height;
        console.log(window.innerHeight, window.innerWidth);
    }

    onMouseDown(e: MouseEvent) {
        if (!this.CanvasCopy) {
            return;
        }
        const context = this.CanvasCopy.getContext("2d");
        if (e.target != this.CanvasCopy || !context || this.ElementType == ElementEnum.Move) {
            return;
        }
        const { offsetX, offsetY } = e;
        this._pointerOrigin = { x: offsetX, y: offsetY };
        const newObj = CavasObjectMap[this.ElementType]({
            x: offsetX,
            y: offsetY,
            h: 0,
            w: 0,
            points: [[offsetX, offsetY]]
        });
        newObj.create(context);
        this._activeObjects.push(newObj);
    }

    onMouseMove(e: MouseEvent) {
        if (!this.CanvasCopy) {
            return;
        }
        const context = this.CanvasCopy.getContext("2d");
        if (e.target != this.CanvasCopy || !context || !this._pointerOrigin || this._activeObjects.length == 0) {
            this.saveBoard();
            return;
        }
        const { offsetX, offsetY } = e;
        const { x, y } = this._pointerOrigin;
        const r = Math.max(offsetX - x, offsetY - y);
        this._activeObjects[0].update(context, { w: offsetX - x, h: offsetY - y, r, points: [[offsetX, offsetY]] });
    }

    onMouseUp(e: MouseEvent) {
        if (!this.CanvasCopy) {
            return;
        }
        const context = this.CanvasCopy.getContext("2d");
        if (e.target != this.CanvasCopy || !context || !this._pointerOrigin || this._activeObjects.length == 0) {
            return;
        }
        const { offsetX, offsetY } = e;
        const { x, y } = this._pointerOrigin;
        const r = Math.max(offsetX - x, offsetY - y);
        this._activeObjects[0].update(context, { w: offsetX - x, h: offsetY - y, r });
        console.log(this._activeObjects[0]);
        this.saveBoard();
    }

    loadBoard(metadata: CanvasMetadata, { height, readonly, width, draw }: Partial<AdditionalCanvasOptions>) {
        const context = this.Canvas.getContext("2d");
        if (context) {
            const objArray = metadata.elements.map((ele) => {
                return CavasObjectMap[ele.type](ele);
            });
            this._elements = objArray;
            this.Height = height ?? metadata.size.height;
            this.Width = width ?? metadata.size.width;
            this.ReadOnly = readonly ?? false;
            if (draw) {
                this.redrawBoard();
            }
        }
    }

    drawBoard(elements: ICanvasObject[]) {
        const context = this.Canvas.getContext("2d");
        if (context) {
            const objArray = elements.map((ele) => {
                const newObj = CavasObjectMap[ele.type](ele);
                newObj.draw(context);
                return newObj;
            });
            this._elements = objArray;
        }
    }

    resizeBoard() {
        this.Canvas.width = window.innerWidth;
        this.Canvas.height = window.innerHeight;
        if (this.CanvasCopy) {
            this.CanvasCopy.width = window.innerWidth;
            this.CanvasCopy.height = window.innerHeight;
        }
        this.redrawBoard();
    }

    saveBoard() {
        if (this._activeObjects[0]) {
            this._elements.push(this._activeObjects[0]);
            this._pointerOrigin = null;
            this._activeObjects = [];
            this.redrawBoard();
        }
    }

    redrawBoard() {
        const context = this.Canvas.getContext("2d");
        if (context) {
            context.clearRect(0, 0, window.innerWidth, window.innerHeight);
            this.Elements.forEach((ele) => {
                ele.draw(context);
            });
            context.save();
        }
        if (!this.CanvasCopy) {
            return;
        }
        const contextCopy = this.CanvasCopy.getContext("2d");
        if (contextCopy) {
            contextCopy.clearRect(0, 0, window.innerWidth, window.innerHeight);
        }
    }

    toJSON(): CanvasMetadata {
        console.log(this.Canvas.toDataURL("image/jpeg", 1.0));
        return { elements: [...this.Elements], size: { height: this.Height, width: this.Width } };
    }

    toSVG({ height, width }: IToSVGOptions) {
        let svgString = "";
        const sRatio = CanvasHelper.getSizeRatio({ height, width }, { height: this.Height, width: this.Width });
        this.Elements.forEach((ele) => {
            svgString += ele.toSVG(sRatio);
        });
        return `<svg width="${width}" height="${height}" xmlns="http://sketch-now/svg">${svgString}</svg>`;
    }
}

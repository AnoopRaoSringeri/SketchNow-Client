import { action, computed, makeObservable, observable, toJS } from "mobx";
import { createRef } from "react";
import { v4 as uuid } from "uuid";

import { AdditionalCanvasOptions, CanvasMetadata, Position, Size } from "@/types/canvas";
import { ElementEnum, ICanvas, ICanvasObjectWithId, IObjectStyle, IToSVGOptions } from "@/types/custom-canvas";

import { CanvasHelper, DefaultStyle } from "../canvas-helpers";
import { CavasObjectMap } from "./canvas-objects/object-mapping";

export class CanvasBoard implements ICanvas {
    private _clicked = false;
    private _canvas: React.RefObject<HTMLCanvasElement>;
    private _canvasCopy: React.RefObject<HTMLCanvasElement>;
    private _elements: ICanvasObjectWithId[] = [];
    private _pointerOrigin: Position | null = null;
    private _zoom = 100;
    private _readOnly: boolean = false;

    private _activeObjects: ICanvasObjectWithId[] = [];
    private _hoveredObject: ICanvasObjectWithId | null = null;
    _selectedElements: ICanvasObjectWithId[] = [];
    private _elmentsDragging = false;

    _elementType: ElementEnum = ElementEnum.Move;

    _style: IObjectStyle = DefaultStyle;

    constructor() {
        this._canvas = createRef();
        this._canvasCopy = createRef();
        makeObservable(this, {
            _elementType: observable,
            ElementType: computed,
            _style: observable,
            Style: computed,
            setStyle: action,
            _selectedElements: observable,
            SelectedElements: computed
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

    set ElementType(type: ElementEnum) {
        this._elementType = type;
    }

    get Height() {
        return this.Canvas.height;
    }

    set Height(height: number) {
        this.Canvas.height = height;
        if (this.CanvasCopy) {
            this.CanvasCopy.height = height;
        }
    }

    get Width() {
        return this.Canvas.width;
    }

    set Width(width: number) {
        this.Canvas.width = width;
        if (this.CanvasCopy) {
            this.CanvasCopy.width = width;
        }
    }

    get ReadOnly() {
        return this._readOnly;
    }

    set ReadOnly(value: boolean) {
        this._readOnly = value;
    }

    get Zoom() {
        return this._zoom;
    }

    set Zoom(zoom: number) {
        this._zoom = zoom;
    }

    get Style() {
        return toJS(this._style);
    }

    get SelectedElements() {
        return this._selectedElements;
    }

    set SelectedElements(elements: ICanvasObjectWithId[]) {
        this._selectedElements = elements;
    }

    init({ width, height }: Size) {
        if (!this.CanvasCopy) {
            return;
        }
        this.Canvas.width = this.CanvasCopy.width = width;
        this.Canvas.height = this.CanvasCopy.height = height;
    }

    setStyle<T extends keyof IObjectStyle>(key: T, value: IObjectStyle[T]) {
        this._style[key] = value;
        if (this.CanvasCopy) {
            const context = this.CanvasCopy.getContext("2d");
            if (context) {
                context.save();
            }
        }
    }

    updateStyle<T extends keyof IObjectStyle>(key: T, value: IObjectStyle[T]) {
        if (this.CanvasCopy) {
            const context = this.CanvasCopy.getContext("2d");
            if (context && this._selectedElements.length > 0) {
                this._selectedElements.forEach((ele) => {
                    ele.updateStyle(context, key, value);
                });
                this.SelectedElements = [...this._selectedElements];
            }
        }
    }

    onMouseDown(e: MouseEvent) {
        if (this._clicked) {
            return;
        }
        this._clicked = true;
        if (!this.CanvasCopy) {
            return;
        }
        const context = this.CanvasCopy.getContext("2d");
        if (!context) {
            return;
        }
        if (e.target != this.CanvasCopy) {
            return;
        }
        if (
            e.target == this.CanvasCopy &&
            this._selectedElements.length != 0 &&
            (this._hoveredObject == null || this._hoveredObject.id != this._selectedElements[0].id)
        ) {
            this.unSelectElements();
        }
        const { offsetX, offsetY } = e;
        this._pointerOrigin = { x: offsetX, y: offsetY };
        if (this.ElementType == ElementEnum.Move) {
            if (this._hoveredObject && e.detail == 1) {
                this._elements = this.Elements.filter((e) => e.id != this._hoveredObject!.id);
                this.redrawBoard();
                this._activeObjects = [this._hoveredObject];
                this.SelectedElements = [this._hoveredObject];
                this._activeObjects.forEach((ao) => {
                    ao.move(context, { x: 0, y: 0 }, "down");
                });
            }
        } else {
            const newObj = CavasObjectMap[this.ElementType]({
                x: offsetX,
                y: offsetY,
                h: 0,
                w: 0,
                points: [[offsetX, offsetY]],
                id: uuid(),
                style: this.Style
            });
            newObj.create(context);
            this._activeObjects.push(newObj);
        }
    }

    onMouseMove(e: MouseEvent) {
        if (!this.CanvasCopy) {
            return;
        }
        const context = this.CanvasCopy.getContext("2d");
        if (!context) {
            return;
        }
        if (e.target != this.CanvasCopy && this._elmentsDragging) {
            this.saveBoard();
            return;
        }
        const { offsetX, offsetY } = e;
        if (this._activeObjects.length != 0 && this._pointerOrigin) {
            const { x, y } = this._pointerOrigin;
            if (this.ElementType == ElementEnum.Move) {
                this._elmentsDragging = true;
                this.SelectedElements = [];
                this._activeObjects.forEach((ao) => {
                    ao.move(context, { x: offsetX - x, y: offsetY - y }, "move");
                });
            } else {
                const r = Math.max(Math.abs(offsetX - x), Math.abs(offsetY - y));
                this._activeObjects.forEach((ao) => {
                    ao.update(context, {
                        w: offsetX - x,
                        h: offsetY - y,
                        r,
                        points: [[offsetX, offsetY]]
                    });
                });
            }
        } else if (this.ElementType == ElementEnum.Move) {
            const ele = CanvasHelper.hoveredElement({ x: offsetX, y: offsetY }, this._elements);
            if (ele) {
                this.CanvasCopy.style.cursor = "move";
                this._hoveredObject = ele;
            } else {
                this.CanvasCopy.style.cursor = "default";
                this._hoveredObject = null;
            }
        }
    }

    onMouseUp(e: MouseEvent) {
        this._clicked = false;
        if (!this.CanvasCopy) {
            return;
        }
        const context = this.CanvasCopy.getContext("2d");
        if (!context) {
            return;
        }
        if (this._activeObjects.length != 0) {
            if (e.target != this.CanvasCopy) {
                this.saveBoard();
                return;
            }
            const { offsetX, offsetY } = e;
            if (this._activeObjects.length != 0 && this._pointerOrigin) {
                const { x, y } = this._pointerOrigin;
                if (this.ElementType == ElementEnum.Move) {
                    this._activeObjects.forEach((ao) => {
                        ao.move(context, { x: offsetX - x, y: offsetY - y }, "up");
                    });
                    this.SelectedElements = this._activeObjects;
                } else {
                    const r = Math.max(Math.abs(offsetX - x), Math.abs(offsetY - y));
                    this._activeObjects.forEach((ao) => {
                        ao.update(context, { w: offsetX - x, h: offsetY - y, r });
                    });
                }
            }
            context.closePath();
            this.saveBoard();
        } else {
            this._pointerOrigin = null;
            return;
        }
    }

    onTouchStart(e: TouchEvent) {
        if (!this.CanvasCopy) {
            return;
        }
        const context = this.CanvasCopy.getContext("2d");
        if (!context) {
            return;
        }
        if (e.target != this.CanvasCopy) {
            return;
        }
        if (
            e.target == this.CanvasCopy &&
            this._selectedElements.length != 0 &&
            this._hoveredObject?.id != this._selectedElements[0]?.id
        ) {
            this.unSelectElements();
        }
        const { clientX: offsetX, clientY: offsetY } = e.touches[0];
        this._pointerOrigin = { x: offsetX, y: offsetY };
        if (this.ElementType == ElementEnum.Move) {
            const ele = CanvasHelper.hoveredElement({ x: offsetX, y: offsetY }, this._elements);
            if (ele) {
                this._elements = this.Elements.filter((e) => e.id != ele.id);
                this.redrawBoard();
                this._hoveredObject = ele;
                this._activeObjects = [ele];
                this.SelectedElements = [ele];
                this._activeObjects[0].move(context, { x: 0, y: 0 }, "down");
            }
        } else {
            const newObj = CavasObjectMap[this.ElementType]({
                x: offsetX,
                y: offsetY,
                h: 0,
                w: 0,
                points: [[offsetX, offsetY]],
                id: uuid(),
                style: this.Style
            });
            newObj.create(context);
            this._activeObjects.push(newObj);
        }
    }

    onTouchMove(e: TouchEvent) {
        if (!this.CanvasCopy) {
            return;
        }
        const context = this.CanvasCopy.getContext("2d");
        if (!context) {
            return;
        }
        if (e.target != this.CanvasCopy && this._elmentsDragging) {
            this.saveBoard();
            return;
        }
        const { clientX: offsetX, clientY: offsetY } = e.touches[0];
        if (this._activeObjects.length != 0 && this._pointerOrigin) {
            const { x, y } = this._pointerOrigin;
            if (this.ElementType == ElementEnum.Move) {
                this._elmentsDragging = true;
                this._activeObjects[0].move(context, { x: offsetX - x, y: offsetY - y }, "move");
            } else {
                const r = Math.max(Math.abs(offsetX - x), Math.abs(offsetY - y));
                this._activeObjects[0].update(context, {
                    w: offsetX - x,
                    h: offsetY - y,
                    r,
                    points: [[offsetX, offsetY]]
                });
            }
        }
    }

    onTouchEnd(e: TouchEvent) {
        if (!this.CanvasCopy) {
            return;
        }
        const context = this.CanvasCopy.getContext("2d");
        if (!context) {
            return;
        }
        if (this._activeObjects.length != 0) {
            if (e.target != this.CanvasCopy) {
                this.saveBoard();
                return;
            }
            const { clientX: offsetX, clientY: offsetY } = e.changedTouches[0];
            if (this._activeObjects.length != 0 && this._pointerOrigin) {
                const { x, y } = this._pointerOrigin;
                if (this.ElementType == ElementEnum.Move) {
                    this._activeObjects[0].move(context, { x: offsetX - x, y: offsetY - y }, "up");
                } else {
                    const r = Math.max(Math.abs(offsetX - x), Math.abs(offsetY - y));
                    this._activeObjects[0].update(context, { w: offsetX - x, h: offsetY - y, r });
                }
            }
            context.closePath();
            this.saveBoard();
        } else {
            this._pointerOrigin = null;
            return;
        }
    }

    selectElements() {
        //
    }

    unSelectElements() {
        this._elmentsDragging = false;
        this.SelectedElements = [];
        this.redrawBoard();
    }

    removeElement(id: string) {
        this._elements = this.Elements.filter((e) => e.id != id);
        this.SelectedElements = [];
        this.redrawBoard();
    }

    copyElement(id: string) {
        if (!this.CanvasCopy) {
            return;
        }
        const context = this.CanvasCopy.getContext("2d");
        if (!context) {
            return;
        }
        const elementToCopy = this.Elements.find((e) => e.id == id);
        if (elementToCopy) {
            const copyElement = CavasObjectMap[elementToCopy.type]({ ...elementToCopy, id: uuid() });
            copyElement.move(context, { x: 0, y: 0 }, "down");
            copyElement.move(context, { x: 40, y: 40 }, "up");
            context.closePath();
            this._elements.push(copyElement);
            this.SelectedElements = [copyElement];
            this.saveBoard();
        }
    }

    loadBoard(metadata: CanvasMetadata, { height, readonly, width, draw }: Partial<AdditionalCanvasOptions>) {
        this.ReadOnly = readonly ?? false;
        this.Height = height ?? metadata.size.height;
        this.Width = width ?? metadata.size.width;
        const context = this.Canvas.getContext("2d");
        if (context) {
            const objArray = metadata.elements.map((ele) => {
                return CavasObjectMap[ele.type](ele);
            });
            this._elements = objArray;
            if (draw) {
                this.redrawBoard();
            }
        }
    }

    createBoard({ height = window.innerHeight, width = window.innerWidth }: Partial<AdditionalCanvasOptions>) {
        this.Height = height;
        this.Width = width;
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
        if (this._activeObjects.length > 0) {
            this._elements.push(...this._activeObjects);
            this._pointerOrigin = null;
            this._activeObjects = [];
            this._hoveredObject = null;
            this._elmentsDragging = false;
            this.redrawBoard();
        }
    }

    redrawBoard() {
        if (this.CanvasCopy) {
            const contextCopy = this.CanvasCopy.getContext("2d");
            if (contextCopy) {
                contextCopy.clearRect(0, 0, window.innerWidth, window.innerHeight);
                contextCopy.restore();
            }
        }
        const context = this.Canvas.getContext("2d");
        if (context) {
            context.clearRect(0, 0, window.innerWidth, window.innerHeight);
            this.Elements.forEach((ele) => {
                ele.draw(context);
            });
            context.restore();
        }
    }

    dispose() {
        this.SelectedElements = [];
        this._activeObjects = [];
        this.ElementType = ElementEnum.Move;
        this.ReadOnly = false;
        this._hoveredObject = null;
        this._elmentsDragging = false;
    }

    toJSON(): CanvasMetadata {
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

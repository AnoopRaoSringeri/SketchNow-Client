import { action, computed, makeObservable, observable, toJS } from "mobx";
import { createRef } from "react";
import { v4 as uuid } from "uuid";

import { AdditionalCanvasOptions, CanvasMetadata, Position, Size } from "@/types/canvas";
import {
    CanvasActionEnum,
    CursorPosition,
    ElementEnum,
    ICanvas,
    ICanvasObjectWithId,
    ICanvasTransform,
    IObjectStyle,
    IToSVGOptions
} from "@/types/custom-canvas";

import { CanvasHelper, DefaultStyle } from "../canvas-helpers";
import { CavasObjectMap } from "./canvas-objects/object-mapping";
import { EventManager } from "./event-handler";

export class CanvasBoard implements ICanvas {
    private _clicked = false;
    private _canvas: React.RefObject<HTMLCanvasElement>;
    private _canvasCopy: React.RefObject<HTMLCanvasElement>;
    private _elements: ICanvasObjectWithId[] = [];
    private _pointerOrigin: Position | null = null;
    _zoom = 100;
    private _readOnly: boolean = false;

    private _activeObjects: ICanvasObjectWithId[] = [];
    private _hoveredObject: ICanvasObjectWithId | null = null;
    _selectedElements: ICanvasObjectWithId[] = [];

    private _canvasTransform: ICanvasTransform = CanvasHelper.GetDefaultTransForm();

    _elementType: ElementEnum = ElementEnum.Move;
    _currentCanvasAction: CanvasActionEnum = CanvasActionEnum.Select;
    private _cursorPosition: CursorPosition | null = null;

    _style: IObjectStyle = DefaultStyle;

    private EventManager: EventManager;

    constructor() {
        this.EventManager = new EventManager(this);
        this._canvas = createRef();
        this._canvasCopy = createRef();
        makeObservable(this, {
            _elementType: observable,
            ElementType: computed,
            _style: observable,
            Style: computed,
            setStyle: action,
            _selectedElements: observable,
            SelectedElements: computed,
            _zoom: observable,
            Zoom: computed
        });
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

    get Transform() {
        return this._canvasTransform;
    }

    get ActiveObjects() {
        return this._activeObjects;
    }

    set ActiveObjects(objects: ICanvasObjectWithId[]) {
        this._activeObjects = objects;
    }

    get Elements() {
        return this._elements;
    }

    set Elements(objects: ICanvasObjectWithId[]) {
        this._elements = objects;
    }

    get HoveredObject() {
        return this._hoveredObject;
    }

    set HoveredObject(object: ICanvasObjectWithId | null) {
        this._hoveredObject = object;
    }

    get PointerOrigin() {
        return this._pointerOrigin;
    }

    set PointerOrigin(origin: Position | null) {
        this._pointerOrigin = origin;
    }

    get CursorPosition() {
        return this._cursorPosition;
    }

    set CursorPosition(position: CursorPosition | null) {
        this._cursorPosition = position;
    }

    get Clicked() {
        return this._clicked;
    }

    set Clicked(value: boolean) {
        this._clicked = value;
    }

    init({ width, height }: Size) {
        if (!this.CanvasCopy) {
            return;
        }
        this.Canvas.width = this.CanvasCopy.width = width;
        this.Canvas.height = this.CanvasCopy.height = height;
    }

    loadBoard(metadata: CanvasMetadata, { height, readonly, width, draw }: Partial<AdditionalCanvasOptions>) {
        this.ReadOnly = readonly ?? false;
        this.Height = height ?? metadata.size.height;
        this.Width = width ?? metadata.size.width;
        this._canvasTransform = metadata.tranform;
        const context = this.Canvas.getContext("2d");
        if (context) {
            const objArray = metadata.elements.map((ele) => {
                return CavasObjectMap[ele.type](ele, this);
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

    selectElements() {
        //
    }

    unSelectElements() {
        this.SelectedElements.forEach((ele) => {
            ele.unSelect();
        });
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
            const copyElement = CavasObjectMap[elementToCopy.type]({ ...elementToCopy, id: uuid() }, this);
            copyElement.move(context, { x: 0, y: 0 }, "down");
            copyElement.move(context, { x: 40, y: 40 }, "up");
            context.closePath();
            this._elements.push(copyElement);
            this.SelectedElements = [copyElement];
            this.saveBoard();
        }
    }

    fitToView() {
        if (this.CanvasCopy) {
            const contextCopy = this.CanvasCopy.getContext("2d");
            if (contextCopy) {
                CanvasHelper.clearCanvasArea(contextCopy, this._canvasTransform);
            }
        }
        const context = this.Canvas.getContext("2d");
        if (context) {
            CanvasHelper.clearCanvasArea(context, this._canvasTransform);
        }
        this._canvasTransform = CanvasHelper.GetDefaultTransForm();
        this.redrawBoard();
    }

    saveBoard() {
        if (this._activeObjects.length > 0) {
            this._elements.push(...this._activeObjects);
            this._pointerOrigin = null;
            this._activeObjects = [];
            this._hoveredObject = null;
            this.redrawBoard();
        }
    }

    redrawBoard() {
        if (this.CanvasCopy) {
            const contextCopy = this.CanvasCopy.getContext("2d");
            if (contextCopy) {
                CanvasHelper.clearCanvasArea(contextCopy, this._canvasTransform);
                contextCopy.resetTransform();
                const { a, b, c, d, e, f } = this._canvasTransform;
                contextCopy.transform(a, b, c, d, e, f);
                contextCopy.restore();
            }
        }
        const context = this.Canvas.getContext("2d");
        if (context) {
            CanvasHelper.clearCanvasArea(context, this._canvasTransform);
            context.resetTransform();
            const { a, b, c, d, e, f } = this._canvasTransform;
            context.transform(a, b, c, d, e, f);
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
        this._currentCanvasAction = CanvasActionEnum.Select;
        this._canvasTransform = CanvasHelper.GetDefaultTransForm();
    }

    toJSON(): CanvasMetadata {
        return {
            elements: [...this.Elements.map((ele) => ele.getValues())],
            size: { height: this.Height, width: this.Width },
            tranform: this._canvasTransform
        };
    }

    toSVG({ height, width }: IToSVGOptions) {
        let svgString = "";
        const sRatio = CanvasHelper.getSizeRatio({ height, width }, { height: this.Height, width: this.Width });
        this.Elements.forEach((ele) => {
            svgString += ele.toSVG(sRatio);
        });
        return `<svg width="${width}" height="${height}" xmlns="http://sketch-now/svg">${svgString}</svg>`;
    }

    onMouseDown(e: MouseEvent) {
        this.EventManager.onMouseDown(e);
    }

    onMouseMove(e: MouseEvent) {
        this.EventManager.onMouseMove(e);
    }

    onMouseUp(e: MouseEvent) {
        this.EventManager.onMouseUp(e);
    }

    onWheelAction(e: WheelEvent) {
        this.EventManager.onWheelAction(e);
    }

    onTouchStart(e: TouchEvent) {
        this.EventManager.onTouchStart(e);
    }

    onTouchMove(e: TouchEvent) {
        this.EventManager.onTouchMove(e);
    }

    onTouchEnd(e: TouchEvent) {
        this.EventManager.onTouchEnd(e);
    }
}
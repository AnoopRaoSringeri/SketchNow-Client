import { ElementSize, Position } from "./canvas";

export interface ICanvasObject {
    x: number;
    y: number;
    h: number;
    w: number;
    create: () => unknown;
    update: () => unknown;
    onSelect: () => unknown;
    delete: () => unknown;
    get: () => this;
    set: <T extends keyof ICanvasObject>(key: T, value: ICanvasObject[T]) => unknown;
    move: (position: Position) => unknown;
    resize: (size: ElementSize) => unknown;
}

export interface ICanvas {
    Canvas: HTMLCanvasElement | null;
    Elements: ICanvasObject[];
    // createElement?: (initValues: Position & ElementSize) => ICanvasObject;
    // getElement?: (elementId: string) => ICanvasObject;
    // setElement?: (elementId: string, element: ICanvasObject) => unknown;
    // moveElement?: (elementId: string, position: Position) => unknown;
    // resizeElement?: (elementId: string, size: ElementSize) => unknown;
    // onSelect?: () => unknown;
    // removeElement?: () => unknown;
}

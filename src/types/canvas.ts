import { fabric } from "fabric";

import { RegistryType } from "./editors";

export interface CanvasOptions {
    scale: number;
}

export interface Zoom {
    context: CanvasRenderingContext2D;
    scale: number;
    position: Position;
}

export interface Draw {
    context: CanvasRenderingContext2D;
    currentPosition: Position;
    previousPosition: Position | null;
}

export interface Position {
    x: number;
    y: number;
}

export interface ElementSize {
    height: number;
    width: number;
}

export interface CanvasBoard {
    size: CanvasBoardSize;
    scale: number;
    elements: CanvasElement[];
}

export interface CanvasBoardSize {
    width: number;
    height: number;
}

export interface CanvasElement extends Position, ElementSize {
    element: Path2D;
    type: ElementType;
    id: number;
}

export interface NewCanvasElement extends Omit<CanvasElement, "id"> {}

export type CreateElementProps = {
    type: RegistryType["type"];
    canvas: fabric.Canvas | null;
    event: fabric.IEvent<MouseEvent>;
    options: Options;
    layer: string;
};

export type UpdateElementProps = Omit<CreateElementProps, "layer"> & {
    origin: Position;
};

export type Views = "infinite";

export type ElementType = "line" | "square" | "rectangle" | "circle" | "ellipse" | "pencil" | "none";

export interface Options {
    stroke: string;
    strokeWidth: number;
}

type FabricElement = fabric.Object & fabric.Circle & fabric.Line & fabric.Ellipse;

type FabricOption = fabric.IObjectOptions & fabric.ICircleOptions & fabric.ILineOptions & fabric.ILineOptions;

export type ElementData = {
    type: RegistryType["type"];
    id: string;
    isMoving?: boolean;
    layer: string;
};
export type BaseFabricElement = Omit<FabricElement, "data"> & {
    data: ElementData;
};

export type BaseFabricOption = Omit<FabricOption, "data"> & {
    data: ElementData;
};

export type NullableFabricElement = BaseFabricElement | null;

export type Layer = {
    id: string;
    order: number;
    data?: string;
};

export const ZOOM_STEP = 5 / 100;

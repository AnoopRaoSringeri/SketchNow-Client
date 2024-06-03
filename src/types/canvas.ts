import { ICanvasObject } from "./custom-canvas";

export interface Position {
    x: number;
    y: number;
}

export interface Size {
    height: number;
    width: number;
}

export type ElementType = "line" | "square" | "rectangle" | "circle" | "ellipse" | "pencil" | "none";

export interface Options {
    stroke: string;
    strokeWidth: number;
}

export type Layer = {
    id: string;
    order: number;
    data?: string;
};

export const ZOOM_STEP = 5 / 100;

export type SavedCanvas = {
    _id: string;
    name: string;
    metadata: CanvasMetadata;
    createdBy: string;
};

export interface CanvasMetadata {
    elements: ICanvasObject[];
    size: Size;
}

export interface AdditionalCanvasOptions {
    readonly: boolean;
    height: number;
    width: number;
    draw: boolean;
}

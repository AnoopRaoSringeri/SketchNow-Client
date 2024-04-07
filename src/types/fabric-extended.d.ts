/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
// import { Canvas } from "fabric";
import { IEvent } from "fabric";

import { Canvas, FabObject, IUtil } from "./index";

declare module "fabric" {
    interface Canvas {
        forEachObject(arg0: (element: FabObject) => void): unknown;
        on(arg0: string, onObjectModify: (event: IEvent<MouseEvent>) => void): unknown;
        off(arg0: string): unknown;
        setHeight(innerHeight: number): unknown;
        setWidth(innerWidth: number): unknown;
        getPointer(e: IEvent): unknown;
        selection: boolean;
        isDrawingMode: boolean;
        defaultCursor: string;
        discardActiveObject(): unknown;
        add(minimapView: fabric.Rect): unknown;
        clear(): unknown;
        zoomToPoint(arg0: { x: number; y: number }, zoom: number): unknown;
        centerObject(backgroundImage: fabric.Image): unknown;
        backgroundImage: fabric.Image;
        backgroundColor: string;
        viewportTransform: number[];
        requestRenderAll(): unknown;
        getRetinaScaling(): number;
    }
    interface IUtil {
        findScaleToFit();
    }

    interface Image {}
}

export as namespace fabric;

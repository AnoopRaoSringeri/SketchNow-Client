import { ElementEnum, ICanvasObjectWithId, PartialCanvasObject } from "@/types/custom-canvas";

import { CanvasBoard } from "../canvas-board";
import { Circle } from "./circle";
import { Line } from "./line";
import { Pencil } from "./pencil";
import { Rectangle } from "./rectangle";
import { Square } from "./square";

export const CavasObjectMap: {
    [key in ElementEnum]: (initValues: PartialCanvasObject, parent: CanvasBoard) => ICanvasObjectWithId;
} = {
    [ElementEnum.Rectangle]: (initValues, parent) => new Rectangle(initValues, parent),
    [ElementEnum.Line]: (initValues, parent) => new Line(initValues, parent),
    [ElementEnum.Square]: (initValues, parent) => new Square(initValues, parent),
    [ElementEnum.Circle]: (initValues, parent) => new Circle(initValues, parent),
    [ElementEnum.Ellipse]: (initValues, parent) => new Rectangle(initValues, parent),
    [ElementEnum.Pencil]: (initValues, parent) => new Pencil(initValues, parent),
    [ElementEnum.Move]: function (): ICanvasObjectWithId {
        throw new Error("Function not implemented.");
    }
};

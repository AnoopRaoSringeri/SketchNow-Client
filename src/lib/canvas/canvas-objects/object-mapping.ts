import { ElementEnum, ICanvasObjectWithId, IObjectValueWithId } from "@/types/custom-canvas";

import { Circle } from "./circle";
import { Pencil } from "./pencil";
import { Rectangle } from "./rectangle";

export const CavasObjectMap: { [key in ElementEnum]: (initValues: IObjectValueWithId) => ICanvasObjectWithId } = {
    [ElementEnum.Rectangle]: (initValues) => new Rectangle(initValues),
    [ElementEnum.Line]: (initValues) => new Rectangle(initValues),
    [ElementEnum.Square]: (initValues) => new Rectangle(initValues),
    [ElementEnum.Circle]: (initValues) => new Circle(initValues),
    [ElementEnum.Ellipse]: (initValues) => new Rectangle(initValues),
    [ElementEnum.Pencil]: (initValues) => new Pencil(initValues),
    [ElementEnum.Move]: function (): ICanvasObjectWithId {
        throw new Error("Function not implemented.");
    }
};

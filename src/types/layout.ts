import { ElementType, Position } from "./canvas";

export interface Option {
    icon: any;
    value: ElementType;
}

export type OptionPanelPosition = "top" | "bottom" | "right" | "left";
export interface MenuPosition extends Position {
    isLocked?: boolean;
}

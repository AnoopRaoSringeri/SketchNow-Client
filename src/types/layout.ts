import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { ElementType, Position } from "./canvas";

export interface Option {
	icon: IconProp;
	value: ElementType;
}

export type OptionPanelPosition = "top" | "bottom" | "right" | "left";
export interface MenuPosition extends Position {
	isLocked?: boolean;
}

import { LucideIcon } from "lucide-react";

import { Position } from "./canvas";
import { ElementEnum } from "./custom-canvas";

export interface Option {
    icon: LucideIcon;
    value: ElementEnum;
}

export type OptionPanelPosition = "top" | "bottom" | "right" | "left";
export interface MenuPosition extends Position {
    isLocked?: boolean;
}

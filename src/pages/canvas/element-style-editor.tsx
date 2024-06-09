import { PaintBucket, Palette, PencilLine } from "lucide-react";
import { observer } from "mobx-react";
import { useParams } from "react-router";

import { ColorPickerControl } from "@/components/ui/color-picker-control";
import { Popover, PopoverContent, PopoverTriggerButton } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { useCanvas } from "@/hooks/use-canvas";

export const ElemntStyleEditor = observer(function ElemntStyleEditor() {
    const { id } = useParams<{ id: string }>();
    const { canvasBoard } = useCanvas(id ?? "new");
    const selectedElements = canvasBoard.SelectedElements;
    const element = selectedElements[0];
    const elementStyle = element?.style;

    if (!elementStyle) {
        return <></>;
    }

    return (
        <div className="absolute right-5 top-20 z-[100] flex flex-col items-center gap-1">
            <Popover>
                <PopoverTriggerButton variant="secondary" size="sm">
                    <PencilLine />
                </PopoverTriggerButton>
                <PopoverContent align="end" alignOffset={120} sideOffset={-38}>
                    <Slider
                        value={[elementStyle.strokeWidth]}
                        onValueChange={(values) => {
                            canvasBoard.updateStyle("strokeWidth", values[0]);
                        }}
                    />
                </PopoverContent>
            </Popover>
            <Popover>
                <PopoverTriggerButton variant="secondary" size="sm">
                    <Palette color={elementStyle.strokeStyle} />
                </PopoverTriggerButton>
                <PopoverContent>
                    <ColorPickerControl
                        value={elementStyle.strokeStyle}
                        onChange={(c) => {
                            if (c.endsWith("00")) {
                                canvasBoard.updateStyle("strokeStyle", c.slice(0, -2));
                            } else {
                                canvasBoard.updateStyle("strokeStyle", c);
                            }
                        }}
                    />
                </PopoverContent>
            </Popover>
            <Popover>
                <PopoverTriggerButton variant="secondary" size="sm">
                    <PaintBucket color={elementStyle.fillColor} />
                </PopoverTriggerButton>
                <PopoverContent>
                    <ColorPickerControl
                        value={elementStyle.fillColor}
                        onChange={(c) => {
                            if (c.endsWith("00")) {
                                canvasBoard.updateStyle("fillColor", c.slice(0, -2));
                            } else {
                                canvasBoard.updateStyle("fillColor", c);
                            }
                        }}
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
});

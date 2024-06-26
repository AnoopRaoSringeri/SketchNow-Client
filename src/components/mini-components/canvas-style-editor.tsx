import { PaintBucket, Palette, PencilLine } from "lucide-react";
import { observer } from "mobx-react";
import { useParams } from "react-router";

import { ColorPickerControl } from "@/components/ui/color-picker-control";
import { Popover, PopoverContent, PopoverTriggerButton } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { useCanvas } from "@/hooks/use-canvas";

export const CanvasStyleEditor = observer(function CanvasStyleEditor() {
    const { id } = useParams<{ id: string }>();
    const { canvasBoard } = useCanvas(id ?? "new");
    const canvasStyle = canvasBoard.Style;
    return (
        <div className="absolute top-5 z-[100] flex flex-row items-center gap-1">
            <Popover>
                <PopoverTriggerButton variant="secondary" size="sm">
                    <PencilLine />
                </PopoverTriggerButton>
                <PopoverContent>
                    <Slider
                        value={[canvasStyle.strokeWidth]}
                        onValueChange={(values) => {
                            canvasBoard.setStyle("strokeWidth", values[0]);
                        }}
                    />
                </PopoverContent>
            </Popover>
            <Popover>
                <PopoverTriggerButton variant="secondary" size="sm">
                    <Palette color={canvasStyle.strokeStyle} />
                </PopoverTriggerButton>
                <PopoverContent>
                    <ColorPickerControl
                        value={canvasStyle.strokeStyle}
                        onChange={(c) => {
                            if (c.endsWith("00")) {
                                canvasBoard.setStyle("strokeStyle", c.slice(0, -2));
                            } else {
                                canvasBoard.setStyle("strokeStyle", c);
                            }
                        }}
                    />
                </PopoverContent>
            </Popover>
            <Popover>
                <PopoverTriggerButton variant="secondary" size="sm">
                    <PaintBucket color={canvasStyle.fillColor} />
                </PopoverTriggerButton>
                <PopoverContent>
                    <ColorPickerControl
                        value={canvasStyle.fillColor}
                        onChange={(c) => {
                            if (c.endsWith("00")) {
                                canvasBoard.setStyle("fillColor", c.slice(0, -2));
                            } else {
                                canvasBoard.setStyle("fillColor", c);
                            }
                        }}
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
});

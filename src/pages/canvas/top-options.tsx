import { Palette, PencilLine } from "lucide-react";
import { observer } from "mobx-react";
import { ColorPicker, useColor } from "react-color-palette";

import { Popover, PopoverContent, PopoverTriggerButton } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { useCanvas } from "@/hooks/canvas-context";
import { useCanvasStore } from "@/data-stores/canvas-store";

// TODO: Resolve errors
const TopCanvasOptions = observer(function TopCanvasOptions() {
    const canvasStore = useCanvasStore();
    const { canvas } = useCanvas();
    const [color, setColor] = useColor(canvasStore.Options.stroke);

    return (
        <div className="fixed top-5 z-[1] flex flex-row items-center gap-1">
            <Popover>
                <PopoverTriggerButton variant="secondary">
                    <PencilLine />
                </PopoverTriggerButton>
                <PopoverContent>
                    <Slider
                        value={[canvasStore.Options.strokeWidth]}
                        onValueChange={(values) => {
                            canvasStore.updateOptions("strokeWidth", values[0]);
                            if (canvas) {
                                canvas.freeDrawingBrush.width = values[0];
                            }
                        }}
                    />
                </PopoverContent>
            </Popover>
            <Popover>
                <PopoverTriggerButton variant="secondary">
                    <Palette />
                </PopoverTriggerButton>
                <PopoverContent>
                    <ColorPicker
                        color={color}
                        onChange={(c) => {
                            setColor(c);
                            canvasStore.updateOptions("stroke", c.hex);
                            if (canvas) {
                                canvas.freeDrawingBrush.color = c.hex;
                            }
                        }}
                        hideInput={["rgb", "hsv", "hex"]}
                        height={100}
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
});

export default TopCanvasOptions;

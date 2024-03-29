import { Palette, PencilLine } from "lucide-react";
import { observer } from "mobx-react";
import { ColorPicker, useColor } from "react-color-palette";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { useCanvas } from "@/hooks/canvas-context";
import { useCanvasStore } from "@/stores/canvas-store";

// TODO: Resolve errors
const TopCanvasOptions = observer(function TopCanvasOptions() {
    const canvasStore = useCanvasStore();
    const { canvas } = useCanvas();
    const [color, setColor] = useColor(canvasStore.Options.stroke);

    return (
        <div className="fixed top-0 z-[1] mt-5 flex flex-row items-center gap-1">
            <Popover>
                <PopoverTrigger>
                    <Button variant="secondary">
                        <PencilLine />
                    </Button>
                </PopoverTrigger>
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
                <PopoverTrigger>
                    <Button variant="secondary">
                        <Palette />
                    </Button>
                </PopoverTrigger>
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

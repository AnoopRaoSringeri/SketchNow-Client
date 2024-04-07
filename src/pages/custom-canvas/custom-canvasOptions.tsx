import { Save } from "lucide-react";
import { observer } from "mobx-react";

import { Button } from "@/components/ui/button";
import { useCustomCanvas } from "@/hooks/custom-canvas-context";

const CustomCanvasOptions = observer(function CustomCanvasOptions() {
    const { canvas } = useCustomCanvas();

    if (!canvas) {
        return <div />;
    }
    return (
        <div className="absolute right-5 top-5 z-[1]">
            <Button
                onClick={() => {
                    console.log(canvas.getContext("2d"));
                }}
            >
                <Save />
            </Button>
        </div>
    );
});

export default CustomCanvasOptions;

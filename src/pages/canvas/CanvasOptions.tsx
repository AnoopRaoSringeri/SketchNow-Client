import { Save } from "lucide-react";
import { observer } from "mobx-react";

import { Button } from "@/components/ui/button";
import { useCanvas } from "@/hooks/canvas-context";

const CanvasOptions = observer(function CanvasOptions() {
    const { canvas } = useCanvas();

    if (!canvas) {
        return <div />;
    }
    return (
        <div className="absolute right-5 top-5 z-[1]">
            <Button
                onClick={() => {
                    console.log(canvas.toJSON(["data", "fill", "fillStyle"]));
                }}
            >
                <Save />
            </Button>
        </div>
    );
});

export default CanvasOptions;

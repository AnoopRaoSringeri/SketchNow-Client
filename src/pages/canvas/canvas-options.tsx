import { Save } from "lucide-react";
import { observer } from "mobx-react";
import { useParams } from "react-router";
import { toast } from "sonner";

import { useStore } from "@/api-stores/store-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCanvasStore } from "@/data-stores/canvas-store";
import { useCanvas } from "@/hooks/canvas-context";

const CanvasOptions = observer(function CanvasOptions() {
    const { canvas } = useCanvas();
    const { sketchStore } = useStore();
    const canvasStore = useCanvasStore();
    const { id } = useParams<{ id: string }>();
    if (!canvas) {
        return <div />;
    }

    const save = async () => {
        if (id) {
            await sketchStore.UpdateSketch(id, canvas.toJSON(["data", "fill", "fillStyle"]), canvasStore.SketchName);
            toast.success("Sketch saved successfully");
        } else {
            await sketchStore.SaveSketch(canvas.toJSON(["data", "fill", "fillStyle"]), canvasStore.SketchName);
            toast.success("Sketch updated successfully");
        }
    };

    return (
        <div className="absolute right-5 top-5 z-[1]">
            <div className="flex w-full max-w-sm items-center space-x-2">
                <Input
                    type="text"
                    placeholder="Name"
                    value={canvasStore.SketchName}
                    onChange={(e) => {
                        canvasStore.SketchName = e.target.value;
                    }}
                />
                <Button
                    onClick={() => {
                        console.log(canvas.toJSON(["data", "fill", "fillStyle"]));
                        save();
                    }}
                >
                    <Save />
                </Button>
            </div>
        </div>
    );
});

export default CanvasOptions;

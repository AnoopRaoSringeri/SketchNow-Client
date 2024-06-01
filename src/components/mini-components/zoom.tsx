import { Minus, Plus, Search } from "lucide-react";
import { observer } from "mobx-react";

import { Button } from "@/components/ui/button";
import { useCanvasStore } from "@/data-stores/canvas-store";
import { useCanvas } from "@/hooks/canvas-context";
import { ZOOM_STEP } from "@/types/canvas";

export const ZoomController = observer(function ZoomController() {
    const canvasStore = useCanvasStore();
    const { canvas } = useCanvas();

    return (
        <div className="fixed bottom-5 right-5 z-[1] flex flex-row items-center justify-center gap-2 rounded border border-solid border-gray-100 p-2">
            <Button size="sm">
                <Search />
            </Button>
            <div className="text-black">{canvasStore.Zoom + "%"}</div>
            <Button
                size="sm"
                onClick={() => {
                    if (canvas) {
                        const zoomOutValue = canvas.getZoom() - ZOOM_STEP;
                        if (zoomOutValue < 0) {
                            return;
                        }
                        canvasStore.Zoom = zoomOutValue * 100;
                        canvas.setZoom(zoomOutValue);
                        canvas.requestRenderAll();
                    }
                }}
            >
                <Minus />
            </Button>
            <Button
                size="sm"
                onClick={() => {
                    if (canvas) {
                        const zoomInValue = canvas.getZoom() + ZOOM_STEP;
                        if (zoomInValue > 20) {
                            return;
                        }
                        canvasStore.Zoom = zoomInValue * 100;
                        canvas.setZoom(zoomInValue);
                        canvas.requestRenderAll();
                    }
                }}
            >
                <Plus />
            </Button>
        </div>
    );
});

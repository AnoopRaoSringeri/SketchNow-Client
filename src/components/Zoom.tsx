import { Minus, Plus, Search } from "lucide-react";
import { observer } from "mobx-react";

import { useCanvas } from "@/hooks/canvas-context";
import { useCanvasStore } from "@/stores/canvas-store";
import { ZOOM_STEP } from "@/types/canvas";

import { Button } from "./ui/button";

export const ZoomController = observer(function ZoomController() {
    const canvasStore = useCanvasStore();
    const { canvas } = useCanvas();

    return (
        <div className="absolute bottom-10 right-20 flex-col justify-center rounded border border-solid border-gray-50 p-5 align-middle">
            <Button>
                <Search />
            </Button>
            <div>{canvasStore.Zoom + "%"}</div>
            <Button
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

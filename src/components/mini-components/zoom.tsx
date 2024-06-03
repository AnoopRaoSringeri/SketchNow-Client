import { Minus, Plus, Search } from "lucide-react";
import { observer } from "mobx-react";
import { useParams } from "react-router";

import { Button } from "@/components/ui/button";
import { useCanvas } from "@/hooks/use-canvas";
import { ZOOM_STEP } from "@/types/canvas";

export const ZoomController = observer(function ZoomController() {
    const { id } = useParams<{ id: string }>();
    const canvas = useCanvas(id ?? "new");

    return (
        <div className="fixed bottom-5 right-5 z-[1] flex flex-row items-center justify-center gap-2 rounded border border-solid border-gray-100 p-2">
            <Button size="sm">
                <Search />
            </Button>
            <div className="text-black">{canvas.Zoom + "%"}</div>
            <Button
                size="sm"
                onClick={() => {
                    const zoomOutValue = canvas.Zoom - ZOOM_STEP;
                    if (zoomOutValue < 0) {
                        return;
                    }
                    canvas.Zoom = zoomOutValue * 100;
                }}
            >
                <Minus />
            </Button>
            <Button
                size="sm"
                onClick={() => {
                    if (canvas) {
                        const zoomInValue = canvas.Zoom + ZOOM_STEP;
                        if (zoomInValue > 20) {
                            return;
                        }
                        canvas.Zoom = zoomInValue * 100;
                    }
                }}
            >
                <Plus />
            </Button>
        </div>
    );
});

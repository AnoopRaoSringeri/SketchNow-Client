import { Button } from "@/components/ui/button";
import { LayerCompoent } from "@/components/Layer";
import { Plus } from "lucide-react";
import { observer } from "mobx-react";
import { useCanvasStore } from "@/stores/canvas-store";

const CanvasLayers = observer(function CanvasLayers() {
    const canvasStore = useCanvasStore();
    return (
        <div>
            <div className="z-1 top-[calc(100vh - 300px)/2] fixed right-20 flex max-h-[40vh] w-[150px] justify-center align-middle">
                {canvasStore.Layers.map((l) => (
                    <LayerCompoent key={l.id} {...l} selected={l.id == canvasStore.SelectedLayer} />
                ))}
            </div>
            <Button onClick={() => canvasStore.addLayer()}>
                <Plus />
            </Button>
        </div>
    );
});

export default CanvasLayers;

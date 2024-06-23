import { Copy, Trash2 } from "lucide-react";
import { observer } from "mobx-react";
import { useParams } from "react-router";

import { Button } from "@/components/ui/button";
import { useCanvas } from "@/hooks/use-canvas";

export const ElementOptions = observer(function ElementOptions() {
    const { id } = useParams<{ id: string }>();
    const { canvasBoard } = useCanvas(id ?? "new");
    const selectedElements = canvasBoard.SelectedElements;
    const element = selectedElements[0];
    if (!element) {
        return <></>;
    }
    const { ax, ay } = element.getPosition();
    const { w = 0 } = element;

    function removeElement() {
        canvasBoard.removeElement(element.id);
    }

    function copyElement() {
        canvasBoard.copyElement(element.id);
    }

    return (
        <div className="absolute z-[100] flex " style={{ top: ay - 30, left: ax + w * canvasBoard.Transform.a - 68 }}>
            <Button size="xs" variant="ghost" onClick={copyElement}>
                <Copy size={20} />
            </Button>
            <Button size="xs" variant="destructive" onClick={removeElement}>
                <Trash2 size={20} />
            </Button>
        </div>
    );
});

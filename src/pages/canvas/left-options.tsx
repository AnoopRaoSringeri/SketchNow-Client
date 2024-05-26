import { Lock, Unlock } from "lucide-react";
import { observer } from "mobx-react";
import { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { useCanvasStore } from "@/data-stores/canvas-store";
import { Option } from "@/types/layout";

const LeftOptions = observer(function LeftOptions({ options }: { options: Option[]; additionalComponent?: ReactNode }) {
    const canvasStore = useCanvasStore();
    const selected = canvasStore.ElementType;
    const isElementLocked = canvasStore.LockElementType;

    return (
        <div className="absolute left-5 z-[1]  flex flex-col items-center gap-1">
            <Button
                onClick={() => {
                    canvasStore.toggleLockElementType();
                }}
                variant={isElementLocked ? "default" : "secondary"}
            >
                {isElementLocked ? <Lock /> : <Unlock />}
            </Button>
            {options.map((o) => (
                <Button
                    size="sm"
                    variant={selected == o.value ? "default" : "secondary"}
                    key={o.value}
                    onClick={() => {
                        canvasStore.ElementType = o.value;
                        canvasStore.SelectedElement = null;
                    }}
                >
                    <o.icon />
                </Button>
            ))}
        </div>
    );
});

export default LeftOptions;

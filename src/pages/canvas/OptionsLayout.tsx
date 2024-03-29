import { Lock, Unlock } from "lucide-react";
import { observer } from "mobx-react";
import { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { useCanvasStore } from "@/stores/canvas-store";
import { Option } from "@/types/layout";

const LeftOptions = observer(function LeftOptions({ options }: { options: Option[]; additionalComponent?: ReactNode }) {
    const canvasStore = useCanvasStore();
    const selected = canvasStore.ElementType;
    const isElementLocked = canvasStore.LockElementType;

    return (
        <div className="fixed left-0 z-[1] ml-5 flex flex-col items-center gap-1">
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

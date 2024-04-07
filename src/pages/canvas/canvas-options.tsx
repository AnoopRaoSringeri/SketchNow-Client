import { Save } from "lucide-react";
import { observer } from "mobx-react";

import { BaseUrl } from "@/api-stores/auth-store";
import { Button } from "@/components/ui/button";
import { useCanvas } from "@/hooks/canvas-context";

const CanvasOptions = observer(function CanvasOptions() {
    const { canvas } = useCanvas();

    if (!canvas) {
        return <div />;
    }

    const save = async () => {
        await fetch(`${BaseUrl}create`, {
            method: "POST",
            body: JSON.stringify(canvas.toJSON(["data", "fill", "fillStyle"])),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });
    };
    return (
        <div className="absolute right-5 top-5 z-[1]">
            <Button
                onClick={() => {
                    console.log(canvas.toJSON(["data", "fill", "fillStyle"]));
                    save();
                }}
            >
                <Save />
            </Button>
        </div>
    );
});

export default CanvasOptions;

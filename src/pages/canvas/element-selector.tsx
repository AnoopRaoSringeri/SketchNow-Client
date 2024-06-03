import { observer } from "mobx-react";
import { useParams } from "react-router";

import { Button } from "@/components/ui/button";
import { useCanvas } from "@/hooks/use-canvas";
import { ElementEnum } from "@/types/custom-canvas";
import { Option } from "@/types/layout";

const ElementSelector = observer(function ElementSelector({
    options,
    onChange
}: {
    options: Option[];
    onChange: (value: ElementEnum) => unknown;
}) {
    const { id } = useParams<{ id: string }>();
    const playgroundCanvas = useCanvas(id ?? "new");

    return (
        <div className="absolute left-5 z-[100]  flex flex-col items-center gap-1">
            {options.map((o) => (
                <Button
                    size="sm"
                    variant={playgroundCanvas.ElementType == o.value ? "default" : "secondary"}
                    key={o.value}
                    onClick={() => {
                        onChange(o.value);
                    }}
                >
                    <o.icon />
                </Button>
            ))}
        </div>
    );
});

export default ElementSelector;

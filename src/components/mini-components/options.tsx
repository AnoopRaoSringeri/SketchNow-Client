import { Pencil } from "lucide-react";
import { observer } from "mobx-react";
import { useState } from "react";
import { ColorPicker, useColor } from "react-color-palette";

import { Popover, PopoverContent, PopoverTriggerButton } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { useCanvas } from "@/hooks/canvas-context";
import { useCanvasStore } from "@/data-stores/canvas-store";
import { OptionType, Registry } from "@/types/editors";

export const OptionsButton = observer(function OptionsButton() {
    const canvasStore = useCanvasStore();
    const [isDragging, setIsDragging] = useState<boolean>(false);
    return (
        <div
            style={{
                visibility: canvasStore.SelectedElement ? "visible" : "hidden",
                width: 0,
                height: 0
            }}
            draggable={canvasStore.MenuPosition?.isLocked}
            onDragEnd={() => setIsDragging(false)}
            onDrag={(e) => {
                if (e.clientX == 0 && e.clientY == 0) {
                    return;
                }
                canvasStore.MenuPosition = {
                    x: e.clientX - 20,
                    y: e.clientY - 20,
                    isLocked: canvasStore.MenuPosition?.isLocked
                };
                setIsDragging(true);
            }}
        >
            <OptionsContainer isDragging={isDragging} />
        </div>
    );
});

export const OptionsContainer = observer(function OptionsContainer({ isDragging }: { isDragging: boolean }) {
    const canvasStore = useCanvasStore();

    if (canvasStore.SelectedElement == null) {
        return <div />;
    }
    const elementType = canvasStore.SelectedElement.data.type;
    return (
        <>
            <Popover>
                <PopoverTriggerButton
                    variant="outline"
                    size="icon"
                    className="absolute right-5 top-20 z-[1]  rounded-full"
                >
                    <Pencil />
                </PopoverTriggerButton>
                <PopoverContent className="flex w-[250px] flex-col gap-2 p-2">
                    {Registry.get(elementType)?.options.map((o, i) => (
                        <OptionsPanelWrapper
                            key={o.optionKey + i}
                            type={o.type}
                            optionKey={o.optionKey}
                            title={o.title}
                        />
                    ))}
                </PopoverContent>
            </Popover>
        </>
    );
});

export const OptionsPanelWrapper = observer(function OptionsPanelWrapper({ type, optionKey, title }: OptionType) {
    return (
        <div className="flex w-full flex-col">
            <div className="text-xs">{title}</div>
            <OptionsPanel type={type} optionKey={optionKey} />
        </div>
    );
});

export const OptionsPanel = observer(function OptionsPanel({ type, optionKey }: Omit<OptionType, "title">) {
    const canvasStore = useCanvasStore();
    const { canvas } = useCanvas();

    const onChange = (value: string | number) => {
        const activeObject = canvas?.getActiveObject();
        if (activeObject) {
            activeObject.set(optionKey, value);
        }
        if (canvasStore.SelectedElement) {
            canvasStore.SelectedElement = {
                ...canvasStore.SelectedElement,
                [optionKey]: value
            };
        }
        canvas?.requestRenderAll();
    };

    switch (type) {
        case "Colour": {
            return <ColorPickerControl value={canvasStore.SelectedElement?.[optionKey]} onChange={onChange} />;
        }
        case "Slider": {
            return <Slider value={[canvasStore.SelectedElement?.[optionKey]]} onValueChange={(v) => onChange(v[0])} />;
        }
        default: {
            return <div></div>;
        }
    }
});

const ColorPickerControl = function ColorPickerControl({
    value,
    onChange
}: {
    // eslint-disable-next-line no-unused-vars
    onChange: (color: string) => unknown;
    value: string;
}) {
    const [color, setColor] = useColor(value);

    return (
        <ColorPicker
            color={color}
            onChange={(c) => {
                setColor(c);
                onChange(c.hex);
            }}
            hideInput={["rgb", "hsv", "hex"]}
            height={100}
        />
    );
};

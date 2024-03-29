import { Pencil } from "lucide-react";
import { observer } from "mobx-react";
import { useState } from "react";
import { HexAlphaColorPicker } from "react-colorful";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Slider } from "@/components/ui/slider";
import { useCanvas } from "@/hooks/canvas-context";
import { useCanvasStore } from "@/stores/canvas-store";
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
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Pencil
                        style={{
                            width: "40px",
                            height: "40px",
                            position: "absolute",
                            right: 20,
                            top: 60,
                            zIndex: 999
                        }}
                    />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    {Registry.get(elementType)?.options.map((o, i) => (
                        <DropdownMenuItem key={o.optionKey + i}>
                            <OptionsPanelWrapper type={o.type} optionKey={o.optionKey} title={o.title} />
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
});

export const OptionsPanelWrapper = observer(function OptionsPanelWrapper({ type, optionKey, title }: OptionType) {
    return (
        <div className="flex-column items-center">
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
            return (
                <>
                    <HexAlphaColorPicker />
                    {/* <ColorPicker
          swatchesPerRow={10}
          format="hex"
          value={canvasStore.SelectedElement?.[optionKey]}
          onChange={onChange}
          fullWidth
          swatches={[
            ...DEFAULT_THEME.colors.red,
            ...DEFAULT_THEME.colors.green,
            ...DEFAULT_THEME.colors.blue,
          ]}
          /> */}
                </>
            );
        }
        case "Slider": {
            return <Slider value={canvasStore.SelectedElement?.[optionKey]} onValueChange={(v) => onChange(v[0])} />;
        }
        default: {
            return <div></div>;
        }
    }
});

import { ColorPicker, useColor } from "react-color-palette";

export const ColorPickerControl = function ColorPickerControl({
    value,
    onChange
}: {
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

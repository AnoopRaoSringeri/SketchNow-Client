import { Pencil } from "lucide-react";

import useMousePosition from "@/hooks/use-mouse-position";

export const Cursor = () => {
    const { x, y } = useMousePosition();
    return (
        <Pencil
            color="black"
            fill="white"
            style={{ left: `${x}px`, top: `${y - 20}px` }}
            className="pointer-events-none fixed z-[999]"
        />
    );
};

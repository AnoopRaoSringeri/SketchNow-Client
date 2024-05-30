import { useEffect, useState } from "react";

type Position = {
    x: number;
    y: number;
};

export default function useMousePosition() {
    const [mousePosition, setMousePosition] = useState<Position>({ x: 0, y: 0 });

    useEffect(() => {
        const mouseMoveHandler = (event: MouseEvent) => {
            const { clientX, clientY } = event;
            setMousePosition({ x: clientX, y: clientY });
        };
        document.addEventListener("mousemove", mouseMoveHandler);

        return () => {
            document.removeEventListener("mousemove", mouseMoveHandler);
        };
    }, []);

    return mousePosition;
}

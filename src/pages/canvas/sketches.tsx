import { fabric } from "fabric";
import { observer } from "mobx-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";

import { useStore } from "@/api-stores/store-provider";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

const SketchList = observer(function SketchList() {
    const { sketchStore } = useStore();
    const [data, setData] = useState([]);
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const sketches = await sketchStore.GetAllSketches();
        setData(sketches);
    };
    return (
        <ScrollArea className="w-full p-5" type="auto">
            <div className="flex flex-1 flex-wrap gap-5 overflow-hidden">
                {data.map((d) => (
                    <Sketch key={d._id} canvasId={d._id} data={d.metadata} name={d.name} />
                ))}
            </div>
        </ScrollArea>
    );
});

export default SketchList;

const Sketch = observer(function Sketch({ canvasId, data, name }: { canvasId: string; data: any; name: string }) {
    const canvasRef = useRef(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const navigate = useNavigate();
    useLayoutEffect(() => {
        if (canvasRef) {
            const fabricCanvas = new fabric.Canvas(canvasRef.current, {
                height: 1000,
                width: 1000
            });
            fabricCanvas.requestRenderAll();
            fabricCanvas.loadFromJSON(data, function () {
                fabricCanvas.requestRenderAll();
            });
            const svg = fabricCanvas.toSVG();
            const blob = new Blob([svg], { type: "image/svg+xml" });
            const url = URL.createObjectURL(blob);
            if (imageRef.current) {
                imageRef.current.src = url;
            }
        }
    }, [canvasRef, imageRef]);

    const onClick = () => {
        navigate(`/sketch/${canvasId}`);
    };
    return (
        <div className="flex flex-col items-center gap-1 rounded-sm">
            <img
                ref={imageRef}
                onClick={onClick}
                className="aspect-square h-[150px] w-[200px] cursor-pointer rounded-sm object-cover"
            />
            <Label className="p-1 text-lg">{name}</Label>
        </div>
    );
});

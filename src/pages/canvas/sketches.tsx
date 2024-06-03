import { TrashIcon } from "lucide-react";
import { observer } from "mobx-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";

import { useStore } from "@/api-stores/store-provider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader } from "@/components/ui/loader";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCanvas } from "@/hooks/use-canvas";
import { CanvasMetadata, SavedCanvas } from "@/types/canvas";

import { NoSketch } from "../no-sketch-page";

const SketchList = observer(function SketchList() {
    const { sketchStore } = useStore();
    const [data, setData] = useState<SavedCanvas[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const sketches = await sketchStore.GetAllSketches();
        setData(sketches);
        setLoading(false);
    };

    return (
        <div className="flex size-full items-center justify-center">
            <Loader loading={loading} />
            {data.length == 0 && !loading ? (
                <NoSketch />
            ) : (
                <ScrollArea className="size-full   p-5" type="auto">
                    <div className="flex flex-1 flex-wrap gap-5 overflow-hidden">
                        {data.map((d) => (
                            <Sketch key={d._id} canvasId={d._id} data={d.metadata} name={d.name} />
                        ))}
                    </div>
                </ScrollArea>
            )}
        </div>
    );
});

export default SketchList;

const Sketch = observer(function Sketch({
    canvasId,
    data,
    name
}: {
    canvasId: string;
    data: CanvasMetadata;
    name: string;
}) {
    const { sketchStore } = useStore();
    const [svg, setSvg] = useState("");
    const canvas = useCanvas(canvasId);
    const canvasRef = canvas.CanvasRef;
    const imageRef = useRef<SVGImageElement>(null);
    const navigate = useNavigate();
    useLayoutEffect(() => {
        canvas.loadBoard(data, { readonly: true });
        setSvg(canvas.toSVG({ height: 200, width: 300 }));
    }, [canvasRef, imageRef]);

    const onClick = () => {
        navigate(`/sketch/${canvasId}`);
    };

    const deleteSketch = async () => {
        await sketchStore.DeleteSketch(canvasId);
    };

    return (
        <>
            <div className="group relative flex flex-col items-center gap-0 rounded-sm ">
                <div className="absolute right-0 top-0 ">
                    <Button
                        size="xs"
                        variant="destructive"
                        onClick={deleteSketch}
                        className="opacity-0  transition duration-300 group-hover:opacity-100"
                    >
                        <TrashIcon size={20} color="white" />
                    </Button>
                </div>
                <canvas ref={canvasRef} onClick={onClick} className="hidden" />
                <div
                    dangerouslySetInnerHTML={{ __html: svg }}
                    onClick={onClick}
                    className=" aspect-square h-[200px] w-[300px] cursor-pointer rounded-sm border-2 border-gray-500/30 object-cover"
                />
                <Label className="p-1 text-lg">{name}</Label>
            </div>
        </>
    );
});

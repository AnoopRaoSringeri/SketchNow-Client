import { fabric } from "fabric";
import { observer } from "mobx-react";
import { useLayoutEffect, useRef } from "react";

import { useCanvas } from "@/hooks/canvas-context";
import { useCanvasStore } from "@/stores/canvas-store";
import { Layer } from "@/types/canvas";

export const LayerCompoent = observer(function LayerCompoent({ selected, id }: Layer & { selected: boolean }) {
    const canvasStore = useCanvasStore();
    const { canvas } = useCanvas();
    const ref = useRef(null);
    useLayoutEffect(() => {
        if (!canvas) {
            return;
        }
        const fabricCanvas = new fabric.Canvas(ref.current, {
            width: 130,
            height: 120,
            selection: false
        });
        // const ctx = fabricCanvas.getContext();
        const width = canvas.width ?? 0;
        const height = canvas.height ?? 0;
        const o = canvas.toObject(["data"]);
        canvas.toObject(["data"]).objects.filter((o) => o.data.layer == id);
        o.objects = o.objects.filter((o) => o.data.layer == id);
        const jsonString = JSON.stringify(o);
        // fabricCanvas.loadFromJSON(jsonString, (n) => {
        //   console.log(n);
        // });
        fabricCanvas.forEachObject((element) => {
            element.scaleToHeight(120);
            element.scaleToWidth(130);
            element.left = ((element.left ?? 0) * 130) / width;
            element.top = ((element.top ?? 0) * 120) / height;
            element.width = ((element.width ?? 0) * 130) / width;
            element.height = ((element.height ?? 0) * 120) / height;
        });
        // const zoomOutValue = fabricCanvas.getZoom() - ZOOM_STEP;
        // if (zoomOutValue < 0) return;
        // fabricCanvas.setZoom(zoomOutValue);
        // ctx.canvas.width = 130;
        // ctx.canvas.height = 120;
        // canvas.forEachObject((element) => {
        //   if ((element.data as ElementData).layer == id) {
        //     element.drawObject(ctx);
        //   }
        // });
        // Get the scale to fit content to the canvas
        // const width = canvas.width ?? 0;
        // const height = canvas.height ?? 0;
        // const scale = Math.min(width / 130, height / 120);

        // // set the origin so that the scaled content is centered on the canvas
        // const origin = {
        //   x: (width - 130 * scale) / 2,
        //   y: (height - 120 * scale) / 2,
        // };

        // // Set the transform to scale and center on canvas
        // ctx.setTransform(scale, 0, 0, scale, origin.x, origin.y);
        fabricCanvas.requestRenderAll();
    }, [ref, canvas, selected]);
    return (
        <div>
            {/* Layer {order} */}
            <canvas id={id} ref={ref} />
        </div>
    );
});

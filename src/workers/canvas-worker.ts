// import { CanvasBoard } from "@/lib/canvas/canvas-board";
// import { CavasObjectMap } from "@/lib/canvas/canvas-objects/object-mapping";
// import { CanvasHelper } from "@/lib/canvas-helpers";
// import { CanvasMetadata } from "@/types/canvas";
// import { CanvasWorkerMessage } from "@/types/worker";

// const handle = 0;

// self.onmessage = (e: MessageEvent<CanvasWorkerMessage>) => {
//     console.log(e.data);
//     const { type, data }: CanvasWorkerMessage = e.data;
//     if (type == "redraw") {
//         redraw(data.metadata);
//     } else if (type == "redrawAsImage") {
//         redrawAsImage(data);
//     }
// };

// const redraw = ({ elements, size: { width, height }, transform }: CanvasMetadata) => {
//     const objArray = elements.map((ele) => {
//         return CavasObjectMap[ele.type](ele, new CanvasBoard());
//     });
//     const newO = new OffscreenCanvas(width, height);
//     const context = newO.getContext("2d");
//     if (context) {
//         CanvasHelper.clearOffscreenCanvasArea(context, transform, { width, height });
//         context.resetTransform();
//         const { a, b, c, d, e, f } = transform;
//         context.transform(a, b, c, d, e, f);
//         objArray.forEach((ele) => {
//             ele.drawOffscreen(context);
//         });
//         context.restore();
//         const btm = newO.transferToImageBitmap();
//         self.postMessage(btm);
//     }
// };

// const redrawAsImage = ({ metadata, imageData }: { metadata: CanvasMetadata; imageData: ImageData }) => {
//     const {
//         elements,
//         size: { width, height },
//         transform
//     } = metadata;
//     // const objArray = elements.map((ele) => {
//     //     return CavasObjectMap[ele.type](ele, new CanvasBoard());
//     // });
//     const newO = new OffscreenCanvas(width, height);
//     const context = newO.getContext("2d");
//     if (context) {
//         // CanvasHelper.clearOffscreenCanvasArea(context, transform, { width, height });
//         context.resetTransform();
//         const { a, b, c, d, e, f } = transform;
//         context.transform(a, b, c, d, e, f);
//         context.putImageData(imageData, 0, 0);
//         context.restore();
//         const btm = newO.transferToImageBitmap();
//         self.postMessage(btm);
//     }
// };

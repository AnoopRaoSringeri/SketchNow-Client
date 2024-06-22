import { CanvasMetadata } from "@/types/canvas";

export type CanvasWorkerMessage =
    | {
          type: "redraw";
          data: { metadata: CanvasMetadata };
      }
    | { type: "redrawAsImage"; data: { metadata: CanvasMetadata; imageData: ImageData } };

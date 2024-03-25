/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// import { Canvas } from "fabric";
import { Canvas } from "./index";

declare module "fabric" {
	interface Canvas {
		viewportTransform: never[];
		requestRenderAll(): unknown;
		getRetinaScaling(): number;
	}
}

export as namespace fabric;

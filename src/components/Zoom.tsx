import { observer } from "mobx-react";
import { useCanvasStore } from "../stores/canvas-store";
import { useCanvas } from "../hooks/canvas-context";
import { ZOOM_STEP } from "../types/canvas";
import { Button } from "./ui/button";
import { Minus, Plus, Search } from "lucide-react";

export const ZoomController = observer(function ZoomController() {
	const canvasStore = useCanvasStore();
	const { canvas } = useCanvas();

	return (
		<div className="flex-column absolute bottom-10 right-20 justify-center rounded border border-solid border-gray-50 p-5 align-middle">
			<Button>
				<Search />
			</Button>
			<div>{canvasStore.Zoom + "%"}</div>
			<Button
				onClick={() => {
					if (canvas) {
						const zoomOutValue = canvas.getZoom() - ZOOM_STEP;
						if (zoomOutValue < 0) return;
						canvasStore.Zoom = zoomOutValue * 100;
						canvas.setZoom(zoomOutValue);
						canvas.requestRenderAll();
					}
				}}
			>
				<Minus />
			</Button>
			<Button
				onClick={() => {
					if (canvas) {
						const zoomInValue = canvas.getZoom() + ZOOM_STEP;
						if (zoomInValue > 20) return;
						canvasStore.Zoom = zoomInValue * 100;
						canvas.setZoom(zoomInValue);
						canvas.requestRenderAll();
					}
				}}
			>
				<Plus />
			</Button>
		</div>
	);
});

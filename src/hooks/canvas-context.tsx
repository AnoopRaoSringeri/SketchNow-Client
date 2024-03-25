import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import { fabric, Canvas } from "fabric";
import { BaseFabricElement, Position } from "../types/canvas";
import { useCanvasStore } from "../stores/canvas-store";
import { observer } from "mobx-react";
import { _createElement, _updateElement } from "../lib/canvas-helpers";
import { v4 as uuid } from "uuid";
import { MenuPosition } from "../types/layout";
import json from "../test/data.json";
fabric.Object.prototype.objectCaching = false;
const WIDTH = 250;
const HEIGHT = 200;
interface FabricContext {
	canvas: fabric.Canvas | null;
	initCanvas: (
		element: HTMLCanvasElement | null,
		options: fabric.ICanvasOptions,
	) => unknown;
	setCanvas: (canvas: fabric.Canvas | null) => unknown;
}

export const FabricContext = createContext<FabricContext>({} as FabricContext);
type CanvasAction = "click" | "pan" | "zoom" | "none";
export const FabricContextProvider = observer(function FabricContextProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const canvasStore = useCanvasStore();
	const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
	const [minimap, setMinimap] = useState<Canvas | null>(null);
	const [action, setAction] = useState<CanvasAction>("none");
	const origin = useRef<Position | null>(null);
	const currentPointer = useRef<Position | null>(null);
	const ref = useRef(null);
	const initCanvas = useCallback(
		(element: HTMLCanvasElement | null, options: fabric.ICanvasOptions) => {
			const canvasOptions: fabric.ICanvasOptions = {
				...options,
			};
			const fabricCanvas = new fabric.Canvas(element, canvasOptions);
			fabricCanvas.requestRenderAll();
			const zoom = fabricCanvas.getZoom();
			canvasStore.Zoom = zoom * 100;
			setCanvas(fabricCanvas);
			const fabricCanvasMini = new fabric.Canvas(ref.current, {
				width: WIDTH,
				height: HEIGHT,
				selection: false,
			});
			// fabricCanvas.loadFromJSON(json, function () {
			//   fabricCanvas.requestRenderAll();
			// });
			// console.log(fabricCanvas.getObjects());
			fabricCanvas.requestRenderAll();
			setMinimap(fabricCanvasMini);
		},
		[],
	);

	useEffect(() => {
		if (!canvas) return;
		window.addEventListener("resize", onResize);
		return () => {
			window.removeEventListener("resize", onResize);
		};
	}, [canvas]);

	useLayoutEffect(() => {
		if (!canvas) return;
		if (canvasStore.ElementType == "pencil") {
			const { stroke, strokeWidth } = canvasStore.Options;
			canvas.isDrawingMode = true;
			canvas.freeDrawingCursor = "pencil";
			canvas.freeDrawingBrush.color = stroke;
			canvas.freeDrawingBrush.width = strokeWidth;
		} else {
			canvas.isDrawingMode = false;
		}
		if (canvasStore.ElementType == "none") {
			canvas.selection = true;
			canvas.forEachObject((element) => {
				element.set({
					selectable: true,
					hasControls: true,
					lockMovementX: false,
					lockMovementY: false,
					hasBorders: true,
					evented: true,
				});
				element.setCoords();
			});
		} else {
			if (!canvasStore.MenuPosition?.isLocked) {
				canvasStore.MenuPosition = null;
			}
			canvas.selection = false;
			canvas.forEachObject((element) => {
				element.set({
					selectable: false,
					hasControls: false,
					lockMovementX: true,
					lockMovementY: true,
					hasBorders: false,
					evented: false,
				});
			});
		}
		setCanvas(canvas);
		canvas.requestRenderAll();
	}, [canvas, canvasStore.ElementType]);

	useLayoutEffect(() => {
		if (!canvas) return;
		canvas.on("mouse:down", onMouseDown);
		canvas.on("mouse:move", mouseMoveHandler);
		canvas.on("mouse:up", onMouseUp);
		canvas.on("mouse:wheel", onMouseWheelMove);
		return () => {
			canvas?.off("mouse:down");
			canvas?.off("mouse:move");
			canvas?.off("mouse:up");
			canvas?.off("mouse:wheel");
		};
	}, [canvas, action, canvasStore.ElementType]);

	useLayoutEffect(() => {
		if (!canvas) return;
		if (canvasStore.ElementType != "none") return;
		canvas.on("selection:created", onSelection);
		canvas.on("selection:updated", onSelection);
		canvas.on("selection:cleared", onUnselect);
		canvas.on("object:moving", onObjectMove);
		canvas.on("object:modified", onObjectModify);
		return () => {
			canvas?.off("selection:created");
			canvas?.off("selection:updated");
			canvas?.off("selection:cleared");
			canvas?.off("object:moving");
			canvas?.off("object:modified");
		};
	}, [canvas, canvasStore.ElementType]);

	const onResize = () => {
		if (!canvas) return;
		canvas.setWidth(window.innerWidth);
		canvas.setHeight(window.innerHeight);
		canvas.requestRenderAll();
	};

	const onSelection = (event: fabric.IEvent<MouseEvent>) => {
		if (event.selected?.length == 1) {
			const selected = (event.selected?.[0] ?? null) as BaseFabricElement;
			const points = selected.getBoundingRect();
			canvasStore.SelectedElement = selected;
			if (!canvasStore.MenuPosition?.isLocked) {
				const menuPosition: MenuPosition = {
					x: (points.left ?? 0) + (points.width ?? 0) + 10,
					y: Math.abs(
						(points.top ?? 0) < 10
							? (points.height ?? 0) + 10
							: (points.top ?? 0) - 30,
					),
					isLocked: false,
				};
				canvasStore.MenuPosition = menuPosition;
			}
		}
	};

	const onUnselect = () => {
		canvasStore.SelectedElement = null;
		if (!canvasStore.MenuPosition?.isLocked) {
			canvasStore.MenuPosition = null;
		}
	};

	const onObjectMove = (event: fabric.IEvent<MouseEvent>) => {
		if (canvasStore.SelectedElement && !canvasStore.MenuPosition?.isLocked) {
			const selected = event.target as BaseFabricElement;
			selected.data.isMoving = true;
			canvasStore.SelectedElement = selected;
			const menuPosition: MenuPosition = {
				x: (selected.left ?? 0) + (selected.width ?? 0) + 10,
				y: Math.abs(
					(selected.top ?? 0) < 10
						? (selected.height ?? 0) + 10
						: (selected.top ?? 0) - 30,
				),
				isLocked: false,
			};
			canvasStore.MenuPosition = menuPosition;
		}
	};

	const onObjectModify = (event: fabric.IEvent<MouseEvent>) => {
		if (canvasStore.SelectedElement && !canvasStore.MenuPosition?.isLocked) {
			const selected = event.target as BaseFabricElement;
			selected.data.isMoving = false;
			canvasStore.SelectedElement = selected;
			const menuPosition: MenuPosition = {
				x: (selected.left ?? 0) + (selected.width ?? 0) + 10,
				y: Math.abs(
					(selected.top ?? 0) < 10
						? (selected.height ?? 0) + 10
						: (selected.top ?? 0) - 30,
				),
				isLocked: false,
			};
			canvasStore.MenuPosition = menuPosition;
		}
	};

	const onMouseDown = (event: fabric.IEvent<MouseEvent>) => {
		if (!canvas) return;
		const points = canvas?.getPointer(event.e);
		if (points) {
			origin.current = { x: points.x, y: points.y };
		}
		currentPointer.current = { x: event.e.clientX, y: event.e.clientY };
		if (event.e.detail == 2) {
			setAction("pan");
			canvas.selection = false;
			canvas.isDrawingMode = false;
			canvas.defaultCursor = "grabbing";
			canvas.discardActiveObject();
		} else {
			if (canvasStore.ElementType == "none") {
				return;
			}
			setAction("click");
			const ele = _createElement({
				type: canvasStore.ElementType,
				event,
				canvas,
				options: canvasStore.Options,
				layer: canvasStore.SelectedLayer,
			});
			if (ele) {
				canvas.add(ele);
				canvas.setActiveObject(ele);
			}
		}
		canvas.requestRenderAll();
		//  canvasStore.Version++;
	};

	const mouseMoveHandler = (event: fabric.IEvent<MouseEvent>) => {
		if (
			action == "none" ||
			!canvas ||
			!origin.current ||
			!currentPointer.current ||
			!minimap
		)
			return;
		if (action == "click" && canvasStore.ElementType != "none") {
			_updateElement({
				type: canvasStore.ElementType,
				event,
				origin: origin.current,
				canvas,
				options: canvasStore.Options,
			});
		} else if (action == "pan") {
			canvas.defaultCursor = "grabbing";
			const vpt = canvas.viewportTransform ?? [];
			vpt[4] += event.e.clientX - currentPointer.current.x;
			vpt[5] += event.e.clientY - currentPointer.current.y;
			canvas.setViewportTransform(canvas.viewportTransform ?? []);
			const minimapRatio = fabric.util.findScaleToFit(canvas, minimap);
			const scaling = minimap.getRetinaScaling();
			const vptMini = minimap.viewportTransform ?? [];
			vptMini[4] +=
				(event.e.clientX - currentPointer.current.x) * minimapRatio * scaling;
			vptMini[5] +=
				(event.e.clientY - currentPointer.current.y) * minimapRatio * scaling;
			minimap.requestRenderAll();
		}
		canvas.requestRenderAll();
		currentPointer.current = { x: event.e.clientX, y: event.e.clientY };
	};

	const onMouseWheelMove = (event: fabric.IEvent<WheelEvent>) => {
		if (!canvas) return;
		const delta = event.e.deltaY;
		let zoom = canvas.getZoom();
		canvasStore.Zoom = zoom * 100;
		zoom *= 0.999 ** delta;
		if (zoom > 20) zoom = 20;
		if (zoom < 0.01) zoom = 0.01;
		canvas.zoomToPoint({ x: event.e.offsetX, y: event.e.offsetY }, zoom);
		canvas.requestRenderAll();
		if (!minimap) {
			return;
		}
		const designSize = {
			width: canvas.getWidth(),
			height: canvas.getHeight(),
		};
		const originalVPT = canvas.viewportTransform;
		const designRatio = fabric.util.findScaleToFit(designSize, canvas);
		const minimapRatio = fabric.util.findScaleToFit(canvas, minimap);
		const scaling = minimap.getRetinaScaling();
		const finalWidth = designSize.width * designRatio;
		const finalHeight = designSize.height * designRatio;
		canvas.viewportTransform = [
			designRatio,
			0,
			0,
			designRatio,
			(canvas.getWidth() - finalWidth) / 2,
			(canvas.getHeight() - finalHeight) / 2,
		];
		minimap.zoomToPoint(
			{
				x: event.e.offsetX * minimapRatio * scaling,
				y: event.e.offsetY * minimapRatio * scaling,
			},
			zoom,
		);
		const canvas1 = canvas.toCanvasElement(minimapRatio * scaling);
		canvas.viewportTransform = originalVPT;
		const backgroundImage = new fabric.Image(canvas1);
		backgroundImage.scaleX = 1 / canvas.getRetinaScaling();
		backgroundImage.scaleY = 1 / canvas.getRetinaScaling();
		minimap.centerObject(backgroundImage);
		minimap.backgroundColor = "white";
		minimap.backgroundImage = backgroundImage;
		minimap.requestRenderAll();
		canvas.requestRenderAll();
		event.e.preventDefault();
		event.e.stopPropagation();
		//  canvasStore.Version++;
	};

	const onMouseUp = () => {
		if (
			action == "none" ||
			!canvas ||
			!origin.current ||
			!currentPointer.current
		)
			return;
		let active = canvas.getActiveObject();
		if (canvasStore.ElementType === "pencil") {
			const allObjects = canvas?.getObjects();
			if (allObjects && allObjects.length > 0) {
				active = allObjects[allObjects.length - 1];
				canvas.setActiveObject(active);
				allObjects[allObjects?.length - 1].set({
					data: { type: "pencil", id: uuid() },
				});
			}
		} else if (canvasStore.ElementType == "none") {
			canvas.selection = true;
		}
		setAction("none");
		canvas.setViewportTransform(canvas.viewportTransform ?? []);
		origin.current = null;
		currentPointer.current = null;
		canvas.defaultCursor = "default";
		if (!canvasStore.LockElementType) {
			canvasStore.ElementType = "none";
			if (active) {
				canvasStore.SelectedElement = active as BaseFabricElement;
			}
		} else {
			canvas.discardActiveObject();
		}
		canvas.requestRenderAll();
		if (!minimap) {
			return;
		}
		minimap.clear();
		const designSize = {
			width: canvas.getWidth(),
			height: canvas.getHeight(),
		};
		const originalVPT = canvas.viewportTransform;
		const designRatio = fabric.util.findScaleToFit(designSize, canvas);
		const minimapRatio = fabric.util.findScaleToFit(canvas, minimap);
		const scaling = minimap.getRetinaScaling();
		const finalWidth = designSize.width * designRatio;
		const finalHeight = designSize.height * designRatio;
		canvas.viewportTransform = [
			designRatio,
			0,
			0,
			designRatio,
			(canvas.getWidth() - finalWidth) / 2,
			(canvas.getHeight() - finalHeight) / 2,
		];
		const canvas1 = canvas.toCanvasElement(minimapRatio * scaling);
		canvas.viewportTransform = originalVPT;
		const backgroundImage = new fabric.Image(canvas1);
		backgroundImage.scaleX = 1 / canvas.getRetinaScaling();
		backgroundImage.scaleY = 1 / canvas.getRetinaScaling();
		minimap.centerObject(backgroundImage);
		minimap.backgroundColor = "white";
		minimap.backgroundImage = backgroundImage;
		const minimapView = new fabric.Rect({
			top: backgroundImage.top,
			left: backgroundImage.left,
			width: backgroundImage.width / canvas.getRetinaScaling(),
			height: backgroundImage.height / canvas.getRetinaScaling(),
			fill: "rgba(0, 0, 255, 0.3)",
			cornerSize: 6,
			transparentCorners: false,
			cornerColor: "blue",
			strokeWidth: 0,
		});
		minimapView.controls = {
			br: fabric.Object.prototype.controls.br,
		};
		minimap.add(minimapView);
		minimap.requestRenderAll();
		//  canvasStore.Version++;
	};

	return (
		<FabricContext.Provider
			value={{
				canvas: canvas,
				initCanvas,
				setCanvas,
			}}
		>
			{children}
			{/* <Flex
        align="center"
        justify="center"
        style={{
          position: "absolute",
          bottom: 20,
          left: 20,
          height: 210,
          width: 260,
          border: "1px solid black",
        }}
      >
        <canvas id="MniMap" ref={ref} />
      </Flex> */}
		</FabricContext.Provider>
	);
});

export const useCanvas = (): FabricContext => useContext(FabricContext);

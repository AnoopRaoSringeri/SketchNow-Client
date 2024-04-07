import { makeAutoObservable, runInAction, toJS } from "mobx";
import { createContext, ReactNode, useContext } from "react";
import { v4 as uuid } from "uuid";

import { Layout } from "@/lib/canvas-helpers";
import { BaseFabricElement, CanvasBoard, ElementType, Layer, Options, Views } from "@/types/canvas";
import { MenuPosition } from "@/types/layout";

class CanvasStore {
    constructor() {
        makeAutoObservable(this);
    }
    private _version = 0;
    private _canvasVersion = 0;
    private _view: Views = "infinite";
    private _zoom: number = 100;
    //
    private _canvaseBoard: CanvasBoard = {
        size: Layout[this._view],
        scale: 1,
        elements: []
    };
    private _elementType: ElementType = "pencil";
    private _lockElementType = false;
    private _options: Options = {
        stroke: "#000000ff",
        strokeWidth: 5
    };
    private menuPosition: MenuPosition | null = null;
    private selectedElement: BaseFabricElement | null = null;
    private layers: Layer[] = [
        {
            id: uuid(),
            order: 1
        }
    ];
    private selectedLayer: string = this.layers[0].id;

    get CanvasSize() {
        return this._canvaseBoard.size;
    }

    get CanvasScale() {
        return this._canvaseBoard.scale;
    }

    set CanvasScale(value: number) {
        runInAction(() => {
            this._canvaseBoard.scale = value ?? this.CanvasScale;
        });
    }

    get View() {
        return this._view;
    }

    set View(view: Views) {
        runInAction(() => {
            this._view = view;
            this._version++;
        });
    }

    get Zoom() {
        return this._zoom;
    }

    set Zoom(value: number) {
        runInAction(() => {
            this._zoom = Math.floor(value);
        });
    }

    get ElementType() {
        return this._elementType;
    }

    set ElementType(elementType: ElementType) {
        runInAction(() => {
            this._elementType = elementType;
            this._version++;
        });
    }

    get LockElementType() {
        return this._lockElementType;
    }

    set LockElementType(value: boolean) {
        runInAction(() => {
            this._lockElementType = value;
        });
    }

    toggleLockElementType() {
        runInAction(() => {
            this._lockElementType = !this._lockElementType;
        });
    }

    get Version() {
        return this._version;
    }

    set Version(value: number) {
        runInAction(() => {
            this._version = value;
        });
    }

    get CanvasVersion() {
        return this._version;
    }

    get SelectedElement() {
        return toJS(this.selectedElement) as BaseFabricElement;
    }

    set SelectedElement(ele: BaseFabricElement | null) {
        runInAction(() => {
            this.selectedElement = ele;
        });
    }

    get MenuPosition() {
        return toJS(this.menuPosition);
    }

    set MenuPosition(position: MenuPosition | null) {
        runInAction(() => {
            this.menuPosition = position;
        });
    }

    get Options() {
        return toJS(this._options);
    }

    get Layers() {
        return toJS(this.layers);
    }

    set Layers(layers: Layer[]) {
        runInAction(() => {
            this.layers = layers;
        });
    }

    get SelectedLayer() {
        return this.selectedLayer;
    }

    set SelectedLayer(layer: string) {
        runInAction(() => {
            this.selectedLayer = layer;
        });
    }

    toggleMenuLock() {
        runInAction(() => {
            if (!this.menuPosition) {
                return;
            }
            this.menuPosition.isLocked = !this.menuPosition.isLocked;
        });
    }

    updateCanvasVersion() {
        runInAction(() => {
            this._canvasVersion++;
        });
    }

    updateOptions<T extends keyof Options>(key: T, value: Options[T]) {
        runInAction(() => {
            this._options[key] = value;
            this._version++;
        });
    }

    addLayer() {
        runInAction(() => {
            this.layers.push({
                id: uuid(),
                order: this.layers.length + 1
            });
        });
    }
}

const canvasStore = new CanvasStore();

const CanvasStoreContext = createContext<CanvasStore>(canvasStore);

export const CanvasStoreProvider = ({ children }: { children: ReactNode }) => {
    const storeContext = useContext(CanvasStoreContext);
    return <CanvasStoreContext.Provider value={storeContext}>{children}</CanvasStoreContext.Provider>;
};

export const useCanvasStore = () => {
    return useContext(CanvasStoreContext);
};

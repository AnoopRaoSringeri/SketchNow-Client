/* eslint-disable import/no-unresolved */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { fabric } from "fabric";
import { ICanvasOptions, IPoint, Object as FabObject, Point } from "fabric/fabric-impl";

export interface Canvas extends fabric.Canvas {
    /**
     * Constructor
     * @param element <canvas> element to initialize instance on
     * @param [options] Options object
     */
    /**
     * Constructor
     * @param {HTMLCanvasElement | String} element <canvas> element to initialize instance on
     * @param {FabObject} [options] Options object
     * @return {FabObject} thisArg
     */
    initialize(element: HTMLCanvasElement | string | null, options?: ICanvasOptions): Canvas;

    /**
     * When true, target detection is skipped when hovering over canvas. This can be used to improve performance.
     * @default
     */
    skipTargetFind: boolean;
    _activeObject: FabObject;
    _objects: FabObject[];
    targets: FabObject[];
    /**
     * Indicates which key enable alternative selection
     * in case of target overlapping with active object
     * values: 'altKey', 'shiftKey', 'ctrlKey'.
     * For a series of reason that come from the general expectations on how
     * things should work, this feature works only for preserveObjectStacking true.
     * If `null` or 'none' or any other string that is not a modifier key
     * feature is disabled.
     * @since 1.6.5
     * @default
     */
    altSelectionKey?: string | undefined;

    /**
     * Renders both the top canvas and the secondary container canvas.
     * @return {fabric.Canvas} instance
     * @chainable
     */
    renderAll(): Canvas;
    /**
     * Method to render only the top canvas.
     * Also used to render the group selection box.
     * @return {fabric.Canvas} thisArg
     * @chainable
     */
    renderTop(): Canvas;
    /**
     * Checks if point is contained within an area of given object
     * @param {Event} e Event object
     * @param {fabric.FabObject} target FabObject to test against
     * @param {FabObject} [point] x,y object of point coordinates we want to check.
     * @return {Boolean} true if point is contained within an area of given object
     */
    containsPoint(e: Event, target: FabObject, point?: { x: number; y: number }): boolean;
    /**
     * Returns true if object is transparent at a certain location
     * @param {fabric.FabObject} target FabObject to check
     * @param {Number} x Left coordinate
     * @param {Number} y Top coordinate
     * @return {Boolean}
     */
    isTargetTransparent(target: FabObject, x: number, y: number): boolean;
    /**
     * Set the cursor type of the canvas element
     * @param {String} value Cursor type of the canvas element.
     * @see http://www.w3.org/TR/css3-ui/#cursor
     */
    setCursor(value: string): void;
    /**
     * Method that determines what object we are clicking on
     * the skipGroup parameter is for internal use, is needed for shift+click action
     * 11/09/2018 TODO: would be cool if findTarget could discern between being a full target
     * or the outside part of the corner.
     * @param {Event} e mouse event
     * @param {Boolean} skipGroup when true, activeGroup is skipped and only objects are traversed through
     * @return {fabric.FabObject} the target found
     */
    findTarget(e: Event, skipGroup: boolean): FabObject | undefined;
    /**
     * Returns pointer coordinates without the effect of the viewport
     * @param {FabObject} pointer with "x" and "y" number values
     * @return {FabObject} object with "x" and "y" number values
     */
    restorePointerVpt(pointer: IPoint): any;
    /**
     * Returns pointer coordinates relative to canvas.
     * Can return coordinates with or without viewportTransform.
     * ignoreZoom false gives back coordinates that represent
     * the point clicked on canvas element.
     * ignoreZoom true gives back coordinates after being processed
     * by the viewportTransform ( sort of coordinates of what is displayed
     * on the canvas where you are clicking.
     * ignoreZoom true = HTMLElement coordinates relative to top,left
     * ignoreZoom false, default = fabric space coordinates, the same used for shape position
     * To interact with your shapes top and left you want to use ignoreZoom true
     * most of the time, while ignoreZoom false will give you coordinates
     * compatible with the object.oCoords system.
     * of the time.
     * @param {Event} e
     * @param {Boolean} ignoreZoom
     * @return {FabObject} object with "x" and "y" number values
     */
    getPointer(e: Event, ignoreZoom?: boolean): { x: number; y: number };
    /**
     * Returns context of canvas where object selection is drawn
     * @return {CanvasRenderingContext2D}
     */
    getSelectionContext(): CanvasRenderingContext2D;
    /**
     * Returns <canvas> element on which object selection is drawn
     * @return {HTMLCanvasElement}
     */
    getSelectionElement(): HTMLCanvasElement;
    /**
     * Returns currently active object
     * @return {fabric.FabObject} active object
     */
    getActiveObject(): FabObject | null;
    /**
     * Returns an array with the current selected objects
     * @return {fabric.FabObject} active object
     */
    getActiveObjects(): FabObject[];
    /**
     * Sets given object as the only active object on canvas
     * @param {fabric.FabObject} object FabObject to set as an active one
     * @param {Event} [e] Event (passed along when firing "object:selected")
     * @return {fabric.Canvas} thisArg
     * @chainable
     */
    setActiveObject(object: FabObject, e?: Event): Canvas;
    /**
     * Discards currently active object and fire events. If the function is called by fabric
     * as a consequence of a mouse event, the event is passed as a parameter and
     * sent to the fire function for the custom events. When used as a method the
     * e param does not have any application.
     * @param {event} e
     * @return {fabric.Canvas} thisArg
     * @chainable
     */
    discardActiveObject(e?: Event): Canvas;
    /**
     * Clears a canvas element and removes all event listeners
     * @return {fabric.Canvas} thisArg
     * @chainable
     */
    dispose(): Canvas;
    /**
     * Clears all contexts (background, main, top) of an instance
     * @return {fabric.Canvas} thisArg
     * @chainable
     */
    clear(): Canvas;
    /**
     * Draws objects' controls (borders/controls)
     * @param {CanvasRenderingContext2D} ctx Context to render controls on
     */
    drawControls(ctx: CanvasRenderingContext2D): void;
    /**
     * @return {Boolean} true if the scaling occurred
     */
    _setObjectScale(
        localMouse: Point,
        transform: any,
        lockScalingX: boolean,
        lockScalingY: boolean,
        by: "x" | "y" | "equally" | undefined,
        lockScalingFlip: boolean,
        _dim: Point
    ): boolean;
    /**
     * Scales object by invoking its scaleX/scaleY methods
     * @param {Number} x pointer's x coordinate
     * @param {Number} y pointer's y coordinate
     * @param {String} by Either 'x' or 'y' - specifies dimension constraint by which to scale an object.
     *                    When not provided, an object is scaled by both dimensions equally
     * @return {Boolean} true if the scaling occurred
     */
    _scaleObject(x: number, y: number, by?: "x" | "y" | "equally"): boolean;
    /**
     * @param {fabric.FabObject} obj FabObject that was removed
     */
    _onObjectRemoved(obj: FabObject): void;
    /**
     * @param {fabric.FabObject} obj FabObject that was added
     */
    _onObjectAdded(obj: FabObject): void;
    /**
     * Resets the current transform to its original values and chooses the type of resizing based on the event
     */
    _resetCurrentTransform(): void;
    /**
     * Compares the old activeObject with the current one and fires correct events
     * @param {fabric.FabObject} obj old activeObject
     */
    _fireSelectionEvents(oldObjects: FabObject[], e?: Event): void;
    /**
     * @param {FabObject} object to set as active
     * @param {Event} [e] Event (passed along when firing "object:selected")
     * @return {Boolean} true if the selection happened
     */
    _setActiveObject(object: fabric.Object, e?: Event): boolean;
    /**
     * Returns pointer coordinates relative to canvas.
     * Can return coordinates with or without viewportTransform.
     * ignoreZoom false gives back coordinates that represent
     * the point clicked on canvas element.
     * ignoreZoom true gives back coordinates after being processed
     * by the viewportTransform ( sort of coordinates of what is displayed
     * on the canvas where you are clicking.
     * ignoreZoom true = HTMLElement coordinates relative to top,left
     * ignoreZoom false, default = fabric space coordinates, the same used for shape position
     * To interact with your shapes top and left you want to use ignoreZoom true
     * most of the time, while ignoreZoom false will give you coordinates
     * compatible with the object.oCoords system.
     * of the time.
     * @param {Event} e
     * @param {Boolean} ignoreZoom
     * @return {FabObject} object with "x" and "y" number values
     */
    getPointer(e: Event, ignoreZoom: boolean): { x: number; y: number };
    /**
     * Function used to search inside objects an object that contains pointer in bounding box or that contains pointerOnCanvas when painted
     * @param {Array} [objects] objects array to look into
     * @param {FabObject} [pointer] x,y object of point coordinates we want to check.
     * @return {fabric.FabObject} object that contains pointer
     */
    _searchPossibleTargets(objects: FabObject[], pointer: { x: number; y: number }): FabObject;

    EMPTY_JSON: string;
    /**
     * Provides a way to check support of some of the canvas methods
     * (either those of HTMLCanvasElement itself, or rendering context)
     * @param methodName Method to check support for; Could be one of "getImageData", "toDataURL", "toDataURLWithQuality" or "setLineDash"
     */
    supports(methodName: "getImageData" | "toDataURL" | "toDataURLWithQuality" | "setLineDash"): boolean;
    /**
     * Returns JSON representation of canvas
     * @param [propertiesToInclude] Any properties that you might want to additionally include in the output
     */
    toJSON(propertiesToInclude?: string[]): {
        version: string;
        objects: FabObject[];
    };
    /**
     * Removes all event listeners
     */
    removeListeners(): void;
}

export interface IUtil extends fabric.IUtil {}

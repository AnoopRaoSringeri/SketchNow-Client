import { observer } from "mobx-react";

import { CustomCanvas } from "./custom-canvas";
import CustomCanvasOptions from "./custom-canvasOptions";

export const CustomCanvasWrapper = observer(function CustomCanvasWrapper() {
    return (
        <div className="flex size-full overflow-hidden bg-gray-200">
            <div className="absolute flex size-full items-center justify-center bg-transparent">
                <CustomCanvasOptions />
            </div>
            <CustomCanvas />
        </div>
    );
});

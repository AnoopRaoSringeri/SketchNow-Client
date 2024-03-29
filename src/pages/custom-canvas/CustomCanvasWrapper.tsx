import { observer } from "mobx-react";

import { CustomCanvas } from "./CustomCanvas";

export const CustomCanvasWrapper = observer(function CustomCanvasWrapper() {
    return (
        <>
            <CustomCanvas />
        </>
    );
});

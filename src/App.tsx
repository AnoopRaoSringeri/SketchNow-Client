import "react-color-palette/css";

import { FabricContextProvider } from "./hooks/canvas-context";
import { CustomCanavsContextProvider } from "./hooks/custom-canvas-context";
import AppContainer from "./layouts/Container";
import { CanvasStoreProvider } from "./stores/canvas-store";

function App() {
    return (
        <CanvasStoreProvider>
            <CustomCanavsContextProvider>
                <FabricContextProvider>
                    <AppContainer />
                </FabricContextProvider>
            </CustomCanavsContextProvider>
        </CanvasStoreProvider>
    );
}

export default App;

import AppContainer from "./layouts/Container";
import { CanvasStoreProvider } from "./stores/canvas-store";
import { CustomCanavsContextProvider } from "./hooks/custom-canvas-context";
import { FabricContextProvider } from "./hooks/canvas-context";

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

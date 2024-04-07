import "react-color-palette/css";

import { StoreProvider } from "@/api-stores/store-provider";
import { Toaster } from "@/components/ui/sonner";
import { CanvasStoreProvider } from "@/data-stores/canvas-store";
import { FabricContextProvider } from "@/hooks/canvas-context";
import { CustomCanavsContextProvider } from "@/hooks/custom-canvas-context";
import AppContainer from "@/pages/app-container";

function App() {
    return (
        <StoreProvider>
            <CanvasStoreProvider>
                <CustomCanavsContextProvider>
                    <FabricContextProvider>
                        <Toaster />
                        <AppContainer />
                    </FabricContextProvider>
                </CustomCanavsContextProvider>
            </CanvasStoreProvider>
        </StoreProvider>
    );
}

export default App;

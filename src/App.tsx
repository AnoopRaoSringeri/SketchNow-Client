import "react-color-palette/css";

import { StoreProvider } from "@/api-stores/store-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { CanvasStoreProvider } from "@/data-stores/canvas-store";
import { FabricContextProvider } from "@/hooks/canvas-context";
import { CustomCanavsContextProvider } from "@/hooks/custom-canvas-context";
import { LayoutProvider } from "@/hooks/layout-provider";
import AppContainer from "@/pages/app-container";

function App() {
    return (
        <LayoutProvider>
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
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
            </ThemeProvider>
        </LayoutProvider>
    );
}

export default App;

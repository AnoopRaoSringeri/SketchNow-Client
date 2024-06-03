import "react-color-palette/css";

import { StoreProvider } from "@/api-stores/store-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { Cursor } from "@/components/ui/cursor";
import { Toaster } from "@/components/ui/sonner";
import MouseContextProvider, { useCustomCursor } from "@/hooks/curser-provider";
import { LayoutProvider } from "@/hooks/layout-provider";
import AppContainer from "@/pages/app-container";

function App() {
    return (
        <LayoutProvider>
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                <StoreProvider>
                    <MouseContextProvider>
                        <ProviderWrapper />
                    </MouseContextProvider>
                </StoreProvider>
            </ThemeProvider>
        </LayoutProvider>
    );
}

function ProviderWrapper() {
    const { cursorType } = useCustomCursor();

    return (
        <>
            <Toaster />
            {cursorType != "none" ? <Cursor /> : null}
            <AppContainer />
        </>
    );
}

export default App;

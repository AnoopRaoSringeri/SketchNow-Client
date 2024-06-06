import "react-color-palette/css";

import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

import { StoreProvider } from "@/api-stores/store-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { Cursor } from "@/components/ui/cursor";
import { Toaster } from "@/components/ui/sonner";
import MouseContextProvider, { useCustomCursor } from "@/hooks/curser-provider";
import { LayoutProvider } from "@/hooks/layout-provider";
import AppContainer from "@/pages/app-container";

const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <LayoutProvider>
                <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                    <StoreProvider>
                        <MouseContextProvider>
                            <ProviderWrapper />
                            <ReactQueryDevtools />
                        </MouseContextProvider>
                    </StoreProvider>
                </ThemeProvider>
            </LayoutProvider>
        </QueryClientProvider>
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

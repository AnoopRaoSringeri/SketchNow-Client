import { createContext, useContext, useMemo, useState } from "react";

import { AppShellPrimary } from "@/components/custom-ui/app-shell-primary";
import { AppShell } from "@/components/custom-ui/app-shell-secondary";

type Layout = "simple" | "secondary";

type LayoutProviderProps = {
    children: React.ReactNode;
    defaultLayout?: Layout;
    storageKey?: string;
};

type LayoutProviderState = {
    layout: Layout;
    setLayout: (layout: Layout) => void;
    element: JSX.Element;
};

const initialState: LayoutProviderState = {
    layout: "simple",
    setLayout: () => null,
    element: <AppShellPrimary />
};

const LayoutProviderContext = createContext<LayoutProviderState>(initialState);

export function LayoutProvider({
    children,
    defaultLayout = "simple",
    storageKey = "layout",
    ...props
}: LayoutProviderProps) {
    const [layout, setLayout] = useState<Layout>(() => (localStorage.getItem(storageKey) as Layout) || defaultLayout);

    const AppLayout = useMemo(() => {
        return layout === "simple" ? <AppShellPrimary /> : <AppShell navbarActions={[]} navbarVisble={true} />;
    }, [layout]);

    const value = {
        element: AppLayout,
        layout: layout,
        setLayout: (layout: Layout) => {
            localStorage.setItem(storageKey, layout);
            setLayout(layout);
        }
    };

    return (
        <LayoutProviderContext.Provider {...props} value={value}>
            {children}
        </LayoutProviderContext.Provider>
    );
}

export const useLayout = () => {
    const context = useContext(LayoutProviderContext);

    if (context === undefined) {
        throw new Error("useLayout must be used within a LayoutProvider");
    }

    return context;
};

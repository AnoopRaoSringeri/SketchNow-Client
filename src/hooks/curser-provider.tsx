import { createContext, ReactNode, useContext, useEffect, useState } from "react";

type CursorType = "pencil" | "arrow" | "none";

type MouseContextState = {
    cursorType: CursorType;
    cursorChangeHandler: (cursorType: CursorType) => void;
};

const initialState: MouseContextState = {
    cursorType: "none",
    cursorChangeHandler: () => null
};

export const MouseContext = createContext<MouseContextState>(initialState);

const MouseContextProvider = ({ children }: { children: ReactNode }) => {
    const [cursorType, setCursorType] = useState<CursorType>("none");

    useEffect(() => {
        const root = window.document.documentElement;
        if (cursorType !== "none") {
            root.classList.add("custom-cursor");
            return;
        } else {
            root.classList.remove("custom-cursor");
        }
    }, [cursorType]);

    const cursorChangeHandler = (cursorType: CursorType) => {
        setCursorType(cursorType);
    };

    return (
        <MouseContext.Provider
            value={{
                cursorType: cursorType,
                cursorChangeHandler: cursorChangeHandler
            }}
        >
            {children}
        </MouseContext.Provider>
    );
};

export const useCustomCursor = () => {
    const context = useContext(MouseContext);

    if (context === undefined) {
        throw new Error("useCustomCursor must be used within a MouseContextProvider");
    }

    return context;
};

export default MouseContextProvider;

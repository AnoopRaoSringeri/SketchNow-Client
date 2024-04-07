import { createContext, ReactNode, useContext } from "react";

import AuthStore from "@/api-stores/auth-store";

const store = {
    authStore: new AuthStore()
};

const StoreContex = createContext(store);

const useStore = () => {
    return useContext(StoreContex);
};

const StoreProvider = ({ children }: { children: ReactNode }) => {
    const storeValue = useContext(StoreContex);
    return <StoreContex.Provider value={storeValue}>{children}</StoreContex.Provider>;
};
export { StoreProvider, useStore };

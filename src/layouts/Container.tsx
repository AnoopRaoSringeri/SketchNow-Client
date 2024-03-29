import { Suspense } from "react";
import { Route, Routes } from "react-router";
import { BrowserRouter } from "react-router-dom";

import { Loader } from "@/components/ui/loader";
import CanvasLayoutWrapper from "@/pages/canvas/CanvasLayoutWrapper";
import { CustomCanvasWrapper } from "@/pages/custom-canvas/CustomCanvasWrapper";
import Home from "@/pages/home/Home";

function AppContainer() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="sketch">
                    <Route
                        path="/sketch/new"
                        element={
                            <Suspense fallback={<Loader />}>
                                <CanvasLayoutWrapper />
                            </Suspense>
                        }
                    />
                    <Route
                        path="/sketch/custom/new"
                        element={
                            <Suspense fallback={<Loader />}>
                                <CustomCanvasWrapper />
                            </Suspense>
                        }
                    />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default AppContainer;

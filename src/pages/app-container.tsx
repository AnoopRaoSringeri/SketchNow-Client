import { Suspense } from "react";
import { Route, Routes } from "react-router";
import { BrowserRouter } from "react-router-dom";

import { Loader } from "@/components/ui/loader";
import { useLayout } from "@/hooks/layout-provider";
import { Auth } from "@/pages/auth/auth-page";
import { LogInPage } from "@/pages/auth/login-page";
import { RegisterPage } from "@/pages/auth/register-page";
import CanvasLayoutWrapper from "@/pages/canvas/canvas-layout-wrapper";
import SketchList from "@/pages/canvas/sketches";
import { CustomCanvasWrapper } from "@/pages/custom-canvas/custom-canvas-wrapper";

function AppContainer() {
    const { element } = useLayout();
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Auth />}>
                    <Route
                        path=""
                        element={
                            <Suspense fallback={<Loader />}>
                                <LogInPage />
                            </Suspense>
                        }
                    />
                    <Route
                        path="register"
                        element={
                            <Suspense fallback={<Loader />}>
                                <RegisterPage />
                            </Suspense>
                        }
                    />
                </Route>
                <Route path="/playground" element={element} />
                <Route path="sketch" element={element}>
                    <Route
                        path=""
                        element={
                            <Suspense fallback={<Loader />}>
                                <SketchList />
                            </Suspense>
                        }
                    />
                    <Route
                        path="/sketch/new"
                        element={
                            <Suspense fallback={<Loader />}>
                                <CanvasLayoutWrapper />
                            </Suspense>
                        }
                    />
                    <Route
                        path="/sketch/:id"
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

import { observer } from "mobx-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { useStore } from "@/api-stores/store-provider";
import { Button } from "@/components/ui/button";

import Login from "./login";
import Register from "./register";

function Home() {
    const { authStore } = useStore();
    const navigate = useNavigate();
    const isAuthenticated = localStorage.getItem("IsAuthenticated");

    useEffect(() => {
        if (isAuthenticated == "true") {
            refreshToken();
        }
    }, []);

    const refreshToken = async () => {
        const res = await authStore.IsValidSession();
        if (!res) {
            navigate("/");
            localStorage.removeItem("IsAuthenticated");
            toast.error("Session expired login again");
            authStore.IsSessionValid = false;
        } else {
            authStore.IsSessionValid = true;
        }
    };

    const logout = async () => {
        await authStore.Logout();
        localStorage.removeItem("IsAuthenticated");
        authStore.IsSessionValid = false;
    };

    return (
        <div className="w-full flex-1 gap-20 bg-gray-500">
            <div className="fixed top-[100px] flex w-full flex-col items-center justify-center gap-[50px]">
                <div className="text-[75px]">Sketch your ideas</div>
                <div className="flex gap-5">
                    {authStore.IsSessionValid ? (
                        <>
                            <Button
                                onClick={() => {
                                    navigate("/sketch/new");
                                }}
                            >
                                Start Sketching
                            </Button>
                            <Button
                                onClick={() => {
                                    navigate("/sketch/custom/new");
                                }}
                            >
                                Custom Sketching
                            </Button>
                            <Button
                                onClick={() => {
                                    logout();
                                }}
                            >
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Register />
                            <Login />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default observer(Home);

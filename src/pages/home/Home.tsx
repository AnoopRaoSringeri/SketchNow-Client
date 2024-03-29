import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

function Home() {
    const navigate = useNavigate();

    return (
        <div className="w-full flex-1 gap-20 bg-gray-500">
            <div className="fixed top-[100px] flex w-full flex-col items-center justify-center gap-[50px]">
                <div className="text-[75px]">Sketch your ideas</div>
                <div className="flex gap-5">
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
                            navigate("/sketch/new");
                        }}
                    >
                        Register
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default Home;

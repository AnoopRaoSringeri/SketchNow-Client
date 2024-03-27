import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();

    return (
        <div className="w-full flex-1 gap-20 bg-gray-600">
            <div className="fixed top-[100px] flex w-full flex-col justify-center gap-[50px] align-middle">
                <div className="text-[75px]">Sketch your ideas</div>

                <div>
                    <div
                        onClick={() => {
                            navigate("/sketch/new");
                        }}
                    >
                        Start Sketching
                    </div>

                    <div
                        onClick={() => {
                            navigate("/sketch/custom/new");
                        }}
                    >
                        Custom Sketching
                    </div>

                    <div
                        onClick={() => {
                            navigate("/sketch/new");
                        }}
                    >
                        Register
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;

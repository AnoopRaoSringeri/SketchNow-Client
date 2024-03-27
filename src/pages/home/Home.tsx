import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();

    return (
        <div
            style={{
                flex: 1,
                width: "100%",
                backgroundColor: "#495057",
                gap: "20px"
            }}
        >
            <div
                style={{
                    display: "flex",

                    alignItems: "center",

                    justifyContent: "center",

                    position: "fixed",

                    top: 100,

                    width: "100%",

                    flexDirection: "column",

                    justifyItems: "center",

                    gap: 50
                }}
            >
                <div style={{ fontSize: "75px" }}>Sketch your ideas</div>

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

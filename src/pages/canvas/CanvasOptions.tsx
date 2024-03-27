import { observer } from "mobx-react";
import { useCanvas } from "@/hooks/canvas-context";

const CanvasOptions = observer(function CanvasOptions() {
    const { canvas } = useCanvas();

    if (!canvas) {
        return <div />;
    }
    return (
        <div
            style={{
                position: "absolute",
                top: 20,
                right: 20,
                zIndex: 1
            }}
        >
            {/* <ActionIcon variant="filled">
        <Icon
          icon="save"
          onClick={() => {
            console.log(canvas.toJSON(["data", "fill", "fillStyle"]));
          }}
        />
      </ActionIcon> */}
        </div>
    );
});

export default CanvasOptions;

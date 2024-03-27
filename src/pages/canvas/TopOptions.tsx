import classes from "./canvas.module.css";
import { observer } from "mobx-react";
import { useCanvas } from "@/hooks/canvas-context";
import { useCanvasStore } from "@/stores/canvas-store";
import { useElementSize } from "@mantine/hooks";
import { useState } from "react";

const TopCanvasOptions = observer(function TopCanvasOptions({ buttonWidth = 50 }: { buttonWidth?: number }) {
    const canvasStore = useCanvasStore();
    const { canvas } = useCanvas();
    const [color, setColor] = useState<string>(canvasStore.Options.stroke);
    const { ref: elementRef, width } = useElementSize();
    const [strokeWidth, setStrokeWidth] = useState<number>(canvasStore.Options.strokeWidth);

    return (
        <div
            ref={elementRef}
            className={classes.top}
            //   style={{
            //     "--width": width + "px",
            //     "--height": "50px",
            //     "--buttonWidth": buttonWidth + "px"
            //   }}
        >
            {/* <Flex direction="column" align="center">
        <Box className={classes.topContent}>
          <Menu width={250}>
            <Menu.Target>
              <ActionIcon className="actionBtn" variant="default">
                <Icon icon="palette" color={canvasStore.Options.stroke} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <ColorPicker
                swatchesPerRow={10}
                style={{ width: "100%" }}
                format="hexa"
                value={color}
                onChange={(color) => {
                  setColor(color);
                }}
                onChangeEnd={(c) => {
                  canvasStore.updateOptions("stroke", c);
                  setColor(c);
                  if (canvas) {
                    canvas.freeDrawingBrush.color = c;
                  }
                }}
                swatches={[...DEFAULT_THEME.colors.red, ...DEFAULT_THEME.colors.green, ...DEFAULT_THEME.colors.blue]}
              />
            </Menu.Dropdown>
          </Menu>
          <Menu width={250}>
            <Menu.Target>
              <ActionIcon className="actionBtn" variant="default">
                <Icon icon="pen-ruler" />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Slider
                value={strokeWidth}
                onChange={setStrokeWidth}
                min={1}
                max={100}
                onChangeEnd={(value) => {
                  canvasStore.updateOptions("strokeWidth", value);
                  if (canvas) {
                    canvas.freeDrawingBrush.width = value;
                  }
                }}
              />
            </Menu.Dropdown>
          </Menu>
        </Box>
      </Flex> */}
        </div>
    );
});

export default TopCanvasOptions;

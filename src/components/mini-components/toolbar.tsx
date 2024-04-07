import { Copy, Delete } from "lucide-react";
import { observer } from "mobx-react";

import { Button } from "../ui/button";

export const ElementType = observer(function ElementType() {
    return (
        <div className="left-[50px] top-[50px] flex-col">
            <Button>
                <Copy />
            </Button>
            <Button>
                <Delete />
            </Button>
        </div>
    );
});

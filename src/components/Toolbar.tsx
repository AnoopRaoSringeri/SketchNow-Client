import { observer } from "mobx-react";
import { Button } from "./ui/button";
import { Copy, Delete } from "lucide-react";

export const ElementType = observer(function ElementType() {
	return (
		<div className="flex-column left-[50px] top-[50px]">
			<Button>
				<Copy />
			</Button>
			<Button>
				<Delete />
			</Button>
		</div>
	);
});

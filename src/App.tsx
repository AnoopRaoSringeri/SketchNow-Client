import AppContainer from "./layouts/Container";
import { library } from "@fortawesome/fontawesome-svg-core";
import * as FasIcons from "@fortawesome/free-solid-svg-icons";
import * as FabIcons from "@fortawesome/free-brands-svg-icons";
import * as FarIcons from "@fortawesome/free-regular-svg-icons";
import { CanvasStoreProvider } from "./stores/canvas-store";
import { FabricContextProvider } from "./hooks/canvas-context";
import { CustomCanavsContextProvider } from "./hooks/custom-canvas-context";
const iconList = [
	...Object.keys(FasIcons)
		.filter((key) => key !== "fas" && key !== "prefix")
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		.map((icon) => (FasIcons as any)[icon]),
	...Object.keys(FabIcons)
		.filter((key) => key !== "fab" && key !== "prefix")
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		.map((icon) => (FabIcons as any)[icon]),
	...Object.keys(FarIcons)
		.filter((key) => key !== "far" && key !== "prefix")
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		.map((icon) => (FarIcons as any)[icon]),
];

library.add(...iconList);
function App() {
	return (
		<CanvasStoreProvider>
			<CustomCanavsContextProvider>
				<FabricContextProvider>
					<AppContainer />
				</FabricContextProvider>
			</CustomCanavsContextProvider>
		</CanvasStoreProvider>
	);
}

export default App;

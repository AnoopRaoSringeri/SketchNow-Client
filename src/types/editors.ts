import { ElementType } from "./canvas";

export type ElementOptionType = "Colour" | "Slider" | "Number";

export type OptionType = {
	optionKey: keyof fabric.Object;
	type: ElementOptionType;
	title: string;
};
export interface RegistryType {
	type: Exclude<ElementType, "none">;
	options: OptionType[];
}

export const Registry: Map<RegistryType["type"], RegistryType> = new Map([
	[
		"line",
		{
			type: "line",
			options: [
				{ type: "Colour", optionKey: "stroke", title: "Colour" },
				{ type: "Slider", optionKey: "strokeWidth", title: "Line Stroke" },
			],
		},
	],
	[
		"rectangle",
		{
			type: "rectangle",
			options: [
				{ type: "Colour", optionKey: "stroke", title: "Colour" },
				{ type: "Slider", optionKey: "strokeWidth", title: "Line Stroke" },
				{ type: "Colour", optionKey: "fill", title: "Fill Colour" },
			],
		},
	],
	[
		"square",
		{
			type: "square",
			options: [
				{ type: "Colour", optionKey: "stroke", title: "Colour" },
				{ type: "Slider", optionKey: "strokeWidth", title: "Line Stroke" },
				{ type: "Colour", optionKey: "fill", title: "Fill Colour" },
			],
		},
	],
	[
		"pencil",
		{
			type: "pencil",
			options: [
				{ type: "Colour", optionKey: "stroke", title: "Colour" },
				{ type: "Slider", optionKey: "strokeWidth", title: "Line Stroke" },
			],
		},
	],
	[
		"circle",
		{
			type: "circle",
			options: [
				{ type: "Colour", optionKey: "stroke", title: "Colour" },
				{ type: "Slider", optionKey: "strokeWidth", title: "Line Stroke" },
				{ type: "Colour", optionKey: "fill", title: "Fill Colour" },
			],
		},
	],
]);

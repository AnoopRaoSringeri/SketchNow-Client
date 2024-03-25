import React from "react";
import { Button, ButtonProps, buttonVariants } from "./button";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export const ActionIcon = React.forwardRef<
	HTMLButtonElement,
	ButtonProps & { icon: LucideIcon }
>(function ActionIcon({ className, variant, size, icon: Icon, ...props }, ref) {
	return (
		<Button
			className={cn(buttonVariants({ variant, size, className }))}
			ref={ref}
			{...props}
		>
			<Icon />
		</Button>
	);
});

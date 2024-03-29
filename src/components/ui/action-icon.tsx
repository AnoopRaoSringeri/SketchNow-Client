import { LucideIcon } from "lucide-react";
import React from "react";

import { cn } from "@/lib/utils";

import { Button, ButtonProps, buttonVariants } from "./button";

export const ActionIcon = React.forwardRef<HTMLButtonElement, ButtonProps & { icon: LucideIcon }>(function ActionIcon(
    { className, variant, size, icon: Icon, ...props },
    ref
) {
    return (
        <Button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props}>
            <Icon />
        </Button>
    );
});

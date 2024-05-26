import { User } from "lucide-react";
import { observer } from "mobx-react";
import { Outlet, useNavigate } from "react-router";

import { useStore } from "@/api-stores/store-provider";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Image } from "@/components/ui/image";
import { LayoutToggle } from "@/components/ui/layout-toggle";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { SketchNow } from "@/images";

// "absolute  top-0 z-50 w-full border-b border-border/40 bg-background/95 opacity-0 backdrop-blur transition-all hover:sticky hover:opacity-100 supports-[backdrop-filter]:bg-background/60";

export const AppShellPrimary = observer(function AppShell2() {
    const { authStore } = useStore();
    const navigate = useNavigate();
    const logout = async () => {
        await authStore.Logout();
        localStorage.removeItem("IsAuthenticated");
        authStore.IsSessionValid = false;
        navigate("/");
    };
    return (
        <div className="relative flex min-h-screen w-screen flex-col overflow-hidden bg-background">
            <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-14 max-w-screen-2xl items-center">
                    <div className="mr-4 hidden md:flex">
                        <a className="mr-6 flex items-center space-x-2">
                            <Image
                                src={SketchNow}
                                width={30}
                                height={30}
                                alt="Avatar"
                                className="overflow-hidden rounded-full"
                            />
                            <span className="hidden font-bold sm:inline-block">SketchNow</span>
                        </a>
                        <nav className="flex items-center gap-4 text-sm lg:gap-6">
                            <a className="text-foreground transition-colors hover:text-foreground/80" href="/sketch">
                                Home
                            </a>
                            <a
                                className="text-foreground/60 transition-colors hover:text-foreground/80"
                                href="/sketch/new"
                            >
                                Canvas
                            </a>
                            <a
                                className="text-foreground/60 transition-colors hover:text-foreground/80"
                                href="/sketch/custom/new"
                            >
                                Custom canvas
                            </a>
                        </nav>
                    </div>
                    <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                        <div className="w-full flex-1 md:w-auto md:flex-none">
                            <button className="relative inline-flex h-8 w-full items-center justify-start whitespace-nowrap rounded-[0.5rem] border border-input bg-background px-4 py-2 text-sm font-normal text-muted-foreground shadow-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 sm:pr-12 md:w-40 lg:w-64">
                                <span className="hidden lg:inline-flex">Search documentation...</span>
                                <span className="inline-flex lg:hidden">Search...</span>
                                <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                                    <span className="text-xs">⌘</span>K
                                </kbd>
                            </button>
                        </div>
                    </div>
                    <nav className="ml-1 flex items-center">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="simple" size="icon">
                                    <User />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Settings</DropdownMenuItem>
                                <DropdownMenuItem>Support</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <ModeToggle />
                        <LayoutToggle />
                    </nav>
                </div>
            </header>
            <main className="flex flex-1 bg-primary-foreground">
                <Outlet />
            </main>
            <footer />
        </div>
    );
});

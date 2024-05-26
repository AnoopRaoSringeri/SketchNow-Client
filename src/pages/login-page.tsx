import { zodResolver } from "@hookform/resolvers/zod";
import { observer } from "mobx-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

import { useStore } from "@/api-stores/store-provider";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
    username: z.string().min(2).max(50),
    email: z.string().email("Invalid email"),
    password: z.string()
});

export const LogInPage = observer(function LogInPage() {
    const { authStore } = useStore();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            email: "",
            password: ""
        }
    });
    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true);
        const response = await authStore.Login(values);
        if (response) {
            toast.success("Logged in successfully");
            localStorage.setItem("IsAuthenticated", "true");
            authStore.IsSessionValid = true;
            navigate("/sketch");
        } else {
            toast.error("User login failed");
            // toast.error("User login failed", { description: response.error.message });
        }
        setLoading(false);
    }

    return (
        <div className="mx-auto grid w-[350px] gap-6">
            <div className="grid gap-2 text-center">
                <h1 className="text-3xl font-bold">Login</h1>
                <p className="text-balance text-muted-foreground">Enter your email below to login to your account</p>
            </div>
            <div className="grid gap-4">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input className="space-y-0" placeholder="Username" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input className="space-y-0" placeholder="Email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex items-center">
                                        <FormLabel>Password</FormLabel>
                                        <Link to="/forgot-password" className="ml-auto inline-block text-sm underline">
                                            Forgot your password?
                                        </Link>
                                    </div>
                                    <FormControl>
                                        <Input className="space-y-0" placeholder="Password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full" loading={loading}>
                            Login
                        </Button>
                        <Button variant="outline" className="w-full">
                            Login with Google
                        </Button>
                    </form>
                </Form>
            </div>
            <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link to="/" className="underline">
                    Sign up
                </Link>
            </div>
        </div>
    );
});

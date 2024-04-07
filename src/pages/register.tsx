import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { toast } from "sonner";

import { useStore } from "@/api-stores/store-provider";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Register = () => {
    const { authStore } = useStore();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [opened, { open, close, toggle }] = useDisclosure(false);

    const register = async () => {
        setLoading(true);
        const res = await authStore.Register({
            email,
            password,
            username
        });
        if (res) {
            toast.success("User registered successfully");
            close();
            setPassword("");
            setEmail("");
            setPassword("");
        } else {
            toast.error("User registration failed");
        }
        setLoading(false);
    };

    return (
        <Dialog open={opened} onOpenChange={toggle}>
            <DialogTrigger asChild>
                <Button onClick={open}>Register</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Rgister</DialogTitle>
                    <DialogDescription>
                        {"Make changes to your profile here. Click save when you're done."}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input
                            id="name"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                            Email
                        </Label>
                        <Input
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="password" className="text-right">
                            Password
                        </Label>
                        <Input
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={register} loading={loading}>
                        Register
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
export default Register;

"use client";

import { useEffect, useState } from "react";
import { LogOut, User, EllipsisVertical } from "lucide-react";
import { useRouter } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";
import { authService } from "@/services/auth-service";

export function NavUser() {
    const { isMobile } = useSidebar();
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [userType, setUserType] = useState<string>("");

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const storedUserType = localStorage.getItem("user_type");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        if (storedUserType) {
            setUserType(storedUserType);
        }
    }, []);

    const getUserName = () => {
        if (!user) return "User";
        if (userType === "admin") return user.nama_user;
        return user.nama || "User";
    };

    const getUserEmail = () => {
        if (!user) return "";
        if (userType === "admin") return user.username;
        if (userType === "mahasiswa") return user.nim;
        if (userType === "reviewer") return user.email;
        return "";
    };

    const getInitials = () => {
        const name = getUserName();
        return name
            .split(" ")
            .map((n: string) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const handleLogout = () => {
        authService.logout();
        router.push("/login");
    };

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarImage src="" alt={getUserName()} />
                                <AvatarFallback className="rounded-lg">
                                    {getInitials()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">{getUserName()}</span>
                                <span className="truncate text-xs">{getUserEmail()}</span>
                            </div>
                            <EllipsisVertical className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage src="" alt={getUserName()} />
                                    <AvatarFallback className="rounded-lg">
                                        {getInitials()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">{getUserName()}</span>
                                    <span className="truncate text-xs">{getUserEmail()}</span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Logout</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}

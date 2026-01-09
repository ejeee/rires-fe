"use client";

import { useEffect, useState } from "react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, CheckCircle, Clock } from "lucide-react";

export default function DashboardPage() {
    const [user, setUser] = useState<any>(null);
    const [userType, setUserType] = useState<string>("");

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const storedUserType = localStorage.getItem("user_type");
        if (storedUser) setUser(JSON.parse(storedUser));
        if (storedUserType) setUserType(storedUserType);
    }, []);

    const getUserName = () => {
        if (!user) return "User";
        if (userType === "admin") return user.nama_user;
        return user.nama || "User";
    };

    const stats = [
        {
            title: "Total Pengajuan",
            value: "12",
            description: "Pengajuan PKM aktif",
            icon: FileText,
        },
        {
            title: "Menunggu Review",
            value: "3",
            description: "Perlu ditinjau",
            icon: Clock,
        },
        {
            title: "Disetujui",
            value: "8",
            description: "Pengajuan diterima",
            icon: CheckCircle,
        },
        {
            title: "Total User",
            value: "156",
            description: "User terdaftar",
            icon: Users,
        },
    ];

    return (
        <>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                {/* Welcome Section */}
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight">
                        Selamat Datang, {getUserName()}!
                    </h1>
                    <p className="text-muted-foreground">
                        Berikut adalah ringkasan aktivitas Anda di Student RIRES.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat) => (
                        <Card key={stat.title}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {stat.title}
                                </CardTitle>
                                <stat.icon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <p className="text-xs text-muted-foreground">
                                    {stat.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Content Placeholder */}
                <div className="min-h-[400px] flex-1 rounded-xl bg-muted/50 md:min-h-[500px] flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                        <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <h3 className="text-lg font-medium">Aktivitas Terbaru</h3>
                        <p className="text-sm">Belum ada aktivitas terbaru.</p>
                    </div>
                </div>
            </div>
        </>
    );
}

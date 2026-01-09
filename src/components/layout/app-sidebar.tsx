"use client";

import * as React from "react";
import {
  Home,
  FileText,
  Users,
  Settings,
  ChevronRight,
  LayoutDashboard,
  CalendarFold,
  ChartLine,
  type LucideIcon, // Import tipe untuk TypeScript
} from "lucide-react";

import { NavMain } from "@/components/layout/nav-main";
import { NavUser } from "@/components/layout/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// 1. Definisikan Mapping Icon
// Database Anda menyimpan string ("layout-dashboard"), kita butuh Komponen Reactnya.
const iconMap: Record<string, LucideIcon> = {
  "layout-dashboard": LayoutDashboard,
  "file-text": FileText,
  "users": Users,
  "settings": Settings,
  "calendar-fold": CalendarFold,
  "chart-line": ChartLine,
  "home": Home,
  // Tambahkan icon lain sesuai kebutuhan database Anda
};

// Helper untuk mengambil icon, default ke Home jika tidak ditemukan
const getIcon = (iconName: string): LucideIcon => {
  return iconMap[iconName] || Home;
};

// 2. Definisikan Tipe Data dari API
interface MenuFromDB {
  id: number;
  nama_menu: string;
  url_menu: string;
  lucide: string;
  children?: MenuFromDB[]; // Rekursif jika endpoint /tree mengembalikan children
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // State untuk menyimpan menu
  const [menuItems, setMenuItems] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchMenu = async () => {
      try {
        // Ambil token dari LocalStorage (atau Cookies)
        // Pastikan Anda menyimpan token dengan nama 'token' saat login
        const token = localStorage.getItem("token"); 

        if (!token) {
          console.error("Token tidak ditemukan, user mungkin belum login");
          return;
        }

        // Panggil Endpoint TREE (bukan list biasa, agar strukturnya hierarki)
        const response = await fetch("http://localhost:8080/api/v1/menus/tree", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        const result = await response.json();

        if (result.success && result.data) {
          // Transform data dari format DB ke format Shadcn UI
          const transformedData = result.data.map((item: MenuFromDB) => transformMenu(item));
          setMenuItems(transformedData);
        }
      } catch (error) {
        console.error("Gagal mengambil menu:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenu();
  }, []);

  // Fungsi rekursif untuk mengubah format data
  const transformMenu = (item: MenuFromDB): any => {
    return {
      title: item.nama_menu,
      url: item.url_menu.startsWith("/") ? item.url_menu : `/${item.url_menu}`, // Pastikan ada slash
      icon: getIcon(item.lucide),
      // Jika punya children dan tidak kosong, transform juga children-nya
      items: item.children && item.children.length > 0 
        ? item.children.map((child) => transformMenu(child)) 
        : undefined,
    };
  };

  return (
    <Sidebar variant="floating" collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground shrink-0">
                  <img
                    src="/images/Logo_UMM_Red.png"
                    alt="Logo"
                    className="size-6 object-contain"
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Student RIRES</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      
      <SidebarContent>
        {/* Tampilkan Loading state sederhana jika perlu */}
        {isLoading ? (
             <div className="p-4 text-sm text-muted-foreground">Loading menu...</div>
        ) : (
            <NavMain items={menuItems} />
        )}
      </SidebarContent>
      
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
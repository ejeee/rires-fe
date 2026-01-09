'use client'

import { usePathname } from 'next/navigation'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import React from 'react'

interface MenuFromDB {
  id: number;
  nama_menu: string;
  url_menu: string;
  children?: MenuFromDB[];
}

interface BreadcrumbNavProps {
  apiMenus?: MenuFromDB[]
}

export function BreadcrumbNav({ apiMenus = [] }: BreadcrumbNavProps) {
  const pathname = usePathname()

  // Fungsi untuk membersihkan slash agar perbandingan URL akurat
  const normalizePath = (path: string) => path.replace(/^\//, '')

  // Fungsi rekursif mencari hirarki menu
  const findMenuPath = (menus: MenuFromDB[], targetPath: string): MenuFromDB[] => {
    const cleanTarget = normalizePath(targetPath)
    
    for (const menu of menus) {
      const cleanMenuUrl = normalizePath(menu.url_menu)
      
      // Cek apakah menu ini adalah tujuannya
      if (cleanMenuUrl === cleanTarget && cleanMenuUrl !== "") {
        return [menu]
      }

      // Cek di dalam children
      if (menu.children && menu.children.length > 0) {
        const foundChildren = findMenuPath(menu.children, targetPath)
        if (foundChildren.length > 0) {
          return [menu, ...foundChildren]
        }
      }
    }
    return []
  }

  const menuHierarchy = findMenuPath(apiMenus, pathname)

  // Mapping hasil hirarki ke format Breadcrumb
  const breadcrumbs = menuHierarchy.map((m) => ({
    title: m.nama_menu,
    // Kita asumsikan jika url_menu tidak diawali slash, kita tambahkan slash
    href: m.url_menu.startsWith('/') ? m.url_menu : `/${m.url_menu}`
  }))

  // Gabungkan dengan Dashboard di posisi paling depan
  // Jika sedang di dashboard, jangan double
  const allBreadcrumbs = pathname === '/dashboard' 
    ? [{ title: 'Dashboard', href: '/dashboard' }]
    : [{ title: 'Dashboard', href: '/dashboard' }, ...breadcrumbs]
  
  return (
    <Breadcrumb>
      <BreadcrumbList className="flex items-center">
        {allBreadcrumbs.map((crumb, index) => {
          const isLast = index === allBreadcrumbs.length - 1

          return (
            <React.Fragment key={`${crumb.href}-${index}`}>
              <BreadcrumbItem className="flex items-center">
                {isLast ? (
                  <BreadcrumbPage className="font-semibold text-foreground leading-none">
                    {crumb.title}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={crumb.href} className="leading-none transition-colors hover:text-foreground">
                    {crumb.title}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && (
                <BreadcrumbSeparator className="[&>svg]:size-3.5" />
              )}
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
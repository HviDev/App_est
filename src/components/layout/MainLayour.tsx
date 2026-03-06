import { ModeToggle } from "@/components/layout/mode-toggle"
import { Outlet } from "react-router-dom"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"

export default function MainLayout() {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex-1 p-6">
          <div className="flex justify-end mb-4 gap-2">
            <SidebarTrigger />
            <ModeToggle />
          </div>
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  )
}

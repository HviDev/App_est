import { Calendar, BrushCleaning, ReceiptText, User2, ChevronUp, Heater, Wrench } from "lucide-react"
import { Link } from "react-router-dom"
import { useAuthStore } from "@/modules/auth/store/auth.store";


import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
 

} from "@/components/ui/sidebar"



import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu"

// Menu items.
const items = [
  {
    title: "Boilers",
    url: "/",
    icon: Heater,
  },
  {
    title: "Pagos",
    url: "/payments",
    icon: ReceiptText,
  },
  {
    title: "Limpieza",
    url: "#",
    icon: BrushCleaning,
  },
  {
    title: "Visita",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Mantenimiento",
    url: "#",
    icon: Wrench,
  },



]

export function AppSidebar() {

  const { logout, loading } = useAuthStore();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarGroupLabel className="text-lg font-semibold">APP ESTUDIANTES</SidebarGroupLabel>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url} className="flex items-center gap-2">
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            {/* Footer con dropdown lo dejamos igual */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 /> Usuario
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
                <DropdownMenuItem>Cuenta</DropdownMenuItem>
                <DropdownMenuItem>Configuración</DropdownMenuItem>
                <DropdownMenuItem onClick={logout} disabled={loading}>
                  {loading ? "Cerrando sesión..." : "Cerrar sesión"}
                </DropdownMenuItem>

              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
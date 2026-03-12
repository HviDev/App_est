"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import type { Payment } from "@/schemas/payments.schema"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"



export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "year",
    header: "Año",
    meta: { className: "w-[120px]" }, 
    cell: ({ row }) => row.getValue("year"),
  },
 {
    accessorKey: "monthIndex",
    header: "Mes",
    meta: { className: "w-[120px]" }, 
    cell: ({ row }) => {
      const months = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
      ];
      const month = months[row.original.monthIndex - 1] || "-";
      return month;
    },
  },
  {
    accessorKey: "amount",
    header: "Monto",
    meta: { className: "w-[120px] text-left" }, 
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
      }).format(amount);

      return formatted;
    },
  },
  {
    accessorKey: "paymentMethod",
    header: "Método de pago",
    meta: { className: "w-[120px] text-left" }, 
    cell: ({ row }) => {
      const value = row.getValue("paymentMethod") as string || "-";
      return value
    },
  },
  {
    accessorKey: "paymentDate",
    header: "Fecha de Pago",
    meta: { className: "w-[120px] text-left" }, 
    cell: ({ row }) => {
      const dateString = row.getValue("paymentDate") as string;

      if (!dateString) return <span className="text-muted-foreground">-</span>;

      const date = new Date(dateString);

      // Formato: 15 de marzo de 2024
      const formattedDate = new Intl.DateTimeFormat("es-MX", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).format(date);

      return formattedDate;
    },
  },
  {
    accessorKey: "status",
    header: "Estado",
    meta: { className: "w-[120px] text-left" }, 
    cell: ({ row }) => {
      const status = row.getValue("status") as string;

      // Mapeo de estilos personalizados (Fondo, Texto y Borde opcional)
      const statusStyles: Record<string, string> = {
        PAGADO: "bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
        PENDIENTE: "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100",
        VENCIDO: "bg-rose-100 text-rose-700 border-rose-200 hover:bg-rose-100",
      };

      return (
            <Badge
              variant="outline" 
              className={statusStyles[status] || "bg-gray-100 text-gray-700"}
            >
              {status}
            </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original
 
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Descargar</DropdownMenuItem>
            <DropdownMenuItem>Ver detalles</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
];
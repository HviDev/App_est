import { useEffect } from "react";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { usePaymentStore } from "@/modules/payments/store/payments.store";
import { columns } from "../components/columns";
import { DataTable } from "../components/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ReceiptText } from "lucide-react";
// 1. Importamos el hook del sidebar
import { useSidebar } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge"; // Opcional, si tienes el componente Badge
import { cn } from "@/lib/utils";


import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react"; // Tus iconos de acción

export default function PaymentsPage() {
  const user = useAuthStore((state) => state.user);
  const { isMobile } = useSidebar(); // 2. Detectamos si es móvil

  const { payments, isLoading, error, fetchUserPayments, clearPayments } = usePaymentStore();

  const MONTHS = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];


  const formatCurrency = (amountRef: number | null | undefined) => {
    if (amountRef === null || amountRef === undefined) return "-";
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(amountRef);
  }
  // Cambiamos el tipo de dateString para que acepte nulos
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "-";

    const date = new Date(dateString);

    if (isNaN(date.getTime())) return "Fecha inválida";

    return new Intl.DateTimeFormat("es-MX", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(date);
  };


  const statusStyles: Record<string, string> = {
    PAGADO: "bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
    PENDIENTE: "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100",
    VENCIDO: "bg-rose-100 text-rose-700 border-rose-200 hover:bg-rose-100",
  };

  const defaultStyle = "bg-slate-100 text-slate-700 border-slate-200";


  useEffect(() => {
    if (user?.$id) {
      fetchUserPayments(user.$id);
    }
    return () => clearPayments();
  }, [user?.$id, fetchUserPayments, clearPayments]);

  return (
    <Card className="shadow-sm border-none sm:border">
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-2xl font-bold tracking-tight text-primary">Mis Pagos</CardTitle>
          <CardDescription className="space-y-1">
            <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-medium text-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              Recuerda que los pagos deben realizarse durante los primeros 5 días del mes.
            </span>
            <span className="text-muted-foreground italic text-xs block">
              El pago puede tardar en reflajarse hasta 72 hrs.
            </span>
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {error && (
          <div className="p-4 border border-destructive/20 bg-destructive/5 text-destructive rounded-lg text-sm">{error}</div>
        )}

        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-[250px] w-full rounded-md" />
          </div>
        ) : (
          <>
            {isMobile ? (
              <Accordion type="single" collapsible className="space-y-3">
                {payments.map((pago) => {
                  // CONFIGURACIÓN DE CAMPOS: Agrega aquí lo que quieras mostrar
                  const details = [
                    { label: "Monto", value: formatCurrency(pago.amount), highlight: true },
                    { label: "Método de pago", value: pago.paymentMethod ?? "-" },
                    { label: "Fecha de pago", value: formatDate(pago.paymentDate) },
                  ];

                  return (
                    <AccordionItem key={pago.$id} value={pago.$id} className="border rounded-xl bg-card px-4 shadow-sm">
                      <AccordionTrigger className="hover:no-underline py-4">
                        <div className="flex items-center justify-between w-full pr-2">
                          <div className="flex flex-col items-start text-left">
                            <span className="font-bold text-lg">{MONTHS[pago.monthIndex - 1]}</span>
                            <span className="text-xs text-muted-foreground">{pago.year}</span>
                          </div>
                          <Badge
                            variant="outline"
                            className={cn(
                              "capitalize font-medium",
                              statusStyles[pago.status] || defaultStyle
                            )}
                          >
                            {pago.status?.toLowerCase() || 'En revisión'}
                          </Badge>
                        </div>
                      </AccordionTrigger>

                      <AccordionContent className="pb-4 pt-2 border-t space-y-4">
                        {/* LISTA DINÁMICA DE DETALLES */}
                        <div className="grid grid-cols-1 gap-3 pt-4">
                          {details.map((field, idx) => (
                            <div key={idx} className="flex justify-between items-end border-b border-border/40 pb-2 last:border-0">
                              <span className="text-[10px] uppercase text-muted-foreground font-bold">{field.label}</span>
                              <span className={`text-sm ${field.highlight ? 'font-bold text-primary text-base' : 'font-medium'}`}>
                                {field.value}
                              </span>
                            </div>
                          ))}
                        </div>

                        <Button variant="outline" className="w-full text-xs h-10 gap-2 mt-2" >
                          {/* asChild para mantener el estilo ademas de agregar logica de descarga*/}
                          <Download className="h-4 w-4" /> Descargar PDF
                        </Button>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            ) : (
              <div className="rounded-md border bg-card">
                <DataTable columns={columns} data={payments} />
              </div>
            )}
          </>
        )}

        {!isLoading && payments.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed rounded-xl bg-muted/30 text-center">
            <ReceiptText className="h-10 w-10 text-muted-foreground/40 mb-3" />
            <p className="text-muted-foreground font-medium">No hay registros de pagos.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}



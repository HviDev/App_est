import { useEffect } from "react";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { usePaymentStore } from "@/modules/payments/store/payments.store";
import { columns } from "../components/columns";
import { DataTable } from "../components/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardDescription, CardHeader, CardTitle, CardContent} from "@/components/ui/card";
import { ReceiptText } from "lucide-react";

export default function PaymentsPage() {

  const user = useAuthStore((state) => state.user);

  const { payments, isLoading, error, fetchUserPayments, clearPayments } = usePaymentStore();

  useEffect(() => {
    if (user?.$id) {
      fetchUserPayments(user.$id);
    }

    return () => clearPayments();
  }, [user?.$id, fetchUserPayments, clearPayments]);

   return (
    <Card className="shadow-sm border-none sm:border"> {/* Sombra suave y sin borde en móviles muy pequeños */}
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-2xl font-bold tracking-tight text-primary">
            Mis Pagos
          </CardTitle>
          <CardDescription className="flex flex-col gap-1 text-sm leading-relaxed">
            <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              Recuerda que los pagos deben realizarse durante los primeros 5 días del mes.
            </span>
            <span className="text-muted-foreground italic">
              El pago puede tardar en reflejarse hasta 72 hrs.
            </span>
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Manejo de estados de la UI */}
        {error && (
          <div className="p-4 border border-destructive/20 bg-destructive/5 text-destructive rounded-lg text-sm">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-[300px] w-full rounded-md" />
          </div>
        ) : (
          <div className="rounded-md border bg-card"> {/* Contenedor extra para la tabla */}
            <DataTable columns={columns} data={payments} />
          </div>
        )}

        {!isLoading && payments.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed rounded-xl bg-muted/30">
            <ReceiptText className="h-10 w-10 text-muted-foreground/40 mb-3" />
            <p className="text-muted-foreground font-medium">No se encontraron registros de pagos.</p>
            <p className="text-xs text-muted-foreground/60">Tus movimientos aparecerán aquí una vez procesados.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
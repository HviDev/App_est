import { useEffect } from "react";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { usePaymentStore } from "@/modules/payments/store/payments.store";
import { columns } from "../components/columns";
import { DataTable } from "../components/data-table";
import { Skeleton } from "@/components/ui/skeleton";

export default function PaymentsPage() {
  // 1. Obtenemos el usuario autenticado
  const user = useAuthStore((state) => state.user);

  // 2. Obtenemos las funciones y datos del store de pagos
  const { payments, isLoading, error, fetchUserPayments, clearPayments } = usePaymentStore();

  // 3. Efecto para cargar los datos al montar el componente
  useEffect(() => {
    if (user?.$id) {
      fetchUserPayments(user.$id);
    }

    // Limpiamos los pagos al desmontar (opcional, para evitar fugas de datos)
    return () => clearPayments();
  }, [user?.$id, fetchUserPayments, clearPayments]);

  return (
    <div className="container mx-auto py-10 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Mis Pagos</h1>
        <p className="text-muted-foreground italic">
          Recuerda que los pagos deben realizarse durante los primeros 5 días del mes.
        </p>
        <p className="text-muted-foreground font-medium">
          El pago puede tardar en reflejarse hasta 72 hrs.
        </p>
      </div>

      {/* Manejo de estados de la UI */}
      {error && (
        <div className="p-4 border border-destructive bg-destructive/10 text-destructive rounded-md">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : (
        <DataTable columns={columns} data={payments} />
      )}

      {!isLoading && payments.length === 0 && !error && (
        <div className="text-center py-10 border rounded-lg border-dashed">
          <p className="text-muted-foreground">No se encontraron registros de pagos.</p>
        </div>
      )}
    </div>
  );
}
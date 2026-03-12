import { create } from "zustand";
import { db, Query } from "../../../../appwriteConfig";
import { paymentSchema, type Payment } from "@/schemas/payments.schema";


interface PaymentState {
  payments: Payment[];
  isLoading: boolean;
  error: string | null;
  // Acciones
  fetchUserPayments: (userId: string) => Promise<void>;
  clearPayments: () => void;
}

export const usePaymentStore = create<PaymentState>((set) => ({
  payments: [],
  isLoading: false,
  error: null,

  fetchUserPayments: async (userId: string) => {
    set({ isLoading: true, error: null });

    try {
      // 1. Llamada a Appwrite filtrando por el usuario actual
      const response = await db.listRows({
         databaseId: import.meta.env.VITE_APPWRITE_DB_ID!,
         tableId: import.meta.env.VITE_APPWRITE_TABLE_PAYMENTS!,
         queries: 
        [
          Query.equal("userData.userId", userId), // Filtramos para que solo vea lo suyo
          Query.orderDesc("year"),       // Ordenamos por año reciente
          Query.orderDesc("monthIndex"),  // Y por mes
          Query.select(["*", "userData.*"])
        ]
    });

      // 2. Validación y Limpieza con Zod
      // Usamos .safeParse para que si un documento falla, no rompa todo el fetch
      const validatedPayments = response.rows.map((doc) => {
        const result = paymentSchema.safeParse(doc);
        if (!result.success) {
          console.error(`Error en documento ${doc.$id}:`, result.error.format());
          return null; // O podrías manejarlo de otra forma
        }
        return result.data;
      }).filter((p): p is Payment => p !== null); // Quitamos los nulos

      set({ payments: validatedPayments, isLoading: false });
    } catch (err: any) {
      console.error("Fetch Error:", err);
      set({ 
        error: "No se pudieron cargar los pagos. Intenta de nuevo.", 
        isLoading: false 
      });
    }
  },

  clearPayments: () => set({ payments: [], error: null }),
}));
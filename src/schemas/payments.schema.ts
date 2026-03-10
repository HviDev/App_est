import { z } from "zod";

export const paymentSchema = z.object({
  $id: z.string(),
  amount: z.number().min(0, "El monto debe ser positivo"),
  status: z.enum(["PENDIENTE", "PAGADO", "VENCIDO"]),
  monthIndex: z.number(),
  year: z.number(),
  paymentDate: z.string().optional().nullable(),
  paymentMethod: z.enum(["EFECTIVO", "SPEI", "DEPOSITO"]).optional().nullable(),

  userData: z.object({
    userId: z.string(),
    userRoom: z.string()
  }).optional()

  
});

// Esto extrae el tipo de TypeScript automáticamente del esquema de Zod
export type Payment = z.infer<typeof paymentSchema>;
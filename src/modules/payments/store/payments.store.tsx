import { z } from "zod";

export const paymentSchema = z.object({
  id: z.string(),
  amount: z.number().positive(),
});

console.log("¡Zod instalado y funcionando!");
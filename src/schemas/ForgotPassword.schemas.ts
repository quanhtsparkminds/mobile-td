import { z } from "zod";
import { ERROR_MESSAGE_KEYS } from "@/configs";

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: ERROR_MESSAGE_KEYS.REQUIRED })
    .email({ message: ERROR_MESSAGE_KEYS.INVALID }),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

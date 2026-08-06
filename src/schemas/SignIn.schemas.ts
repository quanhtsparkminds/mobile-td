import { z } from "zod";
import { ERROR_MESSAGE_KEYS } from "@/configs";

export const signInSchema = z.object({
  email: z
    .string()
    .min(1, { message: ERROR_MESSAGE_KEYS.REQUIRED })
    .email({ message: "errorMessage.invalid" }),
  password: z.string().min(1, { message: ERROR_MESSAGE_KEYS.REQUIRED }),
});

export type SignInFormValues = z.infer<typeof signInSchema>;

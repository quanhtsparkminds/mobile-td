import { z } from "zod";
import { ERROR_MESSAGE_KEYS } from "@/configs";

export const signUpSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: ERROR_MESSAGE_KEYS.REQUIRED })
      .email({ message: ERROR_MESSAGE_KEYS.INVALID }),
    password: z.string().min(1, { message: ERROR_MESSAGE_KEYS.REQUIRED }),
    confirmPassword: z
      .string()
      .min(1, { message: ERROR_MESSAGE_KEYS.REQUIRED }),
    dateOfBirth: z.string().min(1, { message: ERROR_MESSAGE_KEYS.REQUIRED }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: ERROR_MESSAGE_KEYS.PASSWORD_MISMATCH,
    path: ["confirmPassword"],
  });

export type SignUpFormValues = z.infer<typeof signUpSchema>;

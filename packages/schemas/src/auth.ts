import { z } from "zod";

export const authSessionSchema = z.object({
  idToken: z.string().min(1, "ID Token is required"),
});

export const pushSubscriptionSchema = z.object({
  endpoint: z.string().url(),
  keys: z.object({
    p256dh: z.string().min(1),
    auth: z.string().min(1),
  }),
});

export type AuthSessionInput = z.infer<typeof authSessionSchema>;
export type PushSubscriptionInput = z.infer<typeof pushSubscriptionSchema>;

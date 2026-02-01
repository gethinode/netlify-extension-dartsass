import * as z from "zod";

export const TeamConfigSchema = z.object({
  dartsassVersion: z.string().min(5),
});

export type TeamConfig = z.output<typeof TeamConfigSchema>;

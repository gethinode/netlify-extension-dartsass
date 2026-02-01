import * as z from "zod";

export const SiteConfigSchema = z.object({
  dartsassVersion: z.string().min(5),
});

export type SiteConfig = z.output<typeof SiteConfigSchema>;

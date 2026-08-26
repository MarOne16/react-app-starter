import useSWR from "swr";
import { z } from "zod";
import { schemaFetcher } from "@/lib/api/http";

const healthSchema = z.object({
  status: z.string(),
  version: z.string().optional(),
});

export type Health = z.infer<typeof healthSchema>;

/** Example SWR hook: fetch + validate in one place, typed all the way out. */
export function useHealth() {
  const { data, error, isLoading, mutate } = useSWR(
    "health",
    schemaFetcher(healthSchema),
  );

  return { health: data, error, isLoading, refresh: mutate };
}

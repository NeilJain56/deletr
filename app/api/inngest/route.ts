import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { deletionOrchestrator } from "@/inngest/functions/deletion-orchestrator";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [deletionOrchestrator],
});

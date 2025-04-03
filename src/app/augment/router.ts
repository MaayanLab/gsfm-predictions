import { procedure, router } from "@/lib/trpc";
import { z } from 'zod'
import { inferenceGSFM } from "./utils.server"

export default router({
  augment: procedure.input(z.object({
    gene_set: z.string().array(),
  })).mutation(async (props) => {
    // TODO: save gene set
    return await inferenceGSFM(props.input.gene_set)
  }),
})

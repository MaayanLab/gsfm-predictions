import { procedure, router } from "@/lib/trpc"
import { z } from 'zod'
import { inferenceGSFM } from "./utils.server"
import { db } from "@/lib/database"
import { v4 as uuidv4 } from 'uuid'

export default router({
  augment: procedure.input(z.object({
    gene_set: z.string().array(),
    description: z.string().optional(),
  })).mutation(async (props) => {
    await db.insertInto('app.user_gene_set')
      .values({
        id: uuidv4(),
        gene_set: props.input.gene_set.join('\n'),
        description: props.input.description,
      })
      .execute()
    return await inferenceGSFM(props.input.gene_set)
  }),
})

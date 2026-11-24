import { procedure, router } from "@/lib/trpc"
import { z } from 'zod'
import { inferenceGSFM } from "./utils.server"
import { db } from "@/lib/database"
import { v4 as uuidv4 } from 'uuid'
import { TRPCError } from "@trpc/server"

export default router({
  augment: procedure.input(z.object({
    model: z.string().default('latest'),
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
    return await inferenceGSFM(props.input.model, props.input.gene_set)
  }),
  augmentGeneSet: procedure.input(z.object({
    model: z.string().default('latest'),
    gene_set_id: z.uuid(),
  })).query(async (props) => {
    const user_gene_set = await db
      .selectFrom('app.user_gene_set')
      .select('gene_set')
      .where('id', '=', props.input.gene_set_id)
      .executeTakeFirst()
    if (!user_gene_set) throw new TRPCError({ code: 'NOT_FOUND', message: 'Gene set not found' })
    const gene_set = user_gene_set.gene_set.split('\n')
    return {
      gene_set,
      ...await inferenceGSFM(props.input.model, gene_set),
    }
  }),
})

import { procedure, router } from "@/lib/trpc"
import { z } from 'zod'
import { db } from "@/lib/database"
import { v4 as uuidv4 } from 'uuid'
import python from "@/lib/python"

export default router({
  enrich: procedure.input(z.object({
    model: z.string().default('rummagene'),
    input_gene_set: z.string().array(),
    description: z.string().optional(),
    gene_set_library: z.string(),
  })).mutation(async (props) => {
    await db.insertInto('app.user_gene_set')
      .values({
        id: uuidv4(),
        gene_set: props.input.input_gene_set.join('\n'),
        description: props.input.description,
      })
      .execute()
    return await python<{

    }>('app.enrich.gsfm_gsea.enrich', {
      kwargs: {
        model: `maayanlab/gsfm-${props.input.model}`,
        input_gene_set: props.input.input_gene_set.join('\n'),
        gene_set_library: props.input.gene_set_library,
      }
    })
  }),
})

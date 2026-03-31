import { procedure, router } from "@/lib/trpc"
import { z } from 'zod'
import { db } from "@/lib/database"
import { v4 as uuidv4 } from 'uuid'
import python from "@/lib/python"

export default router({
  enrich: procedure.input(z.instanceof(FormData)
    .transform((formData: FormData) => z.object({
      model: z.string().default('rummagene'),
      input_gene_set: z.string().array(),
      description: z.string().optional(),
      gene_set_library: z.file(),
    }).parse({
      model: formData.get('model')?.toString() ?? undefined,
      input_gene_set: formData.get('input_gene_set')?.toString().split(/[\r\n]+/g),
      description: formData.get('description')?.toString() ?? undefined,
      gene_set_library: formData.get('gene_set_library') as File,
    }))
  ).mutation(async (props) => {
    await db.insertInto('app.user_gene_set')
      .values({
        id: uuidv4(),
        gene_set: props.input.input_gene_set.join('\n'),
        description: props.input.description ?? null,
      })
      .execute()
    return await python<{
      "Term": string,
      "es": number,
      "nes": number | null,
      "pval": number,
      "sidak": number,
      "geneset_size": number,
      "leading_edge": string,
    }[]>('app.enrich.gsfm_gsea.enrich', {
      kwargs: {
        model: `maayanlab/gsfm-${props.input.model}`,
        input_gene_set: props.input.input_gene_set,
        gene_set_library: await props.input.gene_set_library.text(),
      },
    })
  }),
})

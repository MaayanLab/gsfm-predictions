import { procedure, router } from "@/lib/trpc"
import { z } from 'zod'
import { db } from "@/lib/database"
import { v4 as uuidv4 } from 'uuid'
import { pythonStream } from "@/lib/python"
import { model_on_hf } from "@/components/resources"
import crypto from 'crypto'
import readline from 'node:readline/promises'

export default router({
  addList: procedure.input(z.object({
    gene_set: z.string().array(),
    description: z.string().optional(),
  })).mutation(async (props) => {
    if (props.input.gene_set.length === 0) throw new Error('Missing or empty gene set')
    const gene_set_id = uuidv4()
    await db.insertInto('app.user_gene_set')
      .values({
        id: gene_set_id,
        gene_set: props.input.gene_set.join('\n'),
        description: props.input.description ?? null,
      })
      .execute()
    return gene_set_id
  }),
  addLibrary: procedure.input(z.instanceof(FormData)
    .transform((formData: FormData) => z.object({
      gene_set_library_file: z.file().nonoptional(),
    }).parse({
      gene_set_library_file: formData.get('gene_set_library_file') as File | null,
    }))
  ).mutation(async (props) => {
    const gene_set_library = await props.input.gene_set_library_file.text()
    const gene_set_library_id = crypto.createHash('sha256').update(gene_set_library).digest('hex')
    await db.insertInto('app.user_gene_set_library')
      .values({
        id: gene_set_library_id,
        gene_set_library: gene_set_library,
      })
      .execute()
    return gene_set_library_id
  }),
  enrich: procedure.input(z.object({
    lastEventId: z.string().nullish(), // for SSE
    model: z.string().transform(model => {
      const res = model_on_hf[model]
      if (res === undefined) throw new Error('Model is invalid')
      return res
    }),
    gene_set_id: z.string(),
    gene_set_library_name: z.string().optional(),
    gene_set_library_id: z.string().optional(),
  })).subscription(async function* (props) {
    if (props.input.gene_set_library_id) yield {status: 'Retreiving user content...'}
    const { gene_set } = await db
      .selectFrom('app.user_gene_set')
      .select('gene_set')
      .where('id', '=', props.input.gene_set_id)
      .executeTakeFirstOrThrow()
    const { gene_set_library } = props.input.gene_set_library_id ?
      await db
        .selectFrom('app.user_gene_set_library')
        .select('gene_set_library')
        .where('id', '=', props.input.gene_set_library_id)
        .executeTakeFirstOrThrow()
      : {}
    yield {status: 'Launching GSFM GSEA enrichment job...'}

    const proc = pythonStream('app.enrich.gsfm_gsea.enrich', {
      kwargs: {
        model: props.input.model,
        input_gene_set: gene_set,
        gene_set_library,
        gene_set_library_name: props.input.gene_set_library_name,
      },
    }, props.signal)
    const rl = readline.createInterface({
      input: proc.stdout,
      crlfDelay: Infinity,
    })

    for await (const line of rl) {
      const evt = JSON.parse(line) as {
        error?: string,
        status?: string,
        data?: {
          "Term": string,
          "es": number,
          "nes": number | null,
          "pval": number,
          "sidak": number,
          "geneset_size": number,
          "leading_edge": string,
          "hits": string,
        }[]
      }
      if (props.signal?.aborted) return
      yield evt
    }
  }),
})

import { procedure, router } from "@/lib/trpc"
import { z } from 'zod'
import { db } from "@/lib/database"
import { v4 as uuidv4 } from 'uuid'
import { pythonStream } from "@/lib/python"
import { model_on_hf } from "@/components/resources"
import crypto from 'crypto'
import readline from 'node:readline/promises'

const modelInput = z.string().transform(model => {
  const res = model_on_hf[model]
  if (res === undefined) throw new Error('Model is invalid')
  return res
})

type EnrichmentResult = {
  "Term": string,
  "es": number,
  "nes": number | null,
  "pval": number,
  "sidak": number,
  "geneset_size": number,
  "leading_edge": string,
  "plot": string,
}

async function getUserGeneSetLibrary(id: string) {
  const { gene_set_library } = await db
    .selectFrom('app.user_gene_set_library')
    .select('gene_set_library')
    .where('id', '=', id)
    .executeTakeFirstOrThrow()
  return gene_set_library
}

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
  getList: procedure.input(z.object({
    id: z.string()
  })).query(async (props) => {
    return await db.selectFrom('app.user_gene_set')
      .where('id', '=', props.input.id)
      .select('gene_set')
      .executeTakeFirstOrThrow()
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
      .onConflict(oc => oc.column('id').doNothing())
      .execute()
    return gene_set_library_id
  }),
  enrich: procedure.input(z.object({
    lastEventId: z.string().nullish(), // for SSE
    model: modelInput,
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
    const gene_set_library = props.input.gene_set_library_id ?
      await getUserGeneSetLibrary(props.input.gene_set_library_id)
      : undefined
    yield {status: 'Launching GSFM GSEA enrichment job...'}

    const proc = pythonStream('app.enrich.gsfm_gsea.enrich', {
      kwargs: {
        model: props.input.model,
        input_gene_set: gene_set.split('\n'),
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
        data?: EnrichmentResult[]
      }
      if (props.signal?.aborted) return
      yield evt
    }
    await proc.exited
  }),
  /**
   * Batch mode: enrich every gene set of a user-submitted GMT (`input_gene_set_library_id`, from addLibrary)
   *  against a gene set library (`enrich_gene_set_library_id` from addLibrary, or `enrich_gene_set_library_name`).
   * Streams one event per input gene set, tagged with `input_term`.
   */
  enrichLibrary: procedure.input(z.object({
    lastEventId: z.string().nullish(), // for SSE
    model: modelInput,
    input_gene_set_library_id: z.string(),
    enrich_gene_set_library_name: z.string().optional(),
    enrich_gene_set_library_id: z.string().optional(),
  }).refine(
    input => !!input.enrich_gene_set_library_name !== !!input.enrich_gene_set_library_id,
    'Exactly one of enrich_gene_set_library_name or enrich_gene_set_library_id is required',
  )).subscription(async function* (props) {
    yield {status: 'Retreiving user content...'}
    const input_gene_set_library = await getUserGeneSetLibrary(props.input.input_gene_set_library_id)
    const enrich_gene_set_library = props.input.enrich_gene_set_library_id ?
      await getUserGeneSetLibrary(props.input.enrich_gene_set_library_id)
      : undefined
    yield {status: 'Launching GSFM GSEA batch enrichment job...'}

    const proc = pythonStream('app.enrich.gsfm_gsea.enrich_library', {
      kwargs: {
        model: props.input.model,
        input_gene_set_library,
        enrich_gene_set_library,
        enrich_gene_set_library_name: props.input.enrich_gene_set_library_name,
      },
    }, props.signal)
    const rl = readline.createInterface({
      input: proc.stdout,
      crlfDelay: Infinity,
    })

    for await (const line of rl) {
      const evt = JSON.parse(line) as {
        // error without input_term is fatal; error with input_term only affects that gene set
        error?: string,
        status?: string,
        progress?: { current: number, total: number },
        input_term?: string,
        data?: EnrichmentResult[]
      }
      if (props.signal?.aborted) return
      yield evt
    }
    await proc.exited
  }),
})

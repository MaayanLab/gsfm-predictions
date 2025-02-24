import { db } from "@/lib/database"
import { procedure, router } from "@/lib/trpc";
import { sql } from "kysely";
import { z } from 'zod'

export default router({
  gene_autocomplete: procedure.input(z.string()).query(async (props) => {
    return await db
      .selectFrom('app.gene')
      .select('gene')
      .where('gene', sql`%`, props.input)
      .orderBy(sql`gene <-> ${props.input}`)
      .limit(10)
      .execute()
  }),
  sources: procedure.query(async (props) => {
    return await db
      .selectFrom('app.prediction')
      .select(eb => ['source', eb.fn.countAll().as('count')])
      .groupBy('source')
      .execute()
  }),
  predictions: procedure.input(z.object({
    source: z.string(),
    gene: z.string(),
    offset: z.number(),
    limit: z.number().transform(limit => Math.min(100, limit)),
  })).query(async (props) => {
    return await db
      .selectFrom('app.prediction')
      .select('term')
      .select('proba')
      .select('known')
      .orderBy('proba desc')
      .where('source', '=', props.input.source)
      .where('gene', '=', props.input.gene)
      .execute()
  }),
})

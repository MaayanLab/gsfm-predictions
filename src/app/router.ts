import { db } from "@/lib/database"
import { procedure, router } from "@/lib/trpc";
import { sql } from "kysely";
import { z } from 'zod'

export default router({
  gene_info: procedure.input(z.string()).query(async (props) => {
    return await db
      .selectFrom('app.gene')
      .selectAll()
      .where('symbol', '=', props.input)
      .executeTakeFirst()
  }),
  gene_autocomplete: procedure.input(z.string()).query(async (props) => {
    return await db
      .selectFrom('app.gene')
      .select('symbol')
      .where('symbol', sql`%`, props.input)
      .orderBy(sql`symbol <-> ${props.input}`)
      .limit(10)
      .execute()
  }),
  sources: procedure.input(z.string()).query(async (props) => {
    return await db
      .selectFrom('app.prediction')
      .select(eb => ['source', eb.fn.countAll().as('count')])
      .groupBy('source')
      .where('gene', '=', props.input)
      .execute()
  }),
  predictions: procedure.input(z.object({
    source: z.string(),
    gene: z.string(),
    offset: z.number().transform(offset => Math.max(0, offset)),
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
      .offset(props.input.offset)
      .limit(props.input.limit)
      .execute()
  }),
})

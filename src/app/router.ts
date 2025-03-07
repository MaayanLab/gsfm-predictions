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
  models: procedure.query(async (props) => {
    return await db
      .selectFrom('app.prediction')
      .select('model')
      .distinct()
      .execute()
  }),
  sources: procedure.input(z.object({
    model: z.string().default('latest'),
    gene: z.string(),
  })).query(async (props) => {
    return await db
      .selectFrom('app.prediction')
      .select(eb => ['source', eb.fn.countAll().as('count')])
      .groupBy('source')
      .where('model', '=', props.input.model)
      .where('gene', '=', props.input.gene)
      .execute()
  }),
  predictions: procedure.input(z.object({
    model: z.string().default('latest'),
    source: z.string(),
    gene: z.string(),
    offset: z.number().transform(offset => Math.max(0, offset)),
    limit: z.number().transform(limit => Math.min(100, limit)),
  })).query(async (props) => {
    return await db
      .selectFrom('app.prediction as pred')
      .select('pred.term')
      .select('pred.proba')
      .select('pred.known')
      .leftJoin('app.performance as perf', j => j.on(sql`(perf.source, perf.term)`, '=', sql`(pred.source, pred.term)`))
      .select('perf.roc_auc')
      .orderBy('pred.proba desc')
      .where('pred.model', '=', props.input.model)
      .where('pred.source', '=', props.input.source)
      .where('pred.gene', '=', props.input.gene)
      .offset(props.input.offset)
      .limit(props.input.limit)
      .execute()
  }),
})

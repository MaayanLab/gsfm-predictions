import { db } from "@/lib/database"
import { procedure, router } from "@/lib/trpc";
import { sql } from "kysely";
import { z } from 'zod'
import { select_distinct_loose_indexscan } from "@/lib/database/utils";
import { source_pagerank, model_pagerank } from "@/components/resources";

export default router({
  gene_info: procedure.input(z.string()).query(async (props) => {
    try {
      return await db
        .selectFrom('app.gene')
        .selectAll()
        .where('symbol', '=', props.input)
        .executeTakeFirstOrThrow()
    } catch (e) {
      // Fall back to case insensitive gene match
      return await db
        .selectFrom('app.gene')
        .selectAll()
        .where(sql`upper(symbol)`, '=', sql`upper(${props.input})`)
        .executeTakeFirst()
    }
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
    const models = (await
      select_distinct_loose_indexscan('app.prediction', 'model')
        .execute(db)
    ).rows.map(({ model }) => ({ model, pagerank: model_pagerank[model] ?? 0 }))
    models.sort((a, b) => b.pagerank - a.pagerank)
    return models
  }),
  modelsWithPredictionsForGene: procedure.input(z.object({
    gene: z.string(),
  })).query(async (props) => {
    const models = (await db
      .selectFrom('app.prediction')
      .select('model').distinct()
      .where('gene', '=', props.input.gene)
      .execute()
    ).map(({ model }) => ({ model, pagerank: model_pagerank[model] ?? 0 }))
    models.sort((a, b) => b.pagerank - a.pagerank)
    return models.map(({ model }) => model)
  }),
  sources: procedure.input(z.object({
    model: z.string().default('latest'),
    gene: z.string(),
  })).query(async (props) => {
    const sources = (await db
      .selectFrom('app.prediction')
      .select(eb => ['source', eb.fn.countAll().as('count')])
      .groupBy('source')
      .where('model', '=', props.input.model)
      .where('gene', '=', props.input.gene)
      .execute()
    ).map(({ source, count }) => ({ source, count, pagerank: source_pagerank[source] ?? 0 }))
    sources.sort((a, b) =>
      (b.pagerank - a.pagerank)
      || (Number(b.count) - Number(a.count))
    )
    return sources
  }),
  termGenes: procedure.input(z.object({
    model: z.string().default('latest'),
    source: z.string(),
    term: z.string(),
  })).query(async (props) => {
    return (await db
      .selectFrom('app.prediction')
      .select(eb => eb.fn.countAll<number>().as('count'))
      .where('model', '=', props.input.model)
      .where('source', '=', props.input.source)
      .where('term', '=', props.input.term)
      .executeTakeFirstOrThrow()
    )
  }),
  predictions: procedure.input(z.object({
    model: z.string().default('latest'),
    source: z.string(),
    gene: z.string(),
    orderBy: z.union([
      z.literal('proba asc'), z.literal('proba desc'),
      z.literal('zscore asc'), z.literal('zscore desc'),
      z.literal('known asc'), z.literal('known desc'),
      z.literal('auroc asc'), z.literal('auroc desc'),
      z.literal('uniqueness asc'), z.literal('uniqueness desc'),
    ]).optional().default('proba desc'),
    filter: z.string().optional(),
    offset: z.number().transform(offset => Math.max(0, offset)),
    limit: z.number().transform(limit => Math.min(100, limit)),
  })).query(async (props) => {
    return await db
      .selectFrom('app.prediction as pred')
      .leftJoin('app.performance as perf', j => j.onRef('perf.model', '=', 'pred.model').onRef('perf.source', '=', 'pred.source').onRef('perf.term', '=', 'pred.term'))
      .selectAll('perf')
      .selectAll('pred')
      .$call(qb => {
        if (props.input.orderBy === 'proba asc')
          return qb.orderBy('pred.proba', 'asc').orderBy('pred.zscore', 'desc')
        else if (props.input.orderBy === 'proba desc')
          return qb.orderBy('pred.proba', 'desc').orderBy('pred.zscore', 'desc')
        else if (props.input.orderBy === 'zscore asc')
          return qb.orderBy('pred.zscore', 'asc')
        else if (props.input.orderBy === 'zscore desc')
          return qb.orderBy('pred.zscore', 'desc')
        else if (props.input.orderBy === 'known asc')
          return qb.orderBy('pred.known', 'asc').orderBy('pred.zscore', 'desc')
        else if (props.input.orderBy === 'known desc')
          return qb.orderBy('pred.known', 'desc').orderBy('pred.zscore', 'desc')
        else if (props.input.orderBy === 'auroc asc')
          return qb.orderBy('perf.roc_auc', 'asc').orderBy('pred.zscore', 'desc')
        else if (props.input.orderBy === 'auroc desc')
          return qb.orderBy('perf.roc_auc', 'desc').orderBy('pred.zscore', 'desc')
        else if (props.input.orderBy === 'uniqueness asc')
          return qb.orderBy('perf.genes_with_term_predicted', 'asc').orderBy('pred.zscore', 'desc')
        else if (props.input.orderBy === 'uniqueness desc')
          return qb.orderBy('perf.genes_with_term_predicted', 'desc').orderBy('pred.zscore', 'desc')
        else
          return qb
      })
      .where('pred.model', '=', props.input.model)
      .where('pred.source', '=', props.input.source)
      .where('pred.gene', '=', props.input.gene)
      .$if(!!props.input.filter, qb => qb.where('pred.term', 'ilike', `%${props.input.filter ?? ''}%`))
      .offset(props.input.offset)
      .limit(props.input.limit)
      .execute()
  }),
  termPredictions: procedure.input(z.object({
    model: z.string().default('latest'),
    source: z.string(),
    term: z.string(),
    orderBy: z.union([
      z.literal('proba asc'), z.literal('proba desc'),
      z.literal('zscore asc'), z.literal('zscore desc'),
      z.literal('known asc'), z.literal('known desc'),
      z.literal('auroc asc'), z.literal('auroc desc'),
      z.literal('uniqueness asc'), z.literal('uniqueness desc'),
    ]).optional().default('proba desc'),
    filter: z.string().optional(),
    offset: z.number().transform(offset => Math.max(0, offset)),
    limit: z.number().transform(limit => Math.min(100, limit)),
  })).query(async (props) => {
    return await db
      .selectFrom('app.prediction as pred')
      .selectAll('pred')
      .$call(qb => {
        if (props.input.orderBy === 'proba asc')
          return qb.orderBy('pred.proba', 'asc').orderBy('pred.zscore', 'desc')
        else if (props.input.orderBy === 'proba desc')
          return qb.orderBy('pred.proba', 'desc').orderBy('pred.zscore', 'desc')
        else if (props.input.orderBy === 'zscore asc')
          return qb.orderBy('pred.zscore', 'asc')
        else if (props.input.orderBy === 'zscore desc')
          return qb.orderBy('pred.zscore', 'desc')
        else if (props.input.orderBy === 'known asc')
          return qb.orderBy('pred.known', 'asc').orderBy('pred.zscore', 'desc')
        else if (props.input.orderBy === 'known desc')
          return qb.orderBy('pred.known', 'desc').orderBy('pred.zscore', 'desc')
        else
          return qb
      })
      .where('pred.model', '=', props.input.model)
      .where('pred.source', '=', props.input.source)
      .where('pred.term', '=', props.input.term)
      .$if(!!props.input.filter, qb => qb.where('pred.gene', 'ilike', `%${props.input.filter ?? ''}%`))
      .offset(props.input.offset)
      .limit(props.input.limit)
      .execute()
  }),
})

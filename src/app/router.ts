import { db } from "@/lib/database"
import { procedure, router } from "@/lib/trpc";
import { sql } from "kysely";
import { z } from 'zod'
import { select_distinct_loose_indexscan } from "@/lib/database/utils";

const source_pagerank: Record<string, number> = {
  LINCS_L1000_Chem_Pert_Consensus_Sigs: 0,
  LINCS_L1000_CRISPR_KO_Consensus_Sigs: 0,
  LINCS_L1000_Consensus_Median_Signatures: 0,
  ARCHS4_IDG_Coexp: 0,
  GlyGen_Glycosylated_Proteins_2022: 0,
  GTEx_Aging_Signatures_2021: 0,
  GTEx_Tissues_V8_2023: 0,
  IDG_Drug_Targets_2022: 0,
  MoTrPAC_Endurance_Trained_Rats_2023: 1,
  KOMP2_Mouse_Phenotypes_2022: 3,
  ChEA_2022: 19,
  KEA_2015: 16,
  Human_Phenotype_Ontology: 17,
  GWAS_Catalog_2023: 17,
  GO_Biological_Process_2023: 18,
  KEGG_2021_Human: 15,
  MGI_Mammalian_Phenotype_Level_4_2024: 14,
  OMIM_Disease: 13,
  HuBMAP_Azimuth: 12,
  'HuBMAP_ASCT+B': 12,
}

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
    return (await
      select_distinct_loose_indexscan('app.prediction', 'model')
        .execute(db)
    ).rows
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
      .offset(props.input.offset)
      .limit(props.input.limit)
      .execute()
  }),
})

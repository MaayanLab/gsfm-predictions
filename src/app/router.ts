import { db } from "@/lib/database"
import { procedure, router } from "@/lib/trpc";
import { sql } from "kysely";
import { z } from 'zod'
import { select_distinct_loose_indexscan } from "@/lib/database/utils";

const source_tags: Record<string, string[]> = {
  LINCS_L1000_Chem_Pert_Consensus_Sigs: ['CFDE'],
  LINCS_L1000_CRISPR_KO_Consensus_Sigs: ['CFDE'],
  LINCS_L1000_Consensus_Median_Signatures: ['CFDE'],
  ARCHS4_IDG_Coexp: ['CFDE'],
  GlyGen_Glycosylated_Proteins_2022: ['CFDE'],
  GTEx_Aging_Signatures_2021: ['CFDE'],
  GTEx_Tissues_V8_2023: ['CFDE'],
  IDG_Drug_Targets_2022: ['CFDE'],
  MoTrPAC_Endurance_Trained_Rats_2023: ['CFDE'],
  KOMP2_Mouse_Phenotypes_2022: ['CFDE'],
  ChEA_2022: [],
  KEA_2015: [],
  Human_Phenotype_Ontology: [],
  GWAS_Catalog_2023: [],
  GO_Biological_Process_2023: [],
  KEGG_2021_Human: [],
  MGI_Mammalian_Phenotype_Level_4_2024: [],
  OMIM_Disease: [],
  HuBMAP_Azimuth: ['CFDE'],
  HuBMAP_ASCTpB: ['CFDE'],
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
    ).map(({ source, count }) => ({ source, count, tags: source_tags[source] ?? [] }))
    sources.sort((a, b) =>
      (b.tags.length - a.tags.length)
      || (Number(b.count) - Number(a.count))
    )
    return sources
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
      .leftJoin('app.performance as perf', j => j.on(sql`(perf.model, perf.source, perf.term)`, '=', sql`(pred.model, pred.source, pred.term)`))
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

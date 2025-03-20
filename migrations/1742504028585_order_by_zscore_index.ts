import type { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema.withSchema('app')
    .dropIndex('prediction_model_gene_source_proba')
		.execute()
	await db.schema.withSchema('app')
    .createIndex('prediction_model_gene_source_proba_zscore')
    .on('prediction')
    .columns(['model', 'gene', 'source', 'proba desc', 'zscore desc'])
		.execute()
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.withSchema('app')
    .dropIndex('prediction_model_gene_source_proba_zscore')
		.execute()
  await db.schema.withSchema('app')
    .createIndex('prediction_model_gene_source_proba')
    .on('prediction')
    .columns(['model', 'gene', 'source', 'proba desc'])
    .execute()
}

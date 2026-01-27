import type { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema.withSchema('app')
		.createIndex('prediction_gene_model')
		.on('prediction')
		.columns(['gene','model'])
		.execute()
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.withSchema('app')
		.dropIndex('prediction_gene_model')
		.execute()
}

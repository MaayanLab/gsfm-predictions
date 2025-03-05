import type { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.withSchema('app')
    .createTable('performance')
    .addColumn('source', 'varchar', c => c.notNull())
    .addColumn('term', 'varchar', c => c.notNull())
    .addColumn('roc_auc', 'float4', c => c.notNull())
    .addPrimaryKeyConstraint('performance_pk', ['source', 'term'])
    .execute()
	await db.schema.withSchema('app')
		.createIndex('prediction_source_term_idx')
		.on('prediction')
		.columns(['source', 'term'])
		.execute()
	await db.schema.withSchema('app')
		.createIndex('performance_source_term_idx')
		.on('performance')
		.columns(['source', 'term'])
		.execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.withSchema('app')
		.dropTable('performance')
		.cascade()
		.execute()
	await db.schema.withSchema('app')
		.dropIndex('prediction_source_term_idx')
		.execute()
}

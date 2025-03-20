import { sql, type Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.withSchema('app')
		.alterTable('prediction')
		.addColumn('zscore', 'float4', c => c.notNull().defaultTo(sql`'NaN'`))
		.addColumn('rank', 'int8', c => c.notNull().defaultTo(0))
		.execute()
  await db.schema.withSchema('app')
    .alterTable('performance')
		.addColumn('genes_with_term_in_top_10', 'int8', c => c.notNull().defaultTo(0))
		.addColumn('genes_with_term_predicted', 'int8', c => c.notNull().defaultTo(0))
		.execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.withSchema('app')
    .alterTable('performance')
		.dropColumn('genes_with_term_in_top_10')
		.dropColumn('genes_with_term_predicted')
		.execute()
	await db.schema.withSchema('app')
		.alterTable('prediction')
		.dropColumn('zscore')
		.dropColumn('rank')
		.execute()
}

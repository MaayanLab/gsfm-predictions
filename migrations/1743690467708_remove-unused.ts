import type { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema.withSchema('app')
		.dropTable('user_prediction')
		.cascade()
		.execute()
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.withSchema('app')
		.createTable('user_prediction')
		.addColumn('id', 'bigserial', col => col.primaryKey())
		.addColumn('gene_set', 'uuid', col => col.references('app.user_gene_set.id').onDelete('cascade'))
		.addColumn('model', 'varchar', c => c.notNull().defaultTo('latest'))
    .addColumn('gene', 'varchar', c => c.notNull())
    .addColumn('proba', 'float4', c => c.notNull())
		.execute()
}

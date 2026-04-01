import type { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema.withSchema('app')
		.createTable('user_gene_set_library')
		.addColumn('id', 'varchar', col => col.primaryKey())
		.addColumn('gene_set_library', 'text', col => col.notNull())
		.execute()
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.withSchema('app')
		.dropTable('user_gene_set_library')
		.execute()
}

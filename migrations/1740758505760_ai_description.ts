import type { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.withSchema('app')
		.alterTable('gene')
		.addColumn('ai_description', 'text')
		.execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.withSchema('app')
		.alterTable('gene')
		.dropColumn('ai_description')
		.execute()
}

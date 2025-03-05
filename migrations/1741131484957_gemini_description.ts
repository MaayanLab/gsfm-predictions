import type { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.withSchema('app')
		.alterTable('gene')
		.renameColumn('ai_description', 'deepdive_gpt4o_description')
		.execute()
	await db.schema.withSchema('app')
		.alterTable('gene')
		.addColumn('deepdive_gemini_description', 'text')
		.execute()
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.withSchema('app')
		.alterTable('gene')
		.dropColumn('deepdive_gemini_description')
		.execute()
  await db.schema.withSchema('app')
		.alterTable('gene')
		.renameColumn('deepdive_gpt4o_description', 'ai_description')
		.execute()
}

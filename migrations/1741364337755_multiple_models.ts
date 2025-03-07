import { sql, type Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
	await sql`
		alter table app.prediction drop constraint prediction_pk;
		alter table app.prediction add column id bigserial primary key;
		alter table app.prediction add column model varchar not null default 'latest';
		create unique index prediction_unique on app.prediction (model, source, term, gene);
		create index prediction_model on app.prediction (model);
		
		alter table app.performance drop constraint performance_pk;
		alter table app.performance add column id bigserial primary key;
		alter table app.performance add column model varchar not null default 'latest';
		create unique index performance_unique on app.performance (model, source, term);
	`.execute(db)
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.withSchema('app')
		.dropIndex('prediction_unique')
		.execute()
	await sql`
		drop unique index performance_unique on app.performance;
		alter table app.performance drop constraint performance_pkey;
		alter table app.performance drop column model;
		alter table app.performance drop column id;
		alter table app.prediction add constraint prediction_pk primary key (source, term);

		drop unique index prediction_unique on app.prediction;
		alter table app.prediction drop constraint prediction_pkey;
		alter table app.prediction drop column model;
		alter table app.prediction drop column id;
		alter table app.prediction add constraint prediction_pk primary key (source, term, gene);
	`.execute(db)
}

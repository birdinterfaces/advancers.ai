import { pgTable, uuid, varchar, foreignKey, timestamp, json, jsonb, text, boolean } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"




export const user = pgTable("User", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	email: varchar({ length: 64 }).notNull(),
	password: varchar({ length: 64 }),
	membership: varchar({ length: 64 }).default('free').notNull(),
	stripecustomerid: varchar({ length: 256 }),
	stripesubscriptionid: varchar({ length: 256 }),
	usage: varchar({ length: 255 }),
	previoussubscriptionid: varchar({ length: 256 }),
	name: varchar({ length: 255 }),
	provider: varchar({ length: 20 }).default('credentials').notNull(),
});

export const chat = pgTable("Chat", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	createdAt: timestamp({ mode: 'string' }).notNull(),
	messages: json().notNull(),
	userId: uuid().notNull(),
	updatedAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	searchResults: jsonb(),
},
(table) => {
	return {
		chatUserIdUserIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "Chat_userId_User_id_fk"
		}),
	}
});

export const task = pgTable("Task", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	title: varchar({ length: 256 }).notNull(),
	description: text(),
	dueDate: timestamp({ mode: 'string' }),
	status: varchar({ length: 64 }).default('todo').notNull(),
	completed: boolean().default(false).notNull(),
	completedAt: timestamp({ mode: 'string' }),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	userId: uuid().notNull(),
},
(table) => {
	return {
		taskUserIdUserIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "Task_userId_User_id_fk"
		}),
	}
});

export const actionLog = pgTable("ActionLog", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	taskId: uuid().notNull(),
	userId: uuid().notNull(),
	actorType: varchar({ length: 20 }).notNull(),
	actorId: varchar({ length: 256 }).notNull(),
	actionType: varchar({ length: 64 }).notNull(),
	details: json(),
	timestamp: timestamp({ mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		actionLogTaskIdTaskIdFk: foreignKey({
			columns: [table.taskId],
			foreignColumns: [task.id],
			name: "ActionLog_taskId_Task_id_fk"
		}),
		actionLogUserIdUserIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "ActionLog_userId_User_id_fk"
		}),
	}
});
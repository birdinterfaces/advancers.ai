import { relations } from "drizzle-orm/relations";
import { user, chat, task, actionLog } from "./schema";

export const chatRelations = relations(chat, ({one}) => ({
	user: one(user, {
		fields: [chat.userId],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	chats: many(chat),
	tasks: many(task),
	actionLogs: many(actionLog),
}));

export const taskRelations = relations(task, ({one, many}) => ({
	user: one(user, {
		fields: [task.userId],
		references: [user.id]
	}),
	actionLogs: many(actionLog),
}));

export const actionLogRelations = relations(actionLog, ({one}) => ({
	task: one(task, {
		fields: [actionLog.taskId],
		references: [task.id]
	}),
	user: one(user, {
		fields: [actionLog.userId],
		references: [user.id]
	}),
}));
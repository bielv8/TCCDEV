import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, jsonb, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  theme: integer("theme").notNull(),
  context: text("context").notNull(),
  problem: text("problem").notNull(),
  architecture: jsonb("architecture").notNull(),
  technologies: jsonb("technologies").notNull(),
  modules: jsonb("modules").notNull(),
  deliverables: jsonb("deliverables").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const weeklySchedule = pgTable("weekly_schedule", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").references(() => projects.id),
  weekNumber: integer("week_number").notNull(),
  title: text("title").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  tasks: jsonb("tasks").notNull(),
  deliverable: text("deliverable").notNull(),
  evaluationCriteria: jsonb("evaluation_criteria").notNull(),
  status: varchar("status", { enum: ["pending", "current", "completed"] }).default("pending"),
});

export const professors = pgTable("professors", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  specialty: text("specialty").notNull(),
  expertise: jsonb("expertise").notNull(),
  avatar: text("avatar"),
  email: text("email"),
});

export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: varchar("type", { enum: ["deadline", "feedback", "announcement"] }).notNull(),
  priority: varchar("priority", { enum: ["low", "medium", "high"] }).default("medium"),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").unique(),
  password: text("password"),
  name: text("name").notNull(),
  type: varchar("type", { enum: ["professor", "student"] }).notNull(),
  githubProfile: text("github_profile"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const groups = pgTable("groups", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  projectId: varchar("project_id").references(() => projects.id),
  leaderId: varchar("leader_id").references(() => users.id),
  status: varchar("status", { enum: ["pending", "approved", "rejected"] }).default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const groupMembers = pgTable("group_members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  groupId: varchar("group_id").references(() => groups.id),
  userId: varchar("user_id").references(() => users.id),
  joinedAt: timestamp("joined_at").defaultNow(),
});

export const projectInterests = pgTable("project_interests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  projectId: varchar("project_id").references(() => projects.id),
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const deliveryCompletions = pgTable("delivery_completions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  scheduleId: varchar("schedule_id").references(() => weeklySchedule.id),
  groupId: varchar("group_id").references(() => groups.id),
  completedAt: timestamp("completed_at").defaultNow(),
  notes: text("notes"),
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
});

export const insertWeeklyScheduleSchema = createInsertSchema(weeklySchedule).omit({
  id: true,
});

export const insertProfessorSchema = createInsertSchema(professors).omit({
  id: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertGroupSchema = createInsertSchema(groups).omit({
  id: true,
  createdAt: true,
});

export const insertGroupMemberSchema = createInsertSchema(groupMembers).omit({
  id: true,
  joinedAt: true,
});

export const insertProjectInterestSchema = createInsertSchema(projectInterests).omit({
  id: true,
  createdAt: true,
});

export const insertDeliveryCompletionSchema = createInsertSchema(deliveryCompletions).omit({
  id: true,
  completedAt: true,
});

export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type WeeklySchedule = typeof weeklySchedule.$inferSelect;
export type InsertWeeklySchedule = z.infer<typeof insertWeeklyScheduleSchema>;
export type Professor = typeof professors.$inferSelect;
export type InsertProfessor = z.infer<typeof insertProfessorSchema>;
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Group = typeof groups.$inferSelect;
export type InsertGroup = z.infer<typeof insertGroupSchema>;
export type GroupMember = typeof groupMembers.$inferSelect;
export type InsertGroupMember = z.infer<typeof insertGroupMemberSchema>;
export type ProjectInterest = typeof projectInterests.$inferSelect;
export type InsertProjectInterest = z.infer<typeof insertProjectInterestSchema>;
export type DeliveryCompletion = typeof deliveryCompletions.$inferSelect;
export type InsertDeliveryCompletion = z.infer<typeof insertDeliveryCompletionSchema>;

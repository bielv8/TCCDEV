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

export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type WeeklySchedule = typeof weeklySchedule.$inferSelect;
export type InsertWeeklySchedule = z.infer<typeof insertWeeklyScheduleSchema>;
export type Professor = typeof professors.$inferSelect;
export type InsertProfessor = z.infer<typeof insertProfessorSchema>;
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;

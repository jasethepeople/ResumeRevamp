import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const resumes = pgTable("resumes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  originalContent: text("original_content").notNull(),
  optimizedContent: text("optimized_content"),
  parsedData: jsonb("parsed_data"),
  atsScore: jsonb("ats_score"),
  optimizationSettings: jsonb("optimization_settings"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertResumeSchema = createInsertSchema(resumes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertResume = z.infer<typeof insertResumeSchema>;
export type Resume = typeof resumes.$inferSelect;

// Resume data structures
export const ResumeDataSchema = z.object({
  name: z.string(),
  phone: z.string(),
  email: z.string(),
  location: z.string(),
  linkedin: z.string().optional(),
  summary: z.string(),
  skills: z.array(z.object({
    category: z.string(),
    items: z.string(),
  })),
  experience: z.array(z.object({
    title: z.string(),
    company: z.string(),
    location: z.string(),
    dates: z.string(),
    achievements: z.array(z.string()),
  })),
  education: z.array(z.object({
    degree: z.string(),
    field: z.string(),
    school: z.string(),
    dates: z.string(),
  })),
});

export const ATSScoreSchema = z.object({
  overall: z.number(),
  keywordOptimization: z.number(),
  formatCompatibility: z.number(),
  sectionStructure: z.number(),
  suggestions: z.array(z.object({
    type: z.string(),
    title: z.string(),
    description: z.string(),
    priority: z.enum(['high', 'medium', 'low']),
  })),
});

export const OptimizationSettingsSchema = z.object({
  keywordEnhancement: z.boolean(),
  impactStatements: z.boolean(),
  summaryOptimization: z.boolean(),
  skillsEnhancement: z.boolean(),
  targetJobField: z.string(),
  experienceLevel: z.enum(['entry', 'mid', 'senior']),
});

export type ResumeData = z.infer<typeof ResumeDataSchema>;
export type ATSScore = z.infer<typeof ATSScoreSchema>;
export type OptimizationSettings = z.infer<typeof OptimizationSettingsSchema>;

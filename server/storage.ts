import { type User, type InsertUser, type Resume, type InsertResume, type ResumeData, type ATSScore, type OptimizationSettings } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getResume(id: string): Promise<Resume | undefined>;
  createResume(resume: InsertResume): Promise<Resume>;
  updateResume(id: string, updates: Partial<Resume>): Promise<Resume | undefined>;
  getUserResumes(userId: string): Promise<Resume[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private resumes: Map<string, Resume>;

  constructor() {
    this.users = new Map();
    this.resumes = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getResume(id: string): Promise<Resume | undefined> {
    return this.resumes.get(id);
  }

  async createResume(insertResume: InsertResume): Promise<Resume> {
    const id = randomUUID();
    const now = new Date().toISOString();
    const resume: Resume = { 
      ...insertResume, 
      userId: insertResume.userId ?? null,
      optimizedContent: insertResume.optimizedContent ?? null,
      parsedData: insertResume.parsedData ?? null,
      atsScore: insertResume.atsScore ?? null,
      optimizationSettings: insertResume.optimizationSettings ?? null,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.resumes.set(id, resume);
    return resume;
  }

  async updateResume(id: string, updates: Partial<Resume>): Promise<Resume | undefined> {
    const existing = this.resumes.get(id);
    if (!existing) return undefined;

    const updated: Resume = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.resumes.set(id, updated);
    return updated;
  }

  async getUserResumes(userId: string): Promise<Resume[]> {
    return Array.from(this.resumes.values()).filter(
      (resume) => resume.userId === userId
    );
  }
}

export const storage = new MemStorage();

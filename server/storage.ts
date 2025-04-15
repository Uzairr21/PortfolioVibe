import { 
  users, 
  type User, 
  type InsertUser,
  projects,
  type Project,
  type InsertProject,
  technologies,
  type Technology,
  type InsertTechnology,
  projectTechnologies,
  type ProjectTechnology,
  type InsertProjectTechnology,
  messages,
  type Message,
  type InsertMessage
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Project methods
  getProjects(): Promise<Project[]>;
  getFeaturedProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;
  
  // Technology methods
  getTechnologies(): Promise<Technology[]>;
  getTechnology(id: number): Promise<Technology | undefined>;
  createTechnology(technology: InsertTechnology): Promise<Technology>;
  
  // Project-Technology methods
  getProjectTechnologies(projectId: number): Promise<ProjectTechnology[]>;
  addTechnologyToProject(projectTechnology: InsertProjectTechnology): Promise<ProjectTechnology>;
  removeTechnologyFromProject(projectId: number, technologyId: number): Promise<boolean>;
  
  // Message methods
  getMessages(): Promise<Message[]>;
  getMessage(id: number): Promise<Message | undefined>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessageAsRead(id: number): Promise<Message | undefined>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  
  // Project methods
  async getProjects(): Promise<Project[]> {
    return await db.select().from(projects).orderBy(asc(projects.order));
  }
  
  async getFeaturedProjects(): Promise<Project[]> {
    return await db.select()
      .from(projects)
      .where(eq(projects.featured, true))
      .orderBy(asc(projects.order));
  }
  
  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }
  
  async createProject(project: InsertProject): Promise<Project> {
    const [newProject] = await db.insert(projects).values(project).returning();
    return newProject;
  }
  
  async updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined> {
    const [updatedProject] = await db
      .update(projects)
      .set(project)
      .where(eq(projects.id, id))
      .returning();
    return updatedProject;
  }
  
  async deleteProject(id: number): Promise<boolean> {
    const result = await db.delete(projects).where(eq(projects.id, id));
    return true; // Drizzle doesn't return affected rows, so we just return true
  }
  
  // Technology methods
  async getTechnologies(): Promise<Technology[]> {
    return await db.select().from(technologies).orderBy(asc(technologies.name));
  }
  
  async getTechnology(id: number): Promise<Technology | undefined> {
    const [technology] = await db.select().from(technologies).where(eq(technologies.id, id));
    return technology;
  }
  
  async createTechnology(technology: InsertTechnology): Promise<Technology> {
    const [newTechnology] = await db.insert(technologies).values(technology).returning();
    return newTechnology;
  }
  
  // Project-Technology methods
  async getProjectTechnologies(projectId: number): Promise<ProjectTechnology[]> {
    return await db
      .select()
      .from(projectTechnologies)
      .where(eq(projectTechnologies.projectId, projectId));
  }
  
  async addTechnologyToProject(projectTech: InsertProjectTechnology): Promise<ProjectTechnology> {
    const [newProjectTech] = await db
      .insert(projectTechnologies)
      .values(projectTech)
      .returning();
    return newProjectTech;
  }
  
  async removeTechnologyFromProject(projectId: number, technologyId: number): Promise<boolean> {
    await db
      .delete(projectTechnologies)
      .where(
        and(
          eq(projectTechnologies.projectId, projectId),
          eq(projectTechnologies.technologyId, technologyId)
        )
      );
    return true;
  }
  
  // Message methods
  async getMessages(): Promise<Message[]> {
    return await db.select().from(messages).orderBy(desc(messages.createdAt));
  }
  
  async getMessage(id: number): Promise<Message | undefined> {
    const [message] = await db.select().from(messages).where(eq(messages.id, id));
    return message;
  }
  
  async createMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await db.insert(messages).values(message).returning();
    return newMessage;
  }
  
  async markMessageAsRead(id: number): Promise<Message | undefined> {
    const [updatedMessage] = await db
      .update(messages)
      .set({ read: true })
      .where(eq(messages.id, id))
      .returning();
    return updatedMessage;
  }
}

export const storage = new DatabaseStorage();

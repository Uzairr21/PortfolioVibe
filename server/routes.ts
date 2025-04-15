import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertMessageSchema, 
  insertProjectSchema, 
  insertTechnologySchema, 
  insertProjectTechnologySchema 
} from "@shared/schema";

const contactFormSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(2),
  message: z.string().min(10),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // ******* Projects API Endpoints *******
  
  // Get all projects
  app.get("/api/projects", async (_req, res) => {
    try {
      const projects = await storage.getProjects();
      res.status(200).json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Error fetching projects" });
    }
  });
  
  // Get featured projects
  app.get("/api/projects/featured", async (_req, res) => {
    try {
      const projects = await storage.getFeaturedProjects();
      res.status(200).json(projects);
    } catch (error) {
      console.error("Error fetching featured projects:", error);
      res.status(500).json({ message: "Error fetching featured projects" });
    }
  });
  
  // Get single project by ID
  app.get("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid project ID" });
      }
      
      const project = await storage.getProject(id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      res.status(200).json(project);
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ message: "Error fetching project" });
    }
  });
  
  // Create new project
  app.post("/api/projects", async (req, res) => {
    try {
      const projectData = insertProjectSchema.parse(req.body);
      const newProject = await storage.createProject(projectData);
      res.status(201).json(newProject);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      
      console.error("Error creating project:", error);
      res.status(500).json({ message: "Error creating project" });
    }
  });
  
  // Update existing project
  app.patch("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid project ID" });
      }
      
      // Partial validation - only validate fields that are present
      const projectData = insertProjectSchema.partial().parse(req.body);
      
      const updatedProject = await storage.updateProject(id, projectData);
      if (!updatedProject) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      res.status(200).json(updatedProject);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      
      console.error("Error updating project:", error);
      res.status(500).json({ message: "Error updating project" });
    }
  });
  
  // Delete project
  app.delete("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid project ID" });
      }
      
      const project = await storage.getProject(id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      await storage.deleteProject(id);
      res.status(200).json({ message: "Project deleted successfully" });
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ message: "Error deleting project" });
    }
  });
  
  // ******* Technologies API Endpoints *******
  
  // Get all technologies
  app.get("/api/technologies", async (_req, res) => {
    try {
      const technologies = await storage.getTechnologies();
      res.status(200).json(technologies);
    } catch (error) {
      console.error("Error fetching technologies:", error);
      res.status(500).json({ message: "Error fetching technologies" });
    }
  });
  
  // Create new technology
  app.post("/api/technologies", async (req, res) => {
    try {
      const technologyData = insertTechnologySchema.parse(req.body);
      const newTechnology = await storage.createTechnology(technologyData);
      res.status(201).json(newTechnology);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      
      console.error("Error creating technology:", error);
      res.status(500).json({ message: "Error creating technology" });
    }
  });
  
  // ******* Project Technologies API Endpoints *******
  
  // Get technologies for a project
  app.get("/api/projects/:id/technologies", async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      if (isNaN(projectId)) {
        return res.status(400).json({ message: "Invalid project ID" });
      }
      
      const projectTechs = await storage.getProjectTechnologies(projectId);
      res.status(200).json(projectTechs);
    } catch (error) {
      console.error("Error fetching project technologies:", error);
      res.status(500).json({ message: "Error fetching project technologies" });
    }
  });
  
  // Add technology to project
  app.post("/api/projects/technologies", async (req, res) => {
    try {
      const projectTechData = insertProjectTechnologySchema.parse(req.body);
      const newProjectTech = await storage.addTechnologyToProject(projectTechData);
      res.status(201).json(newProjectTech);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      
      console.error("Error adding technology to project:", error);
      res.status(500).json({ message: "Error adding technology to project" });
    }
  });
  
  // Remove technology from project
  app.delete("/api/projects/:projectId/technologies/:technologyId", async (req, res) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const technologyId = parseInt(req.params.technologyId);
      
      if (isNaN(projectId) || isNaN(technologyId)) {
        return res.status(400).json({ message: "Invalid IDs provided" });
      }
      
      await storage.removeTechnologyFromProject(projectId, technologyId);
      res.status(200).json({ message: "Technology removed from project successfully" });
    } catch (error) {
      console.error("Error removing technology from project:", error);
      res.status(500).json({ message: "Error removing technology from project" });
    }
  });
  
  // ******* Messages API Endpoints *******
  
  // Contact form submission endpoint - now saves to database
  app.post("/api/contact", async (req, res) => {
    try {
      // Validate form data
      const formData = contactFormSchema.parse(req.body);
      
      // Save to database
      const newMessage = await storage.createMessage({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message
      });
      
      // Return success response
      res.status(200).json({ 
        success: true, 
        message: "Message received successfully",
        data: newMessage
      });
    } catch (error) {
      console.error("Error processing contact form:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid form data", 
          errors: error.errors 
        });
      }
      
      res.status(500).json({ 
        success: false, 
        message: "Database error - please try again later" 
      });
    }
  });
  
  // Get all messages (could be protected in a real app)
  app.get("/api/messages", async (_req, res) => {
    try {
      const messages = await storage.getMessages();
      res.status(200).json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Error fetching messages" });
    }
  });
  
  // Mark message as read
  app.patch("/api/messages/:id/read", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid message ID" });
      }
      
      const updatedMessage = await storage.markMessageAsRead(id);
      if (!updatedMessage) {
        return res.status(404).json({ message: "Message not found" });
      }
      
      res.status(200).json(updatedMessage);
    } catch (error) {
      console.error("Error marking message as read:", error);
      res.status(500).json({ message: "Error marking message as read" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

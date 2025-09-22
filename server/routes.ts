import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get all projects
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  // Get specific project
  app.get("/api/projects/:id", async (req, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  // Get weekly schedule for a project
  app.get("/api/projects/:id/schedule", async (req, res) => {
    try {
      const schedule = await storage.getWeeklySchedule(req.params.id);
      res.json(schedule);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch schedule" });
    }
  });

  // Update weekly schedule status
  app.patch("/api/schedule/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      if (!["pending", "current", "completed"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      
      const updated = await storage.updateWeeklyScheduleStatus(req.params.id, status);
      if (!updated) {
        return res.status(404).json({ message: "Schedule item not found" });
      }
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to update status" });
    }
  });

  // Get all professors
  app.get("/api/professors", async (req, res) => {
    try {
      const professors = await storage.getProfessors();
      res.json(professors);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch professors" });
    }
  });

  // Get all notifications
  app.get("/api/notifications", async (req, res) => {
    try {
      const notifications = await storage.getNotifications();
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  // Mark notification as read
  app.patch("/api/notifications/:id/read", async (req, res) => {
    try {
      const updated = await storage.markNotificationAsRead(req.params.id);
      if (!updated) {
        return res.status(404).json({ message: "Notification not found" });
      }
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to mark notification as read" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

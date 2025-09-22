import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertUserSchema, insertGroupSchema, insertProjectInterestSchema, insertDeliveryCompletionSchema } from "@shared/schema";

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

  // Authentication Routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      const user = await storage.authenticateUser(username, password);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Don't send password back
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      res.status(500).json({ message: "Authentication failed" });
    }
  });

  // Student registration
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse({
        ...req.body,
        type: "student"
      });
      
      // Check if username already exists (for students with GitHub usernames)
      if (userData.username) {
        const existingUser = await storage.getUserByUsername(userData.username);
        if (existingUser) {
          return res.status(409).json({ message: "Username already exists" });
        }
      }
      
      const user = await storage.createUser(userData);
      const { password: _, ...userWithoutPassword } = user;
      res.status(201).json({ user: userWithoutPassword });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to register user" });
    }
  });

  // Groups Routes
  app.get("/api/groups", async (req, res) => {
    try {
      const groups = await storage.getGroups();
      res.json(groups);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch groups" });
    }
  });

  // Get groups for a specific project
  app.get("/api/projects/:projectId/groups", async (req, res) => {
    try {
      const groups = await storage.getGroupsByProject(req.params.projectId);
      res.json(groups);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch project groups" });
    }
  });

  app.get("/api/projects/:id/groups", async (req, res) => {
    try {
      const groups = await storage.getGroupsByProject(req.params.id);
      res.json(groups);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch project groups" });
    }
  });

  app.post("/api/groups", async (req, res) => {
    try {
      const groupData = insertGroupSchema.parse(req.body);
      const group = await storage.createGroup(groupData);
      res.status(201).json(group);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid group data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create group" });
    }
  });

  app.patch("/api/groups/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      if (!["pending", "approved", "rejected"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      
      const updated = await storage.updateGroupStatus(req.params.id, status);
      if (!updated) {
        return res.status(404).json({ message: "Group not found" });
      }
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to update group status" });
    }
  });

  // Group Members Routes
  app.get("/api/groups/:groupId/members", async (req, res) => {
    try {
      const members = await storage.getGroupMembers(req.params.groupId);
      res.json(members);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch group members" });
    }
  });

  app.post("/api/groups/:groupId/members", async (req, res) => {
    try {
      const { userId } = req.body;
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      
      const member = await storage.addGroupMember({
        groupId: req.params.groupId,
        userId
      });
      res.status(201).json(member);
    } catch (error) {
      res.status(500).json({ message: "Failed to add group member" });
    }
  });

  app.delete("/api/groups/:groupId/members/:userId", async (req, res) => {
    try {
      const success = await storage.removeGroupMember(req.params.groupId, req.params.userId);
      if (!success) {
        return res.status(404).json({ message: "Group member not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to remove group member" });
    }
  });

  // Project Interests Routes
  app.get("/api/projects/:projectId/interests", async (req, res) => {
    try {
      const interests = await storage.getProjectInterests(req.params.projectId);
      res.json(interests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch project interests" });
    }
  });

  app.get("/api/users/:userId/interests", async (req, res) => {
    try {
      const interests = await storage.getUserInterests(req.params.userId);
      res.json(interests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user interests" });
    }
  });

  app.post("/api/interests", async (req, res) => {
    try {
      const interestData = insertProjectInterestSchema.parse(req.body);
      const interest = await storage.createProjectInterest(interestData);
      res.status(201).json(interest);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid interest data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create interest" });
    }
  });

  // Delivery Completions Routes
  app.get("/api/groups/:groupId/completions", async (req, res) => {
    try {
      const completions = await storage.getDeliveryCompletions(req.params.groupId);
      res.json(completions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch delivery completions" });
    }
  });

  app.post("/api/completions", async (req, res) => {
    try {
      const completionData = insertDeliveryCompletionSchema.parse(req.body);
      const completion = await storage.createDeliveryCompletion(completionData);
      res.status(201).json(completion);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid completion data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create delivery completion" });
    }
  });

  app.get("/api/schedule/:scheduleId/groups/:groupId/completed", async (req, res) => {
    try {
      const isCompleted = await storage.isDeliveryCompleted(req.params.scheduleId, req.params.groupId);
      res.json({ completed: isCompleted });
    } catch (error) {
      res.status(500).json({ message: "Failed to check completion status" });
    }
  });

  // Users Routes
  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getUsers();
      // Don't send passwords
      const usersWithoutPasswords = users.map(({ password, ...user }) => user);
      res.json(usersWithoutPasswords);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertEventSchema, insertFeedbackSchema, insertParkSchema, insertUsagePredictionSchema, insertIotSensorDataSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Parks routes
  app.get("/api/parks", async (req, res) => {
    try {
      const parks = await storage.getParks();
      res.json(parks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch parks" });
    }
  });

  app.get("/api/parks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const park = await storage.getPark(id);
      if (!park) {
        return res.status(404).json({ error: "Park not found" });
      }
      res.json(park);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch park" });
    }
  });

  app.post("/api/parks", async (req, res) => {
    try {
      const validatedData = insertParkSchema.parse(req.body);
      const park = await storage.createPark(validatedData);
      res.status(201).json(park);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid park data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create park" });
    }
  });

  app.put("/api/parks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertParkSchema.partial().parse(req.body);
      const park = await storage.updatePark(id, validatedData);
      if (!park) {
        return res.status(404).json({ error: "Park not found" });
      }
      res.json(park);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid park data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update park" });
    }
  });

  // Events routes
  app.get("/api/events", async (req, res) => {
    try {
      const events = await storage.getEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch events" });
    }
  });

  app.get("/api/parks/:parkId/events", async (req, res) => {
    try {
      const parkId = parseInt(req.params.parkId);
      const events = await storage.getEventsByPark(parkId);
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch events" });
    }
  });

  app.post("/api/events", async (req, res) => {
    try {
      const validatedData = insertEventSchema.parse(req.body);
      const event = await storage.createEvent(validatedData);
      res.status(201).json(event);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid event data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create event" });
    }
  });

  app.post("/api/events/:id/signup", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const event = await storage.signUpForEvent(id);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }
      res.json(event);
    } catch (error) {
      res.status(500).json({ error: "Failed to sign up for event" });
    }
  });

  // Feedback routes
  app.get("/api/feedback", async (req, res) => {
    try {
      const feedback = await storage.getFeedback();
      res.json(feedback);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch feedback" });
    }
  });

  app.get("/api/parks/:parkId/feedback", async (req, res) => {
    try {
      const parkId = parseInt(req.params.parkId);
      const feedback = await storage.getFeedbackByPark(parkId);
      res.json(feedback);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch feedback" });
    }
  });

  app.post("/api/feedback", async (req, res) => {
    try {
      const validatedData = insertFeedbackSchema.parse(req.body);
      const feedback = await storage.createFeedback(validatedData);
      res.status(201).json(feedback);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid feedback data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create feedback" });
    }
  });

  app.post("/api/feedback/:id/like", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const feedback = await storage.likeFeedback(id);
      if (!feedback) {
        return res.status(404).json({ error: "Feedback not found" });
      }
      res.json(feedback);
    } catch (error) {
      res.status(500).json({ error: "Failed to like feedback" });
    }
  });

  // ML Prediction routes
  app.get("/api/ml/predict-usage/:parkId", async (req, res) => {
    try {
      const parkId = parseInt(req.params.parkId);
      const predictions = await storage.getUsagePredictions(parkId);
      
      // If no predictions exist, generate some basic ones
      if (predictions.length === 0) {
        const timeSlots = [
          { timeSlot: "10:00 AM - 12:00 PM", usage: "high" },
          { timeSlot: "2:00 PM - 4:00 PM", usage: "high" },
          { timeSlot: "6:00 PM - 8:00 PM", usage: "medium" },
          { timeSlot: "8:00 PM - 10:00 PM", usage: "low" }
        ];
        
        const generatedPredictions = [];
        for (const slot of timeSlots) {
          const prediction = await storage.createUsagePrediction({
            parkId,
            timeSlot: slot.timeSlot,
            predictedUsage: slot.usage,
            confidence: Math.floor(Math.random() * 30) + 70 // 70-100% confidence
          });
          generatedPredictions.push(prediction);
        }
        
        res.json(generatedPredictions);
      } else {
        res.json(predictions);
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch usage predictions" });
    }
  });

  // IoT Sensor Data routes
  app.get("/api/iot/sensor-data/:parkId", async (req, res) => {
    try {
      const parkId = parseInt(req.params.parkId);
      const sensorData = await storage.getIotSensorData(parkId);
      
      // If no sensor data exists, generate some basic ones
      if (sensorData.length === 0) {
        const sensorTypes = [
          { type: "trash_level", value: "78", unit: "%" },
          { type: "grass_height", value: "12", unit: "cm" },
          { type: "temperature", value: "68", unit: "°F" },
          { type: "humidity", value: "45", unit: "%" }
        ];
        
        const generatedData = [];
        for (const sensor of sensorTypes) {
          const data = await storage.createIotSensorData({
            parkId,
            sensorType: sensor.type,
            value: sensor.value,
            unit: sensor.unit
          });
          generatedData.push(data);
        }
        
        res.json(generatedData);
      } else {
        res.json(sensorData);
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch sensor data" });
    }
  });

  app.post("/api/iot/sensor-data", async (req, res) => {
    try {
      const validatedData = insertIotSensorDataSchema.parse(req.body);
      const data = await storage.createIotSensorData(validatedData);
      res.status(201).json(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid sensor data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create sensor data" });
    }
  });

  // Simulate maintenance update based on IoT data
  app.post("/api/simulate-maintenance", async (req, res) => {
    try {
      const { parkId, litter_level, grass_height } = req.body;
      
      let maintenanceStatus = "good";
      if (litter_level === "high" || grass_height === "tall") {
        maintenanceStatus = "urgent";
      } else if (litter_level === "medium" || grass_height === "medium") {
        maintenanceStatus = "needs_attention";
      }
      
      await storage.updatePark(parkId, { maintenanceStatus });
      
      res.json({ message: "Maintenance status updated", status: maintenanceStatus });
    } catch (error) {
      res.status(500).json({ error: "Failed to update maintenance status" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

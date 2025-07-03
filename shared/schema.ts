import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const parks = pgTable("parks", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  description: text("description"),
  status: text("status").notNull().default("active"),
  currentUsage: text("current_usage").notNull().default("low"),
  maintenanceStatus: text("maintenance_status").notNull().default("good"),
  nextEvent: text("next_event"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow()
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  parkId: integer("park_id").references(() => parks.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  date: text("date").notNull(),
  time: text("time").notNull(),
  signups: integer("signups").notNull().default(0),
  maxSignups: integer("max_signups").default(50),
  category: text("category").notNull().default("general"),
  createdAt: timestamp("created_at").defaultNow()
});

export const feedback = pgTable("feedback", {
  id: serial("id").primaryKey(),
  parkId: integer("park_id").references(() => parks.id).notNull(),
  username: text("username").notNull(),
  message: text("message").notNull(),
  likes: integer("likes").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow()
});

export const usagePredictions = pgTable("usage_predictions", {
  id: serial("id").primaryKey(),
  parkId: integer("park_id").references(() => parks.id).notNull(),
  timeSlot: text("time_slot").notNull(),
  predictedUsage: text("predicted_usage").notNull(),
  confidence: integer("confidence").notNull().default(75),
  createdAt: timestamp("created_at").defaultNow()
});

export const iotSensorData = pgTable("iot_sensor_data", {
  id: serial("id").primaryKey(),
  parkId: integer("park_id").references(() => parks.id).notNull(),
  sensorType: text("sensor_type").notNull(),
  value: text("value").notNull(),
  unit: text("unit"),
  timestamp: timestamp("timestamp").defaultNow()
});

// Insert schemas
export const insertParkSchema = createInsertSchema(parks).omit({
  id: true,
  createdAt: true
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
  createdAt: true
});

export const insertFeedbackSchema = createInsertSchema(feedback).omit({
  id: true,
  createdAt: true
});

export const insertUsagePredictionSchema = createInsertSchema(usagePredictions).omit({
  id: true,
  createdAt: true
});

export const insertIotSensorDataSchema = createInsertSchema(iotSensorData).omit({
  id: true,
  timestamp: true
});

// Types
export type Park = typeof parks.$inferSelect;
export type Event = typeof events.$inferSelect;
export type Feedback = typeof feedback.$inferSelect;
export type UsagePrediction = typeof usagePredictions.$inferSelect;
export type IotSensorData = typeof iotSensorData.$inferSelect;

export type InsertPark = z.infer<typeof insertParkSchema>;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type InsertFeedback = z.infer<typeof insertFeedbackSchema>;
export type InsertUsagePrediction = z.infer<typeof insertUsagePredictionSchema>;
export type InsertIotSensorData = z.infer<typeof insertIotSensorDataSchema>;

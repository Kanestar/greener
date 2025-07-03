import { 
  parks, events, feedback, usagePredictions, iotSensorData,
  type Park, type Event, type Feedback, type UsagePrediction, type IotSensorData,
  type InsertPark, type InsertEvent, type InsertFeedback, type InsertUsagePrediction, type InsertIotSensorData
} from "@shared/schema";

export interface IStorage {
  // Parks
  getParks(): Promise<Park[]>;
  getPark(id: number): Promise<Park | undefined>;
  createPark(park: InsertPark): Promise<Park>;
  updatePark(id: number, park: Partial<InsertPark>): Promise<Park | undefined>;
  
  // Events
  getEvents(): Promise<Event[]>;
  getEventsByPark(parkId: number): Promise<Event[]>;
  getEvent(id: number): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  signUpForEvent(eventId: number): Promise<Event | undefined>;
  
  // Feedback
  getFeedback(): Promise<Feedback[]>;
  getFeedbackByPark(parkId: number): Promise<Feedback[]>;
  createFeedback(feedback: InsertFeedback): Promise<Feedback>;
  likeFeedback(feedbackId: number): Promise<Feedback | undefined>;
  
  // Usage Predictions
  getUsagePredictions(parkId: number): Promise<UsagePrediction[]>;
  createUsagePrediction(prediction: InsertUsagePrediction): Promise<UsagePrediction>;
  
  // IoT Sensor Data
  getIotSensorData(parkId: number): Promise<IotSensorData[]>;
  createIotSensorData(data: InsertIotSensorData): Promise<IotSensorData>;
}

export class MemStorage implements IStorage {
  private parks: Map<number, Park> = new Map();
  private events: Map<number, Event> = new Map();
  private feedback: Map<number, Feedback> = new Map();
  private usagePredictions: Map<number, UsagePrediction> = new Map();
  private iotSensorData: Map<number, IotSensorData> = new Map();
  
  private currentParkId = 1;
  private currentEventId = 1;
  private currentFeedbackId = 1;
  private currentUsagePredictionId = 1;
  private currentIotSensorDataId = 1;

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Initialize parks
    const initialParks = [
      {
        id: 1,
        name: "Central Park",
        location: "Downtown",
        description: "Large urban park with walking paths and recreational facilities",
        status: "active",
        currentUsage: "high",
        maintenanceStatus: "needs_attention",
        nextEvent: "Yoga Class - 2 PM",
        imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=200",
        createdAt: new Date()
      },
      {
        id: 2,
        name: "Green Valley Park",
        location: "Westside",
        description: "Peaceful park with mature trees and open grass areas",
        status: "active",
        currentUsage: "medium",
        maintenanceStatus: "good",
        nextEvent: "Music Festival - Sat",
        imageUrl: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=200",
        createdAt: new Date()
      },
      {
        id: 3,
        name: "Riverside Park",
        location: "Eastside",
        description: "Park with river views and recreational facilities",
        status: "active",
        currentUsage: "low",
        maintenanceStatus: "urgent",
        nextEvent: "Cleanup Day - Sun",
        imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=200",
        createdAt: new Date()
      }
    ];

    initialParks.forEach(park => {
      this.parks.set(park.id, park);
      this.currentParkId = Math.max(this.currentParkId, park.id + 1);
    });

    // Initialize events
    const initialEvents = [
      {
        id: 1,
        parkId: 1,
        name: "Morning Yoga",
        description: "Start your day with energizing yoga session",
        date: "Today",
        time: "8:00 AM - 9:00 AM",
        signups: 12,
        maxSignups: 25,
        category: "fitness",
        createdAt: new Date()
      },
      {
        id: 2,
        parkId: 2,
        name: "Music Festival",
        description: "Local musicians performing throughout the day",
        date: "Saturday",
        time: "2:00 PM - 8:00 PM",
        signups: 45,
        maxSignups: 100,
        category: "entertainment",
        createdAt: new Date()
      },
      {
        id: 3,
        parkId: 3,
        name: "Community Cleanup",
        description: "Help keep our parks clean and beautiful",
        date: "Sunday",
        time: "9:00 AM - 12:00 PM",
        signups: 28,
        maxSignups: 50,
        category: "community",
        createdAt: new Date()
      }
    ];

    initialEvents.forEach(event => {
      this.events.set(event.id, event);
      this.currentEventId = Math.max(this.currentEventId, event.id + 1);
    });

    // Initialize feedback
    const initialFeedback = [
      {
        id: 1,
        parkId: 1,
        username: "Sarah Johnson",
        message: "The new playground equipment is fantastic! My kids love the updated swings and slides. Would love to see more benches for parents to sit and supervise.",
        likes: 8,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
      },
      {
        id: 2,
        parkId: 3,
        username: "Mike Chen",
        message: "The maintenance crew did an excellent job cleaning up after the storm. The walking paths are clear and safe again. Thank you for the quick response!",
        likes: 15,
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000) // 5 hours ago
      }
    ];

    initialFeedback.forEach(fb => {
      this.feedback.set(fb.id, fb);
      this.currentFeedbackId = Math.max(this.currentFeedbackId, fb.id + 1);
    });
  }

  // Parks methods
  async getParks(): Promise<Park[]> {
    return Array.from(this.parks.values());
  }

  async getPark(id: number): Promise<Park | undefined> {
    return this.parks.get(id);
  }

  async createPark(park: InsertPark): Promise<Park> {
    const newPark: Park = {
      ...park,
      id: this.currentParkId++,
      createdAt: new Date()
    };
    this.parks.set(newPark.id, newPark);
    return newPark;
  }

  async updatePark(id: number, park: Partial<InsertPark>): Promise<Park | undefined> {
    const existingPark = this.parks.get(id);
    if (!existingPark) return undefined;
    
    const updatedPark = { ...existingPark, ...park };
    this.parks.set(id, updatedPark);
    return updatedPark;
  }

  // Events methods
  async getEvents(): Promise<Event[]> {
    return Array.from(this.events.values());
  }

  async getEventsByPark(parkId: number): Promise<Event[]> {
    return Array.from(this.events.values()).filter(event => event.parkId === parkId);
  }

  async getEvent(id: number): Promise<Event | undefined> {
    return this.events.get(id);
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const newEvent: Event = {
      ...event,
      id: this.currentEventId++,
      createdAt: new Date()
    };
    this.events.set(newEvent.id, newEvent);
    return newEvent;
  }

  async signUpForEvent(eventId: number): Promise<Event | undefined> {
    const event = this.events.get(eventId);
    if (!event) return undefined;
    
    const updatedEvent = { ...event, signups: event.signups + 1 };
    this.events.set(eventId, updatedEvent);
    return updatedEvent;
  }

  // Feedback methods
  async getFeedback(): Promise<Feedback[]> {
    return Array.from(this.feedback.values()).sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
  }

  async getFeedbackByPark(parkId: number): Promise<Feedback[]> {
    return Array.from(this.feedback.values()).filter(fb => fb.parkId === parkId);
  }

  async createFeedback(feedback: InsertFeedback): Promise<Feedback> {
    const newFeedback: Feedback = {
      ...feedback,
      id: this.currentFeedbackId++,
      createdAt: new Date()
    };
    this.feedback.set(newFeedback.id, newFeedback);
    return newFeedback;
  }

  async likeFeedback(feedbackId: number): Promise<Feedback | undefined> {
    const feedback = this.feedback.get(feedbackId);
    if (!feedback) return undefined;
    
    const updatedFeedback = { ...feedback, likes: feedback.likes + 1 };
    this.feedback.set(feedbackId, updatedFeedback);
    return updatedFeedback;
  }

  // Usage Predictions methods
  async getUsagePredictions(parkId: number): Promise<UsagePrediction[]> {
    return Array.from(this.usagePredictions.values()).filter(pred => pred.parkId === parkId);
  }

  async createUsagePrediction(prediction: InsertUsagePrediction): Promise<UsagePrediction> {
    const newPrediction: UsagePrediction = {
      ...prediction,
      id: this.currentUsagePredictionId++,
      createdAt: new Date()
    };
    this.usagePredictions.set(newPrediction.id, newPrediction);
    return newPrediction;
  }

  // IoT Sensor Data methods
  async getIotSensorData(parkId: number): Promise<IotSensorData[]> {
    return Array.from(this.iotSensorData.values()).filter(data => data.parkId === parkId);
  }

  async createIotSensorData(data: InsertIotSensorData): Promise<IotSensorData> {
    const newData: IotSensorData = {
      ...data,
      id: this.currentIotSensorDataId++,
      timestamp: new Date()
    };
    this.iotSensorData.set(newData.id, newData);
    return newData;
  }
}

export const storage = new MemStorage();

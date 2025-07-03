export interface PredictionInput {
  parkId: number;
  timeOfDay: number; // 0-23
  dayOfWeek: number; // 0-6 (0 = Sunday)
  weather?: string;
  temperature?: number;
}

export interface PredictionOutput {
  usageLevel: 'low' | 'medium' | 'high';
  confidence: number;
  factors: string[];
}

export class MLPredictor {
  /**
   * Simple rule-based prediction system
   * In a real implementation, this would use a trained ML model
   */
  static predictUsage(input: PredictionInput): PredictionOutput {
    const { timeOfDay, dayOfWeek, weather, temperature } = input;
    
    let baseUsage = 0;
    let confidence = 75;
    const factors: string[] = [];

    // Time-based factors
    if (timeOfDay >= 10 && timeOfDay <= 16) {
      baseUsage += 3; // Peak hours
      factors.push("Peak daytime hours");
    } else if (timeOfDay >= 17 && timeOfDay <= 20) {
      baseUsage += 2; // Evening hours
      factors.push("Evening recreation time");
    } else if (timeOfDay >= 6 && timeOfDay <= 9) {
      baseUsage += 1; // Morning hours
      factors.push("Morning activity");
    }

    // Day-based factors
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      baseUsage += 2; // Weekend
      factors.push("Weekend activity");
    } else if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      baseUsage += 1; // Weekday
      factors.push("Weekday usage");
    }

    // Weather-based factors
    if (weather === "sunny" || weather === "clear") {
      baseUsage += 2;
      factors.push("Good weather conditions");
    } else if (weather === "rain" || weather === "storm") {
      baseUsage -= 2;
      factors.push("Poor weather conditions");
    } else if (weather === "cloudy") {
      baseUsage += 0;
      factors.push("Neutral weather");
    }

    // Temperature-based factors
    if (temperature && temperature >= 70 && temperature <= 85) {
      baseUsage += 1;
      factors.push("Optimal temperature");
    } else if (temperature && (temperature < 50 || temperature > 90)) {
      baseUsage -= 1;
      factors.push("Extreme temperature");
    }

    // Determine usage level
    let usageLevel: 'low' | 'medium' | 'high';
    if (baseUsage >= 5) {
      usageLevel = 'high';
    } else if (baseUsage >= 2) {
      usageLevel = 'medium';
    } else {
      usageLevel = 'low';
    }

    // Adjust confidence based on number of factors
    confidence = Math.min(95, confidence + (factors.length * 5));

    return {
      usageLevel,
      confidence,
      factors
    };
  }

  /**
   * Generate predictions for different time slots
   */
  static generateDailyPredictions(parkId: number, date: Date = new Date()) {
    const dayOfWeek = date.getDay();
    const timeSlots = [
      { hour: 10, label: "10:00 AM - 12:00 PM" },
      { hour: 14, label: "2:00 PM - 4:00 PM" },
      { hour: 18, label: "6:00 PM - 8:00 PM" },
      { hour: 20, label: "8:00 PM - 10:00 PM" }
    ];

    return timeSlots.map(slot => {
      const prediction = this.predictUsage({
        parkId,
        timeOfDay: slot.hour,
        dayOfWeek,
        weather: "sunny", // Default weather
        temperature: 75
      });

      return {
        timeSlot: slot.label,
        ...prediction
      };
    });
  }
}

export interface SensorReading {
  parkId: number;
  sensorType: string;
  value: string;
  unit?: string;
  timestamp: Date;
}

export interface MaintenanceAlert {
  parkId: number;
  type: 'grass_cutting' | 'trash_collection' | 'equipment_check';
  severity: 'low' | 'medium' | 'high';
  message: string;
  timestamp: Date;
}

export class IoTSimulator {
  private static readonly SENSOR_TYPES = [
    'trash_level',
    'grass_height',
    'temperature',
    'humidity',
    'soil_moisture',
    'air_quality'
  ];

  /**
   * Simulate sensor readings for a park
   */
  static generateSensorData(parkId: number): SensorReading[] {
    const readings: SensorReading[] = [];
    const timestamp = new Date();

    // Trash level (0-100%)
    const trashLevel = Math.floor(Math.random() * 100);
    readings.push({
      parkId,
      sensorType: 'trash_level',
      value: trashLevel.toString(),
      unit: '%',
      timestamp
    });

    // Grass height (5-25cm)
    const grassHeight = Math.floor(Math.random() * 20) + 5;
    readings.push({
      parkId,
      sensorType: 'grass_height',
      value: grassHeight.toString(),
      unit: 'cm',
      timestamp
    });

    // Temperature (50-90°F)
    const temperature = Math.floor(Math.random() * 40) + 50;
    readings.push({
      parkId,
      sensorType: 'temperature',
      value: temperature.toString(),
      unit: '°F',
      timestamp
    });

    // Humidity (20-80%)
    const humidity = Math.floor(Math.random() * 60) + 20;
    readings.push({
      parkId,
      sensorType: 'humidity',
      value: humidity.toString(),
      unit: '%',
      timestamp
    });

    // Soil moisture (10-90%)
    const soilMoisture = Math.floor(Math.random() * 80) + 10;
    readings.push({
      parkId,
      sensorType: 'soil_moisture',
      value: soilMoisture.toString(),
      unit: '%',
      timestamp
    });

    // Air quality index (0-300)
    const airQuality = Math.floor(Math.random() * 300);
    readings.push({
      parkId,
      sensorType: 'air_quality',
      value: airQuality.toString(),
      unit: 'AQI',
      timestamp
    });

    return readings;
  }

  /**
   * Analyze sensor data and generate maintenance alerts
   */
  static analyzeMaintenanceNeeds(readings: SensorReading[]): MaintenanceAlert[] {
    const alerts: MaintenanceAlert[] = [];
    const parkId = readings[0]?.parkId;

    if (!parkId) return alerts;

    const timestamp = new Date();

    // Check trash level
    const trashReading = readings.find(r => r.sensorType === 'trash_level');
    if (trashReading) {
      const level = parseInt(trashReading.value);
      if (level >= 80) {
        alerts.push({
          parkId,
          type: 'trash_collection',
          severity: 'high',
          message: `Trash bins are ${level}% full - urgent collection needed`,
          timestamp
        });
      } else if (level >= 60) {
        alerts.push({
          parkId,
          type: 'trash_collection',
          severity: 'medium',
          message: `Trash bins are ${level}% full - collection due soon`,
          timestamp
        });
      }
    }

    // Check grass height
    const grassReading = readings.find(r => r.sensorType === 'grass_height');
    if (grassReading) {
      const height = parseInt(grassReading.value);
      if (height >= 20) {
        alerts.push({
          parkId,
          type: 'grass_cutting',
          severity: 'high',
          message: `Grass height is ${height}cm - cutting needed`,
          timestamp
        });
      } else if (height >= 15) {
        alerts.push({
          parkId,
          type: 'grass_cutting',
          severity: 'medium',
          message: `Grass height is ${height}cm - cutting due soon`,
          timestamp
        });
      }
    }

    // Check air quality
    const airReading = readings.find(r => r.sensorType === 'air_quality');
    if (airReading) {
      const aqi = parseInt(airReading.value);
      if (aqi >= 200) {
        alerts.push({
          parkId,
          type: 'equipment_check',
          severity: 'high',
          message: `Poor air quality (${aqi} AQI) - equipment check needed`,
          timestamp
        });
      }
    }

    return alerts;
  }

  /**
   * Simulate real-time sensor updates
   */
  static async simulateRealTimeData(parkId: number, callback: (data: SensorReading[]) => void) {
    const interval = setInterval(() => {
      const readings = this.generateSensorData(parkId);
      callback(readings);
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }

  /**
   * Determine maintenance status based on sensor data
   */
  static getMaintenanceStatus(readings: SensorReading[]): 'good' | 'needs_attention' | 'urgent' {
    const alerts = this.analyzeMaintenanceNeeds(readings);
    
    if (alerts.some(alert => alert.severity === 'high')) {
      return 'urgent';
    } else if (alerts.some(alert => alert.severity === 'medium')) {
      return 'needs_attention';
    } else {
      return 'good';
    }
  }
}

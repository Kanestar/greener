import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import type { Park, UsagePrediction, IotSensorData } from "@shared/schema";

export default function ParkDetails() {
  const { id } = useParams<{ id: string }>();
  const parkId = parseInt(id || "0");

  const { data: park, isLoading: parkLoading } = useQuery<Park>({
    queryKey: [`/api/parks/${parkId}`],
  });

  const { data: predictions, isLoading: predictionsLoading } = useQuery<UsagePrediction[]>({
    queryKey: [`/api/ml/predict-usage/${parkId}`],
  });

  const { data: sensorData, isLoading: sensorLoading } = useQuery<IotSensorData[]>({
    queryKey: [`/api/iot/sensor-data/${parkId}`],
  });

  if (parkLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">Loading park details...</div>
        </div>
      </div>
    );
  }

  if (!park) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">Park not found</div>
        </div>
      </div>
    );
  }

  const getMaintenanceColor = (status: string) => {
    switch (status) {
      case "good":
        return "bg-green-100 text-green-800";
      case "needs_attention":
        return "bg-yellow-100 text-yellow-800";
      case "urgent":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getUsageColor = (usage: string) => {
    switch (usage) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{park.name}</h1>
          <p className="text-gray-600">{park.location}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Park Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Park Overview</CardTitle>
            </CardHeader>
            <CardContent>
              {park.imageUrl && (
                <img 
                  src={park.imageUrl} 
                  alt={park.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <Badge className="bg-green-100 text-green-800">
                    {park.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Current Usage</span>
                  <Badge className={getUsageColor(park.currentUsage)}>
                    {park.currentUsage}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Maintenance Status</span>
                  <Badge className={getMaintenanceColor(park.maintenanceStatus)}>
                    {park.maintenanceStatus.replace("_", " ")}
                  </Badge>
                </div>
                {park.nextEvent && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Next Event</span>
                    <span className="text-sm text-gray-900">{park.nextEvent}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Usage Predictions */}
          <Card>
            <CardHeader>
              <CardTitle>Usage Predictions</CardTitle>
            </CardHeader>
            <CardContent>
              {predictionsLoading ? (
                <div className="text-center py-4">Loading predictions...</div>
              ) : (
                <div className="space-y-3">
                  {predictions?.map((prediction) => (
                    <div key={prediction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{prediction.timeSlot}</p>
                        <p className="text-sm text-gray-600">Confidence: {prediction.confidence}%</p>
                      </div>
                      <Badge className={getUsageColor(prediction.predictedUsage)}>
                        {prediction.predictedUsage}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Maintenance Status */}
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <i className="fas fa-cut text-gray-600 mr-3"></i>
                    <span className="text-gray-900">Grass Cutting</span>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">Due Soon</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <i className="fas fa-trash text-gray-600 mr-3"></i>
                    <span className="text-gray-900">Trash Collection</span>
                  </div>
                  <Badge className="bg-red-100 text-red-800">Urgent</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <i className="fas fa-tools text-gray-600 mr-3"></i>
                    <span className="text-gray-900">Equipment Check</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Complete</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* IoT Sensor Data */}
          <Card>
            <CardHeader>
              <CardTitle>IoT Sensor Data</CardTitle>
            </CardHeader>
            <CardContent>
              {sensorLoading ? (
                <div className="text-center py-4">Loading sensor data...</div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {sensorData?.map((sensor) => (
                    <div key={sensor.id} className="bg-gray-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-primary">
                        {sensor.value}{sensor.unit}
                      </div>
                      <div className="text-sm text-gray-600 capitalize">
                        {sensor.sensorType.replace("_", " ")}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

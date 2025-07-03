import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import type { Park } from "@shared/schema";

interface ParkCardProps {
  park: Park;
}

export function ParkCard({ park }: ParkCardProps) {
  const getUsageColor = (usage: string) => {
    switch (usage) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const getUsagePercentage = (usage: string) => {
    switch (usage) {
      case "high":
        return 75;
      case "medium":
        return 45;
      case "low":
        return 25;
      default:
        return 0;
    }
  };

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

  const getMaintenanceIcon = (status: string) => {
    switch (status) {
      case "good":
        return "fas fa-check-circle";
      case "needs_attention":
        return "fas fa-wrench";
      case "urgent":
        return "fas fa-exclamation-triangle";
      default:
        return "fas fa-question-circle";
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      {park.imageUrl && (
        <img 
          src={park.imageUrl} 
          alt={park.name}
          className="w-full h-48 object-cover"
        />
      )}
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{park.name}</h3>
          <Badge className="bg-green-100 text-green-800">
            <span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
            {park.status}
          </Badge>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Current Usage</span>
            <div className="flex items-center">
              <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                <div 
                  className={`h-2 rounded-full ${getUsageColor(park.currentUsage)}`}
                  style={{ width: `${getUsagePercentage(park.currentUsage)}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-900 capitalize">{park.currentUsage}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Maintenance Status</span>
            <Badge className={getMaintenanceColor(park.maintenanceStatus)}>
              <i className={`${getMaintenanceIcon(park.maintenanceStatus)} mr-1`}></i>
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

        <div className="mt-6 flex space-x-3">
          <Link href={`/park/${park.id}`}>
            <Button className="flex-1 bg-primary hover:bg-primary/90">
              View Details
            </Button>
          </Link>
          <Button variant="outline" className="flex-1">
            Analytics
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

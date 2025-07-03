import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, ArrowRight } from "lucide-react";

export function AiPredictions() {
  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <Brain className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle>AI Usage Predictions</CardTitle>
              <p className="text-sm text-gray-600">Real-time predictions for optimal park management</p>
            </div>
          </div>
          <Button variant="ghost" className="text-blue-600 hover:text-blue-700">
            View All Predictions
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">Today's Peak Hours</h4>
              <span className="text-xs text-gray-500">Updated 5 min ago</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">10:00 AM - 12:00 PM</span>
                <span className="text-sm font-medium text-red-600">High</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">2:00 PM - 4:00 PM</span>
                <span className="text-sm font-medium text-red-600">High</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">6:00 PM - 8:00 PM</span>
                <span className="text-sm font-medium text-yellow-600">Medium</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">Weather Impact</h4>
              <span className="text-xs text-gray-500">ML Prediction</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Sunny (78°F)</span>
                <span className="text-sm font-medium text-green-600">+35% usage</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Tomorrow Rain</span>
                <span className="text-sm font-medium text-blue-600">-50% usage</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Weekend</span>
                <span className="text-sm font-medium text-green-600">+45% usage</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">Maintenance Schedule</h4>
              <span className="text-xs text-gray-500">IoT Sensors</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Grass Cutting</span>
                <span className="text-sm font-medium text-yellow-600">Due in 3 days</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Trash Collection</span>
                <span className="text-sm font-medium text-red-600">Urgent</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Bench Repair</span>
                <span className="text-sm font-medium text-green-600">Complete</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

import { Card, CardContent } from "@/components/ui/card";
import { TreePine, Calendar, Users, AlertTriangle } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number;
  icon: "tree" | "calendar" | "users" | "alert-triangle";
  change: string;
  changeLabel: string;
  color: "primary" | "blue" | "secondary" | "amber";
}

export function StatsCard({ title, value, icon, change, changeLabel, color }: StatsCardProps) {
  const getIcon = () => {
    switch (icon) {
      case "tree":
        return <TreePine className="h-6 w-6" />;
      case "calendar":
        return <Calendar className="h-6 w-6" />;
      case "users":
        return <Users className="h-6 w-6" />;
      case "alert-triangle":
        return <AlertTriangle className="h-6 w-6" />;
    }
  };

  const getColorClasses = () => {
    switch (color) {
      case "primary":
        return "bg-primary/10 text-primary";
      case "blue":
        return "bg-blue-100 text-blue-600";
      case "secondary":
        return "bg-secondary/10 text-secondary";
      case "amber":
        return "bg-amber-100 text-amber-600";
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</p>
          </div>
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses()}`}>
            {getIcon()}
          </div>
        </div>
        <div className="mt-4 flex items-center">
          <span className="text-green-600 text-sm font-medium">{change}</span>
          <span className="text-gray-500 text-sm ml-2">{changeLabel}</span>
        </div>
      </CardContent>
    </Card>
  );
}

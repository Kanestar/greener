import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Clock, Users, Calendar } from "lucide-react";
import type { Event } from "@shared/schema";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const signUpMutation = useMutation({
    mutationFn: async (eventId: number) => {
      const response = await apiRequest("POST", `/api/events/${eventId}/signup`, {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      toast({ title: "Success", description: "Successfully signed up for event!" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to sign up for event", variant: "destructive" });
    },
  });

  const getEventIcon = (category: string) => {
    switch (category) {
      case "fitness":
        return "fas fa-dumbbell";
      case "entertainment":
        return "fas fa-music";
      case "community":
        return "fas fa-leaf";
      default:
        return "fas fa-calendar";
    }
  };

  const getEventColor = (category: string) => {
    switch (category) {
      case "fitness":
        return "bg-primary/10 text-primary";
      case "entertainment":
        return "bg-blue-100 text-blue-600";
      case "community":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const handleSignUp = () => {
    if (event.maxSignups && event.signups >= event.maxSignups) {
      toast({ title: "Event Full", description: "This event is already at capacity", variant: "destructive" });
      return;
    }
    signUpMutation.mutate(event.id);
  };

  return (
    <Card className="border border-gray-200 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${getEventColor(event.category)}`}>
              <i className={getEventIcon(event.category)}></i>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">{event.name}</h4>
              <p className="text-sm text-gray-600">{event.description}</p>
            </div>
          </div>
          <span className="text-xs text-gray-500">{event.date}</span>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-2" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Users className="h-4 w-4 mr-2" />
            <span>{event.signups} people signed up</span>
            {event.maxSignups && (
              <span className="text-gray-400 ml-1">/ {event.maxSignups}</span>
            )}
          </div>
        </div>
        
        <Button 
          onClick={handleSignUp}
          disabled={signUpMutation.isPending || (event.maxSignups ? event.signups >= event.maxSignups : false)}
          className="w-full bg-primary hover:bg-primary/90"
        >
          {signUpMutation.isPending ? "Signing Up..." : "Sign Up"}
        </Button>
      </CardContent>
    </Card>
  );
}

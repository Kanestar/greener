import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { StatsCard } from "@/components/stats-card";
import { ParkCard } from "@/components/park-card";
import { EventCard } from "@/components/event-card";
import { FeedbackCard } from "@/components/feedback-card";
import { AiPredictions } from "@/components/ai-predictions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Plus, Download } from "lucide-react";
import type { Park, Event, Feedback } from "@shared/schema";

export default function Dashboard() {
  const [feedbackParkId, setFeedbackParkId] = useState<string>("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackUsername, setFeedbackUsername] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: parks, isLoading: parksLoading } = useQuery<Park[]>({
    queryKey: ["/api/parks"],
  });

  const { data: events, isLoading: eventsLoading } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  const { data: feedback, isLoading: feedbackLoading } = useQuery<Feedback[]>({
    queryKey: ["/api/feedback"],
  });

  const submitFeedbackMutation = useMutation({
    mutationFn: async (data: { parkId: number; username: string; message: string }) => {
      const response = await apiRequest("POST", "/api/feedback", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/feedback"] });
      setFeedbackMessage("");
      setFeedbackUsername("");
      setFeedbackParkId("");
      toast({ title: "Success", description: "Feedback submitted successfully!" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to submit feedback", variant: "destructive" });
    },
  });

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackParkId || !feedbackMessage.trim() || !feedbackUsername.trim()) {
      toast({ title: "Error", description: "Please fill in all fields", variant: "destructive" });
      return;
    }
    
    submitFeedbackMutation.mutate({
      parkId: parseInt(feedbackParkId),
      username: feedbackUsername,
      message: feedbackMessage,
    });
  };

  const stats = {
    totalParks: parks?.length || 0,
    activeEvents: events?.length || 0,
    avgVisitors: 1247,
    maintenanceAlerts: parks?.filter(p => p.maintenanceStatus === "urgent").length || 0,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Overview */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Park Management Dashboard</h2>
              <p className="text-gray-600">AI-powered insights for optimal park operations</p>
            </div>
            <div className="flex space-x-3">
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" />
                Add Park
              </Button>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Total Parks"
              value={stats.totalParks}
              icon="tree"
              change="+8%"
              changeLabel="from last month"
              color="primary"
            />
            <StatsCard
              title="Active Events"
              value={stats.activeEvents}
              icon="calendar"
              change="+12%"
              changeLabel="from last week"
              color="blue"
            />
            <StatsCard
              title="Avg. Daily Visitors"
              value={stats.avgVisitors}
              icon="users"
              change="+15%"
              changeLabel="from yesterday"
              color="secondary"
            />
            <StatsCard
              title="Maintenance Alerts"
              value={stats.maintenanceAlerts}
              icon="alert-triangle"
              change="+2"
              changeLabel="new today"
              color="amber"
            />
          </div>
        </div>

        {/* Parks Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {parksLoading ? (
            <div className="col-span-full text-center py-8">Loading parks...</div>
          ) : (
            parks?.map((park) => (
              <ParkCard key={park.id} park={park} />
            ))
          )}
        </div>

        {/* AI Predictions Section */}
        <AiPredictions />

        {/* Community Events Section */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center mr-3">
                  <i className="fas fa-calendar-alt text-secondary"></i>
                </div>
                <div>
                  <CardTitle>Community Events</CardTitle>
                  <p className="text-sm text-gray-600">Upcoming events and activities</p>
                </div>
              </div>
              <Button className="bg-secondary hover:bg-secondary/90">
                <Plus className="mr-2 h-4 w-4" />
                Create Event
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {eventsLoading ? (
                <div className="col-span-full text-center py-4">Loading events...</div>
              ) : (
                events?.slice(0, 3).map((event) => (
                  <EventCard key={event.id} event={event} />
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Feedback Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center mr-3">
                  <i className="fas fa-comments text-amber-600"></i>
                </div>
                <div>
                  <CardTitle>Recent Feedback</CardTitle>
                  <p className="text-sm text-gray-600">Community insights and suggestions</p>
                </div>
              </div>
              <Button variant="ghost" className="text-amber-600 hover:text-amber-700">
                View All Feedback
                <i className="fas fa-arrow-right ml-2"></i>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mb-6">
              {feedbackLoading ? (
                <div className="text-center py-4">Loading feedback...</div>
              ) : (
                feedback?.slice(0, 2).map((item) => (
                  <FeedbackCard key={item.id} feedback={item} />
                ))
              )}
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">Submit New Feedback</h4>
              <form onSubmit={handleSubmitFeedback} className="space-y-3">
                <Input
                  placeholder="Your name"
                  value={feedbackUsername}
                  onChange={(e) => setFeedbackUsername(e.target.value)}
                  required
                />
                <Select value={feedbackParkId} onValueChange={setFeedbackParkId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Park" />
                  </SelectTrigger>
                  <SelectContent>
                    {parks?.map((park) => (
                      <SelectItem key={park.id} value={park.id.toString()}>
                        {park.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Textarea
                  placeholder="Share your thoughts, suggestions, or report issues..."
                  value={feedbackMessage}
                  onChange={(e) => setFeedbackMessage(e.target.value)}
                  rows={3}
                  required
                />
                <Button 
                  type="submit" 
                  className="bg-primary hover:bg-primary/90"
                  disabled={submitFeedbackMutation.isPending}
                >
                  <i className="fas fa-paper-plane mr-2"></i>
                  {submitFeedbackMutation.isPending ? "Submitting..." : "Submit Feedback"}
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

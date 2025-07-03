import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ThumbsUp, Reply, Flag, User } from "lucide-react";
import type { Feedback } from "@shared/schema";

interface FeedbackCardProps {
  feedback: Feedback;
}

export function FeedbackCard({ feedback }: FeedbackCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const likeMutation = useMutation({
    mutationFn: async (feedbackId: number) => {
      const response = await apiRequest("POST", `/api/feedback/${feedbackId}/like`, {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/feedback"] });
      toast({ title: "Success", description: "Feedback liked!" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to like feedback", variant: "destructive" });
    },
  });

  const formatTimestamp = (timestamp: string | Date) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      return `${Math.floor(diffInHours / 24)} days ago`;
    }
  };

  return (
    <Card className="border border-gray-200">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
              <User className="h-4 w-4 text-gray-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">{feedback.username}</h4>
              <p className="text-sm text-gray-600">Park Feedback</p>
            </div>
          </div>
          <span className="text-xs text-gray-500">
            {formatTimestamp(feedback.createdAt || new Date())}
          </span>
        </div>
        
        <p className="text-gray-700 mb-3">{feedback.message}</p>
        
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => likeMutation.mutate(feedback.id)}
            disabled={likeMutation.isPending}
            className="flex items-center text-sm text-gray-600 hover:text-primary"
          >
            <ThumbsUp className="h-4 w-4 mr-1" />
            {feedback.likes}
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            className="flex items-center text-sm text-gray-600 hover:text-primary"
          >
            <Reply className="h-4 w-4 mr-1" />
            Reply
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            className="flex items-center text-sm text-gray-600 hover:text-primary"
          >
            <Flag className="h-4 w-4 mr-1" />
            Report
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

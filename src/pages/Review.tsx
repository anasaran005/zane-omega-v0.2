
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Calendar as CalendarIcon, MessageSquare, CheckCircle, Clock, AlertCircle, Eye, RotateCcw } from "lucide-react";

const Review = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [showBookingDialog, setShowBookingDialog] = useState(false);

  const upcomingSessions = [
    {
      id: 1,
      title: "Site Feasibility Review",
      mentor: "Dr. Anika",
      date: "July 5",
      time: "5:00 PM",
      status: "upcoming"
    },
    {
      id: 2,
      title: "Trial Setup Review",
      mentor: "Mr. Raghav",
      date: "July 9",
      time: "7:00 PM",
      status: "upcoming"
    }
  ];

  const pastSessions = [
    {
      id: 3,
      title: "Clinical Research Basics Review",
      mentor: "Dr. Sarah",
      date: "June 28",
      time: "6:00 PM",
      status: "completed",
      feedback: "Good understanding of feasibility concepts. Work on site selection criteria precision."
    }
  ];

  const reviewedTasks = [
    {
      id: 1,
      caseId: "SITE001",
      taskType: "Site Selection Pitch",
      status: "reviewed",
      score: 88,
      feedback: "Well-structured pitch highlighting key site strengths. Consider including more specific enrollment projections in future submissions.",
      mentorName: "Dr. Anika",
      submittedDate: "July 3",
      reviewedDate: "July 4"
    },
    {
      id: 2,
      caseId: "TRIAL002",
      taskType: "Feasibility Assessment",
      status: "reviewed",
      score: 92,
      feedback: "Excellent evaluation of site capabilities. Thorough analysis of patient population and investigator qualifications.",
      mentorName: "Mr. Raghav",
      submittedDate: "July 1",
      reviewedDate: "July 2"
    }
  ];

  const pendingTasks = [
    {
      id: 3,
      caseId: "SITE003",
      taskType: "Trial Setup Checklist",
      status: "pending",
      feedback: "Missing regulatory compliance items. Please review ICH-GCP guidelines and resubmit with complete checklist.",
      mentorName: "Dr. Sarah",
      submittedDate: "July 2"
    },
    {
      id: 4,
      caseId: "SITE001",
      taskType: "Feasibility Form",
      status: "pending",
      feedback: null,
      mentorName: "Dr. Anika",
      submittedDate: "July 4"
    }
  ];

  const handleJoinSession = (sessionId: number) => {
    toast({
      title: "🚀 Joining Session",
      description: "Connection request sent to mentor. They will contact you shortly.",
    });
  };

  const handleBookSession = () => {
    setShowBookingDialog(true);
  };

  const handleConfirmBooking = () => {
    toast({
      title: "✅ Session Booked",
      description: "Your clinical research mentorship session has been scheduled successfully!",
    });
    setShowBookingDialog(false);
  };

  const handleViewSubmission = (task: any) => {
    toast({
      title: "Opening Submission",
      description: `Viewing your original ${task.taskType.toLowerCase()} for ${task.caseId}`,
    });
  };

  const handleResubmitTask = (task: any) => {
    toast({
      title: "Redirecting to Simulation",
      description: `Opening ${task.taskType.toLowerCase()} module for revision`,
    });
    navigate("/shift");
  };

  const timeSlots = [
    "9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM"
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={() => navigate("/dashboard")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Clinical Research Mentor Review</h1>
                <p className="text-muted-foreground">Review sessions and task feedback for clinical research training</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                <MessageSquare className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">Mentor Online</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Session Calendar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingSessions.map((session) => (
                    <div key={session.id} className="p-4 border rounded-lg space-y-3">
                      <div>
                        <h3 className="font-semibold">{session.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {session.date} at {session.time} with {session.mentor}
                        </p>
                      </div>
                      <Button 
                        onClick={() => handleJoinSession(session.id)}
                        className="w-full"
                        size="sm"
                      >
                        Join Session
                      </Button>
                    </div>
                  ))}
                  
                  <Button 
                    variant="outline" 
                    onClick={handleBookSession}
                    className="w-full"
                  >
                    + Book New Session
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Past Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pastSessions.map((session) => (
                    <div key={session.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{session.title}</h4>
                        <Badge variant="outline">Completed</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {session.date} with {session.mentor}
                      </p>
                      {session.feedback && (
                        <p className="text-sm bg-muted p-2 rounded">
                          "{session.feedback}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  Reviewed Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reviewedTasks.map((task) => (
                    <Card key={task.id} className="border-l-4 border-l-success">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{task.caseId}</h3>
                          <Badge variant="default">Score: {task.score}%</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {task.taskType} • Reviewed by {task.mentorName}
                        </p>
                        <div className="bg-muted p-3 rounded text-sm mb-3">
                          <p className="font-medium mb-1">Mentor Feedback:</p>
                          <p>"{task.feedback}"</p>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Submitted: {task.submittedDate}</span>
                          <span>Reviewed: {task.reviewedDate}</span>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full mt-2"
                          onClick={() => handleViewSubmission(task)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Submission
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-warning" />
                  Pending Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingTasks.map((task) => (
                    <Card key={task.id} className={`border-l-4 ${
                      task.feedback ? "border-l-destructive" : "border-l-warning"
                    }`}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{task.caseId}</h3>
                          <Badge variant={task.feedback ? "destructive" : "secondary"}>
                            {task.feedback ? "Needs Revision" : "Under Review"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {task.taskType} • Submitted to {task.mentorName}
                        </p>
                        
                        {task.feedback && (
                          <div className="bg-destructive/10 border border-destructive/20 p-3 rounded text-sm mb-3">
                            <div className="flex items-center gap-2 mb-1">
                              <AlertCircle className="h-4 w-4 text-destructive" />
                              <p className="font-medium">Revision Required:</p>
                            </div>
                            <p>"{task.feedback}"</p>
                          </div>
                        )}
                        
                        <div className="text-xs text-muted-foreground mb-3">
                          Submitted: {task.submittedDate}
                        </div>

                        {task.feedback ? (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => handleResubmitTask(task)}
                          >
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Resubmit Task
                          </Button>
                        ) : (
                          <div className="text-center py-2">
                            <Clock className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
                            <p className="text-xs text-muted-foreground">Awaiting review...</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Book New Session</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Select Date</label>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Available Time Slots</label>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((time) => (
                  <Button key={time} variant="outline" size="sm">
                    {time}
                  </Button>
                ))}
              </div>
            </div>
            <Button onClick={handleConfirmBooking} className="w-full">
              Confirm Booking
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Review;

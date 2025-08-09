import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, BookOpen, FileText, Wrench, Mail, Settings, Users, Calendar, CheckCircle, Clock, AlertCircle, Download, User, Bot, Database, FileSpreadsheet, Shield, Clipboard, UserCheck, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [xp, setXp] = useState(850);
  const [level, setLevel] = useState(1);
  const [activeTab, setActiveTab] = useState("overview");

  const sidebarItems = [
    { title: "Overview", url: "overview", icon: LayoutDashboard, active: activeTab === "overview" },
    { title: "Assignments", url: "assignments", icon: BookOpen, active: activeTab === "assignments" },
    { title: "Reports", url: "reports", icon: FileText, active: activeTab === "reports" },
    { title: "Tools Access", url: "tools", icon: Wrench, active: activeTab === "tools" },
    { title: "Inbox", url: "inbox", icon: Mail, active: activeTab === "inbox" },
    { title: "Settings", url: "settings", icon: Settings, active: activeTab === "settings" },
  ];

  const programs = [
    { name: "Clinical Research", progress: 65, quiz: 80, status: "In progress" },
    { name: "Clinical Data Management", progress: 0, quiz: 0, status: "join" },
    { name: "Regulatory Affairs", progress: 0, quiz: 0, status: "join" },
    { name: "Quality Assurance", progress: 0, quiz: 0, status: "start" },
  ];

  const leaderboard = [
    { name: "Sarah Chen", xp: 2850, time: "45h", completion: 78 },
    { name: "David Kumar", xp: 2650, time: "42h", completion: 72 },
    { name: "Emily Rodriguez", xp: 2400, time: "38h", completion: 68 },
    { name: "You", xp: xp, time: "28h", completion: 45 },
    { name: "Alex Thompson", xp: 1950, time: "35h", completion: 42 },
  ];

  const todos = [
    { id: 1, task: "Complete Clinical Research Module 3", status: "completed", type: "module" },
    { id: 2, task: "Submit Site Feasibility Report", status: "overdue", type: "task" },
    { id: 3, task: "SOP Review - Site Setup Process", status: "in-progress", type: "sop" },
    { id: 4, task: "Mentor Prep - Weekly Review", status: "pending", type: "mentor" },
  ];

  const upcomingSessions = [
    { title: "Site Feasibility Review", time: "Today 3:00 PM", mentor: "Dr. Anika" },
    { title: "Clinical Trial Setup Workshop", time: "Tomorrow 10:00 AM", mentor: "Mr. Raghav" },
  ];

  const assignments = [
    { id: 1, title: "Clinical Trial Feasibility", type: "module", status: "in-progress", dueDate: "July 10", completion: 65 },
    { id: 2, title: "Site Selection Quiz", type: "quiz", status: "completed", dueDate: "July 5", completion: 100 },
    { id: 3, title: "Trial Setup Checklist", type: "task", status: "pending", dueDate: "July 12", completion: 0 },
  ];

  const reports = [
    { module: "Clinical Research Fundamentals", quizScore: 85, taskStatus: "Completed", progress: 100 },
    { module: "Site Feasibility Assessment", quizScore: 92, taskStatus: "In Progress", progress: 65 },
    { module: "Trial Setup & Management", quizScore: 0, taskStatus: "Not Started", progress: 0 },
  ];

  const inboxMessages = [
    { id: 1, from: "Dr. Anika", subject: "Your site feasibility report was received", time: "2 hours ago", read: false },
    { id: 2, from: "System", subject: "Reminder: Clinical Research Module 4 due tomorrow", time: "1 day ago", read: true },
    { id: 3, from: "Mr. Raghav", subject: "Great work on the quiz! See feedback attached.", time: "2 days ago", read: true },
  ];

  const maxXp = 3200;

  const croTools = [
    { name: "CTMS", description: "Clinical Trial Management System", icon: Database, category: "Management" },
    { name: "eTMF", description: "Electronic Trial Master File", icon: FileText, category: "Documentation" },
    { name: "EDC", description: "Electronic Data Capture", icon: FileSpreadsheet, category: "Data" },
    { name: "IWRS/IVRS", description: "Interactive Web/Voice Response System", icon: Bot, category: "Randomization" },
    { name: "Site Feasibility Portal", description: "Site Assessment & Selection", icon: UserCheck, category: "Site Management" },
    { name: "Subject Registry", description: "Patient Recruitment & Tracking", icon: Users, category: "Recruitment" },
    { name: "eConsent", description: "Electronic Informed Consent", icon: Clipboard, category: "Consent" },
    { name: "Safety Reporting", description: "Adverse Event Management", icon: Shield, category: "Safety" },
  ];

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleTaskClick = (task: any) => {
    switch (task.type) {
      case "module":
        navigate("/learning/clinical-research");
        break;
      case "task":
        toast({
          title: "Task Opened",
          description: "Opening task submission form...",
        });
        break;
      case "sop":
        navigate("/shift");
        break;
      case "mentor":
        navigate("/review");
        break;
    }
  };

  const handleProgramClick = (program: any) => {
    // Quality Assurance — special route
    if (program.name === "Quality Assurance") {
      if (program.status === "start" || program.status === "In Progress") {
        navigate(`/course/Quality-Assurance-Quality-Control`); // now goes to course description
      } else {
        toast({
          title: "Program Locked",
          description: "Complete the previous program to unlock this one.",
          variant: "destructive",
        });
      }
      return;
    }
  
    // Clinical Research
    if (program.name === "Clinical Research") {
      if (program.status === "In Progress") {
        navigate(`/course/clinical-research`);
      } else {
        toast({
          title: "Program Locked",
          description: "Complete the previous program to unlock this one.",
          variant: "destructive",
        });
      }
      return;
    }
  
    // Fallback for other programs
    if (program.status === "In Progress") {
      navigate(`/course/${program.id}`); // Use program.id from sheet
    } else {
      toast({
        title: "Program Locked",
        description: "Complete the previous program to unlock this one.",
        variant: "destructive",
      });
    }
  };
  
  
  

  const handleJoinSession = () => {
    toast({
      title: "🚀 Joining Session",
      description: "Connection request sent to mentor...",
    });
  };

  const handleBookSession = () => {
    toast({
      title: "📅 Booking Session",
      description: "Opening calendar to book new session...",
    });
  };

  const handleSendMessage = (studentName: string) => {
    toast({
      title: "Message Sent",
      description: `Message sent to ${studentName}. They'll reply soon!`,
    });
  };

  const handleDownloadTemplate = (templateName: string) => {
    toast({
      title: "Download Started",
      description: `Downloading ${templateName}...`,
    });
  };

  const handleToolLaunch = (toolName: string) => {
    toast({
      title: `${toolName} Launched`,
      description: `Opening ${toolName} demo environment...`,
    });
  };

  const renderMainContent = () => {
    switch (activeTab) {
      case "assignments":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Assignments</h2>
            <div className="grid gap-4">
              {assignments.map((assignment) => (
                <Card key={assignment.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{assignment.title}</h3>
                      <Badge variant={assignment.status === "completed" ? "default" : assignment.status === "overdue" ? "destructive" : "secondary"}>
                        {assignment.status}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Due: {assignment.dueDate}</span>
                        <span>{assignment.completion}% Complete</span>
                      </div>
                      <Progress value={assignment.completion} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case "reports":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Progress Reports</h2>
            <div className="grid gap-4">
              {reports.map((report, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-4">{report.module}</h3>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-sm text-muted-foreground">Quiz Score</p>
                        <p className="text-xl font-bold">{report.quizScore}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Task Status</p>
                        <p className="text-lg font-semibold">{report.taskStatus}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Progress</p>
                        <p className="text-xl font-bold">{report.progress}%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case "tools":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Clinical Research Digital Lab</h2>
            
            {/* AI Assistants Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  AI Research Assistants
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border-2 border-primary/20 hover:border-primary/40 transition-colors cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Bot className="h-8 w-8 text-primary" />
                        <div>
                          <h3 className="font-semibold">GPT Pro Assistant</h3>
                          <p className="text-sm text-muted-foreground">Protocol design & documentation</p>
                        </div>
                      </div>
                      <Button 
                        onClick={() => toast({ title: "GPT Pro", description: "Opening AI assistant for trial design support..." })}
                        className="w-full"
                      >
                        Launch Assistant
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-2 border-primary/20 hover:border-primary/40 transition-colors cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Database className="h-8 w-8 text-primary" />
                        <div>
                          <h3 className="font-semibold">Copilot 360+</h3>
                          <p className="text-sm text-muted-foreground">Integrated project dashboard</p>
                        </div>
                      </div>
                      <Button 
                        onClick={() => toast({ title: "Copilot 360+", description: "Opening advanced project management interface..." })}
                        className="w-full"
                      >
                        Open Dashboard
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            {/* CRO Tools Database */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5" />
                  CRO Tools Database
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {croTools.map((tool) => (
                    <Card 
                      key={tool.name} 
                      className="hover:shadow-lg transition-shadow cursor-pointer group"
                      onClick={() => handleToolLaunch(tool.name)}
                    >
                      <CardContent className="p-4 text-center">
                        <tool.icon className="h-8 w-8 mx-auto mb-2 text-primary group-hover:scale-110 transition-transform" />
                        <h3 className="font-semibold text-sm mb-1">{tool.name}</h3>
                        <p className="text-xs text-muted-foreground mb-2">{tool.description}</p>
                        <Badge variant="outline" className="text-xs">
                          {tool.category}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Templates Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Downloadable Templates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" onClick={() => handleDownloadTemplate("Site Feasibility Form")}>
                  <Download className="h-4 w-4 mr-2" />
                  Site Feasibility Assessment Form
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => handleDownloadTemplate("Trial Setup Checklist")}>
                  <Download className="h-4 w-4 mr-2" />
                  Phase 2 Trial Setup Checklist
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => handleDownloadTemplate("Site Selection Criteria")}>
                  <Download className="h-4 w-4 mr-2" />
                  Site Selection Criteria Template
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => handleDownloadTemplate("Protocol Synopsis")}>
                  <Download className="h-4 w-4 mr-2" />
                  Protocol Synopsis Template
                </Button>
              </CardContent>
            </Card>
          </div>
        );

      case "inbox":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Inbox</h2>
            <div className="space-y-2">
              {inboxMessages.map((message) => (
                <Card key={message.id} className={`cursor-pointer ${!message.read ? "border-primary" : ""}`}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{message.from}</h3>
                        {!message.read && <div className="w-2 h-2 bg-primary rounded-full"></div>}
                      </div>
                      <span className="text-sm text-muted-foreground">{message.time}</span>
                    </div>
                    <p className="text-sm">{message.subject}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case "settings":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Settings</h2>
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Name</label>
                      <Input defaultValue="John Doe" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <Input defaultValue="john.doe@example.com" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Preferred Clinical Domain</label>
                    <select className="w-full p-2 border rounded">
                      <option>Oncology</option>
                      <option>Cardiology</option>
                      <option>Neurology</option>
                      <option>Infectious Diseases</option>
                    </select>
                  </div>
                  <Button>Update Profile</Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Account Security</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline">Change Password</Button>
                  <Button variant="outline">Enable Two-Factor Authentication</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>XP Progress</span>
                  <Badge variant="secondary">Level {level}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>XP: {xp}/{maxXp}</span>
                    <span>Complete 3 more tasks to reach Level 2</span>
                  </div>
                  <Progress value={(xp / maxXp) * 100} className="h-3" />
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Training Programs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {programs.map((program) => (
                        <Card 
                          key={program.name} 
                          className={`cursor-pointer transition-all hover:shadow-lg ${
                            program.status === "Locked" ? "opacity-50" : "hover:scale-105"
                          }`}
                          onClick={() => handleProgramClick(program)}
                        >
                          <CardContent className="p-4">
                            <h3 className="font-semibold mb-2">{program.name}</h3>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Progress</span>
                                <span>{program.progress}%</span>
                              </div>
                              <Progress value={program.progress} className="h-2" />
                              <div className="flex justify-between text-sm">
                                <span>Quiz Score</span>
                                <span>{program.quiz}%</span>
                              </div>
                              <Badge 
                                variant={program.status === "In Progress" ? "default" : "secondary"}
                                className="w-full justify-center"
                              >
                                {program.status}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>To-Do List</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {todos.map((todo) => (
                        <div 
                          key={todo.id}
                          className="flex items-center justify-between p-3 rounded-lg border cursor-pointer hover:bg-muted/50"
                          onClick={() => handleTaskClick(todo)}
                        >
                          <div className="flex items-center gap-3">
                            {todo.status === "completed" && <CheckCircle className="h-5 w-5 text-success" />}
                            {todo.status === "overdue" && <AlertCircle className="h-5 w-5 text-destructive" />}
                            {todo.status === "in-progress" && <Clock className="h-5 w-5 text-warning" />}
                            {todo.status === "pending" && <Clock className="h-5 w-5 text-muted-foreground" />}
                            <span className={todo.status === "completed" ? "line-through text-muted-foreground" : ""}>
                              {todo.task}
                            </span>
                          </div>
                          <Badge 
                            variant={
                              todo.status === "completed" ? "default" :
                              todo.status === "overdue" ? "destructive" :
                              todo.status === "in-progress" ? "secondary" : "outline"
                            }
                          >
                            {todo.status.replace("-", " ")}
                          </Badge>
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
                      <Users className="h-5 w-5" />
                      Leaderboard
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {leaderboard.map((student, index) => (
                        <div 
                          key={student.name}
                          className={`flex items-center justify-between p-2 rounded-lg ${
                            student.name === "You" ? "bg-primary/10 border border-primary/20" : "hover:bg-muted/50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium">#{index + 1}</span>
                            <div>
                              <p className="font-medium">{student.name}</p>
                              <p className="text-xs text-muted-foreground">{student.xp} XP • {student.time}</p>
                            </div>
                          </div>
                          {student.name !== "You" && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleSendMessage(student.name)}
                            >
                              Message
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Upcoming Sessions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {upcomingSessions.map((session, index) => (
                        <div key={index} className="p-3 rounded-lg border">
                          <h4 className="font-medium">{session.title}</h4>
                          <p className="text-sm text-muted-foreground">{session.time}</p>
                          <p className="text-sm text-muted-foreground">with {session.mentor}</p>
                          <Button 
                            size="sm" 
                            className="w-full mt-2"
                            onClick={handleJoinSession}
                          >
                            Join Session
                          </Button>
                        </div>
                      ))}
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={handleBookSession}
                      >
                        Book New Session
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <Sidebar className="w-64" collapsible="icon">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {sidebarItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={item.active ? "bg-primary text-primary-foreground" : ""}
                        onClick={() => handleTabChange(item.url)}
                      >
                        <div className="flex items-center gap-2 cursor-pointer">
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1">
          <header className="h-16 border-b border-border bg-card flex items-center px-6">
            <SidebarTrigger className="mr-4" />
            <div className="flex-1 flex items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold">Hello Student 👋 Let's start your clinical research training.</h1>
                <p className="text-sm text-muted-foreground">Current Role: Clinical Research Trainee</p>
              </div>
              <div className="flex items-center gap-4">
                <Input placeholder="Search tasks/modules..." className="w-64" />
              </div>
            </div>
          </header>

          <div className="p-6">
            {renderMainContent()}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;

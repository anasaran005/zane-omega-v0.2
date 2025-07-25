import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Database, Code, FileText, Upload, CheckCircle, Star } from "lucide-react";

const ShiftMode = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [feasibilityFormSaved, setFeasibilityFormSaved] = useState(false);
  const [siteEvaluated, setSiteEvaluated] = useState(false);
  const [checklistSubmitted, setChecklistSubmitted] = useState(false);
  const [pitchUploaded, setPitchUploaded] = useState(false);
  const [selectedCriteria, setSelectedCriteria] = useState<string[]>([]);
  const [xpEarned, setXpEarned] = useState(0);

  const siteData = {
    siteId: "SITE001",
    investigatorName: "Dr. Sarah Johnson",
    siteName: "Metro Medical Center",
    patientPopulation: "Oncology patients",
    trialPhase: "Phase 2",
    indication: "Lung Cancer",
    country: "United States",
    enrollmentTarget: "25 patients"
  };

  const feasibilityCriteria = [
    { criterion: "Adequate patient population", code: "FEA001", type: "Population" },
    { criterion: "Qualified investigator", code: "FEA002", type: "Personnel" },
    { criterion: "Proper facilities", code: "FEA003", type: "Infrastructure" },
    { criterion: "Regulatory compliance", code: "FEA004", type: "Compliance" }
  ];

  const allTasksCompleted = feasibilityFormSaved && siteEvaluated && checklistSubmitted && pitchUploaded;
  const completedTasks = [feasibilityFormSaved, siteEvaluated, checklistSubmitted, pitchUploaded].filter(Boolean).length;

  const handleSaveFeasibilityForm = () => {
    setFeasibilityFormSaved(true);
    setXpEarned(prev => prev + 150);
    toast({
      title: "✅ 150 XP Earned",
      description: "Site feasibility form saved successfully!",
    });
  };

  const handleSelectCriteria = (code: string, criterion: string) => {
    if (!selectedCriteria.includes(code)) {
      setSelectedCriteria([...selectedCriteria, `${criterion} | Code: ${code}`]);
    }
  };

  const handleSubmitEvaluation = () => {
    if (selectedCriteria.length > 0) {
      setSiteEvaluated(true);
      setXpEarned(prev => prev + 200);
      toast({
        title: "✅ 200 XP Earned",
        description: "Site evaluation submitted successfully!",
      });
    }
  };

  const handleSubmitChecklist = () => {
    setChecklistSubmitted(true);
    setXpEarned(prev => prev + 175);
    toast({
      title: "✅ 175 XP Earned",
      description: "Trial setup checklist submitted!",
    });
  };

  const handleUploadPitch = () => {
    setPitchUploaded(true);
    setXpEarned(prev => prev + 225);
    toast({
      title: "✅ 225 XP Earned",
      description: "Site selection pitch uploaded successfully!",
    });
  };

  const handleCompleteShift = () => {
    toast({
      title: "🎉 Shift Completed!",
      description: "All tasks submitted. Awaiting mentor review. Total XP earned: " + xpEarned,
    });
    setTimeout(() => {
      navigate("/review");
    }, 2000);
  };

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
                <h1 className="text-2xl font-bold">Clinical Research Simulation</h1>
                <p className="text-muted-foreground">Complete real-world clinical research tasks</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary">XP Earned: {xpEarned}</Badge>
              <Badge variant={allTasksCompleted ? "default" : "outline"}>
                {completedTasks}/4 Tasks
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-4">
        <Card className="bg-primary/10 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="bg-primary rounded-full p-2">
                <Star className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold">Dr. Arya – Clinical Research Mentor</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  "This is your real-world task — give it your best like you're already on the job!"
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Trial Scenario
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">Site #SITE001 – Phase 2 Lung Cancer Trial</h3>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <p>
                      Metro Medical Center has been identified as a potential site for a Phase 2 lung cancer trial. 
                      The site needs comprehensive feasibility assessment including patient population analysis, 
                      investigator qualifications, and infrastructure evaluation.
                    </p>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div><strong>Investigator:</strong> Dr. Sarah Johnson</div>
                      <div><strong>Phase:</strong> Phase 2</div>
                      <div><strong>Indication:</strong> Lung Cancer</div>
                      <div><strong>Target:</strong> 25 patients</div>
                      <div><strong>Site:</strong> Metro Medical Center</div>
                      <div><strong>Country:</strong> United States</div>
                    </div>
                  </div>

                  <div className="border-t pt-3">
                    <p className="text-sm font-medium text-primary">
                      ➤ Action: Complete feasibility assessment and trial setup documentation.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Overall Progress</span>
                      <span>{completedTasks}/4</span>
                    </div>
                    <Progress value={(completedTasks / 4) * 100} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Site Feasibility Assessment Form
                  {feasibilityFormSaved && <CheckCircle className="h-5 w-5 text-success" />}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium">Site ID</label>
                    <Input value={siteData.siteId} disabled />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Investigator Name</label>
                    <Input value={siteData.investigatorName} />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Site Name</label>
                    <Input value={siteData.siteName} />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Patient Population</label>
                    <Input value={siteData.patientPopulation} />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Trial Phase</label>
                    <Select defaultValue={siteData.trialPhase}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Phase 1">Phase 1</SelectItem>
                        <SelectItem value="Phase 2">Phase 2</SelectItem>
                        <SelectItem value="Phase 3">Phase 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Indication</label>
                    <Input value={siteData.indication} />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Country</label>
                    <Input value={siteData.country} />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Enrollment Target</label>
                    <Input value={siteData.enrollmentTarget} />
                  </div>
                </div>
                <Button 
                  onClick={handleSaveFeasibilityForm} 
                  className="w-full mt-4"
                  disabled={feasibilityFormSaved}
                >
                  {feasibilityFormSaved ? "✅ Feasibility Form Saved" : "Save Feasibility Form"}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Site Selection Criteria Evaluation
                  {siteEvaluated && <CheckCircle className="h-5 w-5 text-success" />}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Input placeholder="Search criteria (e.g., patient population)" />
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Evaluation Criteria:</h4>
                    {feasibilityCriteria.map((criteria, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded-lg">
                        <div>
                          <span className="font-medium">{criteria.criterion}</span>
                          <Badge variant="outline" className="ml-2">{criteria.type}</Badge>
                          <p className="text-xs text-muted-foreground">Code: {criteria.code}</p>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleSelectCriteria(criteria.code, criteria.criterion)}
                        >
                          Select
                        </Button>
                      </div>
                    ))}
                  </div>

                  {selectedCriteria.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Selected Criteria:</h4>
                      {selectedCriteria.map((criteria, index) => (
                        <div key={index} className="p-2 bg-muted rounded text-sm">
                          {criteria}
                        </div>
                      ))}
                    </div>
                  )}

                  <Button 
                    onClick={handleSubmitEvaluation} 
                    className="w-full"
                    disabled={selectedCriteria.length === 0 || siteEvaluated}
                  >
                    {siteEvaluated ? "✅ Evaluation Submitted" : "Submit Evaluation"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Trial Setup Checklist
                  {checklistSubmitted && <CheckCircle className="h-5 w-5 text-success" />}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Textarea 
                    placeholder="Create a comprehensive checklist for setting up a Phase 2 Clinical Trial at Metro Medical Center..."
                    rows={6}
                    defaultValue=""
                  />
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      💾 Save Draft
                    </Button>
                    <Button 
                      onClick={handleSubmitChecklist} 
                      className="flex-1"
                      disabled={checklistSubmitted}
                    >
                      {checklistSubmitted ? "✅ Submitted" : "Submit Checklist"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Site Selection Pitch
                  {pitchUploaded && <CheckCircle className="h-5 w-5 text-success" />}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Textarea 
                    placeholder="Write a 100-word paragraph explaining why Metro Medical Center should be chosen for this multicenter trial..."
                    rows={4}
                  />
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Upload supporting documents or drag and drop files here
                    </p>
                  </div>
                  <Input placeholder="Additional notes for reviewer (optional)" />
                  <Button 
                    onClick={handleUploadPitch} 
                    className="w-full"
                    disabled={pitchUploaded}
                  >
                    {pitchUploaded ? "✅ Pitch Submitted" : "Submit Site Selection Pitch"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {allTasksCompleted && (
              <Card className="bg-success/10 border-success/20">
                <CardContent className="p-6 text-center">
                  <CheckCircle className="h-12 w-12 text-success mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">All Clinical Research Tasks Completed!</h3>
                  <p className="text-muted-foreground mb-4">
                    Excellent work! All feasibility assessment and trial setup tasks have been submitted and are awaiting mentor review.
                  </p>
                  <p className="text-lg font-medium mb-4">Total XP Earned: {xpEarned}</p>
                  <Button onClick={handleCompleteShift} size="lg">
                    Complete Simulation & Get Review
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShiftMode;

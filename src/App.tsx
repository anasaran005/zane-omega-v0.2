import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Learning from "./pages/Learning";
import ShiftMode from "./pages/ShiftMode";
import Review from "./pages/Review";
import NotFound from "./pages/NotFound";
import QAQCLesson1 from "./pages/qaqclesson1";
import LearningDynamic from "./pages/LearningDynamic";
import CourseDescription from "./pages/CourseDescription";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/learning/clinical-research" element={<Learning />} />
          <Route path="/shift" element={<ShiftMode />} />
          <Route path="/review" element={<Review />} />
          // ...
          <Route path="/learning/:courseId" element={<LearningDynamic />} />
          // or for static:
          <Route path="/learning/qaqc-lesson1" element={<LearningDynamic />} /> 
          <Route path="/course/:courseId" element={<CourseDescription />} />

          {/* New course lesson route */}
          <Route path="/qaqclesson1" element={<QAQCLesson1 />} />

          {/* Catch-all for 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

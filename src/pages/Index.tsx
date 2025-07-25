
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Play, Users, Award, Building, Star, BookOpen, Zap, UserCheck, TrendingUp } from "lucide-react";
import { useState } from "react";
import { TransitionLoader } from "@/components/TransitionLoader";

const Index = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleStartTraining = () => {
    setIsLoading(true);
  };

  const handleLoadingComplete = () => {
    setIsLoading(false);
    navigate("/dashboard");
  };

  const handleWatchDemo = () => {
    navigate("/learning/clinical-research");
  };

  return (
    <div className="min-h-screen bg-background">
      {isLoading && <TransitionLoader onLoadingComplete={handleLoadingComplete} />}
      {/* Navigation Header */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-xl font-bold text-foreground">
              <span className="text-white">Zane</span>
              <span className="text-primary">Ωmega</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">About</a>
              <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center">
          <div className="mb-4 text-sm font-medium text-primary">Next-Generation Training Platform</div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-white">Zane </span>
            <span className="text-primary">Ωmega</span>
          </h1>
          <div className="text-lg text-muted-foreground mb-4">ZaneProEd Workplace studio</div>
          <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-foreground">
            Real Healthcare Training Simulation
          </h2>
          <p className="text-xl leading-relaxed text-muted-foreground max-w-3xl mx-auto mb-12">
            Master healthcare administration, patient management, and regulatory affairs through immersive simulations and expert-guided training programs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handleStartTraining}
              size="lg" 
              className="px-8 py-3 text-lg bg-primary hover:bg-primary/90"
            >
              Start Training
            </Button>
            <Button 
              onClick={handleWatchDemo}
              variant="outline" 
              size="lg" 
              className="px-8 py-3 text-lg border-muted-foreground text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 bg-card/30">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">500+</div>
              <div className="text-muted-foreground">Students Trained</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">95%</div>
              <div className="text-muted-foreground">Job Placement Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">50+</div>
              <div className="text-muted-foreground">Industry Partners</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">4.8/5</div>
              <div className="text-muted-foreground">Student Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Choose ZANE Workplace?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our platform combines cutting-edge technology with industry expertise to deliver unparalleled training experiences.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="hover:shadow-lg transition-shadow bg-card border-border">
              <CardHeader>
                <BookOpen className="h-12 w-12 text-primary mb-4" />
                <CardTitle className="text-white">Interactive Learning</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Comprehensive modules with videos, quizzes, and hands-on exercises
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow bg-card border-border">
              <CardHeader>
                <Zap className="h-12 w-12 text-primary mb-4" />
                <CardTitle className="text-white">Real-World Simulation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Practice with actual healthcare workflows and case studies
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow bg-card border-border">
              <CardHeader>
                <UserCheck className="h-12 w-12 text-primary mb-4" />
                <CardTitle className="text-white">Expert Mentorship</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Weekly sessions with industry professionals
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow bg-card border-border">
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-primary mb-4" />
                <CardTitle className="text-white">Progress Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  XP system, leaderboards, and detailed analytics
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6 bg-card/30">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white">
              Bridging the Gap Between Education and Industry
            </h2>
            <p className="text-lg text-muted-foreground mb-12 leading-relaxed">
              ZANE Workplace was created by industry veterans who understand the challenges of transitioning from academic learning to professional practice. Our immersive platform provides hands-on experience with real-world scenarios, expert mentorship, and the confidence needed to excel in healthcare careers.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div className="text-center">
                <Building className="h-16 w-16 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-white">Industry-Led</h3>
                <p className="text-muted-foreground">
                  Curriculum designed by healthcare professionals
                </p>
              </div>
              
              <div className="text-center">
                <Zap className="h-16 w-16 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-white">Hands-On</h3>
                <p className="text-muted-foreground">
                  Real workplace simulations and case studies
                </p>
              </div>
              
              <div className="text-center">
                <Users className="h-16 w-16 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-white">Mentored</h3>
                <p className="text-muted-foreground">
                  Direct access to industry experts and guidance
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Ready to Start Your Journey?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of students who have successfully launched their careers in healthcare industries.
          </p>
          <Button 
            onClick={handleStartTraining}
            size="lg" 
            className="px-8 py-3 text-lg bg-primary hover:bg-primary/90"
          >
            Begin Training Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">
                <span className="text-white">Zane</span>
                <span className="text-primary">Ωmega</span>
              </h3>
              <p className="text-muted-foreground text-sm">
                Empowering the next generation of healthcare professionals through immersive training and expert mentorship.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-white">Platform</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div><a href="#" className="hover:text-foreground transition-colors">Features</a></div>
                <div><a href="#" className="hover:text-foreground transition-colors">Pricing</a></div>
                <div><a href="#" className="hover:text-foreground transition-colors">Enterprise</a></div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-white">Support</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div><a href="#" className="hover:text-foreground transition-colors">Help Center</a></div>
                <div><a href="#contact" className="hover:text-foreground transition-colors">Contact Us</a></div>
                <div><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></div>
              </div>
            </div>
            
            <div id="contact">
              <h4 className="font-semibold mb-4 text-white">Contact</h4>
              <div className="text-sm text-muted-foreground">
                Get in touch for enterprise solutions and partnerships.
              </div>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            © 2024 ZANE Workplace. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Clock, CheckCircle, Users, ArrowRight } from "lucide-react";

interface HomePageProps {
  onViewChange: (view: string) => void;
}

export function HomePage({ onViewChange }: HomePageProps) {
  const features = [
    {
      icon: FileText,
      title: "Submit Complaints",
      description: "Easily report issues across Healthcare, Sanitation, Transportation, and Education departments.",
      color: "bg-primary"
    },
    {
      icon: Clock,
      title: "Track Progress",
      description: "Monitor your complaint status in real-time with detailed updates and timeline.",
      color: "bg-secondary"
    },
    {
      icon: CheckCircle,
      title: "Quick Resolution",
      description: "Our streamlined process ensures faster response times and efficient problem-solving.",
      color: "bg-accent"
    },
    {
      icon: Users,
      title: "Dedicated Support",
      description: "Professional staff committed to addressing citizen concerns with transparency.",
      color: "bg-status-resolved"
    }
  ];

  const departments = [
    { name: "Healthcare", count: "24 active", color: "bg-status-progress" },
    { name: "Sanitation", count: "18 active", color: "bg-status-submitted" },
    { name: "Transportation", count: "31 active", color: "bg-status-resolved" },
    { name: "Education", count: "12 active", color: "bg-secondary" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Your Voice,{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Our Priority
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              A comprehensive platform for citizens to submit, track, and resolve grievances 
              with municipal services efficiently and transparently.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="hero" 
                size="lg" 
                onClick={() => onViewChange('register')}
                className="group"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={() => onViewChange('login')}
              >
                Already Registered? Login
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              How We Serve You
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform is designed to make citizen-government interaction seamless and effective.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 bg-gradient-card border-0">
                <CardHeader className="pb-3">
                  <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Departments Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Service Departments
            </h2>
            <p className="text-muted-foreground">
              Report issues across various municipal departments
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {departments.map((dept, index) => (
              <Card key={index} className="text-center group hover:shadow-md transition-all duration-300 bg-background border">
                <CardContent className="pt-6">
                  <div className={`w-3 h-3 rounded-full ${dept.color} mx-auto mb-3`}></div>
                  <h3 className="font-semibold text-foreground mb-2">{dept.name}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {dept.count}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl text-center">
          <Card className="bg-gradient-hero border-0 text-white">
            <CardContent className="py-12">
              <h2 className="text-3xl font-bold mb-4">
                Ready to Make Your Voice Heard?
              </h2>
              <p className="text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
                Join thousands of citizens who have successfully resolved their concerns 
                through our transparent and efficient grievance system.
              </p>
              <Button 
                variant="secondary" 
                size="lg" 
                onClick={() => onViewChange('register')}
                className="group"
              >
                Register Now
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
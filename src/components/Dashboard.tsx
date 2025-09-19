import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  Calendar,
  Eye,
  Plus
} from "lucide-react";

interface DashboardProps {
  userData: any;
  onViewChange: (view: string) => void;
  userComplaints?: Array<{
    complaintId: string;
    issue: string;
    department: string;
    status: string;
    submissionDate: string;
    lastUpdated: string;
  }>;
}

export function Dashboard({ userData, onViewChange, userComplaints = [] }: DashboardProps) {
  // Mock complaint data
  const complaints = [
    {
      id: "GRV-2024-001",
      issue: "Street lighting not working in residential area",
      department: "Infrastructure",
      status: "In Progress",
      submissionDate: "2024-01-15",
      lastUpdated: "2024-01-18"
    },
    {
      id: "GRV-2024-002", 
      issue: "Garbage collection irregular in neighborhood",
      department: "Sanitation",
      status: "Resolved",
      submissionDate: "2024-01-10",
      lastUpdated: "2024-01-16"
    },
    {
      id: "GRV-2024-003",
      issue: "Bus stop shelter damaged and needs repair",
      department: "Transportation", 
      status: "Submitted",
      submissionDate: "2024-01-20",
      lastUpdated: "2024-01-20"
    }
  ];

  const stats = [
    {
      title: "Total Complaints",
      value: complaints.length,
      change: "+2 this month",
      icon: FileText,
      color: "text-primary"
    },
    {
      title: "In Progress",
      value: complaints.filter(c => c.status === "In Progress").length,
      change: "1 active",
      icon: Clock,
      color: "text-status-progress"
    },
    {
      title: "Resolved",
      value: complaints.filter(c => c.status === "Resolved").length,
      change: "66% resolution rate",
      icon: CheckCircle,
      color: "text-status-resolved"
    },
    {
      title: "Avg. Response Time",
      value: "3.2 days",
      change: "-0.5 days improved",
      icon: TrendingUp,
      color: "text-secondary"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Submitted": return "bg-status-submitted";
      case "In Progress": return "bg-status-progress";
      case "Resolved": return "bg-status-resolved";
      case "Rejected": return "bg-status-rejected";
      default: return "bg-muted";
    }
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "Resolved": return "default";
      case "In Progress": return "secondary";
      case "Rejected": return "destructive";
      default: return "outline";
    }
  };

  const mergedComplaints = [
    ...userComplaints.map((c) => ({
      id: c.complaintId,
      issue: c.issue,
      department: c.department,
      status: c.status,
      submissionDate: new Date(c.submissionDate).toLocaleDateString(),
      lastUpdated: new Date(c.lastUpdated).toLocaleDateString(),
    })),
    ...complaints,
  ];

  const hasComplaints = userComplaints.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {userData.name}!
          </h1>
          <p className="text-muted-foreground">
            {hasComplaints 
              ? "Monitor your complaints and their resolution progress"
              : "Submit your first complaint or track existing ones"
            }
          </p>
        </div>

        {/* Stats Cards - Only show if user has complaints */}
        {hasComplaints && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="bg-gradient-card border-0 shadow-md hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-foreground">
                        {stat.value}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {stat.change}
                      </p>
                    </div>
                    <div className={`p-3 rounded-lg bg-primary/10`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Main Content - Different layout based on whether user has complaints */}
        {hasComplaints ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="lg:col-span-2 bg-gradient-card border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Recent Complaints
                </CardTitle>
                <CardDescription>
                  Your latest submitted grievances and their status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mergedComplaints.map((complaint) => (
                    <div key={complaint.id} className="flex items-center justify-between p-4 rounded-lg bg-background border border-border hover:shadow-sm transition-all duration-200">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            {complaint.id}
                          </Badge>
                          <Badge variant={getStatusVariant(complaint.status)}>
                            {complaint.status}
                          </Badge>
                        </div>
                        <h4 className="font-medium text-foreground mb-1">
                          {complaint.issue}
                        </h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {complaint.submissionDate}
                          </span>
                          <span>Department: {complaint.department}</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => onViewChange('track')}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
                <CardDescription>
                  Common tasks you might want to perform
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  variant="default" 
                  className="w-full justify-start" 
                  onClick={() => onViewChange('submit')}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Submit New Complaint
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => onViewChange('track')}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Track Existing Complaint
                </Button>
                <div className="pt-4 border-t border-border">
                  <h4 className="font-medium text-sm text-foreground mb-2">Resolution Progress</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Overall completion</span>
                      <span>66%</span>
                    </div>
                    <Progress value={66} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Simple two-box layout for users without complaints */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="bg-gradient-card border-0 shadow-md hover:shadow-lg transition-all duration-300">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                  <Plus className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">Submit New Complaint</CardTitle>
                <CardDescription>
                  Report issues with municipal services like healthcare, sanitation, transportation, and education
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button 
                  variant="default" 
                  size="lg" 
                  className="w-full" 
                  onClick={() => onViewChange('submit')}
                >
                  Submit Complaint
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-0 shadow-md hover:shadow-lg transition-all duration-300">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                  <Eye className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">Track Complaint</CardTitle>
                <CardDescription>
                  Monitor the progress of your submitted complaints with real-time updates
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full"
                  onClick={() => onViewChange('track')}
                >
                  Track Progress
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Department Officials */}
        <Card className="bg-gradient-card border-0 shadow-md">
          <CardHeader>
            <CardTitle>Department Officials</CardTitle>
            <CardDescription>
              Department heads handling your municipal service complaints
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { 
                  department: "Healthcare", 
                  official: "Dr. Sarah Johnson",
                  description: "Handles medical facility issues, emergency services, and public health concerns. Manages hospital equipment, ambulance services, and community health programs."
                },
                { 
                  department: "Sanitation", 
                  official: "Michael Rodriguez",
                  description: "Oversees waste management, street cleaning, and garbage collection services. Addresses issues with public cleanliness, recycling programs, and waste disposal."
                },
                { 
                  department: "Transportation", 
                  official: "Emily Chen",
                  description: "Manages road maintenance, traffic signals, and public transport systems. Handles complaints about potholes, bus services, and traffic management."
                },
                { 
                  department: "Education", 
                  official: "David Thompson",
                  description: "Supervises school facilities, educational programs, and student services. Addresses issues with school infrastructure, teacher resources, and student welfare."
                }
              ].map((dept) => (
                <div key={dept.department} className="p-4 rounded-lg bg-background border border-border hover:shadow-sm transition-all duration-200">
                  <h4 className="font-medium text-foreground mb-2">{dept.department}</h4>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm font-semibold text-primary">{dept.official}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {dept.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
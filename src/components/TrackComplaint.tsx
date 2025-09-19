import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Search, Calendar, MapPin, Building, FileText, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface TrackComplaintProps {
  userData: any;
  externalComplaints?: any[];
  initialComplaintId?: string;
}

export function TrackComplaint({ userData, externalComplaints = [], initialComplaintId }: TrackComplaintProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [complaintId, setComplaintId] = useState(initialComplaintId || "");
  const [complaintData, setComplaintData] = useState<any>(null);

  // Mock complaint database
  const mockComplaints = {
    "GRV-2024-001": {
      complaintId: "GRV-2024-001",
      userName: "John Doe",
      address: "123 Main Street, Downtown Area",
      issue: "Street lighting not working in residential area. Multiple streetlights are out making it unsafe for pedestrians and vehicles during night time.",
      department: "Infrastructure",
      status: "In Progress",
      submissionDate: "2024-01-15T10:30:00Z",
      lastUpdated: "2024-01-18T14:20:00Z",
      timeline: [
        { status: "Submitted", date: "2024-01-15T10:30:00Z", description: "Complaint received and registered" },
        { status: "Under Review", date: "2024-01-16T09:15:00Z", description: "Assigned to technical team for assessment" },
        { status: "In Progress", date: "2024-01-18T14:20:00Z", description: "Repair work initiated, estimated completion in 2-3 days" }
      ]
    },
    "GRV-2024-002": {
      complaintId: "GRV-2024-002",
      userName: "Jane Smith",
      address: "456 Oak Avenue, Suburban Area",
      issue: "Garbage collection irregular in neighborhood. Waste pickup has been inconsistent for the past two weeks.",
      department: "Sanitation",
      status: "Resolved",
      submissionDate: "2024-01-10T08:45:00Z",
      lastUpdated: "2024-01-16T16:30:00Z",
      timeline: [
        { status: "Submitted", date: "2024-01-10T08:45:00Z", description: "Complaint received and registered" },
        { status: "In Progress", date: "2024-01-12T11:00:00Z", description: "Sanitation team notified and schedule adjusted" },
        { status: "Resolved", date: "2024-01-16T16:30:00Z", description: "Regular collection schedule restored" }
      ]
    },
    "GRV-2024-003": {
      complaintId: "GRV-2024-003",
      userName: "Mike Johnson",
      address: "789 Pine Road, City Center",
      issue: "Bus stop shelter damaged and needs repair. The roof is leaking and seating is broken.",
      department: "Transportation",
      status: "Submitted",
      submissionDate: "2024-01-20T15:20:00Z",
      lastUpdated: "2024-01-20T15:20:00Z",
      timeline: [
        { status: "Submitted", date: "2024-01-20T15:20:00Z", description: "Complaint received and awaiting review" }
      ]
    }
  };

  const allComplaints = useMemo(() => {
    const map: Record<string, any> = { ...mockComplaints };
    for (const c of externalComplaints) {
      map[c.complaintId] = c;
    }
    return map;
  }, [externalComplaints]);

  useEffect(() => {
    if (initialComplaintId) {
      // Auto search when arriving with a prefilled ID
      const found = allComplaints[initialComplaintId as keyof typeof allComplaints];
      if (found) {
        setComplaintData(found);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialComplaintId]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!complaintId.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please enter a complaint ID to track.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      const found = allComplaints[complaintId as keyof typeof allComplaints];
      if (found) {
        setComplaintData(found);
        toast({
          title: "Complaint Found",
          description: `Displaying details for ${complaintId}`,
        });
      } else {
        setComplaintData(null);
        toast({
          title: "Complaint Not Found",
          description: "Please check the complaint ID and try again.",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Submitted": return <AlertCircle className="h-4 w-4 text-status-submitted" />;
      case "Under Review": return <Clock className="h-4 w-4 text-status-progress" />;
      case "In Progress": return <Clock className="h-4 w-4 text-status-progress" />;
      case "Resolved": return <CheckCircle className="h-4 w-4 text-status-resolved" />;
      case "Rejected": return <XCircle className="h-4 w-4 text-status-rejected" />;
      default: return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "Resolved": return "default";
      case "In Progress": 
      case "Under Review": return "secondary";
      case "Rejected": return "destructive";
      default: return "outline";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-4xl">
        {/* Search Section */}
        <Card className="mb-8 shadow-lg bg-gradient-card border-0">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
              <Search className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold">Track Your Complaint</CardTitle>
            <CardDescription>
              Enter your complaint ID to view current status and progress updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="trackId" className="font-medium">
                  Complaint ID
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="trackId"
                    type="text"
                    placeholder="Enter complaint ID (e.g., GRV-2024-001)"
                    value={complaintId}
                    onChange={(e) => setComplaintId(e.target.value.toUpperCase())}
                    className="bg-background"
                    required
                  />
                  <Button type="submit" disabled={isLoading} className="shrink-0">
                    {isLoading ? "Searching..." : <Search className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </form>
            
            <div className="mt-4 p-3 bg-primary-light rounded-lg border border-primary/20">
              <p className="text-sm text-primary-dark">
                <strong>Try these sample IDs:</strong> GRV-2024-001, GRV-2024-002, GRV-2024-003
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Complaint Details */}
        {complaintData && (
          <div className="space-y-6">
            {/* Basic Information */}
            <Card className="shadow-lg bg-gradient-card border-0">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Complaint Details
                  </CardTitle>
                  <Badge variant={getStatusVariant(complaintData.status)} className="text-sm">
                    {getStatusIcon(complaintData.status)}
                    {complaintData.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Complaint ID</p>
                        <p className="font-mono text-foreground">{complaintData.complaintId}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Building className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Department</p>
                        <p className="text-foreground">{complaintData.department}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Submitted</p>
                        <p className="text-foreground">{formatDate(complaintData.submissionDate)}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                        <p className="text-foreground">{formatDate(complaintData.lastUpdated)}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-border">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-muted-foreground">Address</p>
                      <p className="text-foreground">{complaintData.address}</p>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-border">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Issue Description</p>
                  <p className="text-foreground leading-relaxed">{complaintData.issue}</p>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card className="shadow-lg bg-gradient-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Progress Timeline
                </CardTitle>
                <CardDescription>
                  Track the progress of your complaint resolution
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {complaintData.timeline.map((item: any, index: number) => {
                    const isCompleted = index < complaintData.timeline.length - 1 || complaintData.status === "Resolved";
                    const isCurrent = index === complaintData.timeline.length - 1 && complaintData.status !== "Resolved";
                    
                    return (
                      <div key={index} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            isCompleted 
                              ? 'bg-green-500 text-white' 
                              : isCurrent 
                                ? 'bg-blue-500 text-white' 
                                : 'bg-gray-300 text-gray-600'
                          }`}>
                            {getStatusIcon(item.status)}
                          </div>
                          {index < complaintData.timeline.length - 1 && (
                            <div className={`w-1 h-8 mt-2 ${
                              isCompleted ? 'bg-green-500' : 'bg-gray-300'
                            }`}></div>
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className={`font-medium ${
                              isCompleted ? 'text-green-700' : isCurrent ? 'text-blue-700' : 'text-gray-600'
                            }`}>
                              {item.status}
                            </h4>
                            <Badge variant="outline" className="text-xs">
                              {formatDate(item.date)}
                            </Badge>
                            {isCompleted && (
                              <Badge variant="default" className="text-xs bg-green-500">
                                ✓ Completed
                              </Badge>
                            )}
                            {isCurrent && (
                              <Badge variant="default" className="text-xs bg-blue-500">
                                In Progress
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {!complaintData && !isLoading && (
          <Card className="shadow-lg bg-gradient-card border-0">
            <CardContent className="text-center py-12">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No Complaint Selected</h3>
              <p className="text-muted-foreground">
                Enter a complaint ID above to view its details and tracking information.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
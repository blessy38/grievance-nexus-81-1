import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { FileText, Send, User, MapPin, Building } from "lucide-react";

interface ComplaintFormProps {
  userData: any;
  onSuccess: (complaintId: string) => void;
}

export function ComplaintForm({ userData, onSuccess }: ComplaintFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    userName: userData.name || "",
    address: "",
    issue: "",
    department: ""
  });

  const departments = [
    { value: "Healthcare", label: "Healthcare", description: "Medical facilities, emergency services" },
    { value: "Sanitation", label: "Sanitation", description: "Waste management, cleaning services" },
    { value: "Transportation", label: "Transportation", description: "Roads, traffic, public transport" },
    { value: "Education", label: "Education", description: "Schools, educational facilities" }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.userName || !formData.address || !formData.issue || !formData.department) {
      toast({
        title: "Incomplete Form",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      const complaintId = `GRV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9999) + 1).padStart(3, '0')}`;
      
      toast({
        title: "Complaint Submitted Successfully",
        description: `Your complaint has been registered with ID: ${complaintId}`,
      });
      
      onSuccess(complaintId);
      setIsLoading(false);
    }, 1500);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-2xl">
        <Card className="shadow-lg bg-gradient-card border-0">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">Submit New Complaint</CardTitle>
              <CardDescription>
                Report an issue with municipal services. We'll track and resolve it for you.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="userName" className="flex items-center gap-2 font-medium">
                  <User className="h-4 w-4 text-primary" />
                  Your Name
                </Label>
                <Input
                  id="userName"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.userName}
                  onChange={(e) => handleInputChange("userName", e.target.value)}
                  className="bg-background"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="flex items-center gap-2 font-medium">
                  <MapPin className="h-4 w-4 text-primary" />
                  Address
                </Label>
                <Textarea
                  id="address"
                  placeholder="Enter the address where the issue is located"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className="bg-background min-h-[80px]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department" className="flex items-center gap-2 font-medium">
                  <Building className="h-4 w-4 text-primary" />
                  Department
                </Label>
                <Select value={formData.department} onValueChange={(value) => handleInputChange("department", value)}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select the relevant department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.value} value={dept.value}>
                        <div className="flex flex-col">
                          <span className="font-medium">{dept.label}</span>
                          <span className="text-xs text-muted-foreground">{dept.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="issue" className="flex items-center gap-2 font-medium">
                  <FileText className="h-4 w-4 text-primary" />
                  Issue Description
                </Label>
                <Textarea
                  id="issue"
                  placeholder="Describe the issue in detail. Include relevant information like location, time, and impact on daily life."
                  value={formData.issue}
                  onChange={(e) => handleInputChange("issue", e.target.value)}
                  className="bg-background min-h-[120px]"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Be as specific as possible to help us understand and resolve the issue quickly.
                </p>
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                  variant="default"
                  size="lg"
                >
                  {isLoading ? (
                    "Submitting..."
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Submit Complaint
                    </>
                  )}
                </Button>
              </div>
            </form>

            <div className="mt-6 p-4 bg-accent-light rounded-lg border border-accent/20">
              <h4 className="font-medium text-foreground mb-2">What happens next?</h4>
              <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                <li>You'll receive a unique complaint ID for tracking</li>
                <li>Your complaint will be assigned to the relevant department</li>
                <li>You can track progress using the "Track Complaint" feature</li>
                <li>You'll be notified of any status updates</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
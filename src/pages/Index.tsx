import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { HomePage } from "@/components/HomePage";
import { AuthForms } from "@/components/AuthForms";
import { Dashboard } from "@/components/Dashboard";
import { ComplaintForm } from "@/components/ComplaintForm";
import { TrackComplaint } from "@/components/TrackComplaint";
import { FirebaseTest } from "@/components/FirebaseTest";
import { useAuth } from "@/contexts/AuthContext";
import { complaintsService } from "@/lib/complaints";
import type { Complaint } from "@/types";

const Index = () => {
  const { user, loading, logout } = useAuth();
  const [currentView, setCurrentView] = useState("home");
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [lastSubmittedId, setLastSubmittedId] = useState<string | null>(null);

  // Load user complaints when user is logged in
  useEffect(() => {
    if (user) {
      loadUserComplaints();
    } else {
      setComplaints([]);
    }
  }, [user]);

  const loadUserComplaints = async () => {
    if (!user) return;
    
    try {
      const userComplaints = await complaintsService.getUserComplaints(user.uid);
      setComplaints(userComplaints);
    } catch (error) {
      console.error('Error loading user complaints:', error);
    }
  };

  const handleLogin = (userData: any) => {
    setCurrentView("dashboard");
  };

  const handleLogout = async () => {
    await logout();
    setCurrentView("home");
    setComplaints([]);
  };

  const handleComplaintSubmission = (complaint: Complaint) => {
    setComplaints((prev) => [complaint, ...prev]);
    setLastSubmittedId(complaint.complaintId);
    setCurrentView("track");
  };

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const renderContent = () => {
    if (!user) {
      switch (currentView) {
        case "login":
          return (
            <AuthForms
              isLogin={true}
              onSuccess={handleLogin}
              onToggleMode={() => setCurrentView("register")}
            />
          );
        case "register":
          return (
            <AuthForms
              isLogin={false}
              onSuccess={handleLogin}
              onToggleMode={() => setCurrentView("login")}
            />
          );
        case "firebase-test":
          return <FirebaseTest />;
        default:
          return <HomePage onViewChange={setCurrentView} />;
      }
    }

    // Logged in views
    switch (currentView) {
      case "dashboard":
        return <Dashboard userData={user} onViewChange={setCurrentView} userComplaints={complaints} />;
      case "submit":
        return <ComplaintForm userData={user} onSuccess={handleComplaintSubmission} />;
      case "track":
        return <TrackComplaint userData={user} externalComplaints={complaints} initialComplaintId={lastSubmittedId ?? undefined} />;
      default:
        return <Dashboard userData={user} onViewChange={setCurrentView} userComplaints={complaints} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        currentView={currentView}
        onViewChange={setCurrentView}
        isLoggedIn={!!user}
        onLogout={handleLogout}
      />
      {renderContent()}
    </div>
  );
};

export default Index;

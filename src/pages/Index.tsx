import { useState } from "react";
import { Header } from "@/components/Header";
import { HomePage } from "@/components/HomePage";
import { AuthForms } from "@/components/AuthForms";
import { Dashboard } from "@/components/Dashboard";
import { ComplaintForm } from "@/components/ComplaintForm";
import { TrackComplaint } from "@/components/TrackComplaint";

const Index = () => {
  const [currentView, setCurrentView] = useState("home");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  const handleLogin = (userData: any) => {
    setIsLoggedIn(true);
    setUserData(userData);
    setCurrentView("dashboard");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserData(null);
    setCurrentView("home");
  };

  const handleComplaintSubmission = (complaintId: string) => {
    // After successful submission, redirect to dashboard
    setCurrentView("dashboard");
  };

  const renderContent = () => {
    if (!isLoggedIn) {
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
        default:
          return <HomePage onViewChange={setCurrentView} />;
      }
    }

    // Logged in views
    switch (currentView) {
      case "dashboard":
        return <Dashboard userData={userData} onViewChange={setCurrentView} />;
      case "submit":
        return <ComplaintForm userData={userData} onSuccess={handleComplaintSubmission} />;
      case "track":
        return <TrackComplaint userData={userData} />;
      default:
        return <Dashboard userData={userData} onViewChange={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        currentView={currentView}
        onViewChange={setCurrentView}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      />
      {renderContent()}
    </div>
  );
};

export default Index;

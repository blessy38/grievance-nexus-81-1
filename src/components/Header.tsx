import { Button } from "@/components/ui/button";
import { Shield, Menu, X, Home, LogIn, UserPlus, LayoutDashboard, FileText, Eye } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  currentView: string;
  onViewChange: (view: string) => void;
  isLoggedIn: boolean;
  onLogout: () => void;
}

export function Header({ currentView, onViewChange, isLoggedIn, onLogout }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = isLoggedIn
    ? [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'submit', label: 'Submit Complaint', icon: FileText },
        { id: 'track', label: 'Track Complaint', icon: Eye },
      ]
    : [
        { id: 'home', label: 'Home', icon: Home },
        { id: 'login', label: 'Login', icon: LogIn },
        { id: 'register', label: 'Register', icon: UserPlus },
      ];

  return (
    <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-primary" />
            <div className="flex flex-col">
              <span className="text-lg font-bold text-foreground">GrievancePortal</span>
              <span className="text-xs text-muted-foreground">Municipal Services</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant={currentView === item.id ? "default" : "ghost"}
                onClick={() => onViewChange(item.id)}
                className="text-sm"
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            ))}
            {isLoggedIn && (
              <Button variant="outline" onClick={onLogout} className="text-sm">
                <LogIn className="mr-2 h-4 w-4" />
                Logout
              </Button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 animate-fade-in">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant={currentView === item.id ? "default" : "ghost"}
                onClick={() => {
                  onViewChange(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full justify-start"
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            ))}
            {isLoggedIn && (
              <Button 
                variant="outline" 
                onClick={() => {
                  onLogout();
                  setIsMobileMenuOpen(false);
                }} 
                className="w-full justify-start"
              >
                <LogIn className="mr-2 h-4 w-4" />
                Logout
              </Button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
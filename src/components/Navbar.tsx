import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { LogOut, User } from "lucide-react";

export const Navbar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      navigate("/auth");
    }
  };

  return (
    <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/dashboard" className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          RudraCore
        </Link>
        
        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
            Dashboard
          </Link>
          <Link to="/services" className="text-sm font-medium hover:text-primary transition-colors">
            Services
          </Link>
          <Link to="/orders" className="text-sm font-medium hover:text-primary transition-colors">
            Orders
          </Link>
          <Link to="/profile" className="text-sm font-medium hover:text-primary transition-colors">
            Profile
          </Link>
          
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </nav>
  );
};

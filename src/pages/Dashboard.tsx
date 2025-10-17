import { useEffect, useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Session } from "@supabase/supabase-js";
import { Loader2, Package, ShoppingCart, UserCircle } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (!session?.user) {
          navigate("/auth");
        } else {
          setTimeout(() => {
            fetchProfile(session.user.id);
            fetchOrderCount(session.user.id);
          }, 0);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session?.user) {
        navigate("/auth");
      } else {
        fetchProfile(session.user.id);
        fetchOrderCount(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    
    setProfile(data);
    setLoading(false);
  };

  const fetchOrderCount = async (userId: string) => {
    const { count } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);
    
    setOrderCount(count || 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <Navbar />
      
      <main className="container mx-auto px-4 py-6 md:py-8">
        <div className="max-w-6xl mx-auto space-y-6 md:space-y-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Welcome back, {profile?.full_name || "User"}!
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Manage your services and orders from your dashboard
            </p>
          </div>

          <div className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{orderCount}</div>
                <p className="text-xs text-muted-foreground">Active projects</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Available Services</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">7</div>
                <p className="text-xs text-muted-foreground">Professional solutions</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Account Status</CardTitle>
                <UserCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">Active</div>
                <p className="text-xs text-muted-foreground">All systems operational</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Get started with these common tasks</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <Link
                to="/services"
                className="p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
              >
                <h3 className="font-semibold mb-1">Browse Services</h3>
                <p className="text-sm text-muted-foreground">
                  Explore our range of development services
                </p>
              </Link>
              <Link
                to="/orders"
                className="p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
              >
                <h3 className="font-semibold mb-1">View Orders</h3>
                <p className="text-sm text-muted-foreground">
                  Check the status of your current projects
                </p>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

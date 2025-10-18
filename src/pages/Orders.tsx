import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { User, Session } from "@supabase/supabase-js";

export default function Orders() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (!session?.user) {
          navigate("/auth");
        } else {
          setTimeout(() => {
            fetchOrders(session.user.id);
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
        fetchOrders(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchOrders = async (userId: string) => {
    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        services (name, description, icon)
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        variant: "destructive",
      });
    } else {
      setOrders(data || []);
    }
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-success text-white";
      case "pending":
        return "bg-warning text-white";
      case "in-progress":
        return "bg-info text-white";
      default:
        return "bg-muted";
    }
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
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Your Orders</h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Track the status of your projects
            </p>
          </div>

          {orders.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center">
                <p className="text-muted-foreground mb-4">No orders yet</p>
                <Link to="/services" className="text-primary hover:underline">
                  Browse Services
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{order.services?.name || "Service"}</CardTitle>
                        <CardDescription className="mt-1">
                          {order.services?.description}
                        </CardDescription>
                      </div>
                      <Badge 
                        className={`${getStatusColor(order.status)} ${
                          order.status === "completed" ? "cursor-pointer hover:opacity-80" : ""
                        }`}
                        onClick={() => {
                          if (order.status === "completed") {
                            navigate(`/delivery?order=${order.id}`);
                          }
                        }}
                      >
                        {order.status}
                        {order.status === "completed" && " ✓"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Order Date</p>
                          <p className="text-sm">{format(new Date(order.created_at), "PPP")}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Amount</p>
                          <p className="text-sm font-bold">₹{order.total_amount}</p>
                        </div>
                      </div>
                      
                      {order.details && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-1">Project Details</p>
                          <p className="text-sm bg-muted/50 p-3 rounded-md">{order.details}</p>
                        </div>
                      )}
                      
                      {order.include_lifetime && (
                        <Badge variant="secondary">Lifetime Updates Included</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { CheckCircle2, Download, Mail, Calendar, Package } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Order {
  id: string;
  service_id: string;
  status: string;
  details: string | null;
  total_amount: number;
  created_at: string;
  updated_at: string;
  delivery_link: string | null;
  services: {
    name: string;
    description: string;
  };
}

const ServiceDelivery = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get("order");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate("/auth");
          return;
        }

        const { data, error } = await supabase
          .from("orders")
          .select(`
            *,
            services (
              name,
              description
            )
          `)
          .eq("id", orderId)
          .eq("user_id", user.id)
          .eq("status", "completed")
          .single();

        if (error) throw error;

        if (!data) {
          toast({
            title: "Order Not Found",
            description: "This delivery is not available or doesn't exist.",
            variant: "destructive",
          });
          navigate("/orders");
          return;
        }

        setOrder(data);
        setShowAnimation(true);
        
        // Show success toast
        toast({
          title: "Service Delivered!",
          description: `${data.services.name} is ready for you.`,
        });
      } catch (error: any) {
        console.error("Error fetching order:", error);
        toast({
          title: "Error",
          description: "Failed to load delivery information.",
          variant: "destructive",
        });
        navigate("/orders");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    } else {
      navigate("/orders");
    }
  }, [orderId, navigate]);

  const handleDownload = () => {
    if (order?.delivery_link) {
      window.open(order.delivery_link, "_blank");
      toast({
        title: "Opening Download",
        description: "Your service files are being accessed.",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-3xl mx-auto">
          {/* Checkmark Animation */}
          <div className="flex justify-center mb-8">
            <div
              className={`transition-all duration-500 ${
                showAnimation ? "scale-100 opacity-100" : "scale-0 opacity-0"
              }`}
            >
              <div className="relative">
                <div className="absolute inset-0 glow-primary rounded-full blur-xl"></div>
                <CheckCircle2 className="w-24 h-24 text-primary relative z-10" />
              </div>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Your Service is Ready! 🎉
          </h1>
          <p className="text-muted-foreground text-center mb-12 text-lg">
            Thank you for choosing RudraCore. Your project has been completed.
          </p>

          {/* Summary Card */}
          <Card className="glass border-border/50 mb-8 animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                Service Details
              </CardTitle>
              <CardDescription>Your completed project information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">Service Name</label>
                  <p className="text-lg font-semibold">{order.services.name}</p>
                </div>
                
                <div>
                  <label className="text-sm text-muted-foreground">Description</label>
                  <p className="text-foreground">{order.services.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Order ID</label>
                    <p className="font-mono text-sm">{order.id.slice(0, 8)}...</p>
                  </div>
                  
                  <div>
                    <label className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Completed Date
                    </label>
                    <p>{new Date(order.updated_at).toLocaleDateString()}</p>
                  </div>
                </div>

                {order.details && (
                  <div>
                    <label className="text-sm text-muted-foreground">Project Details</label>
                    <p className="text-foreground whitespace-pre-wrap">{order.details}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={handleDownload}
              disabled={!order.delivery_link}
              size="lg"
              className="w-full glow-primary hover:scale-105 transition-transform"
            >
              <Download className="w-5 h-5 mr-2" />
              {order.delivery_link ? "Access Service" : "Delivery Pending"}
            </Button>

            <Button
              onClick={() => window.open("https://rudracore.com/support", "_blank")}
              variant="outline"
              size="lg"
              className="w-full hover:bg-accent/10 hover:border-accent transition-all"
            >
              <Mail className="w-5 h-5 mr-2" />
              Contact Support
            </Button>
          </div>

          {!order.delivery_link && (
            <p className="text-center text-sm text-muted-foreground mt-6">
              Your delivery files are being prepared. You'll receive an email when they're ready.
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default ServiceDelivery;

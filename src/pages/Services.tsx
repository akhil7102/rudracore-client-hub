import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Code, ShoppingCart, MessageSquare, Bot, Smartphone, LayoutDashboard, Blocks, Loader2 } from "lucide-react";
import { User, Session } from "@supabase/supabase-js";

const iconMap: any = {
  Code,
  ShoppingCart,
  MessageSquare,
  Bot,
  Smartphone,
  LayoutDashboard,
  Blocks,
};

export default function Services() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [orderLoading, setOrderLoading] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [orderDetails, setOrderDetails] = useState("");
  const [includeLifetime, setIncludeLifetime] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (!session?.user) {
          navigate("/auth");
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session?.user) {
        navigate("/auth");
      } else {
        fetchServices();
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchServices = async () => {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch services",
        variant: "destructive",
      });
    } else {
      setServices(data || []);
    }
    setLoading(false);
  };

  const handleOrder = async () => {
    if (!selectedService || !user) return;

    setOrderLoading(true);

    const totalAmount = includeLifetime 
      ? selectedService.lifetime_price 
      : selectedService.base_price;

    const { error } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        service_id: selectedService.id,
        details: orderDetails,
        total_amount: totalAmount,
        include_lifetime: includeLifetime,
        status: "pending",
      });

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Order placed successfully!",
      });
      setSelectedService(null);
      setOrderDetails("");
      setIncludeLifetime(false);
      navigate("/orders");
    }
    setOrderLoading(false);
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
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Our Services</h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Professional development solutions tailored for your needs
            </p>
          </div>

          <div className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const IconComponent = iconMap[service.icon] || Code;
              
              return (
                <Card key={service.id} className="hover:shadow-lg transition-all hover:-translate-y-1">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                      <Badge variant="secondary">{service.category}</Badge>
                    </div>
                    <CardTitle className="mt-4">{service.name}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-2xl font-bold">₹{service.base_price}</p>
                        <p className="text-sm text-muted-foreground">Base price</p>
                      </div>
                      {service.lifetime_price && (
                        <div>
                          <p className="text-lg font-semibold text-accent">₹{service.lifetime_price}</p>
                          <p className="text-sm text-muted-foreground">Lifetime updates</p>
                        </div>
                      )}
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            className="w-full mt-4" 
                            onClick={() => setSelectedService(service)}
                          >
                            Order Now
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Order {service.name}</DialogTitle>
                            <DialogDescription>
                              Provide details about your requirements
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="details">Project Details</Label>
                              <Textarea
                                id="details"
                                placeholder="Describe your project requirements..."
                                value={orderDetails}
                                onChange={(e) => setOrderDetails(e.target.value)}
                                rows={4}
                              />
                            </div>
                            
                            {service.lifetime_price && (
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id="lifetime"
                                  checked={includeLifetime}
                                  onCheckedChange={(checked) => setIncludeLifetime(checked as boolean)}
                                />
                                <Label htmlFor="lifetime" className="cursor-pointer">
                                  Include lifetime updates (₹{service.lifetime_price})
                                </Label>
                              </div>
                            )}
                            
                            <div className="pt-4 border-t">
                              <div className="flex justify-between items-center mb-4">
                                <span className="font-semibold">Total Amount:</span>
                                <span className="text-2xl font-bold text-primary">
                                  ₹{includeLifetime ? service.lifetime_price : service.base_price}
                                </span>
                              </div>
                              
                              <Button 
                                onClick={handleOrder} 
                                className="w-full"
                                disabled={orderLoading || !orderDetails.trim()}
                              >
                                {orderLoading ? "Placing Order..." : "Confirm Order"}
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}

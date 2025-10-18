import { Button } from "@/components/ui/button";
import { ArrowRight, Code, Zap, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-12 md:pt-20 pb-8 md:pb-16">
        <div className="max-w-4xl mx-auto text-center space-y-6 md:space-y-8">
          <div className="space-y-3 md:space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              Welcome to RudraCore
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
              Professional development services tailored for your business. 
              From web apps to custom plugins, we build solutions that scale.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
            <Button size="lg" asChild className="group hover:shadow-glow-primary transition-all">
              <Link to="/auth">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="hover:shadow-glow-accent transition-all">
              <Link to="/auth">Client Login</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-6xl mx-auto grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="glass p-6 rounded-xl hover:shadow-glow-primary transition-all duration-300">
            <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4">
              <Code className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Full Stack Development</h3>
            <p className="text-muted-foreground">
              Modern, responsive web applications built with the latest technologies.
            </p>
          </div>

          <div className="glass p-6 rounded-xl hover:shadow-glow-accent transition-all duration-300">
            <div className="p-3 bg-accent/10 rounded-lg w-fit mb-4">
              <Zap className="h-6 w-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
            <p className="text-muted-foreground">
              Optimized performance and seamless user experiences across all devices.
            </p>
          </div>

          <div className="glass p-6 rounded-xl hover:shadow-glow-primary transition-all duration-300">
            <div className="p-3 bg-success/10 rounded-lg w-fit mb-4">
              <Shield className="h-6 w-6 text-success" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Secure & Reliable</h3>
            <p className="text-muted-foreground">
              Built with security best practices and lifetime update options.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-4xl mx-auto bg-gradient-hero rounded-2xl p-8 md:p-12 text-center text-white shadow-glow-primary">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Start Your Project?</h2>
          <p className="text-white/90 mb-6 md:mb-8 max-w-2xl mx-auto text-sm md:text-base px-4">
            Join our growing community of satisfied clients. Get access to professional 
            development services with transparent pricing and lifetime support options.
          </p>
          <Button size="lg" variant="secondary" asChild className="hover:shadow-glow-accent transition-all">
            <Link to="/auth">Access Client Portal</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Phone, Clock } from "lucide-react";
import heroImage from "@/assets/hero-fish-chips.jpg";

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${heroImage})` }}>
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-background" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg">
            Fresh Fish & Chips,
            <br />
            Cooked to Perfection
          </h1>
          <p className="text-xl md:text-2xl text-white/95 mb-8 drop-shadow">
            Traditional fish and chips, made fresh daily
          </p>
          <Link to="/menu">
            <Button
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-8 py-6 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              View Our Menu
            </Button>
          </Link>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 px-4 bg-secondary/30">
        <div className="container mx-auto max-w-4xl">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Opening Hours */}
            <div className="bg-card p-8 rounded-xl shadow-sm border border-border">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">Opening Hours</h2>
              </div>
              <div className="space-y-2 text-foreground/80">
                <div className="flex justify-between">
                  <span>Monday</span>
                  <span className="font-medium">12:00pm - 7:30pm</span>
                </div>
                <div className="flex justify-between">
                  <span>Tuesday - Friday</span>
                  <span className="font-medium">10:30am - 7:30pm</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span className="font-medium">10:30am - 7:00pm</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span className="font-medium">Closed</span>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-card p-8 rounded-xl shadow-sm border border-border">
              <div className="flex items-center gap-3 mb-4">
                <Phone className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">Call to Order</h2>
              </div>
              <a
                href="tel:+61234567890"
                className="text-3xl font-bold text-primary hover:text-primary/80 transition-colors"
              >
                0405353467
              </a>
              <p className="mt-4 text-foreground/70">Call us to place your order for pickup</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 text-center">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-4xl font-bold mb-6">Discover Our Fresh Seafood Menu</h2>
          <p className="text-xl text-muted-foreground mb-8">
            From classic fish and chips to delicious seafood favourites, all cooked fresh to order
          </p>
          <Link to="/menu">
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground text-lg px-8 py-6 rounded-full transition-all duration-300"
            >
              Explore Menu
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;

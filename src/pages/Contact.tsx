import { Card } from "@/components/ui/card";
import { MapPin, Phone, Clock } from "lucide-react";
import GoogleMap from "@/components/GoogleMap";

const Contact = () => {
  return (
    <div className="min-h-screen py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Find Us</h1>
          <p className="text-xl text-muted-foreground">Visit us or call ahead for pickup</p>
        </div>

        {/* Contact Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Address */}
          <Card className="p-8 text-center hover:shadow-lg transition-shadow">
            <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-3">Our Location</h3>
            <p className="text-muted-foreground leading-relaxed">
              Shop 3, 153 Smith Rd
              <br />
              Woodridge, QLD 4114
              <br />
              Australia
            </p>
          </Card>

          {/* Phone */}
          <Card className="p-8 text-center hover:shadow-lg transition-shadow">
            <Phone className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-3">Call to Order</h3>
            <a
              href="tel:+61234567890"
              className="text-2xl font-bold text-primary hover:text-primary/80 transition-colors block"
            >
              0405 353 467
            </a>
            <p className="text-muted-foreground mt-2">Available during opening hours</p>
          </Card>

          {/* Hours */}
          <Card className="p-8 text-center hover:shadow-lg transition-shadow">
            <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-3">Opening Hours</h3>
            <div className="text-muted-foreground space-y-1">
              <p>Mon: 12pm - 7:30pm</p>
              <p>Tue-Fri: 10:30am - 7:30pm</p>
              <p>Sat: 10:30am - 7pm</p>
              <p>Sun: Closed</p>
            </div>
          </Card>
        </div>

        {/* Map */}
        <Card className="overflow-hidden">
          <div className="aspect-video w-full">
            <GoogleMap
              apiKey="YOUR_GOOGLE_MAPS_API_KEY"
              center={{ lat: -27.622799, lng: 153.108382 }}
              zoom={15}
              markerTitle="Costa's Takeaway - Shop 3, 153 Smith Rd, Woodridge"
            />
          </div>
        </Card>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <Card className="p-8 bg-secondary/50">
            <h3 className="text-2xl font-bold mb-4">Pickup Only</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We currently offer takeaway pickup service. Call ahead to place your order and we'll have it ready when
              you arrive!
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Contact;

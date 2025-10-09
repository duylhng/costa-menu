import { Card } from "@/components/ui/card";
import { MapPin, Phone, Clock } from "lucide-react";

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
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3540.5746387438897!2d153.10838207617654!3d-27.62279897620728!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b915076b3d3e5e5%3A0x502a35af3dea7a0!2sShop%203%2F153%20Smith%20Rd%2C%20Woodridge%20QLD%204114%2C%20Australia!5e0!3m2!1sen!2s!4v1709876543210!5m2!1sen!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Costa's Takeaway Location"
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

import { Card } from "@/components/ui/card";

const Menu = () => {
  const menuCategories = [
    {
      category: "Fish",
      items: [
        {
          name: "Flake (Shark)",
          description: "Premium Australian flake, battered and fried to golden perfection",
          price: "$12.50",
        },
        {
          name: "Barramundi",
          description: "Fresh barramundi fillet in our signature batter",
          price: "$14.90",
        },
        {
          name: "Flathead",
          description: "Local flathead, lightly battered and crispy",
          price: "$13.90",
        },
        {
          name: "Grilled Fish",
          description: "Your choice of fish, grilled with lemon and herbs",
          price: "$15.90",
        },
      ],
    },
    {
      category: "Fish & Chips Packs",
      items: [
        {
          name: "Standard Pack",
          description: "1 piece of fish with chips",
          price: "$14.90",
        },
        {
          name: "Family Pack",
          description: "4 pieces of fish with large chips",
          price: "$52.00",
        },
        {
          name: "Deluxe Pack",
          description: "2 pieces of fish, 6 prawns, calamari rings, and large chips",
          price: "$38.50",
        },
      ],
    },
    {
      category: "Seafood",
      items: [
        {
          name: "Calamari Rings",
          description: "Tender squid rings in a crispy golden coating",
          price: "$11.90",
        },
        {
          name: "Prawn Cutlets (6 pcs)",
          description: "Crumbed prawns, fried until golden",
          price: "$13.50",
        },
        {
          name: "Scallops (4 pcs)",
          description: "Plump scallops in crispy batter",
          price: "$9.90",
        },
        {
          name: "Seafood Basket",
          description: "Fish, calamari, scallops, and prawns with chips",
          price: "$24.90",
        },
      ],
    },
    {
      category: "Chips & Sides",
      items: [
        {
          name: "Minimum Chips",
          description: "Perfect portion for one",
          price: "$4.50",
        },
        {
          name: "Regular Chips",
          description: "Golden, crispy chips",
          price: "$6.50",
        },
        {
          name: "Large Chips",
          description: "Great for sharing",
          price: "$9.00",
        },
        {
          name: "Potato Cakes (2)",
          description: "Crispy potato scallops",
          price: "$4.00",
        },
        {
          name: "Coleslaw",
          description: "Fresh, creamy coleslaw",
          price: "$5.50",
        },
        {
          name: "Garden Salad",
          description: "Mixed greens with house dressing",
          price: "$7.90",
        },
      ],
    },
    {
      category: "Extras & Sauces",
      items: [
        {
          name: "Tartar Sauce",
          description: "House-made tartar sauce",
          price: "$1.50",
        },
        {
          name: "Lemon",
          description: "Fresh lemon wedges",
          price: "$0.50",
        },
        {
          name: "Tomato Sauce / Vinegar",
          description: "Classic accompaniments",
          price: "Free",
        },
      ],
    },
    {
      category: "Drinks",
      items: [
        {
          name: "Soft Drinks",
          description: "Coke, Sprite, Fanta, Lemon Squash",
          price: "$3.50",
        },
        {
          name: "Bottled Water",
          description: "600ml",
          price: "$3.00",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Our Menu</h1>
          <p className="text-xl text-muted-foreground">
            Fresh fish and seafood, cooked to order daily
          </p>
        </div>

        {/* Menu Categories */}
        <div className="space-y-16">
          {menuCategories.map((category) => (
            <div key={category.category}>
              <h2 className="text-3xl font-bold mb-8 text-primary border-b-2 border-primary/20 pb-3">
                {category.category}
              </h2>

              <div className="space-y-6">
                {category.items.map((item, index) => (
                  <Card
                    key={index}
                    className="p-6 hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">{item.name}</h3>
                        <p className="text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                      <div className="text-2xl font-bold text-primary whitespace-nowrap">
                        {item.price}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-16 text-center p-8 bg-secondary/50 rounded-xl">
          <p className="text-lg text-muted-foreground">
            * Prices subject to change. Please call to confirm current pricing.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Menu;

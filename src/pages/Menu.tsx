import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

const Menu = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const menuCategories = [
    {
      category: "Snacks",
      items: [
        { name: "Kabana", description: "", price: "$3.20" },
        { name: "Cheese Kabana", description: "", price: "$3.20" },
        { name: "Chiko Roll", description: "", price: "$3.00" },
        { name: "Spring Roll", description: "", price: "$3.00" },
        { name: "Crumbed Sausage", description: "", price: "$2.80" },
        { name: "Bacon & Cheese Crumbed Sausage", description: "", price: "$3.20" },
        { name: "Battered Sav", description: "", price: "$3.00" },
        { name: "Fish Cake", description: "", price: "$2.50" },
        { name: "Chicken & Cheese Schnitzel", description: "", price: "$3.00" },
        { name: "Mini Dim Sim", description: "", price: "$1.00" },
        { name: "Chicken Dim Sim", description: "", price: "$2.80" },
        { name: "Corn Jack", description: "", price: "$3.00" },
        { name: "Beef Croquette", description: "", price: "$1.50" },
        { name: "Seafood Stick", description: "", price: "$1.50" },
        { name: "Pineapple Fritter", description: "", price: "$1.40" },
        { name: "Pork Sausage", description: "", price: "$3.20" },
        { name: "Ham & Cheese Potato Scallop", description: "", price: "$3.00" },
      ],
    },
    {
      category: "Burgers & Sandwiches",
      items: [
        { name: "Hamburger", description: "", price: "$6.00" },
        { name: "Hamburger w/ Lot", description: "", price: "$8.50" },
        { name: "Steak Burger", description: "", price: "$7.00" },
        { name: "Steak Burger w/ Lot", description: "", price: "$9.50" },
        { name: "Bacon & Egg Burger", description: "", price: "$6.00" },
        { name: "Chicken Burger", description: "", price: "$6.50" },
        { name: "Fish Burger", description: "", price: "$8.50" },
        { name: "Chicken Salad Sandwich", description: "", price: "$5.50" },
      ],
    },
    {
      category: "Hot Rolls",
      items: [
        { name: "Chicken Gravy", description: "", price: "$6.00" },
        { name: "Chicken Mayo", description: "", price: "$6.00" },
        { name: "Steak Gravy", description: "", price: "$6.50" },
        { name: "Hot Dog", description: "", price: "$4.00" },
        { name: "Hot Dog & Cheese", description: "", price: "$4.50" },
        { name: "Hot Dog w/ Lot", description: "", price: "$6.00" },
        { name: "Kabana Dog", description: "", price: "$5.30" },
        { name: "Kabana Dog w/ Lot", description: "", price: "$7.30" },
      ],
    },
    {
      category: "Fish (Crumbed / Battered)",
      items: [
        { name: "Cod", description: "Add grilled +$1", price: "$6.00" },
        { name: "Hoki", description: "Add grilled +$1", price: "$6.00" },
        { name: "Snapper", description: "Add grilled +$1", price: "$8.50" },
        { name: "Barramundi", description: "Add grilled +$1", price: "$8.00" },
      ],
    },
    {
      category: "Chicken",
      items: [
        { name: "Whole", description: "", price: "$14.00" },
        { name: "Half", description: "", price: "$8.00" },
        { name: "Quarter", description: "", price: "$5.00" },
      ],
    },
    {
      category: "Snack Deals",
      items: [
        { name: "Chicken Nuggets", description: "5 for $3.50 ($0.70 each)", price: "$3.50" },
        { name: "Chicken Chips", description: "5 for $2.50 ($0.50 each)", price: "$2.50" },
        { name: "Spicy Chicken Wings", description: "5 for $6.50 ($1.30 each)", price: "$6.50" },
        { name: "Chicken Garlic Balls", description: "6 for $4.80 ($0.80 each)", price: "$4.80" },
        { name: "Fish Cocktails", description: "5 for $4.60 ($0.92 each)", price: "$4.60" },
        { name: "Prawn Cutlets", description: "5 for $6.00 ($1.20 each)", price: "$6.00" },
        { name: "Potato Scallops", description: "6 for $5.00 ($0.83 each)", price: "$5.00" },
        { name: "Calamari Rings", description: "8 for $4.50 ($0.56 each)", price: "$4.50" },
        { name: "Seafood Bites", description: "5 for $4.30 ($0.86 each)", price: "$4.30" },
        { name: "Onion Rings", description: "4 for $1.50 ($0.38 each)", price: "$1.50" },
        { name: "Battered Mussels", description: "4 for $2.80 ($0.70 each)", price: "$2.80" },
      ],
    },
    {
      category: "Minimum Hot Chips",
      items: [
        { name: "Chips", description: "", price: "$3.00" },
        { name: "Beer Battered Chips", description: "", price: "$3.00" },
        { name: "Potato Gems", description: "", price: "$3.00" },
      ],
    },
    {
      category: "Gravy",
      items: [
        { name: "Small", description: "", price: "$1.00" },
        { name: "Medium", description: "", price: "$2.00" },
        { name: "Large", description: "", price: "$3.00" },
      ],
    },
  ];

  // Filter categories based on search
  const filteredCategories = menuCategories.map(category => ({
    ...category,
    items: category.items.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.items.length > 0);

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Our Menu</h1>
          <p className="text-lg text-muted-foreground">
            Fresh fish and seafood, cooked to order daily
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              type="text"
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>
        </div>

        {/* Menu Categories */}
        <div className="space-y-12">
          {filteredCategories.map((category) => (
            <div key={category.category} className="space-y-4">
              {/* Category Header */}
              <h2 className="text-2xl md:text-3xl font-bold text-primary">
                {category.category}
              </h2>

              {/* Menu Items Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {category.items.map((item, index) => (
                  <Card
                    key={index}
                    className="p-4 hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold mb-1 truncate">{item.name}</h3>
                        {item.description && (
                          <p className="text-sm text-muted-foreground">
                            {item.description}
                          </p>
                        )}
                      </div>
                      <div className="text-lg font-bold text-primary whitespace-nowrap">
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
        <div className="mt-12 text-center p-6 bg-secondary/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            * Prices subject to change. Please call to confirm current pricing.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Menu;

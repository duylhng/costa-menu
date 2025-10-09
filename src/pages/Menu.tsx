import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Star } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import fishChipsPlate from "@/assets/fish-chips-plate.jpg";
import prawnsImg from "@/assets/prawns.jpg";
import calamariImg from "@/assets/calamari.jpg";
import hamburgerDealImg from "@/assets/hamburger-deal.jpg";
import hawaiianBurgerImg from "@/assets/hawaiian-burger.jpg";
import specialForTwoImg from "@/assets/special-for-two.jpg";
import chickenDealImg from "@/assets/chicken-deal.jpg";
import fishChipsSaladImg from "@/assets/fish-chips-salad.jpg";

interface MenuItem {
  name: string;
  description: string;
  price: string;
  popular?: boolean;
  image?: string;
}

interface MenuCategory {
  category: string;
  items: MenuItem[];
}

const Menu = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const menuCategories: MenuCategory[] = [
    {
      category: "Specials",
      items: [
        { name: "Hamburger Deal (w/ Lot + $9.00)", description: "4 burgers, $3 chips, 1.25L drink", price: "$28.00", popular: false, image: hamburgerDealImg },
        { name: "Hawaiian Burger Deal", description: "4 Hawaiian burgers, $3 chips, 1.25L drink and medium gravy", price: "$30.00", popular: false, image: hawaiianBurgerImg },
        { name: "Fish Deal", description: "4 cods, $3 chips, 1.25L drink", price: "$28.00", popular: true, image: fishChipsPlate },
        { name: "Seafood Basket", description: "$2.50 chips, 5 calamaries, 3 fish cocktails, 3 seafood bites, 2 prawn cutlets, 1 seafood stick, tartare sauce and lemon", price: "$13.50", popular: true, image: prawnsImg },
        { name: "Special for Two", description: "$3 chips, 2 cods, 6 calamaries, 4 seafood bites and 3 potato scallops", price: "$23.50", popular: true, image: specialForTwoImg },
        { name: "Chicken Deal", description: "1 whole chicken, $3 chips and 1.25L drink", price: "$21.00", popular: false, image: chickenDealImg },
        { name: "Fish & Chips Salad Plate", description: "", price: "$12.50", popular: false, image: fishChipsSaladImg },
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
      category: "Snack Deals",
      items: [
        { name: "Chicken Nuggets", description: "5 for $3.50 ($0.70 each)", price: "$3.50", popular: false },
        { name: "Chicken Chips", description: "5 for $2.50 ($0.50 each)", price: "$2.50", popular: false },
        { name: "Spicy Chicken Wings", description: "5 for $6.50 ($1.30 each)", price: "$6.50", popular: false },
        { name: "Chicken Garlic Balls", description: "6 for $4.80 ($0.80 each)", price: "$4.80", popular: false },
        { name: "Fish Cocktails", description: "5 for $4.60 ($0.92 each)", price: "$4.60", popular: false },
        { name: "Prawn Cutlets", description: "5 for $6.00 ($1.20 each)", price: "$6.00", popular: false },
        { name: "Potato Scallops", description: "6 for $5.00 ($0.83 each)", price: "$5.00", popular: true },
        { name: "Calamari Rings", description: "8 for $4.50 ($0.56 each)", price: "$4.50", popular: true, image: calamariImg },
        { name: "Seafood Bites", description: "5 for $4.30 ($0.86 each)", price: "$4.30", popular: false },
        { name: "Onion Rings", description: "4 for $1.50 ($0.38 each)", price: "$1.50", popular: false },
        { name: "Battered Mussels", description: "4 for $2.80 ($0.70 each)", price: "$2.80", popular: false },
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
      category: "Chicken",
      items: [
        { name: "Whole", description: "", price: "$14.00" },
        { name: "Half", description: "", price: "$8.00" },
        { name: "Quarter", description: "", price: "$5.00" },
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
                    className="overflow-hidden hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
                  >
                    {item.image && (
                      <div className="relative h-32 w-full overflow-hidden">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                        />
                        {item.popular && (
                          <Badge className="absolute top-2 right-2 bg-accent text-accent-foreground flex items-center gap-1">
                            <Star className="h-3 w-3 fill-current" />
                            Popular
                          </Badge>
                        )}
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-base font-semibold truncate">{item.name}</h3>
                            {item.popular && !item.image && (
                              <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                                <Star className="h-3 w-3 fill-current" />
                                Popular
                              </Badge>
                            )}
                          </div>
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

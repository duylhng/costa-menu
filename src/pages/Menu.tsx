import { Card } from "@/components/ui/card";
import calamariImg from "@/assets/calamari.jpg";
import fishChipsImg from "@/assets/fish-chips-plate.jpg";
import prawnsImg from "@/assets/prawns.jpg";
import dish1 from "@/assets/dish-1.jpg";
import dish2 from "@/assets/dish-2.jpg";
import dish3 from "@/assets/dish-3.jpg";

const Menu = () => {
  const menuCategories = [
    {
      category: "Snacks",
      image: dish1,
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
      image: dish2,
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
      image: dish3,
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
      image: fishChipsImg,
      items: [
        { name: "Cod", description: "", price: "$6.00" },
        { name: "Hoki", description: "", price: "$6.00" },
        { name: "Snapper", description: "", price: "$8.50" },
        { name: "Barramundi", description: "", price: "$8.00" },
        { name: "Whole", description: "", price: "$14.00" },
        { name: "Half", description: "", price: "$8.00" },
        { name: "Quarter", description: "", price: "$5.00" },
      ],
    },
    {
      category: "Snack Deals",
      image: calamariImg,
      items: [
        { name: "Chicken Nuggets", description: "5 pieces", price: "$3.50" },
        { name: "Chicken Chips", description: "5 pieces", price: "$2.50" },
        { name: "Spicy Chicken Wings", description: "5 pieces", price: "$6.50" },
        { name: "Chicken Garlic Balls", description: "6 pieces", price: "$4.80" },
        { name: "Fish Cocktails", description: "5 pieces", price: "$4.60" },
        { name: "Prawn Cutlets", description: "5 pieces", price: "$6.00" },
        { name: "Potato Scallops", description: "6 pieces", price: "$5.00" },
        { name: "Calamari Rings", description: "8 pieces", price: "$4.50" },
        { name: "Seafood Bites", description: "5 pieces", price: "$4.30" },
        { name: "Onion Rings", description: "4 pieces", price: "$1.50" },
        { name: "Battered Mussels", description: "4 pieces", price: "$2.80" },
      ],
    },
    {
      category: "Minimum Hot Chips",
      image: prawnsImg,
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

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Our Menu</h1>
          <p className="text-lg text-muted-foreground">
            Fresh fish and seafood, cooked to order daily
          </p>
        </div>

        {/* Menu Categories */}
        <div className="space-y-12">
          {menuCategories.map((category) => (
            <div key={category.category} className="space-y-4">
              {/* Category Header with Image */}
              <div className="flex items-center gap-4 mb-6">
                {category.image && (
                  <img 
                    src={category.image} 
                    alt={category.category}
                    className="w-16 h-16 rounded-lg object-cover shadow-md"
                  />
                )}
                <h2 className="text-2xl md:text-3xl font-bold text-primary">
                  {category.category}
                </h2>
              </div>

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

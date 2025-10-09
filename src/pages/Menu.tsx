import { Card } from "@/components/ui/card";

const Menu = () => {
  const menuCategories = [
    {
      category: "Appetizers",
      items: [
        {
          name: "Spring Rolls",
          description: "Crispy vegetable rolls served with sweet chili sauce",
          price: "$8.90",
        },
        {
          name: "Chicken Satay",
          description: "Grilled chicken skewers with peanut sauce",
          price: "$12.90",
        },
        {
          name: "Prawn Dumplings",
          description: "Steamed dumplings filled with fresh prawns",
          price: "$14.50",
        },
      ],
    },
    {
      category: "Main Courses",
      items: [
        {
          name: "Pad Thai",
          description: "Classic Thai stir-fried noodles with prawns, peanuts, and egg",
          price: "$18.90",
        },
        {
          name: "Beef Rendang",
          description: "Slow-cooked beef in aromatic spices and coconut milk",
          price: "$22.50",
        },
        {
          name: "Chicken Teriyaki",
          description: "Grilled chicken glazed with teriyaki sauce, served with rice",
          price: "$19.90",
        },
        {
          name: "Green Curry",
          description: "Thai green curry with vegetables and your choice of protein",
          price: "$20.90",
        },
        {
          name: "Mongolian Lamb",
          description: "Stir-fried lamb with spring onions in a savory sauce",
          price: "$23.90",
        },
      ],
    },
    {
      category: "Rice & Noodles",
      items: [
        {
          name: "Fried Rice",
          description: "Classic fried rice with egg and vegetables",
          price: "$12.90",
        },
        {
          name: "Singapore Noodles",
          description: "Stir-fried rice noodles with curry powder and vegetables",
          price: "$15.90",
        },
        {
          name: "Hokkien Noodles",
          description: "Thick egg noodles stir-fried with vegetables and sauce",
          price: "$16.50",
        },
      ],
    },
    {
      category: "Sides",
      items: [
        {
          name: "Steamed Rice",
          description: "Fluffy jasmine rice",
          price: "$3.50",
        },
        {
          name: "Garden Salad",
          description: "Fresh mixed greens with house dressing",
          price: "$7.90",
        },
        {
          name: "Prawn Crackers",
          description: "Crispy prawn crackers",
          price: "$4.50",
        },
      ],
    },
    {
      category: "Drinks",
      items: [
        {
          name: "Soft Drinks",
          description: "Coke, Sprite, Fanta",
          price: "$3.50",
        },
        {
          name: "Thai Iced Tea",
          description: "Sweet and creamy Thai tea over ice",
          price: "$5.90",
        },
        {
          name: "Fresh Juice",
          description: "Orange, apple, or tropical",
          price: "$6.50",
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
            All dishes are prepared fresh to order
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
